import { open } from './lib.mjs';
const { browser, page } = await open(1440, 900);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
const top = await page.evaluate(() => { const el = document.querySelector('[data-framer-name="MARKETS"]'); return el.getBoundingClientRect().top + scrollY; });
const ang = () => page.evaluate(() => { const c = document.querySelector('[data-framer-name="MARKETS"] [data-framer-name="Circle"]'); const m = getComputedStyle(c).transform.match(/matrix\(([^)]+)\)/); if (!m) return 0; const [a, b] = m[1].split(',').map(Number); return Math.round(Math.atan2(b, a) * 180 / Math.PI); });
const secTop = () => page.evaluate(() => Math.round(document.querySelector('[data-framer-name="MARKETS"]').getBoundingClientRect().top));
// approach gradually with wheel from far above, 50px per event
await page.evaluate((y) => window.scrollTo(0, y), top - 1400); await page.waitForTimeout(600);
await page.mouse.move(700, 450);
let log = [];
for (let i = 0; i < 26; i++) { await page.mouse.wheel(0, 50); await page.waitForTimeout(300); log.push(`${await secTop()}:${await ang()}`); }
console.log('wheel 50px events  (secTop:angle)', log.join(' '));
log = [];
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 25); await page.waitForTimeout(300); log.push(`${await secTop()}:${await ang()}`); }
console.log('wheel 25px events', log.join(' '));
log = [];
for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(300); log.push(`${await secTop()}:${await ang()}`); }
console.log('wheel 200px events', log.join(' '));
log = [];
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -60); await page.waitForTimeout(300); log.push(`${await secTop()}:${await ang()}`); }
console.log('wheel -60px events', log.join(' '));
// a fast burst of 10 x 50px with 16ms gaps (like a real trackpad fling)
log = [];
const a0 = await ang();
for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 50); await page.waitForTimeout(16); }
await page.waitForTimeout(800);
console.log('burst 10x50px: angle', a0, '->', await ang(), 'secTop', await secTop());
await browser.close();
