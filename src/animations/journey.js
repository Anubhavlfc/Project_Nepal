import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { camera, overviewFocus, view } from '../components/Journey/camera';

gsap.registerPlugin(ScrollTrigger);

/*
 * Scroll is the camera. The stage stays put while the journey scrolls
 * past, and the scroll position drives a single timeline over the same
 * stupa: in to the eyes, up to the gilded spire and its flags, down to the
 * base and the wheels, then back out into the night. Each stop holds while
 * its text is read. Only transforms and a few opacities change; the camera
 * never turns, and never zooms by more than about two.
 *
 * A view is a scene point (x, y), where it sits on screen (ax, ay) and a
 * zoom (z); see components/Journey/camera.js.
 */
const VIEWS = {
  wide: {
    eyes: { z: 2.05, x: 800, y: 598, ax: 0.6, ay: 0.47, flags: 0.3 },
    spire: { z: 1.45, x: 800, y: 300, ax: 0.6, ay: 0.4 },
    mandala: { z: 1.55, x: 800, y: 1000, ax: 0.5, ay: 0.45, lamps: 1, flags: 0.7 },
    evening: { z: 0.68, ax: 0.5, ay: 0.78, lamps: 1, dim: 0.3 },
  },
  // the text sits low on tall screens, on the dark of the veil
  tall: {
    eyes: { z: 2.1, x: 800, y: 600, ax: 0.5, ay: 0.34, flags: 0.3, veil: 1 },
    spire: { z: 1.2, x: 800, y: 320, ax: 0.5, ay: 0.3, veil: 1 },
    mandala: { z: 1.5, x: 800, y: 1060, ax: 0.5, ay: 0.56, lamps: 1, flags: 0.7, veil: 0.3 },
    evening: { z: 0.85, ax: 0.5, ay: 0.3, lamps: 1, dim: 0.3, veil: 0.4 },
  },
};

const STOPS = ['eyes', 'spire', 'mandala', 'evening'];

export function createJourney(root, stage) {
  const caption = (id) => root.querySelector(`[data-caption="${id}"]`);
  const mm = gsap.matchMedia();

  mm.add({ tall: '(max-aspect-ratio: 3/4)', wide: '(min-aspect-ratio: 3/4)' }, ({ conditions }) => {
    const views = conditions.tall ? VIEWS.tall : VIEWS.wide;
    // the overview, and the closing view, are measured from the laid-out scene
    const overview = () => ({ z: 1, ...overviewFocus(view.layout), ax: 0.5, ay: 0.5, lamps: 0.85, flags: 1, dim: 0, veil: 0 });
    const resolve = (v) => () => ({ ...overview(), ...v, ...(v.x === undefined ? overviewFocus(view.layout, v.ax, v.ay) : {}) });
    const poses = [overview, ...STOPS.map((id) => resolve(views[id]))];
    const value = (i, key) => () => poses[i]()[key];
    const keys = Object.keys(overview());

    stage.drive(true);
    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      onUpdate: stage.update,
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    tl.to(caption('title'), { opacity: 0, y: -10, duration: 0.3 }, 0.12);
    STOPS.forEach((id, i) => {
      const start = 0.2 + i * 1.5;
      const pose = (n) => Object.fromEntries(keys.map((k) => [k, value(n, k)]));
      tl.fromTo(camera, pose(i), { ...pose(i + 1), duration: 1, immediateRender: false }, start);
      tl.addLabel(id, start + 1.1); // arrived, text in place
      tl.fromTo(caption(id), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'sine.out', immediateRender: false }, start + 0.75);
      if (i < STOPS.length - 1) tl.to(caption(id), { opacity: 0, y: -10, duration: 0.25, ease: 'sine.in' }, start + 1.45);
    });
    tl.to({}, { duration: 0.3 }); // a last held moment before the page moves on

    // tabbing to the wheels takes the camera down to them (worked out here:
    // labelToScroll refreshes every trigger when the journey starts at 0)
    const wheels = root.querySelector('[data-wheels]');
    const toWheels = (e) => {
      if (wheels.contains(e.relatedTarget) || !e.target.matches(':focus-visible')) return;
      const { start, end } = tl.scrollTrigger;
      const top = start + (tl.labels.mandala / tl.duration()) * (end - start);
      if (Math.abs(window.scrollY - top) > window.innerHeight * 0.1) window.scrollTo({ top, behavior: 'smooth' });
    };
    wheels?.addEventListener('focusin', toWheels);

    return () => {
      wheels?.removeEventListener('focusin', toWheels);
      tl.scrollTrigger?.kill();
      tl.kill();
      stage.drive(false);
      gsap.set(STOPS.map(caption), { clearProps: 'opacity,transform' });
      gsap.set(caption('title'), { clearProps: 'opacity,transform' });
      stage.update();
    };
  });

  return () => mm.revert();
}
