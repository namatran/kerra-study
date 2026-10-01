# Kerra design study: handoff (paused 2026-10-01)

An unofficial design study of kerra.earth, rebuilt with original placeholder content.

## Finished

- **Phase 1 (measuring the original):** [`docs/DESIGN-REFS.md`](docs/DESIGN-REFS.md) records its sections, type, colours, spacing, breakpoints, components, motion and the asset plan.
- **Reference screenshots** of the original at 1440, 1024, 768 and 375 wide are in `docs/screenshots/original/`. They're kept out of git on purpose because they show third-party content.
- **App scaffold:** Next.js 16, TypeScript and ESLint, using the App Router, a `src/` folder and CSS Modules (no Tailwind).
- **Measuring scripts** (Playwright, using your installed Chrome) are in `scripts/measure/`. Run them from that folder, for example `cd scripts/measure && node survey.mjs 1440 900`.
- **Phase 2 so far:**
  - Fonts and design tokens are in `src/app/globals.css`, and all page text is in `src/data/content.ts` (fictional brand "Nacre"). `robots: noindex` is set.
  - Built and checked against the original at 1440: **Nav**, **Intro** (with the partner row), **Technology** (canvas dot lattice) and the section **Divider**. The hero is a grey gradient placeholder for now.
  - **Markets** (the scroll-stepped wheel) is built from measured geometry but **not yet compared** with the original. Its measurements are in `scripts/measure/wheel.mjs`.
  - `npm run compare -- <section> [width]` screenshots one section of this build next to the original. Images go to `docs/screenshots/compare/` (git-ignored).

## Next (Phase 2: build)

1. Run `npm run compare -- markets` and fix any differences in the wheel. Then build the remaining sections one at a time in `src/components/sections/`: Why, Sustainability, Contact, Footer, Preloader. Check each against the original at 1440 with `npm run compare`.
2. Once the whole page is built, check it at 768 and 375 and fix the differences.
3. Add the footer line "Unofficial design study of kerra.earth. Not affiliated." and check `prefers-reduced-motion` everywhere.
4. Build the hero last: the headline reveal, corner brackets and spec readout, then a Three.js glossy grey blob in place of the gradient. Show it and ask before adding film grain, blur or glitch boxes.

## Start the preview

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:4317. The port is set in `package.json`; 4317 was free when checked. If it's taken, run `npx next dev --port 4318` (or any free number) instead. `kerra-matty` uses 4330.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
