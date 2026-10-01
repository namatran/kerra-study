import { open } from './lib.mjs';
import { PNG } from 'pngjs';
import fs from 'node:fs';
// usage: node film.mjs <name> <selector> <frames> <intervalMs> [scrollFrac] [mouse]
const [name, sel, nF, iv, frac = '0.5', mouse = ''] = process.argv.slice(2);
const { browser, page } = await open(1440, 900);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
const r0 = await page.evaluate((sel) => { const e = [...document.querySelectorAll(sel)].find(x => x.getBoundingClientRect().width > 0); const r = e.getBoundingClientRect(); return { top: r.top + scrollY, left: r.left, w: r.width, h: r.height }; }, sel);
// place element so its top sits at frac of the viewport
const y = Math.max(0, r0.top - 900 * Number(frac));
await page.evaluate((y) => window.scrollTo(0, y), y);
const t0 = Date.now();
const frames = [];
const clip = { x: Math.max(0, r0.left), y: Math.max(0, r0.top - y), width: Math.min(r0.w, 1440), height: Math.min(r0.h, 900 - Math.max(0, r0.top - y)) };
for (let i = 0; i < Number(nF); i++) {
  if (mouse) await page.mouse.move(clip.x + clip.width * (0.2 + 0.6 * (i % 2)), clip.y + clip.height * 0.5, { steps: 4 });
  const buf = await page.screenshot({ clip });
  frames.push([Date.now() - t0, buf]);
  const wait = Number(iv) - ((Date.now() - t0) - i * Number(iv));
  if (wait > 0) await page.waitForTimeout(wait);
}
// metrics: mean luminance + diff vs previous + fraction of "dark" pixels
let prev = null; const rows = [];
for (const [t, buf] of frames) {
  const p = PNG.sync.read(buf); let sum = 0, dark = 0, diff = 0; const n = p.width * p.height;
  for (let i = 0; i < n; i++) { const L = 0.2126 * p.data[i * 4] + 0.7152 * p.data[i * 4 + 1] + 0.0722 * p.data[i * 4 + 2]; sum += L; if (L < 128) dark++; if (prev) diff += Math.abs(L - prev[i]); }
  const lum = new Float32Array(n); for (let i = 0; i < n; i++) lum[i] = 0.2126 * p.data[i * 4] + 0.7152 * p.data[i * 4 + 1] + 0.0722 * p.data[i * 4 + 2];
  rows.push(`t${t} meanL=${(sum / n).toFixed(1)} dark=${(100 * dark / n).toFixed(1)}% diff=${prev ? (diff / n).toFixed(2) : '-'}`);
  prev = lum;
}
console.log(name, JSON.stringify(clip)); console.log(rows.join('\n'));
// contact sheet
fs.mkdirSync('film', { recursive: true });
const pick = frames.filter((_, i) => i % Math.max(1, Math.floor(frames.length / 8)) === 0).slice(0, 8);
const imgs = pick.map(([t, b]) => `<figure><img src="data:image/png;base64,${b.toString('base64')}"><figcaption>${t}ms</figcaption></figure>`).join('');
const sheet = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await sheet.setContent(`<style>body{margin:0;background:#888;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:4px;font:12px sans-serif}figure{margin:0}img{width:100%;display:block;background:#fff}figcaption{color:#fff}</style>${imgs}`);
await sheet.screenshot({ path: `film/${name}.png`, fullPage: true });
await browser.close();
