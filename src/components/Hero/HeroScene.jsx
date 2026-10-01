import { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { hero } from '../../data/content';
import { SCENE } from '../Stupa/geometry';
import Stupa from '../Stupa/Stupa';
import StupaLights from '../Stupa/StupaLights';
import PrayerFlags from '../PrayerFlags/PrayerFlags';
import MountainBackground from '../Mountains/MountainBackground';
import ValleyRim from '../Mountains/ValleyRim';
import StarField from '../Atmosphere/StarField';
import Mist from '../Atmosphere/Mist';
import Motes from '../Atmosphere/Motes';
import ScrollIndicator from '../Navigation/ScrollIndicator';
import { heroStrands } from './heroStrands';
import { createHeroIntro } from '../../animations/heroIntro';
import { createPointerParallax } from '../../animations/pointerParallax';
import useMediaQuery from '../../hooks/useMediaQuery';
import styles from './HeroScene.module.css';

const VIEWBOX = [0, 0, SCENE.width, SCENE.height];

/*
 * Layer order, back to front (see --z-* tokens):
 * sky · mountains · atmosphere · back flags · stupa · front flags ·
 * foreground light · interface.
 */
export default function HeroScene() {
  const root = useRef(null);
  const scene = useRef(null);
  const compact = useMediaQuery('(max-width: 700px)');
  const strands = useMemo(() => heroStrands({ compact }), [compact]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          finePointer: '(hover: hover) and (pointer: fine)',
        },
        ({ conditions }) => {
          if (!conditions.motion) return undefined;
          const stopIntro = createHeroIntro(root.current);
          const stopParallax = conditions.finePointer ? createPointerParallax(root.current) : undefined;
          return () => {
            stopIntro();
            stopParallax?.();
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="dusk" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.sky} data-layer="sky" data-depth="1">
        <StarField />
      </div>

      <div className={styles.layer} data-layer="mountains" data-depth="2">
        <MountainBackground />
      </div>

      <div className={styles.layer} data-layer="atmosphere" data-depth="3">
        <Mist />
        <ValleyRim lights={compact ? 18 : 34} />
      </div>

      <div className={`${styles.flags} ${styles.flagsBack}`} data-layer="flags" data-depth="3">
        <PrayerFlags strands={strands.back} viewBox={VIEWBOX} frameRef={scene} tone="back" reveal />
      </div>

      <div ref={scene} className={styles.scene}>
        <div className={styles.pinnacleGlow} data-intro="glow" aria-hidden="true" />
        <div className={`${styles.sceneLayer} ${styles.stupa}`} data-depth="4">
          <Stupa title="Illustration of Boudhanath Stupa at dusk, with prayer flags and prayer wheels, before the Himalaya" />
        </div>
        <div className={styles.sceneLayer} data-intro="lights" data-depth="4">
          <StupaLights />
        </div>
      </div>

      <div className={`${styles.flags} ${styles.flagsFront}`} data-layer="flags" data-depth="6">
        <PrayerFlags strands={strands.front} viewBox={VIEWBOX} frameRef={scene} reveal />
      </div>

      <div className={styles.foreground} data-layer="foreground" data-depth="7">
        <div className={styles.groundLight} />
        <Motes count={compact ? 6 : 14} />
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.aura} data-aura aria-hidden="true" />

      <header className={styles.intro}>
        <p className="eyebrow" data-intro="ui">
          {hero.eyebrow}
        </p>
        <h1 id="hero-title" className={styles.title} data-intro="ui">
          <span className={styles.titleLatin}>{hero.title}</span>
          <span className={`${styles.titleNepali} devanagari`} lang="ne">
            {hero.titleNepali}
          </span>
        </h1>
        <p className={styles.tagline} data-intro="ui">
          {hero.tagline}
        </p>
      </header>

      <p className={styles.coordinates} data-intro="ui">
        27°43′ N &nbsp;·&nbsp; 85°21′ E
      </p>

      <ScrollIndicator />
    </section>
  );
}
