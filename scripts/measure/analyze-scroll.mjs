import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const only = process.argv[3] ? process.argv[3].split(',') : null;
const maxLines = Number(process.argv[4] || 14);
for (const [sec, samples] of Object.entries(data)) {
  if (only && !only.includes(sec)) continue;
  console.log('\n######', sec);
  const byEl = {}; const scrolls = [];
  for (const [t, k, v] of samples) {
    if (k === 'SCROLL') { scrolls.push([t, JSON.parse(v).topInViewport]); continue; }
    (byEl[k] = byEl[k] || []).push([t, JSON.parse(v)]);
  }
  const scrollAt = (t) => { let s = null; for (const [st, y] of scrolls) if (st <= t) s = y; return s; };
  for (const [k, arr] of Object.entries(byEl)) {
    if (arr.length < 2) continue;
    const t0 = arr[0][0];
    let prev = arr[0][1];
    const lines = [];
    for (const [t, o] of arr.slice(1)) {
      const diff = Object.entries(o).filter(([p, v]) => prev[p] !== v && p !== 'rect').map(([p, v]) => p + '=' + String(v).replace(/\n/g, ' ').slice(0, 58));
      if (diff.length) lines.push(`  +${t - t0}ms (secTop@${scrollAt(t)}px) ${diff.join(' | ')}`.slice(0, 260));
      prev = o;
    }
    if (!lines.length) continue;
    const o0 = arr[0][1];
    console.log(`## ${k} [${o0.rect}] start: op=${o0.opacity} tf=${o0.transform.slice(0, 50)} clip=${o0.clipPath} filter=${o0.filter} changes=${lines.length}`);
    lines.slice(0, maxLines).forEach(l => console.log(l));
    if (lines.length > maxLines) console.log('  ...', lines.length - maxLines, 'more; last:', lines[lines.length - 1].slice(0, 200));
  }
}
