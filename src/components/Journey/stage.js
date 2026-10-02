import { gsap } from 'gsap';
import { camera, measure, overviewFocus, project, view } from './camera';

/*
 * Moves every layer of the stage with the camera, plus a few pixels of
 * pointer parallax on desktop. It runs on GSAP's shared ticker and writes
 * styles only when the camera or the pointer has actually moved.
 *
 * Each layer names its depth: how much of the camera's travel and zoom it
 * follows, and how many pixels it drifts with the pointer.
 */
const DEPTH = {
  stars: { follow: 0.03, drift: 1 },
  mountains: { follow: 0.1, drift: 1.5 },
  haze: { follow: 0.14, drift: 2 },
  scene: { follow: 1, drift: 3.5 },
};

export function createStage(stage, { parallax = false } = {}) {
  const scene = stage.querySelector('[data-scene]');
  const layers = [...stage.querySelectorAll('[data-depth]')].map((el) => ({ el, depth: DEPTH[el.dataset.depth] }));
  const lights = stage.querySelector('[data-lights]');
  const flags = [...stage.querySelectorAll('[data-flags]')];
  const night = stage.querySelector('[data-night]');
  const veil = stage.querySelector('[data-veil]');
  const target = { x: 0, y: 0 };
  const { pointer } = view;
  let dirty = true;
  let driven = false;
  // Chrome rasterises a will-change layer once, at the scale it had then, so
  // a layer that has zoomed in turns soft. Layers are promoted while the zoom
  // changes and released once it settles, which redraws them sharp.
  let zoom = camera.z;
  let settledAt = 0;
  let zooming = false;

  const relayout = () => {
    view.layout = measure(stage, scene);
    if (!driven) Object.assign(camera, overviewFocus(view.layout));
    dirty = true;
  };

  const apply = () => {
    for (const { el, depth } of layers) {
      const p = project(camera, view.layout, depth.follow);
      const x = p.x + pointer.x * depth.drift;
      const y = p.y + pointer.y * depth.drift;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${p.scale.toFixed(4)})`;
    }
    if (lights) lights.style.opacity = camera.lamps.toFixed(3);
    for (const el of flags) el.style.opacity = camera.flags.toFixed(3);
    if (night) night.style.opacity = camera.dim.toFixed(3);
    if (veil) veil.style.opacity = camera.veil.toFixed(3);
  };

  const promote = (on) => {
    zooming = on;
    for (const { el } of layers) el.style.willChange = on ? 'transform' : 'auto';
  };

  const tick = (time) => {
    if (camera.z !== zoom) {
      zoom = camera.z;
      settledAt = time + 0.2;
      if (!zooming) promote(true);
    } else if (zooming && time > settledAt) {
      promote(false);
    }
    const dx = target.x - pointer.x;
    const dy = target.y - pointer.y;
    if (Math.abs(dx) + Math.abs(dy) > 0.0005) {
      pointer.x += dx * 0.05;
      pointer.y += dy * 0.05;
      dirty = true;
    }
    if (dirty) {
      apply();
      dirty = false;
    }
  };

  const onPointer = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  relayout();
  apply();
  const resizeObserver = new ResizeObserver(relayout);
  resizeObserver.observe(stage);
  if (parallax) window.addEventListener('pointermove', onPointer, { passive: true });
  gsap.ticker.add(tick);

  return {
    /* call after changing the camera */
    update: () => {
      dirty = true;
    },
    /* the scroll journey takes the camera over from the overview */
    drive: (on) => {
      driven = on;
      if (!on) relayout();
    },
    destroy: () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      pointer.x = 0;
      pointer.y = 0;
    },
  };
}
