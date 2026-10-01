import { open, scrollThrough } from './lib.mjs';
import fs from 'node:fs';
const w = Number(process.argv[2] || 1440), h = Number(process.argv[3] || 900);
const shot = process.argv[4];
const { browser, page } = await open(w, h);
await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(5000);
await scrollThrough(page);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1200);
const data = await page.evaluate(() => {
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const names = (el) => { const n = []; let e = el; while (e && n.length < 4) { const v = e.getAttribute && e.getAttribute('data-framer-name'); if (v) n.unshift(v); e = e.parentElement; } return n.join(' > '); };
  // tree
  const tree = [];
  (function walk(el, d) {
    for (const c of el.children) {
      if (!visible(c) && !c.classList.contains('ssr-variant')) continue;
      const nm = c.getAttribute('data-framer-name');
      const cs = getComputedStyle(c);
      if (nm || ['SECTION','MAIN','NAV','FORM','FOOTER','HEADER','INPUT','TEXTAREA','BUTTON','A','IMG','CANVAS','VIDEO','SVG','svg'].includes(c.tagName)) {
        tree.push({ d, name: nm, tag: c.tagName.toLowerCase(), cls: (typeof c.className === 'string' ? c.className : '').split(' ')[0], ...rect(c),
          display: cs.display, pos: cs.position, dir: cs.flexDirection, gap: cs.gap, pad: cs.padding, jc: cs.justifyContent, ai: cs.alignItems,
          gtc: cs.display.includes('grid') ? cs.gridTemplateColumns : undefined, bg: cs.backgroundColor, bgi: cs.backgroundImage === 'none' ? undefined : cs.backgroundImage.slice(0, 160),
          br: cs.borderRadius, bd: cs.borderTopWidth !== '0px' ? `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}` : undefined,
          sh: cs.boxShadow === 'none' ? undefined : cs.boxShadow, op: cs.opacity !== '1' ? cs.opacity : undefined, tf: cs.transform === 'none' ? undefined : cs.transform,
          mix: cs.mixBlendMode !== 'normal' ? cs.mixBlendMode : undefined, filt: cs.filter !== 'none' ? cs.filter : undefined, bdf: cs.backdropFilter !== 'none' ? cs.backdropFilter : undefined,
          mask: cs.maskImage && cs.maskImage !== 'none' ? cs.maskImage.slice(0, 160) : undefined, ov: cs.overflow !== 'visible' ? cs.overflow : undefined, z: cs.zIndex !== 'auto' ? cs.zIndex : undefined });
      }
      if (d < 14) walk(c, d + 1);
    }
  })(document.querySelector('#main') || document.body, 0);
  // texts
  const texts = [];
  for (const el of document.querySelectorAll('#main *')) {
    if (!visible(el)) continue;
    const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    const isField = ['INPUT','TEXTAREA'].includes(el.tagName);
    if (!own && !isField) continue;
    const cs = getComputedStyle(el);
    texts.push({ path: names(el), tag: el.tagName.toLowerCase(), t: isField ? `[${el.tagName} placeholder=${el.placeholder}]` : own.slice(0, 28), ...rect(el),
      ff: cs.fontFamily, fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, ls: cs.letterSpacing, c: cs.color, tt: cs.textTransform, ta: cs.textAlign, op: cs.opacity,
      ffs: cs.fontFeatureSettings !== 'normal' ? cs.fontFeatureSettings : undefined, fvs: cs.fontVariationSettings !== 'normal' ? cs.fontVariationSettings : undefined,
      ph: isField ? getComputedStyle(el, '::placeholder').color : undefined });
  }
  // colors
  const colors = {};
  const add = (k, v, where) => { if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'none') return; const key = k + ' | ' + v; colors[key] = colors[key] || { n: 0, where: new Set() }; colors[key].n++; if (colors[key].where.size < 4) colors[key].where.add(where); };
  for (const el of document.querySelectorAll('#main *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el); const nm = names(el) || el.tagName.toLowerCase();
    add('bg', cs.backgroundColor, nm);
    if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url')) add('bgimg', cs.backgroundImage.slice(0, 220), nm);
    if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) add('text', cs.color, nm);
    if (parseFloat(cs.borderTopWidth) > 0) add('border', cs.borderTopWidth + ' ' + cs.borderTopColor, nm);
    if (cs.boxShadow !== 'none') add('shadow', cs.boxShadow, nm);
    if (el.tagName === 'path' || el.tagName === 'rect' || el.tagName === 'circle') { add('svgfill', cs.fill, nm); if (cs.stroke !== 'none') add('svgstroke', cs.stroke, nm); }
  }
  const colorList = Object.entries(colors).map(([k, v]) => ({ k, n: v.n, where: [...v.where] })).sort((a, b) => a.k.localeCompare(b.k));
  // fonts + media + tokens
  const fontFaces = [], media = {}, tokens = {};
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules; } catch { continue; }
    const visit = (rs) => { for (const r of rs) {
      if (r instanceof CSSFontFaceRule) fontFaces.push(`${r.style.getPropertyValue('font-family')} w=${r.style.getPropertyValue('font-weight')} s=${r.style.getPropertyValue('font-style')} ${r.style.getPropertyValue('src').slice(0, 110)}`);
      else if (r instanceof CSSMediaRule) { media[r.conditionText] = (media[r.conditionText] || 0) + r.cssRules.length; visit(r.cssRules); }
      else if (r.style) { for (const p of r.style) if (p.startsWith('--token')) tokens[p] = r.style.getPropertyValue(p).trim(); }
    } };
    visit(rules);
  }
  const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`);
  return { vw: innerWidth, docH: document.documentElement.scrollHeight, tree, texts, colorList, fontFaces: [...new Set(fontFaces)], loaded: [...new Set(loaded)], media, tokens };
});
fs.writeFileSync(`survey-${w}.json`, JSON.stringify(data, null, 1));
if (shot) await page.screenshot({ path: shot, fullPage: true });
console.log('ok', w, 'docH', data.docH, 'tree', data.tree.length, 'texts', data.texts.length, 'colors', data.colorList.length);
await browser.close();
