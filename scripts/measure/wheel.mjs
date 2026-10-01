// Wheel geometry in the Markets section at several widths.
import { open } from './lib.mjs';
for (const [w, h] of [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [375, 812]]) {
  const { browser, page } = await open(w, h);
  await page.goto('https://www.kerra.earth/', { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(5000);
  const r = await page.evaluate(() => {
    const vis = (e) => e && e.getBoundingClientRect().width > 0;
    const sec = document.querySelector('[data-framer-name="MARKETS"]');
    const s = sec.getBoundingClientRect(); const top = s.top + scrollY;
    const rel = (e) => { const b = e.getBoundingClientRect(); return `x${Math.round(b.left)} y${Math.round(b.top + scrollY - top)} ${Math.round(b.width)}x${Math.round(b.height)}`; };
    const circle = [...sec.querySelectorAll('[data-framer-name="Circle"]')].find(vis);
    // centre = midpoint of an arm's bounding box (arms are symmetric about the centre)
    const arm = circle && [...circle.children].find(vis);
    const ab = arm.getBoundingClientRect();
    const centre = { x: Math.round(ab.left + ab.width / 2), y: Math.round(ab.top + ab.height / 2 + scrollY - top) };
    // label distance from centre: nearest point of any label box to centre
    const labels = [...circle.querySelectorAll('h4')].filter(vis);
    const cs = getComputedStyle(labels[0]);
    const pointer = [...sec.querySelectorAll('[data-framer-name="Pointer"] *')].find(e => vis(e) && getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)');
    const logo = [...sec.querySelectorAll('[data-framer-name="LOGO"] *')].find(vis);
    const sel = [...sec.querySelectorAll('[data-framer-name="Selected"]')].find(vis);
    const selH = sel && sel.querySelector('h4');
    const fades = [...sec.querySelectorAll('[data-framer-name^="fade"]')].filter(vis).map(e => e.getAttribute('data-framer-name') + ' ' + rel(e));
    const content = [...sec.querySelectorAll('[data-framer-name="content"]')].find(vis);
    const textBoxes = content ? [...content.querySelectorAll('h2,p,a')].filter(vis).map(e => e.tagName + ' ' + rel(e)) : [];
    const pb = pointer && pointer.getBoundingClientRect();
    const lb = logo && logo.getBoundingClientRect();
    const sb = selH && selH.getBoundingClientRect();
    return {
      section: `${Math.round(s.width)}x${Math.round(s.height)}`, centre, labelFont: `${cs.fontSize}/${cs.lineHeight}`,
      pointer: pb && { cx: Math.round(pb.left + pb.width / 2), cy: Math.round(pb.top + pb.height / 2 + scrollY - top), size: Math.round(pb.width), distFromCentre: Math.round(pb.left + pb.width / 2 - centre.x) },
      logo: lb && { cx: Math.round(lb.left + lb.width / 2), cy: Math.round(lb.top + lb.height / 2 + scrollY - top), w: Math.round(lb.width), h: Math.round(lb.height) },
      selectedTextStart: sb && Math.round(sb.left - centre.x),
      fades, content: content && rel(content), textBoxes,
    };
  });
  console.log(w, JSON.stringify(r));
  await browser.close();
}
