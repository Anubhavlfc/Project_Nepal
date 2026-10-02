import { SCENE } from '../Stupa/geometry';

/*
 * One camera over one scene. The stage lays the stupa out once, at its
 * overview size (CSS does that, see Journey.module.css); the camera then
 * moves over it with a single transform, so every layer stays registered
 * and nothing is laid out again while it moves.
 *
 * A view is a scene point (x, y, in SVG units), the place on screen it
 * should sit (ax, ay, as fractions of the stage), and a zoom. Nearer layers
 * follow the camera fully; the mountains and the stars follow only a little
 * of its travel and its zoom, which is what makes them read as far away.
 */

export const camera = {
  z: 1,
  x: SCENE.width / 2,
  y: 0,
  ax: 0.5,
  ay: 0.5,
  lamps: 0.85, // lamplight, brighter as the camera reaches the base
  flags: 1, // the flags recede while the camera looks into the eyes
  dim: 0, // the closing view settles into darkness
  veil: 0, // on tall screens, the dark the text sits on at the foot of the frame
};

/* Shared with the canvases that draw in scene space (the prayer flags) */
export const view = {
  layout: null,
  pointer: { x: 0, y: 0 }, // -1 … 1 across the window, eased
};

/* Where the overview puts things, read from the laid-out scene */
export function measure(stage, scene) {
  return {
    width: stage.clientWidth,
    height: stage.clientHeight,
    left: scene.offsetLeft,
    top: scene.offsetTop,
    unit: scene.offsetWidth / SCENE.width,
  };
}

/* The scene point that sits at the anchor in the overview */
export function overviewFocus(layout, ax = 0.5, ay = 0.5) {
  const { width, height, left, top, unit } = layout;
  return { x: (ax * width - left) / unit, y: (ay * height - top) / unit };
}

/*
 * Screen mapping for a layer that follows `depth` of the camera (1 for the
 * scene itself): returns a scale and an offset so that, for a point at
 * overview position p, its position on screen is offset + p * scale.
 */
export function project(cam, layout, depth = 1) {
  const { width, height, left, top, unit } = layout;
  const focus = { x: left + cam.x * unit, y: top + cam.y * unit };
  const anchor = { x: cam.ax * width, y: cam.ay * height };
  const scale = 1 + (cam.z - 1) * depth;
  const at = { x: focus.x + (anchor.x - focus.x) * depth, y: focus.y + (anchor.y - focus.y) * depth };
  return { scale, x: at.x - focus.x * scale, y: at.y - focus.y * scale };
}
