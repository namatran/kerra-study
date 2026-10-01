# Design references: kerra.earth (unofficial study)

Measured on 2026-10-01 in headless Chrome 154 (Playwright), using `getComputedStyle` and
`getBoundingClientRect`. Motion was sampled every 50 ms (`requestAnimationFrame` for the wheel).
The original is a **Framer** site (generator `Framer 25dfa11`) and the hero is a **Unicorn Studio**
WebGL embed. Layer names in `code` are Framer's own layer names, recorded only to map sections.

This file describes the design system only. It does not reproduce the original's copy,
images, logos or 3D scene.

## Reference screenshots

All are full-page, saved in `docs/screenshots/original/` (git-ignored because they are
third-party content):

| File | Viewport | Layout shown |
| --- | --- | --- |
| `desktop-1440x900.png` | 1440×900 | Desktop (1200–1919) |
| `tablet-768x1024.png` | 768×1024 | **Phone** layout: Framer's phone range goes up to 809px |
| `tablet-1024x768.png` | 1024×768 | Tablet layout (810–1199), extra reference |
| `phone-375x812.png` | 375×812 | Phone |

---

## 1. Sections (top to bottom)

| # | Section (Framer layer) | Height @1440 | Layout |
| --- | --- | --- | --- |
| 0 | Preloader (`PRELOADER`) | overlay | Full-screen white overlay with a centred 96×96 wordmark that fills black from left to right, then cuts away. |
| 1 | Nav (`Desktop` / `TABLET` / `Phone`) | 88 (fixed) | Fixed bar with a white-to-transparent fade. Wordmark on the left; 3 uppercase links plus a dark pill CTA on the right. |
| 2 | Hero (`Hero`) | 900 (100vh) | WebGL scene behind (fades to white top and bottom). Bottom row: 2-line 80px headline on the left inside 4 corner brackets, 3-line mono spec readout on the right. |
| — | Divider (`Desktop` section) | 321 | 1px gradient hairline with 160px space above and below. Repeats between every content section. |
| 3 | Intro (`WHY KERRA`) | 753 | Centred 800px statement (44px light, 4 lines) and a 24px paragraph; uppercase label above a row of 4 grey partner logos. Soft shader background behind. |
| 4 | Technology (`TECHNOLOGY`) | 402 | Two columns: copy (eyebrow, H2, two paragraphs) on the left; a 576×402 oval animated dot-lattice graphic on the right. |
| 5 | Markets (`MARKETS`) | 860 | A 986px wheel of 36 application names (10° apart) cropped by the left edge, rotating step by step on scroll. Right column: H2, paragraph and pill CTA. |
| 6 | Why (`WHY`) | 536 | Two columns: copy (eyebrow, 4-line H2, paragraph) on the left; stat card (128px number, 2-line label, corner brackets, shimmer) on the right. |
| 7 | Sustainability (`SUSTAINABILITY`) | 441 | Two columns: 592×441 image with a pixel-mosaic reveal on the left; bottom-aligned copy (eyebrow, H2, two paragraphs) on the right. |
| 8 | Contact (`CONTACT`) | 688 | Two columns: intro (H2, 4-line tagline, email prompt and link pinned to the bottom) on the left; form (3 inputs, textarea, black submit) on the right. Shader background. |
| 9 | Footer (`FOOTER`) | 161 | Wordmark on the left; on the right, copyright line, legal links with a dot separator, and a 40px social icon. |

## 2. Type

All sizes are in px and measured at 1440. "Phone" is the ≤809 layout, the same at 768 and 375 unless noted.

