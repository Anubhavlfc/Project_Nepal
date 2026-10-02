import { gsap } from 'gsap';
import { flagReveal } from '../components/PrayerFlags/PrayerFlags';

/*
 * The opening: light finding the architecture. The valley is dark. The
 * range comes up out of the night with the stupa as a silhouette in front
 * of it; then the light finds the dome, the eyes, and the gilding from the
 * foot of the spire to its tip. The flags appear on their lines, the lamps
 * are lit, and last of all the words. Nothing moves or assembles; only the
 * light changes.
 *
 * Nothing waits on it: the page scrolls and responds throughout, and any
 * input simply hurries the rest along. It plays only when the page opens
 * at the top.
 */
export function createIntro(stage) {
  if (window.scrollY > 40) return () => {};
  const q = gsap.utils.selector(stage);

  gsap.set(q('[data-shade]'), { opacity: 1 });
  const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });
  tl.from(q('[data-intro="landscape"]'), { opacity: 0, duration: 1 }, 0.5)
    .from(q('[data-intro="sky"]'), { opacity: 0, duration: 1.4 }, 0.6)
    .to(q('[data-shade="dome"]'), { opacity: 0, duration: 1 }, 0.8)
    .to(q('[data-shade="base"]'), { opacity: 0, duration: 1.1 }, 0.9)
    .from(q('[data-intro="wheels"]'), { opacity: 0, duration: 1.1 }, 0.9)
    .to(q('[data-shade="harmika"]'), { opacity: 0, duration: 1 }, 1.1)
    // the gilding is lit from the foot of the spire up to the finial
    .to(q('[data-shade="tier"]'), { opacity: 0, duration: 0.45, stagger: 0.045 }, 1.4)
    .to(q('[data-shade="canopy"], [data-shade="pinnacle"]'), { opacity: 0, duration: 0.5, stagger: 0.1 }, 1.95)
    .fromTo(flagReveal, { value: 0 }, { value: 1, duration: 1.1, ease: 'sine.out' }, 1.8)
    .from(q('[data-lamps], [data-intro="lamps"]'), { opacity: 0, duration: 0.9, stagger: 0.12 }, 2.2)
    .from(q('[data-intro="text"]'), { opacity: 0, y: 8, duration: 0.9, stagger: 0.1, ease: 'sine.out' }, 2.6);

  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  const remove = () => events.forEach((e) => window.removeEventListener(e, hurry));
  const hurry = () => {
    tl.timeScale(4);
    remove();
  };
  events.forEach((e) => window.addEventListener(e, hurry, { passive: true }));
  tl.eventCallback('onComplete', remove);

  return () => {
    remove();
    tl.progress(1).kill();
    flagReveal.value = 1;
  };
}
