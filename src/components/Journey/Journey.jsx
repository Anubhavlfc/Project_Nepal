import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { chapters, hero, prayer } from '../../data/content';
import Stupa from '../Stupa/Stupa';
import StupaLights from '../Stupa/StupaLights';
import StupaWheels from '../PrayerWheels/StupaWheels';
import PrayerFlags from '../PrayerFlags/PrayerFlags';
import StarField from '../Atmosphere/StarField';
import Haze from '../Atmosphere/Haze';
import { createStage } from './stage';
import { createIntro } from '../../animations/intro';
import styles from './Journey.module.css';

const base = import.meta.env.BASE_URL;
const PHOTO_WIDTHS = [900, 1440, 1920, 2560, 2998];

/*
 * One stupa, one camera. The stage stays on screen while the page scrolls
 * beneath it, and scrolling moves the camera: from the whole scene to the
 * eyes, up the spire to the flags, down to the wheels, and back out into
 * the night. Each stop has a short text, which stays in the page in
 * reading order.
 *
 * Layers, back to front: sky and stars · the Himalaya · haze · rear flags ·
 * the stupa, its lamps and wheels · front flags · foreground · text.
 */
export default function Journey() {
  const root = useRef(null);

  useGSAP(
    () => {
      const stageEl = root.current.querySelector('[data-stage]');
      const mm = gsap.matchMedia();
      // matchMedia only runs this when a condition matches, so `still` is
      // there to lay out the stage for a reader who prefers less motion
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
          parallax: '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 900px)',
        },
        ({ conditions }) => {
          const stage = createStage(stageEl, { parallax: conditions.parallax });
          if (!conditions.motion) return stage.destroy;

          const stopIntro = createIntro(stageEl);
          let stopJourney;
          let cancelled = false;
          // the scroll choreography and ScrollTrigger load after first paint
          import('../../animations/journey').then(({ createJourney }) => {
            if (!cancelled) stopJourney = createJourney(root.current, stage);
          });
          return () => {
            cancelled = true;
            stopJourney?.();
            stopIntro();
            stage.destroy();
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.journey} id="boudhanath" aria-labelledby="title">
      <div className={styles.stage} data-stage>
        <div className={styles.sky} data-depth="stars" data-intro="sky">
          <StarField className={styles.stars} />
        </div>

        <div className={styles.layer} data-depth="mountains" data-intro="landscape">
          <img
            className={styles.photo}
            src={`${base}images/background-1920.webp`}
            srcSet={PHOTO_WIDTHS.map((w) => `${base}images/background-${w}.webp ${w}w`).join(', ')}
            sizes="(max-aspect-ratio: 3/4) 110vh, (max-aspect-ratio: 19/12) 190vh, 120vw"
            width="2998"
            height="1710"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <Haze className={styles.layer} data-depth="haze" data-intro="landscape" />

        <PrayerFlags tone="back" className={`${styles.flags} ${styles.flagsBack}`} />

        <div className={`${styles.layer} ${styles.camera}`} data-depth="scene">
          <div className={styles.scene} data-scene>
            <Stupa title="Illustration of Boudhanath Stupa at nightfall, its prayer flags running out to the sides, with Mount Everest far behind" />
            <div className={styles.lights} data-lights>
              <StupaLights />
            </div>
            <StupaWheels />
          </div>
        </div>

        <PrayerFlags tone="front" className={`${styles.flags} ${styles.flagsFront}`} />

        <div className={styles.foreground} aria-hidden="true" data-intro="lamps" />
        <div className={styles.veil} data-veil aria-hidden="true" />
        <div className={styles.night} data-night aria-hidden="true" />

        <header className={`${styles.caption} ${styles.title}`} data-caption="title">
          <h1 id="title" className={styles.name}>
            <span data-intro="text">{hero.title}</span>
            <span className={`${styles.nameNepali} devanagari`} lang="ne" data-intro="text">
              {hero.titleNepali}
            </span>
          </h1>
          <p className={styles.place} data-intro="text">
            {hero.place}
          </p>
          <p className={styles.line} data-intro="text">
            {hero.line}
          </p>
        </header>

      </div>

      <div className={styles.chapters}>
        {chapters.map((c, i) => (
          <article key={c.id} className={`${styles.caption} ${styles[c.id]}`} data-caption={c.id} aria-labelledby={`chapter-${c.id}`}>
            <p className={styles.index} aria-hidden="true">
              <span className="devanagari" lang="ne">
                {'१२३४'[i]}
              </span>
            </p>
            <h2 id={`chapter-${c.id}`} className={styles.label}>
              {c.label}
            </h2>
            <p className={styles.text}>{c.text}</p>
            {c.hint && <p className={styles.hint}>{c.hint}</p>}
            {c.id === 'evening' && (
              <p className={styles.mantra}>
                <span className={styles.mantraTibetan} lang="bo">
                  {prayer.mantra}
                </span>
                <span className={styles.mantraLatin}>{prayer.mantraLatin}</span>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
