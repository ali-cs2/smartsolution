
import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',fullyParallel:true,retries:1,workers:2,timeout:45000,globalTimeout:480000,
 reporter:[['list'],['html',{open:'never'}]],use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'npm run preview -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
 projects:[
  {name:'small-phone',use:{browserName:'chromium',viewport:{width:320,height:720},isMobile:true,hasTouch:true}},
  {name:'phone',use:{browserName:'chromium',viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  {name:'tablet',use:{browserName:'chromium',viewport:{width:768,height:1024}}},
  {name:'desktop',use:{browserName:'chromium',viewport:{width:1440,height:1000}}},
  {name:'landscape',use:{browserName:'chromium',viewport:{width:844,height:390},isMobile:true,hasTouch:true}},
  {name:'safari-phone',use:{browserName:'webkit',viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  {name:'firefox',use:{browserName:'firefox',viewport:{width:1280,height:900}}}
 ]
});
