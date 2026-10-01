import { open } from './lib.mjs';
import fs from 'node:fs';
const w = Number(process.argv[2] || 1440), h = Number(process.argv[3] || 900);
const { browser, page } = await open(w, h, { init: fs.readFileSync('sampler.js', 'utf8') });
// sample WHY KERRA + dividers from load
await page.addInitScript(() => { window.__sampleSel = [['[data-framer-name="WHY KERRA"]', 7]]; });
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(6000);
// slowly scroll down 1000px in 50px steps
for (let y = 0; y <= 1100; y += 50) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
await page.waitForTimeout(2500);
const s = await page.evaluate(() => { window.__stopSampling(); return window.__samples; });
const byEl = {};
for (const [t, k, v] of s) (byEl[k] = byEl[k] || []).push([t, JSON.parse(v)]);
console.log('== WHY KERRA animated elements');
for (const [k, arr] of Object.entries(byEl)) {
  if (arr.length < 2) continue;
  const props = new Set(); for (let i = 1; i < arr.length; i++) for (const p of Object.keys(arr[i][1])) if (arr[i][1][p] !== arr[i - 1][1][p] && p !== 'rect') props.add(p);
  if (!props.size) continue;
  console.log('##', k, [...props].join(','), 'n=' + arr.length);
  for (const [t, o] of arr.slice(0, 14)) console.log('   t' + t, 'op', o.opacity, 'tf', o.transform.slice(0, 60), 'clip', o.clipPath, 'filter', o.filter, 'w', o.width, JSON.stringify(o.text).slice(0, 30));
}
// details
const d = await page.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)].find(e => e.getBoundingClientRect().width > 0);
  const st = (el, props) => { if (!el) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); const o = { rect: `${Math.round(r.width)}x${Math.round(r.height)}` }; for (const p of props) o[p] = cs[p]; return o; };
  const P = ['padding', 'borderRadius', 'backgroundColor', 'borderTopWidth', 'borderTopStyle', 'borderTopColor', 'boxShadow', 'color', 'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'textTransform', 'gap'];
  const label = q('[data-framer-name="Name Field"]');
  const input = label && label.querySelector('input');
  const ta = q('[data-framer-name="Message Field"] textarea');
  const btn = q('form button');
  const dot = q('[data-framer-name="TECHNOLOGY"] [data-framer-name="Left"] [data-framer-name="wrapper"] > *');
  const eyebrowWrap = q('[data-framer-name="TECHNOLOGY"] [data-framer-name="Left"] [data-framer-name="wrapper"]');
  const backed = q('[data-framer-name="WHY KERRA"] [data-framer-name="wrapper"] p');
  const statCard = q('[data-framer-name="WHY"] [data-framer-name="Variant 1"]');
  const statH = statCard && [...statCard.querySelectorAll('h1')];
  const line = q('[data-framer-name="line"]');
  const lineKids = line && [...line.querySelectorAll('*')].map(e => st(e, ['backgroundColor', 'backgroundImage', 'width', 'height', 'borderRadius', 'opacity']));
  const pin = (sel) => { const e = q(sel); return e ? st(e, ['opacity', 'filter', 'mixBlendMode']) : null; };
  return {
    label: st(label, P), input: st(input, P), inputPlaceholder: input && getComputedStyle(input, '::placeholder').color, inputPH: input && input.placeholder,
    textarea: st(ta, P), taPlaceholder: ta && getComputedStyle(ta, '::placeholder').color, button: st(btn, P), buttonText: btn && st(btn.querySelector('p') || btn, P),
    dot: st(dot, ['width', 'height', 'borderRadius', 'backgroundColor']), eyebrowWrap: st(eyebrowWrap, ['gap', 'alignItems']),
    backedBy: st(backed, P),
    statH: statH && statH.map(e => st(e, ['color', 'backgroundImage', 'backgroundSize', 'backgroundClip', 'webkitBackgroundClip', 'webkitTextFillColor', 'position'])),
    line: st(line, ['backgroundImage', 'height', 'width', 'opacity', 'gap']), lineKids,
    logos: [1, 2, 3].map(i => pin(`[data-framer-name="Logo-${i}"]`)),
  };
});
console.log(JSON.stringify(d, null, 1));
await browser.close();
