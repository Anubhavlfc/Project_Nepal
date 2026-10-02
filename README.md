# Boudhanath · Kathmandu, Nepal

A digital portrait of Boudhanath Stupa: an editorial illustration of the
monument at nightfall, its eyes, its gilded spire, prayer flags in the evening
breeze and prayer wheels turned by hand, with Everest far behind. Scrolling
moves a camera over the one stupa. It is a static site built for GitHub Pages.

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
    Journey/         the stage, its camera and the chapter labels
    Stupa/           Boudhanath in layered SVG, its lamps and intro shades
    PrayerFlags/     flag lines drawn on canvas in scene space
    PrayerWheels/    the wheels in the niches of the lowest wall
    Atmosphere/      stars (canvas) and one slow band of haze
    Navigation/      नेपाल · Sound · About
    About/           the closing note and credits
  animations/        GSAP: the intro, and the scroll camera (ScrollTrigger)
  audio/             synthesised ambient sound (Web Audio)
  data/content.js    every line of copy, in one place
  styles/            design tokens, base styles, font faces
public/images/       the background photograph at five widths (WebP)
```

## How the stage works

The stupa is laid out once, at its overview size, by CSS (`Journey.module.css`).
Scrolling then drives one GSAP timeline that moves a camera over it
(`components/Journey/camera.js`): a scene point, where it sits on screen and a
zoom. Every layer follows the camera by its depth, so the far layers barely
move, and the flag canvases apply the same mapping when they draw.

| z | layer | follows the camera | pointer drift |
|---|-------|--------------------|---------------|
| 0 | Himalaya photograph | 10% | 1.5 px |
| 1 | stars | 3% | 1 px |
| 2 | haze | 14% | 2 px |
| 3 | rear prayer flags | fully | 2.5 px |
| 4 | the stupa, its lamps and wheels | fully | 3.5 px |
| 5 | front prayer flags | fully | 5 px |
| 6 | lamplight from below; on tall screens, the dark under the text | none | none |
| 7 | the night falling at the end | none | none |
| 8 | text | none | none |

Pointer drift is for desktop only. Tall screens have their own composition:
the whole stupa stands in the upper part of the frame and the text sits on the
dark ground below it.

## Notes for editing

- **Copy** lives in `src/data/content.js`. Lines marked as placeholders render
  with a dotted underline until replaced; the photograph credit is one.
- **Camera stops** are in `src/animations/journey.js`, one set for wide screens
  and one for tall ones.
- **Sound** is synthesised in the browser (filtered noise for the evening air,
  a rare, distant singing bowl), so no recording needs licensing. It is off on
  arrival and starts only from the Sound button. To use a recording instead,
  see the note at the top of `src/audio/ambientEngine.js`.
- **Motion** respects `prefers-reduced-motion`: there is no intro, camera or
  parallax, the picture is drawn complete and still, and the chapter texts
  follow it as plain text. Turning a prayer wheel stays available because it
  is user-initiated.
- **Fonts** are self-hosted: Cormorant Garamond, Manrope and Noto Serif
  Devanagari via Fontsource, and Jomolhari (SIL OFL) subset to the mantra
  only, in `src/assets/fonts/`.
- **The photograph** (2998 × 1710) is served at 900, 1440, 1920, 2560 and its
  native 2998 px. Screens up to about 2560 px wide show it at or below its
  native size; it sits far back, at 62% opacity. A new background can replace
  `public/images/background-*.webp` at the same names; its placement is set by
  the summit's position in `Journey.module.css`.
