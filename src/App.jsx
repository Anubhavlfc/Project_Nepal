import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import HeroScene from './components/Hero/HeroScene';
import HimalayaSection from './components/Sections/HimalayaSection';
import BoudhanathSection from './components/Sections/BoudhanathSection';
import PrayerSection from './components/Sections/PrayerSection';
import ClosingSection from './components/Sections/ClosingSection';
import Navigation from './components/Navigation/Navigation';

export default function App() {
  // Scroll choreography (and ScrollTrigger) load after first paint, in their own chunk
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let stop;
      let cancelled = false;
      import('./animations/scrollStory').then(({ createScrollStory }) => {
        if (!cancelled) stop = createScrollStory();
      });
      return () => {
        cancelled = true;
        stop?.();
      };
    });
    return () => mm.revert();
  });

  return (
    <>
      <a className="skip-link" href="#himalaya">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <HeroScene />
        <HimalayaSection />
        <BoudhanathSection />
        <PrayerSection />
        <ClosingSection />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
