# Boudhanath · Between Earth, Sky, and Prayer

An interactive, single-page study of Nepal: the Himalaya at dusk, an illustrated
Boudhanath Stupa, prayer flags in the wind and prayer wheels turned by hand.
It is a static site built for GitHub Pages.

**Live:** https://anubhavlfc.github.io/Project_Nepal/

## Run it

```bash
npm install
npm run dev       # local development
npm run build     # production build into dist/
npm run preview   # serve the production build at http://localhost:4173
```

Node 20 or newer is required (CI uses Node 22).

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the site and publishes it
with the official Pages actions on every push to `main`.

1. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**
   (one time only; this repository is already set up).
2. Push to `main`, or run the workflow by hand from the **Actions** tab.
3. The site appears at `https://<user>.github.io/<repository>/`.

`vite.config.js` uses a relative base (`./`), so asset URLs work under any
repository name or a custom domain without changes. The site is one page with
hash links only, so refreshing never hits a missing route.

## Structure

```
src/
  components/
    Hero/            the opening scene and its layer order
    Stupa/           Boudhanath in layered SVG, plus its animated lights
    PrayerFlags/     flag strings: sagging curves, per-flag flutter
    PrayerWheels/    one wheel drawing; hover wheels and turnable wheels
    Mountains/       the photograph and the valley rim silhouettes
    Atmosphere/      stars (canvas), haze, rising lamp motes
    Navigation/      side numbers, mobile menu, sound toggle, scroll cue
    Sections/        Himalaya, Boudhanath study, Prayer, closing
  animations/        GSAP: intro timeline, pointer parallax, scroll story
  audio/             synthesised ambient sound (Web Audio)
  data/content.js    every line of copy, in one place
  styles/            design tokens, base styles, font faces
public/images/       the Himalaya photograph at 768 and 1064 px (WebP)
```

## Hero layer order

| z | layer | moves with pointer |
|---|-------|--------------------|
| 0 | sky gradient and stars | 1 px |
| 1 | Himalaya photograph | 2 px |
| 2 | haze and valley rim | 3 px |
| 4 | scene: back flags, stupa, lights, front flags | 3–6 px |
| 6 | lamp light on the plaza, motes, vignette | 7 px |
| 7 | title and interface | none |
| 8 | navigation | none |

## Notes for editing

- **Copy** lives in `src/data/content.js`. Lines marked as placeholders render
  with a dotted gold underline until replaced, including the photo caption and
  credit.
- **Sound** is synthesised in the browser (filtered noise for wind, a rare soft
  bowl tone), so no recording needs licensing. It is off on arrival and starts
  only from the Sound button. To use a recording instead, see the note at the
  top of `src/audio/ambientEngine.js`.
- **Motion** respects `prefers-reduced-motion`: the intro, parallax, scroll
  effects and ambient loops are switched off and the scene renders complete.
  Turning a prayer wheel stays available because it is user-initiated.
- **Fonts** are self-hosted: Cormorant Garamond, Manrope and Noto Serif
  Devanagari via Fontsource, and Jomolhari (SIL OFL) subset to the mantra
  only, in `src/assets/fonts/`.
- **The photograph** is 1064 px wide. It sits behind haze in the hero and is
  shown at or below its native size in the Himalaya section. A larger original
  can replace `public/images/himalaya-dusk-*.webp` at the same names.
