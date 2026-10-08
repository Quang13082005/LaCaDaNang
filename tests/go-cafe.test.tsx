import React from 'react';
import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {NextRequest} from 'next/server';
import {GET} from '@/app/api/discovery/route';
import {DISCOVERY_SQL,NEARBY_CANDIDATES_SQL} from '@/lib/data/place-repository';
import HomePage from '@/app/page';
import {LocaleProvider} from '@/components/i18n/LocaleProvider';
import {LOCALE_STORAGE_KEY} from '@/lib/i18n/locales';
import {translate} from '@/lib/i18n/messages';
import {apiPlace} from './discovery-fixtures';
import {validateClientAnalyticsPayload} from '@/lib/analytics/validator';
import {ANALYTICS_EVENT_NAMES,ANALYTICS_INTENTS} from '@/lib/analytics/types';
import * as analytics from '@/lib/analytics/client';
const {execute}=vi.hoisted(()=>({execute:vi.fn()}));
vi.mock('@/lib/db/neon',async original=>({...await original<typeof import('@/lib/db/neon')>(),getNeonExecutor:()=>execute}));
const raw=(id:number,lat=16)=>({id,section:'CAFE',name:`Cafe ${id}`,google_place_id:`g${id}`,address:'Da Nang',latitude:lat,longitude:108,area_id:1,google_maps_url:`https://maps.google.com/?cid=${id}`,rating:null,review_count:null,tags:[]});
beforeEach(()=>{ window.matchMedia=vi.fn().mockReturnValue({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}); execute.mockReset().mockResolvedValue([raw(1),raw(2),raw(3)]);});
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();localStorage.clear();});
describe('GO product intent routes CAFE catalog',()=>{
 it.each(['vi','en','ko'])('citywide %s preserves product intent and real section',async locale=>{
  const r=await GET(new NextRequest(`http://localhost/api/discovery?intent=GO&preference=cafe&locale=${locale}`));expect(r.status).toBe(200);
  expect(execute).toHaveBeenCalledWith(DISCOVERY_SQL,['CAFE',locale,null,3]);const body=await r.json();expect(body.data).toMatchObject({intent:'GO',preference:'cafe',count:3});expect(body.data.places.every((p:{section:string})=>p.section==='CAFE')).toBe(true);expect(body.data.places[0].googleMapsUrl).toBe('https://maps.google.com/?cid=1');
 });
 it.each([[16,1],[16.02,3],[16.04,5]])('nearby latitude %s uses radius %i and CAFE candidates',async(lat,radius)=>{
  execute.mockResolvedValue([raw(1,lat),raw(2,lat),raw(3,lat)]);const r=await GET(new NextRequest('http://localhost/api/discovery?intent=GO&preference=cafe&lat=16&lng=108'));const body=await r.json();expect(execute).toHaveBeenCalledWith(NEARBY_CANDIDATES_SQL,['CAFE','vi',null]);expect(body.data.meta.radiusKm).toBe(radius);expect(body.data.count).toBe(3);
 });
 it('keeps zero honest and does not enable a fifth public intent',async()=>{execute.mockResolvedValue([]);const r=await GET(new NextRequest('http://localhost/api/discovery?intent=GO&preference=cafe'));expect((await r.json()).data.count).toBe(0);expect((await GET(new NextRequest('http://localhost/api/discovery?intent=CAFE'))).status).toBe(400);});
 it.each(['vi','en','ko'] as const)('offers cafe in the GO sheet in %s with GO analytics',async locale=>{
  localStorage.setItem(LOCALE_STORAGE_KEY,locale);
  const tracking=vi.spyOn(analytics,'trackPreferenceSelected');
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({ok:true,data:{intent:'GO',preference:'cafe',locale,count:1,places:[apiPlace(1,'CAFE')],meta:{source:'neon-postgres',limit:3,ranking:'provisional-v1'}}})}));
  render(<LocaleProvider><HomePage/></LocaleProvider>);
  const region=screen.getByRole('region',{name:translate(locale,'intent.region')});expect(region.querySelectorAll('button')).toHaveLength(4);
  fireEvent.click(screen.getByText(translate(locale,'intent.go')));fireEvent.click(screen.getByRole('button',{name:translate(locale,'pref.cafe')}));
  expect(await screen.findByText('API fixture 1')).toBeInTheDocument();expect(fetch).toHaveBeenLastCalledWith(`/api/discovery?intent=GO&locale=${locale}&preference=cafe`,expect.anything());
  expect(tracking).toHaveBeenCalledWith('GO','cafe',locale,'manual');expect(screen.getByRole('link',{name:translate(locale,'action.maps')})).toHaveAttribute('href','https://maps.google.com/?cid=901');
 });
 it('accepts GO/cafe without changing locked event names or intent enum',()=>{
  expect(ANALYTICS_EVENT_NAMES).toHaveLength(11);expect([...ANALYTICS_INTENTS]).toEqual(['NOW','EAT','GO','STAY']);
  const result=validateClientAnalyticsPayload({event_name:'preference_selected',session_id:'11111111-1111-4111-8111-111111111111',journey_id:'22222222-2222-4222-8222-222222222222',locale:'vi',language_mode:'manual',intent:'GO',preference:'cafe',meaningful_tap_count:2});expect(result.ok).toBe(true);
 });
});