| Role | Font | Size / line-height | Weight | Letter-spacing | Color | Phone (≤809) |
| --- | --- | --- | --- | --- | --- | --- |
| Hero headline (h1, 2 lines) | Open Sans | 80 / 88 (1.1) | 300 | −4.8 (−0.06em) | `#000000` | 48 / 52.8, −2.88. Tablet: 64 / 70.4, −3.84 |
| Hero spec readout (3 lines, right-aligned, uppercase) | Chakra Petch | 12 / 16.8 (1.4) | 400 | normal | `#a3a3a3` | same |
| Nav link (uppercase) | Chakra Petch | 12 / 12 | 600 | 1.44 (0.12em) | `#000000` | hidden |
| Pill button label (uppercase) | Chakra Petch | 12 / 13.2 (1.1) | 600 | 0.72 (0.06em) | `#fafafa` | 10 / 11, 0.6 (small pill) |
| Intro statement (h2, centred) | Open Sans | 44 / 52.8 (1.2) | 300 (brand word 400) | −1.32 (−0.03em) | `#171717` | 32 / 38.4, −0.96, left-aligned |
| Intro paragraph (centred) | Open Sans | 24 / 31.2 (1.3) | 400 | normal | `#525252` | 20 / 28, `#404040`, left-aligned |
| Small caps label ("backed by" style, uppercase) | Chakra Petch | 16 / 17.6 (1.1) | 600 | 0.32 (0.02em) | `#a3a3a3` | same |
| Eyebrow label (uppercase text) | Chakra Petch | 16 / 16 (1.0) | 600 | 0.48 (0.03em) | `#0a0a0a` | same |
| Section heading (h2) | Open Sans | 44 / 52.8 (1.2) | 300 | −1.32 (−0.03em) | `#0a0a0a` | Technology, Markets, Contact: 44. Why, Sustainability: 32 / 38.4, −0.96 |
| Body copy | Open Sans | 24 / 33.6 (1.4) | 400 | normal | `#737373` | same (24) |
| Market wheel item (uppercase) | Open Sans | 28 / 42 (1.5) | 500 | −0.28 (−0.01em) | `#d4d4d4`, selected `#0a0a0a` | 28 at 768, 25 / 37.5 at 375 |
| Stat number | Open Sans | 128 / 128 (1.0) | 600 | normal | `#0a0a0a` | same |
| Stat label (2 lines, centred) | Open Sans | 24 / 33.6 | 400 | normal | `#737373` | same |
| Contact email link | Open Sans | 24 / 33.6 | 600 | normal | `#262626` | `#0a0a0a` |
| Input / placeholder (uppercase) | Chakra Petch | 14 / 16.8 (1.2) | 600 | 0.84 (0.06em) | text `#0a0a0a`, placeholder `#a3a3a3` | same |
| Textarea | Chakra Petch | 14 / 19.6 (1.4) | 600 | 0.84 | as input | same |
| Submit label (uppercase) | Chakra Petch | 14 / 15.4 (1.1) | 600 | 0.84 | `#fafafa` | same |
| Footer copyright | Open Sans | 13 / 20.8 (1.6) | 400 | normal | `#666666` | 16 / 22.4 (also on tablet) |
| Footer legal links (uppercase) | Chakra Petch | 11 / 12.1 (1.1) | 600 | 0.22 (0.02em) | `#262626` | 12 / 13.2, 0.24 (also on tablet) |

Only Open Sans 300/400/500/600 and Chakra Petch 400/600 actually render. Inter 400 is
loaded for a hidden helper layer only. DM Sans, Kulim Park, Lora and Young Serif are declared
but never used.

## 3. Color

The palette is the Tailwind "neutral" grey scale (9 Framer tokens), plus white and black. There are
no hue accents, borders or box-shadows anywhere.

