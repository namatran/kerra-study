# Nacre: a design study of kerra.earth

Unofficial design study of kerra.earth. Not affiliated. It recreates the original's layout,
type, spacing, colour and motion in Next.js, using original placeholder content for a
fictional brand called "Nacre". The page is set to `noindex`.

## Handoff (updated 2026-10-01)

- **Done:**
  - **Phase 1:** the measurements are in [`docs/DESIGN-REFS.md`](docs/DESIGN-REFS.md).
  - **Phase 2:** every section is built and checked against the original at 1440, 1024, 768 and 375.
  - **Checks:** `npm run build` passes, and reduced motion is respected throughout.
- **Waiting on a decision:** the hero has a first Three.js version, a glossy grey blob that spins slowly and leans toward the cursor. The open question is whether to add film grain, blur or glitch tracking boxes.
- **Next:** that hero decision, then whichever items under "Still different" are worth polishing.

## Start it again

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:4317.

The port is set in `package.json`. If 4317 is ever taken, run `npx next dev --port 4318` (or any free number) instead. `kerra-matty` uses 4330.

## Where things live

| Path | What's there |
| --- | --- |
| `docs/DESIGN-REFS.md` | Measurements of the original: sections, type, colour, spacing, breakpoints, components, motion, assets |
| `src/data/content.ts` | All page text |
| `src/app/globals.css` | Colour, type, spacing and motion tokens (CSS variables), plus base styles and reduced-motion rules |
| `src/app/layout.tsx` | Fonts (Open Sans, Chakra Petch, Young Serif), page title, `robots: noindex` |
| `src/app/page.tsx` | The order of the sections |
| `src/components/sections/` | One folder per section: Preloader, Nav, Hero, Intro, Technology, Markets, Why, Sustainability, Contact, Footer |
| `src/components/ui/` | Shared pieces: pill button, decoding text, eyebrow label, corner brackets, divider, streak background, wordmark, text styles |
| `src/hooks/` | Helpers: "is it on screen?", "does the visitor prefer reduced motion?", "has the preloader finished?" |
| `scripts/compare.mjs` | Side-by-side checks against the original (see below) |
| `scripts/measure/` | The Playwright scripts used to measure the original |
| `docs/screenshots/` | Reference and comparison screenshots. Kept local only (git-ignored) because they contain the original's imagery |

## Compare with the original

Keep the dev server running, then run, for example:

```bash
npm run compare -- intro 1440
```

The section can be any of `nav`, `hero`, `intro`, `technology`, `markets`, `why`, `sustainability`, `contact` or `footer`. Use `page` for the whole page side by side, or `sections` for a table of every section's height on both sites. The width defaults to 1440. Each run saves an image (mine on the left, the original on the right) to `docs/screenshots/compare/` and prints every text box's font and position for both sites. It needs Google Chrome installed.

## Still different from the original

- **Hero 3D:** a simple glossy blob instead of the original's twisted strand, with no film grain, blur or glitch tracking boxes yet.
- **Intro and contact backgrounds:** CSS streaks stand in for the original's WebGL "fluted glass" shaders. Theirs are crisper and faintly iridescent, and the contact one reacts to the cursor.
- **Technology graphic:** my canvas lattice is simpler. It has no dashed connector lines, smaller readout boxes and no soft blur at the edges.
- **Tile reveal (Sustainability):** tiles fade through flat greys. The original shows a pixelated version of its photo before it sharpens.
- **Wordmark and the wheel's centre letter:** set in Young Serif, so their shapes differ from the custom logo.
- **Copy length:** with different placeholder text, a few headings and paragraphs wrap to fewer lines at 1024 and 375. The page is identical in height at 1440 and within 1px at 768.
- **Markets wheel feel:** the stepping rule is approximated as one notch per scroll event, at most one every 160ms, once the section's top passes 40% of the screen.
- **Additions:** visible focus styles on links, buttons and fields, which the original doesn't have. The contact form sends nothing; it shows a note instead.
- **1920 and wider:** built from measurements, but only spot-checked.

## Handoff prompt for the next session

```text
Continue the unofficial kerra.earth design study in /Users/namtran/Dev/kerra-study
(Next.js + TypeScript + CSS Modules). Read README.md and docs/DESIGN-REFS.md first.

Rules: never copy the original's images, logos, 3D scene or text; keep robots noindex and
the footer notice "Unofficial design study of kerra.earth. Not affiliated."; respect
prefers-reduced-motion; keep text in src/data/content.ts and tokens in globals.css;
small Conventional Commits with my existing git author and no co-author trailer; don't
push unless I ask.

Start the preview with `npm run dev` (http://localhost:4317). Check changes against the
original with `npm run compare -- <section> [width]` and `npm run compare -- sections <width>`.

Next: [say whether to add film grain, blur and/or glitch tracking boxes to the hero, or
which item under "Still different" to work on].
```
