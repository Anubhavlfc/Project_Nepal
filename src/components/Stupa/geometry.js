/*
 * Shared scene geometry, in SVG user units.
 * Every hero layer (back flags, stupa, front flags) uses the same 1600×1000
 * viewBox so they stay registered with one another at any size.
 * Proportions follow a frontal elevation of Boudhanath: a broad three-step
 * mandala base, a low dome, the square harmika, thirteen tiers, the canopy
 * and the pinnacle.
 */

export const SCENE = { width: 1600, height: 1000 };
export const CX = 800;
export const GROUND_Y = 958;

/* Terraces, bottom to top. `returns` are the x positions where the wall
   steps back (the corners of the mandala plan seen from the front). */
export const TERRACES = [
  { x1: 230, x2: 1370, top: 872, bottom: 958, walk: 12, stair: 48, returns: [384, 582] },
  { x1: 345, x2: 1255, top: 800, bottom: 860, walk: 10, stair: 36, returns: [470, 640] },
  { x1: 460, x2: 1140, top: 742, bottom: 790, walk: 8, stair: 26, returns: [560, 690] },
];

export const DRUM = [
  { x1: 496, x2: 1104, top: 722, bottom: 734 },
  { x1: 506, x2: 1094, top: 712, bottom: 722 },
];

export const DOME = { cx: CX, cy: 714, rx: 292, ry: 205 };

export const HARMIKA = {
  plinth: { x1: 738, x2: 862, top: 500, bottom: 512 },
  body: { x1: 724, x2: 876, top: 430, bottom: 502 },
  band: { x1: 712, x2: 888, top: 404, bottom: 430 },
};

export const SPIRE = { tiers: 13, bottom: 404, tierHeight: 14, widthBottom: 168, widthTop: 70 };
export const SPIRE_TOP = SPIRE.bottom - SPIRE.tiers * SPIRE.tierHeight;

export const CANOPY = { brim: 212, top: 178, x1: 748, x2: 852 };

/* Where the flag lines are tied, just under the pinnacle */
export const FLAG_ANCHOR = { y: 150, spread: 8 };

/* Prayer wheel niches in the lowest wall, mirrored about the stairs */
const NICHE_WIDTH = 46;
const leftNiches = [262, 328, 394, 460, 526, 592, 658];
export const NICHES = [
  ...leftNiches,
  ...leftNiches.map((x) => SCENE.width - x - NICHE_WIDTH).reverse(),
].map((x) => ({ x, y: 882, width: NICHE_WIDTH, height: 70 }));

export function domePath() {
  const { cx, cy, rx, ry } = DOME;
  return `M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy} Z`;
}