| Hex | Where |
| --- | --- |
| `#ffffff` | Page background, preloader overlay, every fade gradient, nav fade |
| `#000000` | Hero headline, nav links, preloader fill, headline wipe blocks, submit button, corner brackets |
| `#0a0a0a` | Section H2s, eyebrow text and dot, selected wheel item and pointer dot, stat number, input text, link hover, phone email link |
| `#171717` | Intro statement; pill button hover |
| `#262626` | Pill button background, desktop email link, footer legal links |
| `#404040` | Intro paragraph on phone |
| `#525252` | Intro paragraph on desktop and tablet |
| `#666666` | Footer copyright |
| `#737373` | Body copy, stat label |
| `#a3a3a3` | Hero spec readout, "backed by" label, input placeholders |
| `#c4c4c4` | Stat-number shimmer band |
| `#d4d4d4` | Unselected wheel items |
| `#e5e5e5` | Centre of the divider hairline |
| `#fafafa` | Button labels |
| `rgba(112,112,112,0.05)` | Input and textarea fill (with `backdrop-filter: blur(10px)`) |
| `#000000` at 30% | Preloader "ghost" wordmark under the fill |
| `#f5f5f5` | Defined as a token but not visible on the page |

**Gradients and fades**

- Nav: `linear-gradient(#fff 36.37%, transparent)`.
- Hero: top `linear-gradient(#fff 20%, transparent)` over 120px; bottom 2× `linear-gradient(transparent, #fff)` over the last 320px.
- Intro shader: radial `radial-gradient(50% 50%, transparent 0%, #fff 100%)`.
- Technology graphic: radial `radial-gradient(49% 50%, transparent 34%, #fff 100%)`.
- Markets: left edge 192px `linear-gradient(90deg, #fff, transparent 77%)` (×3, stacked for strength); top 160px `linear-gradient(#fff, transparent 66%)`; bottom 160px `linear-gradient(transparent 46%, #fff)` (×3).
- Contact shader: radial `radial-gradient(50% 50%, transparent 49.5%, #fff 100%)`.
- Divider hairline: `linear-gradient(90deg, #fff, #e5e5e5 50%, #fff)`.
- Stat shimmer: `linear-gradient(135deg, transparent 33.2%, #c4c4c4 50%, transparent 66.8%)` at 200% × 200%, clipped to the text.

## 4. Grid and spacing @1440

- **Page margins:** 128px left/right for all content (Hero, Intro, Technology, Why, Sustainability, Contact, Footer). The nav uses 48px side padding.
- **Max content width:** 1184px at 1440 (fluid `100% − 256px`), capped at **1440px** from 1920 up and centred.
- **Nav height:** 88px, with its content row 40px tall at y=24. The wordmark is 89×24; links are 48px apart; the CTA pill is the last item.
- **Space between sections:** each divider block is 321px (160 + 1px line + 160). The hairline spans the 1184 container.
- **Hero:** 100vh. Content sits at the bottom with 96px bottom padding. Headline box is 362×176 on the left; spec readout is right-aligned (lines 2px apart) with its bottom aligned to the headline's. Corner brackets sit 24px outside the headline box on all four sides.
- **Intro:** padding-top 240. Statement column is 800 wide and centred. Statement → paragraph 48. 48 → label row (24 top padding) → label → logos 24. The logo row is 78px tall, `space-between` across 1184.
- **Technology:** row, copy 560 | gap 48 | graphic 576×402 (radius 9999). In the copy column: eyebrow → H2 24, H2 → body 48, paragraphs 24 apart. Body max width 540.
- **Markets:** 860 tall, section padding-right 128. The wheel circle is 986px across, centred at x≈196 and vertically centred; labels sit on 18 arms (2 labels per arm). The text column is 394 wide at x=918, vertically centred: H2 → body 48, paragraphs one blank line (≈34) apart, body → CTA 24.
- **Why:** padding 96 / 128. Row, copy 568 | gap 48 | stat card 568×344. Eyebrow → H2 24, H2 → body 24. In the card: number → label 24, label lines 2 apart, content centred; brackets 4px outside the card.
- **Sustainability:** row, image 592×441 | gap 48 | content 544 (bottom-aligned, vertically centred in the row). Eyebrow → H2 24, H2 → body 48, body max width 440, paragraphs 24 apart.
- **Contact:** padding 128 on all sides, row gap 96: intro 608 | form 480. In the intro: H2 → tagline 24, 4 tagline lines with no spacing; email block pinned to the bottom (48 top padding, prompt → link 4). Form: fields 56 tall, textarea 160, button 56, all 12 apart.
- **Footer:** padding 24 / 128 / 96. Wordmark on the left. Right column, right-aligned: copyright, then 8, then links row (12px gaps around a 6px dot); social icon 40×40 with 48px left padding.

