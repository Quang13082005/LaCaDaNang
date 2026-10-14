/* Owner-gated, single-session import. Default: offline validation only.
 * --preflight: SELECT-only. --execute additionally requires approval env.
 * Never run --execute before a separate Owner message authorizes D2.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { Client, neonConfig } = require('@neondatabase/serverless');
neonConfig.webSocketConstructor = require('ws');
const ROOT = path.resolve(__dirname, '../..');
const SOURCE_HASH = '029eb6139e640668bad3ec07024c800dc10cba5fdc0a4563501dbf7849af3e14';
const DDL_HASH = 'bac9cc7555f607d4f4420698986679574c1390f977b58e691751327c9506dac6';
const PROJECT = 'flat-lake-94547160', BRANCH = 'br-shiny-band-b3mlezx7';
const HOST = 'ep-old-tooth-b3gz7nsn.c-4.ap-southeast-1.aws.neon.tech';
const TABLES = ['rental_vehicle_models','rental_vehicles','rental_vehicle_media','rental_contact_settings'];
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
function validateSource() {
 const raw=fs.readFileSync(path.join(ROOT,'docs/RENTAL_IMPORT_PREVIEW.json'));
 assert(hash(raw)===SOURCE_HASH,'SOURCE_HASH_MISMATCH');
 assert(hash(fs.readFileSync(path.join(ROOT,'scripts/rental/migrations/001_rental_schema_v2.1.sql')))===DDL_HASH,'DDL_HASH_MISMATCH');
 const d=JSON.parse(raw.toString('utf8').replace(/^\uFEFF/,''));
 assert(d.models.length===8 && d.vehicles.length===21 && d.media.length===0,'COUNTS');
 const keys=d.models.map(m=>`${m.brand}/${m.model_name}`);
 assert(new Set(keys).size===8,'MODEL_UNIQUENESS');
 assert(new Set(d.vehicles.map(v=>v.vehicle_code)).size===21,'VEHICLE_UNIQUENESS');
 const counts={scooter:0,semi:0,manual:0};
 for(const [i,v] of d.vehicles.entries()) {
  const m=d.models.find(m=>`${m.brand}/${m.model_name}`===`${v.brand}/${v.model_name}`);
  assert(m && m.category===v.category,'MODEL_MAPPING');
  assert(v.vehicle_code===`XE${String(i+1).padStart(3,'0')}`,'VEHICLE_CODE');
  assert(Number.isInteger(v.raw_daily_price)&&v.raw_daily_price>0&&v.daily_price_vnd===v.raw_daily_price*1000,'PRICE');
  assert(v.one_cccd_deposit_vnd===({scooter:2000000,semi:1000000,manual:1500000})[v.category],'DEPOSIT');
  assert(Number.isFinite(v.engine_cc)&&v.engine_cc>0&&Number.isInteger(v.registration_year),'SPEC');
  assert(typeof v.color_source==='string'&&typeof v.color_complete==='boolean','COLOR');
  counts[v.category]++;
 }
 assert(counts.scooter===10&&counts.semi===10&&counts.manual===1,'CATEGORIES');
 assert(d.vehicles[10].color_complete===false&&d.vehicles[16].engine_cc===113,'EXCEPTIONS');
 assert(d.contact.active===false&&d.contact.phone_e164==='+84931981789'&&d.contact.zalo_url==='https://zalo.me/0931981789'&&d.contact.two_cccd_cash_deposit_vnd===0&&d.contact.helmets_included===true,'CONTACT');
 for(const l of ['vi','en','ko'])assert(typeof d.contact[`policy_${l}`]==='string'&&d.contact[`policy_${l}`].length>30,'POLICY');
 return d;
}
function targetUrl() {
 // CLI stdout containing credentials is held in memory, never logged/saved.
 const cli=args=>execFileSync('cmd.exe',['/d','/s','/c',`npx --no-install neonctl ${args}`],{cwd:ROOT,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:60000}).trim();
 const branches=JSON.parse(cli(`branches list --project-id ${PROJECT} --output json`));
 assert(branches.some(b=>b.id===BRANCH&&b.name==='production'&&b.primary===true&&b.default===true),'CONTROL_PLANE_TARGET');
 const cs=cli(`connection-string ${BRANCH} --project-id ${PROJECT}`);
 const u=new URL(cs.replace(/^"|"$/g,''));
 assert(u.hostname.replace('-pooler.','.')===HOST&&u.pathname==='/neondb','ENDPOINT_TARGET');
 return u.toString();
}
async function schema(client) {
 const {rows}=await client.query(`SELECT table_name,column_name,data_type,is_nullable,column_default,is_identity FROM information_schema.columns WHERE table_schema='public' AND table_name=ANY($1::text[]) ORDER BY table_name,ordinal_position`,[TABLES]);
 assert(new Set(rows.map(r=>r.table_name)).size===4,'TABLES_MISSING');
 for(const table of [TABLES[0],TABLES[1],TABLES[3]]) assert(rows.some(r=>r.table_name===table&&r.column_name==='active'&&r.column_default==='false'&&r.is_nullable==='NO'),'DARK_DEFAULT');
 assert(rows.some(r=>r.table_name===TABLES[1]&&r.column_name==='vehicle_code'&&r.data_type==='text'),'SCHEMA_VERSION');
 const constraints=(await client.query(`SELECT c.relname,con.conname,pg_get_constraintdef(con.oid) AS definition FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname=ANY($1::text[]) ORDER BY c.relname,con.conname`,[TABLES])).rows;
 const indexes=(await client.query(`SELECT tablename,indexname,indexdef FROM pg_indexes WHERE schemaname='public' AND tablename=ANY($1::text[]) ORDER BY tablename,indexname`,[TABLES])).rows;
 for(const table of TABLES.slice(0,3))assert(rows.some(r=>r.table_name===table&&r.column_name==='id'&&r.data_type==='bigint'&&r.is_identity==='YES'),'IDENTITY_MISSING');
 for(const [table,fragment] of [[TABLES[0],'UNIQUE (brand, model_name)'],[TABLES[1],'UNIQUE (public_id)'],[TABLES[1],'UNIQUE (vehicle_code)'],[TABLES[1],'FOREIGN KEY (model_id)'],[TABLES[2],'FOREIGN KEY (vehicle_id)'],[TABLES[2],'UNIQUE (vehicle_id, image_url)']])assert(constraints.some(c=>c.relname===table&&c.definition.includes(fragment)),'CONSTRAINT_MISSING');
 for(const name of ['rental_media_primary_idx','rental_media_order_idx','rental_vehicles_model_idx'])assert(indexes.some(i=>i.indexname===name),'INDEX_MISSING');
 const triggers=(await client.query(`SELECT t.tgname FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname=ANY($1::text[]) AND NOT t.tgisinternal`,[TABLES])).rows;
 assert(triggers.length===0,'UNEXPECTED_RENTAL_TRIGGER');
 return {columns:rows,constraints,indexes};
}
async function snapshot(client) {
 const rows=(await client.query(`SELECT v.vehicle_code,m.brand,m.model_name,m.category,v.engine_cc::text,v.registration_year,v.color_source,v.color_complete,v.raw_daily_price,v.daily_price_vnd,v.raw_asset_deposit,v.one_cccd_deposit_vnd,v.active,v.public_id::text FROM public.rental_vehicles v JOIN public.rental_vehicle_models m ON m.id=v.model_id ORDER BY v.vehicle_code`)).rows;
 const models=(await client.query('SELECT brand,model_name,category,active FROM public.rental_vehicle_models ORDER BY brand,model_name')).rows;
 const contact=(await client.query('SELECT * FROM public.rental_contact_settings')).rows;
 const media=Number((await client.query('SELECT count(*) AS n FROM public.rental_vehicle_media')).rows[0].n);
 const physicalCount=Number((await client.query('SELECT count(*) AS n FROM public.rental_vehicles')).rows[0].n);
 assert(physicalCount===rows.length,'ORPHAN_VEHICLE');
 return {rows,models,contact,media};
}
function verify(s,d) {
 assert(s.rows.length===21&&s.models.length===8&&s.contact.length===1&&s.media===0,'POST_COUNTS');
 assert(s.models.every(m=>m.active===false)&&new Set(s.rows.map(v=>v.public_id)).size===21,'POST_DARK_UUID');
 for(const v of d.vehicles){const r=s.rows.find(x=>x.vehicle_code===v.vehicle_code);assert(r&&r.active===false,'POST_VEHICLE');for(const k of ['brand','model_name','category','registration_year','color_source','color_complete','raw_daily_price','daily_price_vnd','raw_asset_deposit','one_cccd_deposit_vnd'])assert(r[k]===v[k],`POST_FIELD_${k}`);assert(Number(r.engine_cc)===v.engine_cc,'POST_CC');}
 for(const m of d.models)assert(s.models.some(r=>r.brand===m.brand&&r.model_name===m.model_name&&r.category===m.category),'POST_MODEL');
 for(const [k,v] of Object.entries(d.contact))assert(s.contact[0][k]===v,'POST_CONTACT');
}
async function importTransaction(client,d) {
 let inTx=false,commitSent=false;
 try {
  await client.query('BEGIN');inTx=true;
  await client.query("SET LOCAL lock_timeout='5s'");await client.query("SET LOCAL statement_timeout='30s'");
  await client.query('LOCK TABLE public.rental_vehicle_models,public.rental_vehicles,public.rental_vehicle_media,public.rental_contact_settings IN ACCESS EXCLUSIVE MODE');
  const locked=await snapshot(client);assert(!locked.rows.length&&!locked.models.length&&!locked.contact.length&&!locked.media,'CONCURRENT_IMPORT');
  const ids=new Map();
  for(const m of d.models){const r=await client.query('INSERT INTO public.rental_vehicle_models(brand,model_name,category,active) VALUES($1,$2,$3,false) RETURNING id',[m.brand,m.model_name,m.category]);ids.set(`${m.brand}/${m.model_name}`,r.rows[0].id);}
  for(const v of d.vehicles)await client.query('INSERT INTO public.rental_vehicles(vehicle_code,model_id,engine_cc,registration_year,color_source,color_complete,raw_daily_price,daily_price_vnd,raw_asset_deposit,one_cccd_deposit_vnd,active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false)',[v.vehicle_code,ids.get(`${v.brand}/${v.model_name}`),v.engine_cc,v.registration_year,v.color_source,v.color_complete,v.raw_daily_price,v.daily_price_vnd,v.raw_asset_deposit,v.one_cccd_deposit_vnd]);
  const c=d.contact;await client.query('INSERT INTO public.rental_contact_settings(id,phone_e164,zalo_url,active,helmets_included,two_cccd_cash_deposit_vnd,policy_vi,policy_en,policy_ko) VALUES(1,$1,$2,false,$3,$4,$5,$6,$7)',[c.phone_e164,c.zalo_url,c.helmets_included,c.two_cccd_cash_deposit_vnd,c.policy_vi,c.policy_en,c.policy_ko]);
  verify(await snapshot(client),d);commitSent=true;await client.query('COMMIT');inTx=false;
 return {committed:true};
 } catch(e) {
  if(inTx&&!commitSent){try{await client.query('ROLLBACK');}catch{throw new Error('ROLLBACK_UNCERTAIN');}}
  if(commitSent)throw new Error('COMMIT_UNCERTAIN_RECONCILE_NO_RETRY');
  throw e;
 }
}
async function main() {
 const mode=process.argv[2]||'--validate';assert(['--validate','--preflight','--execute'].includes(mode),'MODE');
 const d=validateSource();console.log('Offline source validation PASS: 8 models / 21 vehicles / 1 contact / 0 media');
 if(mode==='--validate')return;
 if(mode==='--execute')assert(process.env.RENTAL_D2_OWNER_APPROVAL==='APPROVED_ONE_ATOMIC_DARK_IMPORT','OWNER_APPROVAL_REQUIRED');
 const client=new Client({connectionString:targetUrl(),connectionTimeoutMillis:15000});let committed=false;
 const evidence=path.resolve(ROOT,'../RENTAL_D2_2026-10-14');fs.mkdirSync(evidence,{recursive:true});
 const prefile=path.join(evidence,'preflight.json');
 try {
  await client.connect();assert((await client.query('SELECT current_database() AS db')).rows[0].db==='neondb','DATABASE');
  const currentSchema=await schema(client);const before=await snapshot(client);
  assert(before.rows.length===0&&before.models.length===0&&before.contact.length===0&&before.media===0,'TARGET_NOT_EMPTY');
  if(mode==='--preflight'){fs.writeFileSync(prefile,JSON.stringify({utc:new Date().toISOString(),project:PROJECT,branch:BRANCH,host:HOST,sourceHash:SOURCE_HASH,schema:currentSchema,empty:true},null,2));console.log('READ-ONLY preflight saved. No INSERT executed.');return;}
  const approved=JSON.parse(fs.readFileSync(prefile,'utf8'));
  assert(approved.sourceHash===SOURCE_HASH&&Date.now()-Date.parse(approved.utc)<86400000&&hash(JSON.stringify(approved.schema))===hash(JSON.stringify(currentSchema)),'PREFLIGHT_STALE_OR_SCHEMA_DRIFT');
  await importTransaction(client,d);committed=true;
  verify(await snapshot(client),d);fs.writeFileSync(path.join(evidence,`committed-${Date.now()}.json`),JSON.stringify({utc:new Date().toISOString(),sourceHash:SOURCE_HASH,counts:[8,21,1,0],active:false,postImportVerified:true}));console.log('COMMITTED; read-only post-import assertions PASS.');
 }catch(e){if(committed||e.message==='COMMIT_UNCERTAIN_RECONCILE_NO_RETRY')console.error('COMMIT sent or completed: reconcile with SELECT, NEVER retry import.');if(e instanceof Error&&/^[A-Z_]+$/.test(e.message))console.error(`Assertion: ${e.message}`);throw new Error('D2 stopped; sanitized failure; no automatic retry.');}finally{await client.end().catch(()=>{});}
}
module.exports={validateSource,verify,schema,snapshot,importTransaction,targetUrl,PROJECT,BRANCH,HOST,SOURCE_HASH};
if(require.main===module)main().catch(()=>{console.error('D2 failed safely. Inspect preflight/target/assertions; credentials omitted.');process.exitCode=1;});


