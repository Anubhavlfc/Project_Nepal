import { gsap } from 'gsap';
import { flagReveal } from '../components/PrayerFlags/PrayerFlags';

/*
 * The opening: dusk settling over the valley, then the stupa assembling
 * from the ground up, then its lights, then the stars and the interface.
 * Nothing waits on it: the page scrolls and responds throughout, and any
 * input simply hurries the remainder along.
 */
export function createHeroIntro(root) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.from(q('[data-layer="mountains"]'), { autoAlpha: 0, scale: 1.04, duration: 1.6, ease: 'power1.out' }, 0.2)
    .from(q('[data-layer="atmosphere"]'), { autoAlpha: 0, duration: 1.4 }, 0.7)
    .from(q('[data-intro="base"]'), { autoAlpha: 0, y: 14, duration: 1.1 }, 0.8)
    .from(q('[data-intro="dome"]'), { autoAlpha: 0, y: 18, duration: 1.1 }, 1.0)
    .from(q('[data-intro="harmika"]'), { autoAlpha: 0, y: 10, duration: 1.0 }, 1.3)
    .from(q('[data-intro="spire"]'), { autoAlpha: 0, y: 24, duration: 1.1, ease: 'power3.out' }, 1.5)
    // the lines are paid out from the pinnacle toward the ground
    .fromTo(flagReveal, { value: 0 }, { value: 1, duration: 1.6, ease: 'power1.inOut' }, 1.8)
    .from(q('[data-intro="glow"], [data-intro="lights"], [data-layer="foreground"]'), { autoAlpha: 0, duration: 1.4 }, 2.2)
    .from(q('[data-layer="sky"]'), { autoAlpha: 0, duration: 1.4 }, 2.5)
    .from(q('[data-intro="ui"]'), { autoAlpha: 0, y: 12, duration: 1.0, stagger: 0.12 }, 3.0);

  const hurry = () => {
    tl.timeScale(3);
    remove();
  };
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  const remove = () => events.forEach((e) => window.removeEventListener(e, hurry));
  events.forEach((e) => window.addEventListener(e, hurry, { passive: true }));
  tl.eventCallback('onComplete', remove);

  return () => {
    remove();
    tl.kill();
    flagReveal.value = 1;
  };
}
