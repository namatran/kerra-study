import { open } from './lib.mjs';
const { browser, page } = await open(1440, 900);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
const res = await page.evaluate(async () => {
  const sec = document.querySelector('[data-framer-name="MARKETS"]');
  const c = sec.querySelector('[data-framer-name="Circle"]');
  const ang = () => { const m = getComputedStyle(c).transform.match(/matrix\(([^)]+)\)/); const [a, b] = m[1].split(',').map(Number); return Math.round(Math.atan2(b, a) * 180 / Math.PI); };
  const top = sec.getBoundingClientRect().top + scrollY;
  window.scrollTo(0, top - 300); await new Promise(r => setTimeout(r, 800));
  const out = [];
  // continuous scroll: 4px every 16ms for 2.4s (~250px/s)
  const changes = []; let last = ang(); const t0 = performance.now();
  await new Promise(res => { const iv = setInterval(() => { window.scrollBy(0, 4); const a = ang(); if (a !== last) { changes.push(Math.round(performance.now() - t0)); last = a; } if (performance.now() - t0 > 2400) { clearInterval(iv); res(); } }, 16); });
  out.push({ mode: '4px/16ms', stepsStartedAt: changes.length, secTopEnd: Math.round(sec.getBoundingClientRect().top) });
  await new Promise(r => setTimeout(r, 600));
  const a1 = ang();
  // fast: 20px every 16ms for 1s
  const t1 = performance.now(); await new Promise(res => { const iv = setInterval(() => { window.scrollBy(0, 20); if (performance.now() - t1 > 1000) { clearInterval(iv); res(); } }, 16); });
  await new Promise(r => setTimeout(r, 600));
  out.push({ mode: '20px/16ms for 1s', angleFrom: a1, angleTo: ang(), secTopEnd: Math.round(sec.getBoundingClientRect().top) });
  return out;
});
console.log(JSON.stringify(res));
await browser.close();
