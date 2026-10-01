import { chromium } from 'playwright-core';
export async function open(width, height, opts = {}) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: opts.dpr ?? 1,
    isMobile: width < 768 ? true : false,
    hasTouch: width < 768,
    reducedMotion: opts.reducedMotion ?? 'no-preference',
  });
  const page = await ctx.newPage();
  if (opts.init) await page.addInitScript(opts.init);
  return { browser, ctx, page };
}
export async function scrollThrough(page, step = 250, wait = 120) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(wait);
  }
  await page.waitForTimeout(800);
}
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
