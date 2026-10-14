// SELECT-only companion audit. Never calls the import transaction.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {Client}=require('@neondatabase/serverless');
const d2=require('./d2-import.cjs');
const root=path.resolve(__dirname,'../..'),dir=path.resolve(root,'../RENTAL_D2_PRODUCTION_2026-10-14');
const assert=(v,m)=>{if(!v)throw new Error(m);};
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const tables=['administrative_units','tags','tag_translations','places','place_tags','place_translations','analytics_events'];
function cli(args){return JSON.parse(execFileSync('cmd.exe',['/d','/s','/c',`npx --no-install neonctl ${args} --no-analytics`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:90000}));}
async function main(){
 const mode=process.argv[2];assert(['before','after'].includes(mode),'MODE');fs.mkdirSync(dir,{recursive:true});
 const hashes=JSON.parse(fs.readFileSync(path.resolve(root,'../RENTAL_D2_FINAL_REHEARSAL_2026-10-14/final-hashes.json'),'utf8').replace(/^\uFEFF/,''));
 for(const item of hashes)assert(sha(fs.readFileSync(item.Path))===item.Hash.toLowerCase(),'APPROVED_HASH_CHANGED');
 const source=d2.validateSource(),project=cli(`projects get ${d2.PROJECT} --output json`);assert(project.id===d2.PROJECT,'PROJECT');
 const eps=cli(`api /projects/${d2.PROJECT}/endpoints --output json`).endpoints;
 const ep=eps.find(e=>e.branch_id===d2.BRANCH&&e.host===d2.HOST);assert(ep&&ep.project_id===d2.PROJECT,'ENDPOINT');
 const c=new Client({connectionString:d2.targetUrl(),connectionTimeoutMillis:20000});
 try{
  await c.connect();const identity=(await c.query('SELECT current_database() AS db,current_schema() AS schema')).rows[0];assert(identity.db==='neondb'&&identity.schema==='public','DATABASE_SCHEMA');
  const schema=await d2.schema(c),approved=JSON.parse(fs.readFileSync(path.resolve(root,'../RENTAL_D2_FINAL_REHEARSAL_2026-10-14/before.json'),'utf8'));
  assert(equal(schema,approved.schema),'RENTAL_SCHEMA_DRIFT');
  const rental=await d2.snapshot(c),core={};
  for(const t of tables)core[t]=(await c.query(`SELECT count(*)::int AS count,md5(COALESCE(string_agg(h,'' ORDER BY h),'')) AS fingerprint FROM (SELECT md5(row_to_json(t)::text) h FROM public.${t} t) s`)).rows[0];
  const coreColumns=(await c.query("SELECT table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_schema='public' AND table_name=ANY($1::text[]) ORDER BY table_name,ordinal_position",[tables])).rows;
  const coreConstraints=(await c.query("SELECT c.relname,con.conname,pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname=ANY($1::text[]) ORDER BY c.relname,con.conname",[tables])).rows;
  const publicCount=Number((await c.query('SELECT count(*) AS n FROM public.rental_vehicles v JOIN public.rental_vehicle_models m ON m.id=v.model_id WHERE v.active=true AND m.active=true')).rows[0].n);
  const sequences=(await c.query("SELECT sequencename,last_value FROM pg_sequences WHERE schemaname='public' AND sequencename LIKE 'rental_%' ORDER BY sequencename")).rows;
  let coreChanges=[];
  if(mode==='before')assert(!rental.rows.length&&!rental.models.length&&!rental.contact.length&&!rental.media,'RENTAL_NOT_EMPTY');
  else{
   d2.verify(rental,source);assert(publicCount===0,'PUBLIC_LEAK');
   const before=JSON.parse(fs.readFileSync(path.join(dir,'before.json'),'utf8'));
   assert(equal(before.coreColumns,coreColumns)&&equal(before.coreConstraints,coreConstraints),'CORE_SCHEMA_CHANGED');
   coreChanges=tables.filter(t=>!equal(before.core[t],core[t]));
  }
  fs.writeFileSync(path.join(dir,`${mode}.json`),JSON.stringify({utc:new Date().toISOString(),project:d2.PROJECT,branch:d2.BRANCH,endpoint:{id:ep.id,host:ep.host},identity,sourceHash:d2.SOURCE_HASH,importerHash:sha(fs.readFileSync(path.join(__dirname,'d2-import.cjs'))),schema,rental,core,coreColumns,coreConstraints,publicCount,sequences,coreChanges},null,2),{flag:'wx'});
  console.log(JSON.stringify({mode,models:rental.models.length,vehicles:rental.rows.length,contact:rental.contact.length,media:rental.media,publicCount,coreChanges}));
 }finally{await c.end();}
}
main().catch(e=>{console.error('Audit STOP; no writes performed.');if(/^[A-Z_]+$/.test(e.message))console.error(e.message);process.exitCode=1;});