## 5. Breakpoints

Framer breakpoints are `≥1920`, `1200–1919.98`, `810–1199.98` and `≤809.98`.

| Range | What changes |
| --- | --- |
| **≥1920** | Content capped at 1440 and centred (e.g. 240px margins at 1920). Hero 100vh. Intro padding-top grows to 320. Technology gets 96px vertical padding and a larger 832×560 graphic. Sustainability image becomes 835×776. Contact padding becomes 0 / 128 / 180, intro column 784, form 560. |
| **1200–1919** | Desktop layout as measured above (128px margins). |
| **810–1199** (tablet) | Nav links gap 32 (links and CTA still shown). Side margins 48. Hero height **90vh**, headline 64px, hero content padding 0 / 96 / 96. Intro padding 96 / 48 / 0, statement full width and left-aligned. Logos wrap (gaps 32 / 58). Dividers 193px (96 + 1 + 96). **All two-column sections stack:** Technology (graphic 928×480 above copy), Markets (H2 above the wheel; paragraph and CTA hidden), Why, Sustainability (image 928×430 above copy), Contact (intro above a full-width form). Footer padding 16 / 48 / 96; copyright 16px, links 12px. |
| **≤809** (phone) | Nav is just the wordmark (87×24) and a small pill (127×40, 10px label); links are hidden and there is no menu button. Nav height 100 with 24px top padding. Margins 24 (hero 32). Hero 90vh, headline 48px; the spec readout floats right-aligned and vertically centred above the headline. Intro statement 32px, paragraph 20px. Logos stack vertically (gap 32). Dividers 192px. Technology graphic 320px tall. The wheel shows only its right half; items 25px at 375. Why: stat card (327×281) first, then copy, H2 32px. Text columns keep max widths (copy 540, content 560, form 480) and are centred at 768, full width at 375. Footer is a centred column: wordmark, copyright, links, social icon. |

## 6. Components

| Component | Size | Radius | Padding | Fill / border / shadow | Hover |
| --- | --- | --- | --- | --- | --- |
| **Nav bar** | 100% × 88 (phone 100) | 0 | 0 48 (phone 24 24 0) | White→transparent gradient; no border or shadow; `position: fixed`, z 3 | — |
| **Nav link** | Text 12px; hover brackets 5×12 | — | — | Text `#000` | `[ ]` brackets fade in (0→1) and move outward 4px (gap 8→12) with a spring of about 0.3s |
| **Pill button** (desktop CTA) | auto × 40 (146 wide for its label) | 12 | 0 16 | `#262626`, no border or shadow | Background → `#171717` plus `brightness(1.1)`; label scrambles (~0.45s); ~0.4s overall |
| **Pill button, small** (phone nav) | auto × 40 (127) | 12 | 0 16 | `#262626` | as above |
| **Submit button** | full form width × 56 | 16 | 12 24 | `#000000`, no border or shadow | None measured |
| **Text input** | full form width × 56 | 16 | 20 | `rgba(112,112,112,.05)` with `backdrop-filter: blur(10px)`, no border or shadow | No hover or focus change measured |
| **Textarea** | full form width × 160 | 16 | 20 | as input | as input |
| **Eyebrow** | 18px dot + 16 gap + label | dot 1000 | — | Dot `#0a0a0a` | — |
| **Corner bracket** | 14×16 L-shape | — | — | Black stroke; one shape rotated per corner (TR 90°, BR 180°) | — |
| **Stat card** | 568×344 (phone 327×281) | 0 | — | Transparent; 4 corner brackets 4px outside | — |
| **Divider** | container width × 1 | — | 160 above and below (tablet/phone 96) | Hairline gradient | — |
| **Logo strip item** | 180–240 × 38–57 | — | — | Greyscale logos at opacity 0.7 / 0.7 / 0.5 | None |
| **Text link** (email, footer legal) | — | — | — | `#262626` | → `#0a0a0a` plus underline, `color 0.4s cubic-bezier(.44,0,.56,1)` |
| **Social icon** | 40×40 | — | — | Grey glyph | None |
| **Wheel pointer** | 26×26 dot | full | — | `#0a0a0a`; the selected label gets 44px left padding to make room | — |

