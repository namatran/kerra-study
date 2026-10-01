import { open } from './lib.mjs';
import fs from 'node:fs';
const w = Number(process.argv[2] || 1440), h = Number(process.argv[3] || 900);
const names = (process.argv[4] || 'WHY KERRA,TECHNOLOGY,MARKETS,WHY,SUSTAINABILITY,CONTACT,FOOTER').split(',');
const { browser, page } = await open(w, h, { init: fs.readFileSync('sampler.js', 'utf8') });
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5500);
await page.evaluate(() => { window.__stopSampling(); });
const out = {};
for (const name of names) {
  const top = await page.evaluate((n) => { const el = document.querySelector(`[data-framer-name="${n}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return r.top + scrollY; }, name);
  if (top == null) { console.log('missing', name); continue; }
  // position section top at 115% of viewport, then step up 40px at a time to 55%
  await page.evaluate(([t, h]) => window.scrollTo(0, Math.max(0, t - h * 1.15)), [top, h]);
  await page.waitForTimeout(400);
  await page.evaluate((n) => { window.__samples.length = 0; window.__startSampling([[`[data-framer-name="${n}"]`, 9]]); }, name);
  for (let f = 1.15; f >= 0.55; f -= 40 / h) {
    await page.evaluate(([t, h, f]) => { window.scrollTo(0, Math.max(0, t - h * f)); window.__samples.push([Math.round(performance.now()), 'SCROLL', JSON.stringify({ topInViewport: Math.round(h * f), frac: +f.toFixed(3) })]); }, [top, h, f]);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(3000);
  out[name] = await page.evaluate(() => { window.__stopSampling(); return window.__samples.slice(); });
  console.log(name, 'top', Math.round(top), 'samples', out[name].length);
}
fs.writeFileSync(`scroll-${w}.json`, JSON.stringify(out));
await browser.close();
