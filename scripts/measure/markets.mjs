import { open } from './lib.mjs';
import fs from 'node:fs';
const w = Number(process.argv[2] || 1440), h = Number(process.argv[3] || 900);
const { browser, page } = await open(w, h, { init: fs.readFileSync('sampler.js', 'utf8') });
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
await page.evaluate(() => window.__stopSampling());
const top = await page.evaluate(() => { const el = document.querySelector('[data-framer-name="MARKETS"]'); return el.getBoundingClientRect().top + scrollY; });
const read = () => page.evaluate(() => {
  const c = document.querySelector('[data-framer-name="MARKETS"] [data-framer-name="Circle"]');
  const sel = [...document.querySelectorAll('[data-framer-name="MARKETS"] [data-framer-name="Selected"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.textContent.trim().slice(0, 3) + '…');
  const variant = c && c.parentElement.getAttribute('data-framer-name');
  return { tf: c ? getComputedStyle(c).transform : null, variant, sel, t: Math.round(performance.now()) };
});
// 1) hold section centered for 12s
await page.evaluate(([t, h]) => window.scrollTo(0, t - h * 0.1), [top, h]);
let lastTf = null;
for (let i = 0; i < 120; i++) { const r = await read(); if (r.tf !== lastTf || i % 40 === 0) console.log('hold', i * 100, 'ms', r.variant, r.tf, r.sel.join(',')); lastTf = r.tf; await page.waitForTimeout(100); }
// 2) scroll through the section slowly
for (let y = top - h; y <= top + 900; y += 60) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(250); const r = await read(); if (r.tf !== lastTf) console.log('scroll secTop@', Math.round(top - y), r.variant, r.tf, r.sel.join(',')); lastTf = r.tf; }
// 3) try hover/click on an unselected label
const box = await page.evaluate(() => { const el = [...document.querySelectorAll('[data-framer-name="MARKETS"] [data-framer-name="Not Selected"]')].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top > 100 && r.top < innerHeight - 100 && r.left > 100; }); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, cursor: getComputedStyle(el).cursor }; });
console.log('candidate', box);
await page.evaluate(([t, h]) => window.scrollTo(0, t - h * 0.1), [top, h]); await page.waitForTimeout(600);
const box2 = await page.evaluate(() => { const el = [...document.querySelectorAll('[data-framer-name="MARKETS"] [data-framer-name="Not Selected"]')].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top > 150 && r.top < innerHeight - 150 && r.left > 150; }); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, cursor: getComputedStyle(el).cursor, txt: el.textContent.trim().slice(0,3) }; });
console.log('hover target', box2);
if (box2) { await page.mouse.move(box2.x, box2.y); for (let i = 0; i < 15; i++) { const r = await read(); console.log('hover', i * 100, r.tf, r.sel.join(',')); await page.waitForTimeout(100); } await page.mouse.click(box2.x, box2.y); for (let i = 0; i < 20; i++) { const r = await read(); console.log('click', i * 100, r.tf, r.sel.join(',')); await page.waitForTimeout(100); } }
await browser.close();
