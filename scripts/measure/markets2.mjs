import { open } from './lib.mjs';
const { browser, page } = await open(1440, 900);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
const top = await page.evaluate(() => { const el = document.querySelector('[data-framer-name="MARKETS"]'); return el.getBoundingClientRect().top + scrollY; });
const ang = () => page.evaluate(() => { const c = document.querySelector('[data-framer-name="MARKETS"] [data-framer-name="Circle"]'); const m = getComputedStyle(c).transform.match(/matrix\(([^)]+)\)/); if (!m) return 0; const [a, b] = m[1].split(',').map(Number); return +(Math.atan2(b, a) * 180 / Math.PI).toFixed(2); });
// A: tiny 10px steps
await page.evaluate((y) => window.scrollTo(0, y), top - 600); await page.waitForTimeout(800);
console.log('start angle', await ang());
for (let i = 0; i < 8; i++) { await page.evaluate(() => window.scrollBy(0, 10)); await page.waitForTimeout(400); console.log('  +10px ->', await ang()); }
// B: big 300px jumps
for (let i = 0; i < 3; i++) { await page.evaluate(() => window.scrollBy(0, 300)); await page.waitForTimeout(500); console.log('  +300px ->', await ang()); }
// C: scrolling up
for (let i = 0; i < 3; i++) { await page.evaluate(() => window.scrollBy(0, -40)); await page.waitForTimeout(500); console.log('  -40px ->', await ang()); }
// D: mouse wheel events (real wheel) of 100px each
await page.mouse.move(700, 450);
for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(500); console.log('  wheel +100 ->', await ang()); }
// E: frame-by-frame transition timing for one step
const series = await page.evaluate(async () => {
  const c = document.querySelector('[data-framer-name="MARKETS"] [data-framer-name="Circle"]');
  const out = []; const t0 = performance.now();
  const read = () => { const m = getComputedStyle(c).transform.match(/matrix\(([^)]+)\)/); const [a, b] = m[1].split(',').map(Number); return +(Math.atan2(b, a) * 180 / Math.PI).toFixed(3); };
  window.scrollBy(0, 20);
  await new Promise(res => { function f() { out.push([Math.round(performance.now() - t0), read()]); if (performance.now() - t0 < 1200) requestAnimationFrame(f); else res(); } requestAnimationFrame(f); });
  return out;
});
console.log('transition:', series.filter((_, i) => i % 2 === 0).map(([t, a]) => t + ':' + a).join(' '));
// F: selected label + pointer styling
const sel = await page.evaluate(() => { const s = [...document.querySelectorAll('[data-framer-name="MARKETS"] [data-framer-name="Selected"]')].find(e => e.getBoundingClientRect().width > 0); const h = s.querySelector('h4,p,span') || s; const cs = getComputedStyle(h); const p = document.querySelector('[data-framer-name="MARKETS"] [data-framer-name="Pointer"]'); const dot = p && [...p.querySelectorAll('*')].map(e => { const c2 = getComputedStyle(e); const r = e.getBoundingClientRect(); return `${e.tagName} ${Math.round(r.width)}x${Math.round(r.height)} bg ${c2.backgroundColor} r ${c2.borderRadius}`; }); return { color: cs.color, transition: getComputedStyle(s).transition, pad: getComputedStyle(s).paddingLeft, pointer: dot }; });
console.log(JSON.stringify(sel, null, 1));
await browser.close();
