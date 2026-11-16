
import {test,expect} from '@playwright/test';
const visit=async(page,lang='ar')=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?renderer=svg&lang='+lang);
 await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.workshop')).toHaveAttribute('data-renderer','svg');
};
test('both languages fit the viewport and persist',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['ar','en']){
  await visit(page,lang);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('dir',lang==='ar'?'rtl':'ltr');await expect(page.locator('h1')).toBeVisible();
 }
 await page.locator('.language').click();await expect(page.locator('html')).toHaveAttribute('lang','ar');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','ar');expect(errors).toEqual([]);
});
test('physical models, pause, and keyboard rotation work without a GPU',async({page})=>{
 await visit(page);const workshop=page.locator('.workshop');
 for(const id of ['robot','gate','greenhouse']){
  await page.locator('button[data-model="'+id+'"]').click();await expect(workshop).toHaveAttribute('data-model',id);
  await expect(page.locator('.model-fallback svg')).toBeVisible();await page.locator('.model-action').click();await expect(workshop).toHaveAttribute('data-action','true');
 }
 const before=await page.locator('.model-fallback').innerHTML();await page.locator('.model-surface').press('ArrowLeft');
 await expect.poll(()=>page.locator('.model-fallback').innerHTML()).not.toBe(before);
 const still=await page.locator('.model-fallback').innerHTML();await page.waitForTimeout(350);expect(await page.locator('.model-fallback').innerHTML()).toBe(still);
});
test('service keyboard navigation and brief stay synchronized',async({page})=>{
 await visit(page,'en');const tabs=page.getByRole('tab');await tabs.nth(2).click();await tabs.nth(2).press('ArrowRight');
 await expect(tabs.nth(3)).toHaveAttribute('aria-selected','true');await page.locator('.contact-section .start').click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();expect(await dialog.locator('select').evaluate(el=>el.selectedIndex)).toBe(3);
 await dialog.getByLabel('Your name',{exact:true}).fill('Example');await dialog.getByLabel('Your email or phone').fill('example@example.com');
 await dialog.getByLabel('Your idea',{exact:true}).fill('A connected monitoring system for a small business.');
 const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'Save project brief',exact:true}).click();
 expect((await download).suggestedFilename()).toBe('smart-solution-project-brief.txt');await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
});
test('menu, concept selection, and transparent branding work',async({page,request})=>{
 await visit(page);const menu=page.locator('.menu');
 if(await menu.isVisible()){await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(menu).toBeFocused()}
 await page.locator('[data-explore="gate"]').click();await expect(page.locator('.workshop')).toHaveAttribute('data-model','gate');
 await expect(page.locator('.model-surface')).toBeFocused();const svg=await (await request.get('/brand/smart-solution-web.svg')).text();
 expect(svg).toContain('<svg');expect(svg).not.toContain('<image');expect(svg).not.toContain('<rect');
 await expect(page.locator('.brand-logo img')).toHaveAttribute('src','/brand/smart-solution-web.svg');
});
test('capture stable review views',async({page},testInfo)=>{
 await visit(page);await page.screenshot({path:testInfo.outputPath('01-arabic-hero.png')});
 await page.locator('#solutions').scrollIntoViewIfNeeded();await page.screenshot({path:testInfo.outputPath('02-solutions.png')});
 await page.locator('#lab').scrollIntoViewIfNeeded();await page.screenshot({path:testInfo.outputPath('03-concepts.png')});
 await visit(page,'en');await page.screenshot({path:testInfo.outputPath('04-english-hero.png')});
});
test('optional GPU renderer initializes on a WebGL2-capable runner',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop','GPU smoke test runs once on desktop');
 await page.goto('/?lang=en');const supported=await page.evaluate(()=>!!document.createElement('canvas').getContext('webgl2'));
 test.skip(!supported,'This runner has no WebGL2; SVG behavior is tested separately');
 await expect(page.locator('.workshop')).toHaveAttribute('data-renderer','webgl',{timeout:25000});
 await page.locator('button[data-model="gate"]').click();await page.locator('.model-action').click();await page.screenshot({path:testInfo.outputPath('05-webgl-scene.png')});
});
