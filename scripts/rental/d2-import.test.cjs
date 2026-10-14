const test=require('node:test'),assert=require('node:assert/strict');
const {validateSource,importTransaction}=require('./d2-import.cjs');
function mock(commitError=false,nonempty=false){
 const d=validateSource(),calls=[];let inserted=false;
 return {calls,query:async(sql)=>{
  calls.push(sql);
  if(sql==='COMMIT'&&commitError)throw new Error('connection lost');
  if(sql.startsWith('INSERT INTO public.rental_vehicle_models'))return {rows:[{id:1}]};
  if(sql.startsWith('INSERT INTO public.rental_contact_settings'))inserted=true;
  if(sql.startsWith('SELECT v.vehicle_code'))return {rows:inserted?d.vehicles.map((v,i)=>({...v,engine_cc:String(v.engine_cc),active:false,public_id:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`})):[]};
  if(sql.startsWith('SELECT brand,model_name'))return {rows:inserted?d.models.map(m=>({...m,active:false})):nonempty?[{brand:'Existing'}]:[]};
  if(sql.startsWith('SELECT * FROM public.rental_contact_settings'))return {rows:inserted?[d.contact]:[]};
  if(sql.includes('count(*)'))return {rows:[{n:sql.includes('public.rental_vehicles')&&inserted?21:0}]};
  return {rows:[]};
 }};
}
test('uncertain COMMIT never retries COMMIT or sends rollback',async()=>{
 const c=mock(true);await assert.rejects(importTransaction(c,validateSource()),/COMMIT_UNCERTAIN_RECONCILE_NO_RETRY/);
 assert.equal(c.calls.filter(s=>s==='COMMIT').length,1);assert.equal(c.calls.includes('ROLLBACK'),false);
});
test('nonempty target rolls back before any insert',async()=>{
 const c=mock(false,true);await assert.rejects(importTransaction(c,validateSource()),/CONCURRENT_IMPORT/);
 assert.equal(c.calls.filter(s=>s.startsWith('INSERT')).length,0);assert.equal(c.calls.at(-1),'ROLLBACK');
});
test('same transaction commits once after assertions',async()=>{
 const c=mock();await importTransaction(c,validateSource());
 assert.equal(c.calls.filter(s=>s==='BEGIN').length,1);assert.equal(c.calls.filter(s=>s==='COMMIT').length,1);
 assert.equal(c.calls.filter(s=>s.startsWith('INSERT')).length,30);
});
