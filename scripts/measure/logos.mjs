import { open } from './lib.mjs';
import fs from 'node:fs';
const { browser, page } = await open(1440, 900, { init: fs.readFileSync('sampler.js', 'utf8') });
await page.addInitScript(() => { window.__sampleSel = [['[data-framer-name="Logos"]', 2]]; });
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(6000);
const marks = [];
for (let y = 0; y <= 1100; y += 50) { await page.evaluate((y) => window.scrollTo(0, y), y); marks.push([await page.evaluate(() => Math.round(performance.now())), y, await page.evaluate(() => Math.round(document.querySelector('[data-framer-name="Logos"]').getBoundingClientRect().top))]); await page.waitForTimeout(120); }
await page.waitForTimeout(3000);
const s = await page.evaluate(() => { window.__stopSampling(); return window.__samples; });
const at = (t) => { let m = null; for (const x of marks) if (x[0] <= t) m = x; return m ? `logosTop@${m[2]}` : 'pre-scroll'; };
const byEl = {};
for (const [t, k, v] of s) { const o = JSON.parse(v); (byEl[k] = byEl[k] || []).push([t, o.opacity, o.transform, o.filter]); }
for (const [k, arr] of Object.entries(byEl)) {
  const ch = arr.filter((x, i) => i === 0 || x[1] !== arr[i - 1][1] || x[2] !== arr[i - 1][2] || x[3] !== arr[i - 1][3]);
  if (ch.length < 2) continue;
  console.log(k, ch.map(([t, op, tf, f]) => `${t}(${at(t)}):op${(+op).toFixed(3)}${tf !== 'none' ? ' ' + tf.slice(0, 40) : ''}${f !== 'none' ? ' ' + f : ''}`).join('  '));
}
await browser.close();
