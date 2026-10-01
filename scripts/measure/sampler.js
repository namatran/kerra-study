// Injected before page scripts: samples computed styles every 50ms and logs only changes.
(() => {
  const T0 = performance.now();
  const log = []; const last = new Map();
  window.__samples = log;
  const PROPS = ['opacity','transform','clipPath','width','height','backgroundColor','color','filter','visibility','display','maskImage','backgroundPosition','letterSpacing','top','left'];
  function key(el) {
    if (!el.__sid) el.__sid = (el.getAttribute('data-framer-name') || el.tagName.toLowerCase()) + '#' + Math.random().toString(36).slice(2, 6);
    return el.__sid;
  }
  function snap(el) {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const o = {};
    for (const p of PROPS) o[p] = cs[p];
    o.rect = `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)}x${Math.round(r.height)}`;
    o.text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim().slice(0, 24);
    return JSON.stringify(o);
  }
  function targets() {
    const sel = window.__sampleSel || [];
    const out = [];
    for (const [s, depth] of sel) for (const el of document.querySelectorAll(s)) {
      out.push(el);
      if (depth) (function walk(e, d) { for (const c of e.children) { out.push(c); if (d < depth) walk(c, d + 1); } })(el, 1);
    }
    return out;
  }
  function tick() {
    const t = Math.round(performance.now() - T0);
    for (const el of targets()) {
      const k = key(el); const s = snap(el);
      if (last.get(k) !== s) { last.set(k, s); log.push([t, k, s]); }
    }
  }
  window.__startSampling = (sel, ms = 50) => { window.__sampleSel = sel; clearInterval(window.__sint); window.__sint = setInterval(tick, ms); tick(); };
  window.__stopSampling = () => clearInterval(window.__sint);
  window.__sampleSel = [['[data-framer-name="PRELOADER"]', 6], ['nav', 1], ['[data-framer-name="Blind Reveal Headline"]', 6], ['[data-framer-name="DESCRIPTION"]', 3], ['[data-framer-name="top-left"]', 0], ['[data-framer-name="top-right"]', 0], ['[data-framer-name="bottom-right"]', 0], ['[data-framer-name="FRAME"]', 4]];
  window.__sint = setInterval(tick, 50);
})();