## 7. Motion

All timings come from 50ms samples of computed styles, except the wheel (sampled per animation frame) and the canvases (frame diffs).

| # | Animation | Trigger | What moves | Duration | Delay | Easing |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Preloader wordmark fill | Page load (once JS hydrates, ~0.7s) | Black copy of the wordmark, clipped `inset(0 100% 0 0)` → `inset(0 0 0 0)` (left → right) over a 30% grey ghost wordmark | ≈2.0s | ~0.7s after navigation | ease-in-out (fits `cubic-bezier(.45,.03,.52,.96)`) |
| 2 | Preloader exit | Fill complete | Whole overlay removed instantly (`visibility: hidden`), no fade | 0 | — | — |
| 3 | Hero headline "blind" wipe | Preloader exit | Per line, a black block (line width × 88px) wipes in left→right, then out left→right | ≈0.4s per line (in ≈0.15s, out ≈0.2s) | Line 2 starts +150ms | ease-in-out |
| 4 | Hero headline text | As each block exits | Line opacity 0 → 1, `translateY(8px)` → 0 | ≈0.6s | Line 1 +0.4s after exit; line 2 +0.15s more | strong ease-out (≈ `cubic-bezier(.22,1,.36,1)`) |
| 5 | Hero spec readout scramble | Preloader exit | Each line resolves **right → left** one character at a time; unresolved characters are random block glyphs and punctuation, re-randomised every ~50ms | 0.5–1.25s per line (≈45–85ms per character) | 0 | linear (stepped) |
| 6 | Hero corner brackets appear | Page load (runs under the preloader) | From `x: ±20px`, opacity 0 → in place; TR also rotates 0→90°, BR 0→180° | 0.4s | 0.5s | spring, bounce 0.2 |
| 7 | Hero WebGL scene | Continuous | Glossy grey twisted strand swirling, with glitchy tracking boxes; reacts to the cursor | loop | — | — |
| 8 | Eyebrow dot | Section enters view | `scale(.5)` → 1, opacity 0 → 1 (≈0.7% overshoot) | ≈0.4s | 0 | spring |
| 9 | Eyebrow label scramble | ~100px before entering view | Characters type in **left → right** with a random-glyph tail | ≈1–2s | 0 | linear (stepped) |
| 10 | Logo strip | Row ~125px below the fold | All logos opacity 0 → resting (0.7 / 0.7 / 0.5) together, slight overshoot | ≈0.25s | 0 | spring |
| 11 | Markets wheel | Each scroll event while the section top is ≤ ~40% of the viewport | Circle rotates −10° per step down (+10° up), 20 states (first step 5°), clamped; selected label turns `#0a0a0a` and gains 44px left padding for the pointer dot | ≈0.25s to land, settles by 0.45s (≈0.15° overshoot) | 0 | spring |
| 12 | Stat brackets flicker | Card fully in view (section top ≈515px) | 4 brackets opacity 1 → ~0.1 → 1 | ≈0.2s | 0 | stepped |
| 13 | Stat number shimmer | Continuous | Light band sweeps across the number: `background-position-x` 195% → −97.5% | 2s loop | — | linear |
| 14 | Sustainability pixel reveal | Image enters view | Image appears through a grid of ≈37px tiles that fade from pale grey to clear in random order, roughly top to bottom | ≈0.75s | ≈0.5s | ease-out per tile |
| 15 | Technology graphic | Continuous | Oval dot lattice (dark discs with light centres) pulsing; small `[ ]` tracking boxes with numeric readouts hop around | loop | — | — |
| 16 | Intro and contact shaders | Continuous (contact also reacts to the cursor) | Soft grey vertical "fluted glass" streaks drifting slowly under radial white fades | slow loop | — | — |
| 17 | Nav link hover | `:hover` | Brackets fade and slide outward 4px | ≈0.3s | 0 | spring (slight overshoot) |
| 18 | Pill hover | `:hover` | Background and brightness; label scramble | ≈0.4–0.45s | 0 | spring |
| 19 | Text link hover | `:hover` | Colour and underline | 0.4s | 0 | `cubic-bezier(.44,0,.56,1)` |

