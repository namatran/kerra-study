import { open } from './lib.mjs';
const w = Number(process.argv[2] || 1440), h = Number(process.argv[3] || 900);
const { browser, page } = await open(w, h);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
const targets = {
  navLink: 'nav [data-framer-name="Links"] a',
  navCTA: 'nav a[data-framer-name="Secondary L"]',
  marketsCTA: '[data-framer-name="MARKETS"] a[data-framer-name="Secondary L"]',
  input: '[data-framer-name="Name Field"]',
  textarea: '[data-framer-name="Message Field"]',
  send: 'form button',
  email: '[data-framer-name="Email"] a',
  footerLink: '[data-framer-name="FOOTER"] [data-framer-name="links"] a',
  linkedin: '[data-framer-name="linkedin"]',
  logo1: '[data-framer-name="Logo-1"]',
  navLogo: 'nav [data-framer-name="logo"]',
};
const PROPS = ['opacity','transform','backgroundColor','color','borderTopColor','borderTopWidth','boxShadow','borderRadius','width','height','padding','filter','textDecorationLine','left','right','gap','outlineStyle','outlineColor'];
for (const [name, sel] of Object.entries(targets)) {
  const ok = await page.evaluate(([sel]) => { const el = [...document.querySelectorAll(sel)].find(e => e.getBoundingClientRect().width > 0); if (!el) return false; el.scrollIntoView({ block: 'center' }); window.__hel = el; return true; }, [sel]);
  if (!ok) { console.log('##', name, 'not found'); continue; }
  await page.mouse.move(5, 5); await page.waitForTimeout(500);
  const snap = () => page.evaluate((PROPS) => { const el = window.__hel; const all = [el, ...el.querySelectorAll('*')].slice(0, 14); return all.map(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const o = { tag: e.tagName.toLowerCase() + (e.getAttribute('data-framer-name') ? '[' + e.getAttribute('data-framer-name') + ']' : ''), rect: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}` }; for (const p of PROPS) o[p] = cs[p]; o.transition = cs.transition; o.cursor = cs.cursor; return o; }); }, PROPS);
  const base = await snap();
  const b0 = base[0];
  console.log(`## ${name} ${b0.tag} ${b0.rect} bg=${b0.backgroundColor} color=${b0.color} r=${b0.borderRadius} pad=${b0.padding} border=${b0.borderTopWidth} ${b0.borderTopColor} shadow=${b0.boxShadow} cursor=${b0.cursor} transition=${b0.transition.slice(0, 80)}`);
  const box = await page.evaluate(() => { const r = window.__hel.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await page.mouse.move(box.x, box.y);
  const t0 = Date.now(); let prev = base;
  for (let i = 0; i < 16; i++) {
    await page.waitForTimeout(50);
    const s = await snap();
    s.forEach((o, j) => { const p = prev[j]; if (!p) return; const d = Object.keys(o).filter(k => k !== 'transition' && o[k] !== p[k]).map(k => `${k}:${String(p[k]).slice(0, 40)}→${String(o[k]).slice(0, 40)}`); if (d.length) console.log(`   +${Date.now() - t0}ms ${o.tag} ${d.join(' | ')}`.slice(0, 300)); });
    prev = s;
  }
  if (name === 'input' || name === 'textarea') {
    await page.evaluate(() => { const f = window.__hel.querySelector('input,textarea'); f.focus(); });
    await page.waitForTimeout(400);
    const s = await snap();
    s.forEach((o, j) => { const p = prev[j]; const d = Object.keys(o).filter(k => k !== 'transition' && o[k] !== p[k]).map(k => `${k}:${String(p[k]).slice(0, 40)}→${String(o[k]).slice(0, 40)}`); if (d.length) console.log(`   FOCUS ${o.tag} ${d.join(' | ')}`.slice(0, 300)); });
  }
  // leave
  await page.mouse.move(5, 5);
  await page.waitForTimeout(600);
}
await browser.close();
