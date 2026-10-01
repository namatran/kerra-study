// Side-by-side comparison of one section: this build (left) vs the original (right).
//
//   npm run compare -- <section> [width]          e.g. npm run compare -- intro 1440
//   npm run compare -- page 375                   whole page, side by side
//   npm run compare -- sections 768               every section's position and height, as a table
//
// Needs the dev server running (npm run dev) and Google Chrome installed.
// Writes docs/screenshots/compare/<section>-<width>.png (git-ignored: it contains the
// original's imagery) and prints every text box in the section for both sites, so
// sizes and offsets can be compared as numbers instead of by eye.

import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";

const MINE = process.env.MINE_URL || "http://localhost:4317/";
const ORIGINAL = "https://www.kerra.earth/";

// data-section on this build -> Framer layer name on the original
const SECTIONS = {
  nav: ['[data-section="nav"]', "nav"],
  hero: ['[data-section="hero"]', '[data-framer-name="Hero"]'],
  divider: ['[data-section="divider"]', 'section[data-framer-name="Desktop"], section[data-framer-name="Tablet"], section[data-framer-name="Phone"]'],
  intro: ['[data-section="intro"]', '[data-framer-name="WHY KERRA"]'],
  technology: ['[data-section="technology"]', '[data-framer-name="TECHNOLOGY"]'],
  markets: ['[data-section="markets"]', '[data-framer-name="MARKETS"]'],
  why: ['[data-section="why"]', '[data-framer-name="WHY"]'],
  sustainability: ['[data-section="sustainability"]', '[data-framer-name="SUSTAINABILITY"]'],
  contact: ['[data-section="contact"]', '[data-framer-name="CONTACT"]'],
  footer: ['[data-section="footer"]', '[data-framer-name="FOOTER"]'],
};

const [section = "page", widthArg = "1440"] = process.argv.slice(2);
const width = Number(widthArg);
const height = width >= 1200 ? 900 : width >= 810 ? 768 : width >= 768 ? 1024 : 812;
if (section !== "page" && section !== "sections" && !SECTIONS[section]) {
  console.error(`Unknown section "${section}". Use one of: page, sections, ${Object.keys(SECTIONS).join(", ")}`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

if (section === "sections") {
  const boxes = async (url, side, settleMs) => {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 });
    await page.goto(url, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(settleMs);
    const result = await page.evaluate(([sections, side]) => {
      const visible = (el) => el.getBoundingClientRect().height > 0;
      const out = {};
      for (const [name, selectors] of Object.entries(sections)) {
        if (name === "divider") continue;
        const el = [...document.querySelectorAll(selectors[side])].find(visible);
        if (el) out[name] = [Math.round(el.getBoundingClientRect().top + scrollY), Math.round(el.getBoundingClientRect().height)];
      }
      out.page = [0, document.documentElement.scrollHeight];
      return out;
    }, [SECTIONS, side]);
    await page.close();
    return result;
  };
  const mine = await boxes(MINE, 0, 3000);
  const orig = await boxes(ORIGINAL, 1, 5500);
  await browser.close();
  console.log(`\nsection          mine y / height      original y / height   height diff   (${width}px)`);
  for (const name of Object.keys(orig)) {
    const [my, mh] = mine[name] ?? ["-", "-"];
    const [oy, oh] = orig[name];
    const diff = typeof mh === "number" ? mh - oh : "-";
    console.log(`${name.padEnd(16)} ${String(my).padStart(6)} / ${String(mh).padEnd(10)} ${String(oy).padStart(6)} / ${String(oh).padEnd(10)} ${String(diff).padStart(6)}`);
  }
  process.exit(0);
}

async function capture(url, selector, settleMs) {
  const page = await browser.newPage({
    viewport: { width, height },
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(settleMs);
  // scroll through once so on-scroll reveals have played, then return to the top
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= docHeight; y += 250) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(110);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);

  const info = await page.evaluate((selector) => {
    const visible = (el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
    const el = selector ? [...document.querySelectorAll(selector)].find(visible) : document.documentElement;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const box = { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
    const texts = [];
    for (const node of el.querySelectorAll("*")) {
      if (!visible(node)) continue;
      const own = [...node.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      const field = node.tagName === "INPUT" || node.tagName === "TEXTAREA";
      if (!own && !field) continue;
      const cs = getComputedStyle(node);
      if (cs.opacity === "0" || cs.visibility === "hidden") continue;
      const nr = node.getBoundingClientRect();
      texts.push({
        tag: node.tagName.toLowerCase(),
        font: `${cs.fontFamily.split(",")[0].replace(/"/g, "")} ${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ls${cs.letterSpacing}`,
        color: cs.color,
        x: Math.round(nr.left - r.left),
        y: Math.round(nr.top + scrollY - box.y),
        w: Math.round(nr.width),
        h: Math.round(nr.height),
      });
    }
    texts.sort((a, b) => a.y - b.y || a.x - b.x);
    return { box, texts, docHeight: document.documentElement.scrollHeight };
  }, section === "page" ? null : selector);

  const shot = PNG.sync.read(await page.screenshot({ fullPage: true }));
  await page.close();
  return { info, shot };
}

const [mineSel, origSel] = section === "page" ? [null, null] : SECTIONS[section];
const mine = await capture(MINE, mineSel, 4000);
const orig = await capture(ORIGINAL, origSel, 5500);
await browser.close();

if (!mine.info || !orig.info) {
  console.error(!mine.info ? `Section "${section}" not found on this build.` : `Section "${section}" not found on the original.`);
  process.exit(1);
}

// crop both sections and place them side by side
const crop = ({ info, shot }) => {
  const { x, y, w, h } = section === "page" ? { x: 0, y: 0, w: shot.width, h: shot.height } : info.box;
  const cw = Math.min(w, shot.width - x);
  const ch = Math.max(1, Math.min(h, shot.height - y));
  const out = new PNG({ width: cw, height: ch });
  PNG.bitblt(shot, out, x, y, cw, ch, 0, 0);
  return out;
};
const a = crop(mine);
const b = crop(orig);
const gap = 24;
const sheet = new PNG({ width: a.width + gap + b.width, height: Math.max(a.height, b.height) });
sheet.data.fill(0);
for (let i = 0; i < sheet.data.length; i += 4) { sheet.data[i] = 255; sheet.data[i + 1] = 0; sheet.data[i + 2] = 80; sheet.data[i + 3] = 255; }
PNG.bitblt(a, sheet, 0, 0, a.width, a.height, 0, 0);
PNG.bitblt(b, sheet, 0, 0, b.width, b.height, a.width + gap, 0);
const outDir = path.join(process.cwd(), "docs/screenshots/compare");
fs.mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `${section}-${width}.png`);
fs.writeFileSync(file, PNG.sync.write(sheet));

const fmt = (t) => `${t.tag.padEnd(8)} ${t.font.padEnd(40)} ${t.color.padEnd(20)} x${t.x} y${t.y} ${t.w}x${t.h}`;
console.log(`\n${section} @ ${width}px   mine ${mine.info.box.w}x${mine.info.box.h} at y${mine.info.box.y}   original ${orig.info.box.w}x${orig.info.box.h} at y${orig.info.box.y}`);
console.log(`page height   mine ${mine.info.docHeight}   original ${orig.info.docHeight}`);
if (section !== "page") {
  console.log("\nmine:");
  mine.info.texts.forEach((t) => console.log("  " + fmt(t)));
  console.log("\noriginal:");
  orig.info.texts.forEach((t) => console.log("  " + fmt(t)));
}
console.log(`\nside by side (mine left, original right): ${path.relative(process.cwd(), file)}`);