**Static (no motion):** intro text, all H2s and body copy, the contact block, footer, logos (after
appearing), social icon, inputs and the submit button. The original does not appear to change
anything for `prefers-reduced-motion`.

## 8. Assets and replacements

| Original | Kind | Replacement in this study |
| --- | --- | --- |
| Open Sans 300/400/500/600 | Google Font | **Same**, via `next/font/google` |
| Chakra Petch 400/600 | Google Font | **Same**, via `next/font/google` |
| Inter (hidden helper only) | Google Font | Not needed |
| Wordmark (custom SVG, used as nav logo, preloader mask, footer) | Logo | Original placeholder brand name set in **Young Serif** (Google Fonts, similar weight and serif feel) |
| Big monogram letter inside the wheel | Logo | Placeholder brand initial in Young Serif, light grey |
| Hero 3D strand (Unicorn Studio scene, model, textures) | WebGL | Soft grey gradient placeholder first, then an original **Three.js** glossy grey blob |
| Technology dot-lattice canvas | Animation | Original CSS/SVG dot lattice with pulsing discs under the same oval white fade |
| Sustainability photo (lab dish) | Image | Original CSS placeholder visual (soft concentric shapes) behind the same tile reveal |
| Intro and contact WebGL shaders | Animation | CSS streak pattern (blurred repeating gradients drifting slowly) under the same radial fades |
| 4 partner logos | Logos | Neutral placeholder marks (simple SVG shapes with placeholder names) |
| Corner brackets, nav `[ ]` brackets, footer dot | Icons | Redrawn as simple original SVG/CSS shapes |
| Social (LinkedIn) icon | Third-party logo | Generic placeholder icon (no third-party logo) |
| Favicon | Logo | Original placeholder mark |
| All copy | Text | Original placeholder copy for a fictional brand, kept in `src/data/content.ts`, with similar line lengths so the layout breaks in the same places |

---

## 9. Found while building

Measured again while matching the build section by section:

- **Dividers** keep 128px side padding at every width. On phones the whole block is 192px (96 above, 95 below the 1px line).
- **Partner logos:** the fourth sits in a 78px-tall box, which shows once the logos stack on phones.
- **Footer on phones:** the wordmark block is 48px tall (24px of space under the logo).
- **Contact on phones:** there's no gap between the email prompt and the email link (4px on desktop).
- **Stat card:** 258px tall on tablet and 281px on phones.
- **Technology:** at 1200–1919 the section's height comes from the copy column (402px) and the graphic stretches to match. At 1920 and up the graphic is 560px tall.
- **Markets wheel**, measured at each breakpoint:
  - Labels start 287px from the centre, and the selected label steps out a further 44px.
  - The pointer dot is 26px, centred 243px right of the wheel's centre.
  - Wheel centre: (196, 447) at 1200–1919, (396, 427) at 1920+, (210, 640) on tablet, and (−139, 451) on phones, measured from the section's top-left.
  - Label size is 28px, or 25px at 375.
