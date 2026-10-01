import { open } from './lib.mjs';
const { browser, page } = await open(375, 812);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
const info = await page.evaluate(() => {
  const nav = [...document.querySelectorAll('nav')].find(n => n.getBoundingClientRect().width > 0);
  const out = [];
  (function walk(e, d) { for (const c of e.children) { const r = c.getBoundingClientRect(); const cs = getComputedStyle(c); if (r.width === 0 && cs.display === 'none') continue; out.push(`${'  '.repeat(d)}${c.tagName.toLowerCase()}${c.getAttribute('data-framer-name') ? '[' + c.getAttribute('data-framer-name') + ']' : ''} ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} op${cs.opacity} vis:${cs.visibility} ov:${cs.overflow} bg:${cs.backgroundColor} r:${cs.borderRadius} pad:${cs.padding} cursor:${cs.cursor}`); if (d < 6) walk(c, d + 1); } })(nav, 0);
  return { navH: nav.getBoundingClientRect().height, navOv: getComputedStyle(nav).overflow, tree: out.join('\n') };
});
console.log(info.navH, info.navOv); console.log(info.tree);
await page.screenshot({ path: 'phone-nav.png', clip: { x: 0, y: 0, width: 375, height: 300 } });
// try clicking a toggle if any (element with cursor pointer that's not the CTA)
const toggled = await page.evaluate(() => { const nav = [...document.querySelectorAll('nav')].find(n => n.getBoundingClientRect().width > 0); const c = [...nav.querySelectorAll('*')].filter(e => getComputedStyle(e).cursor === 'pointer' && e.getBoundingClientRect().width > 0).map(e => `${e.tagName}[${e.getAttribute('data-framer-name')}] ${Math.round(e.getBoundingClientRect().left)},${Math.round(e.getBoundingClientRect().top)}`); return c; });
console.log('pointer elements:', toggled);
await browser.close();
