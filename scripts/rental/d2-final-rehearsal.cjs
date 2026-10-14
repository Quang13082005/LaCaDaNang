// Owner-authorized ONE temporary branch. Never imports into Production.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {Client,neonConfig}=require('@neondatabase/serverless');neonConfig.webSocketConstructor=require('ws');
const d2=require('./d2-import.cjs');
const root=path.resolve(__dirname,'../..');
const dir=path.resolve(root,'../RENTAL_D2_FINAL_REHEARSAL_2026-10-14');
const stateFile=path.join(dir,'created-branch.json');
const assert=(x,m)=>{if(!x)throw new Error(m);};
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function cli(args,json=true){
 const out=execFileSync('cmd.exe',['/d','/s','/c',`npx --no-install neonctl ${args} --no-analytics`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:90000}).trim();
 return json?JSON.parse(out):out;
}
const save=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2),{flag:'wx'});
const branches=()=>cli(`branches list --project-id ${d2.PROJECT} --output json`);
const endpoints=()=>cli(`api /projects/${d2.PROJECT}/endpoints --output json`).endpoints;
const simple=b=>({id:b.id,name:b.name,parent_id:b.parent_id,primary:b.primary,default:b.default,project_id:b.project_id});
function production(list){const p=list.find(b=>b.id===d2.BRANCH);assert(p&&p.primary&&p.default&&p.name==='production','PRODUCTION_IDENTITY');return p;}
async function connect(url){const c=new Client({connectionString:url,connectionTimeoutMillis:20000});await c.connect();return c;}
async function core(c){const result={};for(const table of ['administrative_units','tags','tag_translations','places','place_tags','place_translations','analytics_events']){
 result[table]=(await c.query(`SELECT count(*)::int AS count,md5(COALESCE(string_agg(row_hash,'' ORDER BY row_hash),'')) AS fingerprint FROM (SELECT md5(row_to_json(t)::text) AS row_hash FROM public.${table} t) s`)).rows[0];
}return result;}
function empty(s){return s.rows.length===0&&s.models.length===0&&s.contact.length===0&&s.media===0;}
function testIdentity(state,list,eps){
 assert(/^br-[a-z0-9-]+$/.test(state.id)&&state.id!==d2.BRANCH,'TEST_ID');
 const b=list.find(b=>b.id===state.id);assert(b&&b.name===state.name&&b.parent_id===d2.BRANCH&&!b.primary&&!b.default&&b.project_id===d2.PROJECT,'TEST_IDENTITY');
 const ep=eps.find(e=>e.id===state.endpoint.id);assert(ep&&ep.branch_id===state.id&&ep.host===state.endpoint.host&&ep.project_id===d2.PROJECT&&ep.host!==d2.HOST,'TEST_ENDPOINT');
 return b;
}
async function main(){
 fs.mkdirSync(dir,{recursive:true});const mode=process.argv[2];assert(['--run','--cleanup'].includes(mode),'MODE');
 const source=d2.validateSource();
 if(mode==='--run'){
  assert(!fs.existsSync(stateFile)&&!fs.existsSync(path.join(dir,'creation-attempt.json')),'ONE_BRANCH_ONLY');
  const project=cli(`projects get ${d2.PROJECT} --output json`);assert(project.id===d2.PROJECT,'PROJECT');
  const before=branches();production(before);const prodEps=endpoints();assert(prodEps.some(e=>e.branch_id===d2.BRANCH&&e.host===d2.HOST),'PROD_ENDPOINT');
  const prod=await connect(d2.targetUrl());let baseline,prodSchema;
  try{baseline={rental:await d2.snapshot(prod),core:await core(prod)};assert(empty(baseline.rental),'PRODUCTION_NOT_EMPTY');prodSchema=await d2.schema(prod);}finally{await prod.end();}
  save('before.json',{utc:new Date().toISOString(),project:{id:project.id,name:project.name},branches:before.map(simple),endpoints:prodEps.map(e=>({id:e.id,branch_id:e.branch_id,host:e.host})),baseline,schema:prodSchema,sourceHash:d2.SOURCE_HASH,importerHash:digest(fs.readFileSync(path.join(__dirname,'d2-import.cjs'),'utf8'))});
  const name=`rental-d2-final-${Date.now()}`;save('creation-attempt.json',{name,parent:d2.BRANCH,utc:new Date().toISOString()});
  const created=cli(`branches create --project-id ${d2.PROJECT} --parent ${d2.BRANCH} --name ${name} --no-secrets --output json`);
  // Save API response before any SQL; no credentials requested.
  save('creation-response.json',created);
  const after=branches();const added=after.filter(b=>!before.some(x=>x.id===b.id));assert(added.length===1&&added[0].name===name,'CREATED_BRANCH');
  const ep=endpoints().find(e=>e.branch_id===added[0].id);assert(ep,'CREATED_ENDPOINT');
  const state={...simple(added[0]),endpoint:{id:ep.id,host:ep.host},createdByThisRun:true};save('created-branch.json',state);
  testIdentity(state,after,endpoints());
  const url=cli(`connection-string ${state.id} --project-id ${d2.PROJECT}`,false);const parsed=new URL(url.replace(/^"|"$/g,''));
  assert(parsed.hostname.replace('-pooler.','.')===ep.host&&parsed.pathname==='/neondb','CONNECTION_TARGET');
  const test=await connect(parsed.toString());
  try{
   assert((await test.query('SELECT current_database() AS db')).rows[0].db==='neondb','DATABASE');
   assert(digest(await d2.schema(test))===digest(prodSchema),'SCHEMA_FINGERPRINT');assert(empty(await d2.snapshot(test)),'TEST_NOT_EMPTY');
   const testCore=await core(test);let insertedVehicles=0,injected=false,sqlLog=[];
   const adapter={query:async(sql,params)=>{
    sqlLog.push({sql,parameterCount:params?.length??0});
    if(sql.startsWith('INSERT INTO public.rental_vehicles')&&insertedVehicles===10){injected=true;return test.query('SELECT 1/0');}
    const result=await test.query(sql,params);if(sql.startsWith('INSERT INTO public.rental_vehicles'))insertedVehicles++;return result;
   }};
   let failed=false;try{await d2.importTransaction(adapter,source);}catch(e){assert(e.code==='22012','UNEXPECTED_FAILURE');failed=true;}
   assert(failed&&injected&&insertedVehicles===10,'FAILURE_NOT_INJECTED');assert(empty(await d2.snapshot(test)),'PARTIAL_DATA_AFTER_ROLLBACK');assert(digest(await core(test))===digest(testCore),'CORE_CHANGED_ROLLBACK');
   save('rollback.json',{utc:new Date().toISOString(),branch:state.id,modelsInsertedBeforeError:8,vehiclesInsertedBeforeError:10,postgresError:'22012',rentalAfterRollback:await d2.snapshot(test),coreUnchanged:true,sql:sqlLog});
   sqlLog=[];const successAdapter={query:async(sql,params)=>{sqlLog.push({sql,parameterCount:params?.length??0});return test.query(sql,params);}};
   await d2.importTransaction(successAdapter,source);const imported=await d2.snapshot(test);d2.verify(imported,source);
   const publicRows=(await test.query('SELECT v.public_id FROM public.rental_vehicles v JOIN public.rental_vehicle_models m ON m.id=v.model_id WHERE v.active=true AND m.active=true')).rows;
   assert(publicRows.length===0,'INACTIVE_PUBLIC_LEAK');assert(digest(await core(test))===digest(testCore),'CORE_CHANGED_IMPORT');
   assert(digest(await d2.schema(test))===digest(prodSchema),'SCHEMA_CHANGED');
   save('success.json',{utc:new Date().toISOString(),branch:state.id,imported,coreUnchanged:true,publicCount:0,schemaUnchanged:true,sql:sqlLog});
   const sessions=(await test.query("SELECT count(*)::int AS n FROM pg_stat_activity WHERE backend_type='client backend' AND pid<>pg_backend_pid() AND datname=current_database() AND application_name NOT LIKE 'neon%' ")).rows[0].n;
   save('dependency-check.json',{otherClientSessions:sessions,credentialsPersisted:false,appConfigurationChanged:false});assert(sessions===0,'OTHER_CLIENT_SESSIONS');
  }finally{await test.end();}
  console.log(`Rehearsal PASS; test branch ${state.id}. Evidence saved. Cleanup is a separate verified step.`);
 }else{
  const state=JSON.parse(fs.readFileSync(stateFile,'utf8'));assert(state.createdByThisRun,'OWNERSHIP');
  assert(fs.existsSync(path.join(dir,'success.json'))&&fs.existsSync(path.join(dir,'rollback.json')),'EVIDENCE_REQUIRED');
  const list=branches();production(list);testIdentity(state,list,endpoints());assert(!list.some(b=>b.parent_id===state.id),'CHILD_BRANCH_DEPENDENCY');
  const dep=JSON.parse(fs.readFileSync(path.join(dir,'dependency-check.json'),'utf8'));assert(dep.otherClientSessions===0&&!dep.credentialsPersisted&&!dep.appConfigurationChanged,'DEPENDENCY');
  save('pre-cleanup.json',{utc:new Date().toISOString(),branch:simple(list.find(b=>b.id===state.id)),children:0});
  cli(`branches delete ${state.id} --project-id ${d2.PROJECT} --output json`);
  const remaining=branches();production(remaining);assert(!remaining.some(b=>b.id===state.id),'DELETE_NOT_CONFIRMED');assert(!endpoints().some(e=>e.branch_id===state.id),'ENDPOINT_REMAINS');
  const original=JSON.parse(fs.readFileSync(path.join(dir,'before.json'),'utf8'));assert(original.branches.every(b=>remaining.some(r=>r.id===b.id)),'PREEXISTING_BRANCH_MISSING');
  const prod=await connect(d2.targetUrl());try{const rental=await d2.snapshot(prod);assert(digest(rental)===digest(original.baseline.rental),'PRODUCTION_RENTAL_CHANGED');assert(digest(await d2.schema(prod))===digest(original.schema),'PRODUCTION_SCHEMA_CHANGED');const afterCore=await core(prod);save('cleanup.json',{utc:new Date().toISOString(),deletedBranch:state.id,absentFromApi:true,productionRentalUnchanged:true,productionSchemaUnchanged:true,coreBefore:original.baseline.core,coreAfter:afterCore,remaining:remaining.map(simple)});}finally{await prod.end();}
  console.log('CLEANED: exact created test branch absent; Production rental remains unchanged/empty.');
 }
}
main().catch(e=>{console.error('STOP: rehearsal/cleanup failed; no automatic retry or cleanup.');if(/^[A-Z_]+$/.test(e.message))console.error(e.message);process.exitCode=1;});
