/*
 * Shared scene geometry, in SVG user units.
 * Every layer of the scene (rear flags, stupa, lamps, wheels, front flags)
 * uses the same 1600×1150 box, so they stay registered at any size and
 * under any camera move.
 *
 * Proportions are taken from photographs of Boudhanath, in frontal
 * elevation: three broad terraces; a low, full-shouldered dome about four
 * harmika-widths across; a wide, short harmika whose eyes sit just beneath
 * a deep red cloth band; thirteen gilded tiers about 1.3 harmika widths
 * tall; the canopy with its cloth skirt; and the gajur, the finial.
 */

export const SCENE = { width: 1600, height: 1150 };
export const CX = 800;
export const GROUND_Y = 1110;

/* Terraces, bottom to top. `returns` are the x positions where the wall
   steps back: the stepped corners of the mandala plan, seen head-on. */
export const TERRACES = [
  { x1: 196, x2: 1404, top: 1024, bottom: 1110, stair: 56, cornice: 9, returns: [352, 548] },
  { x1: 314, x2: 1286, top: 956, bottom: 1016, stair: 44, cornice: 8, returns: [446, 618] },
  { x1: 428, x2: 1172, top: 908, bottom: 948, stair: 34, cornice: 7, returns: [536, 676] },
];

/* How far each bay sits back, from the central bay outward. Seen from a
   little above, a bay further back shows a little higher on the page. */
export const RECESS = [0, 4, 8];

/* The bays of one half of a terrace wall, outermost first: x range and lift */
export function terraceBays(t) {
  const edges = [t.x1, ...t.returns, CX];
  return edges.slice(0, -1).map((x, i) => ({ x1: x, x2: edges[i + 1], lift: RECESS[edges.length - 2 - i] }));
}

/* The round plinth the dome stands on, with its band of small niches */
export const PLINTH = { x1: 456, x2: 1144, top: 870, bottom: 902, band: [876, 896] };

/* The small niches round the plinth, each holding an image and a lamp.
   They crowd together toward the sides as the drum turns away. */
export const PLINTH_NICHES = (() => {
  const r = (PLINTH.x2 - PLINTH.x1) / 2;
  const step = (3.4 * Math.PI) / 180;
  const result = [];
  for (let a = -Math.PI / 2 + step; a < Math.PI / 2 - step / 2; a += step) {
    const w = r * step * Math.cos(a) * 0.56;
    if (w >= 2.2) result.push({ x: CX + r * Math.sin(a) - w / 2, w });
  }
  return result;
})();

export const DOME = { cx: CX, base: 872, rx: 336, ry: 212, fullness: 2.15 };

export const HARMIKA = {
  plinth: { x1: 712, x2: 888, top: 646, bottom: 668 },
  face: { x1: 716, x2: 884, top: 588, bottom: 648 },
  cloth: { x1: 702, x2: 898, top: 548, bottom: 588 },
  trim: { x1: 708, x2: 892, top: 532, bottom: 548 },
};

export const SPIRE = { tiers: 13, bottom: 532, top: 310, widthBottom: 174, widthTop: 62 };

export const CANOPY = {
  collar: { top: 302, bottom: 310, width: 70 },
  skirt: { top: 272, bottom: 302, widthTop: 96, widthBottom: 108 },
  stripes: { top: 256, bottom: 272, width: 108 },
  drum: { top: 212, bottom: 256, width: 112 },
  eave: { top: 204, bottom: 212, width: 128 },
};

export const GAJUR = { base: 204, top: 104 };

/* The flag lines are tied round the top of the tiers, under the canopy */
export const FLAG_ANCHOR = { y: 306 };

/* Prayer-wheel niches in the lowest wall: two, three and three per bay,
   left to right, mirrored about the stair */
const NICHE = { width: 46, height: 64, top: 1038 };
const NICHES_PER_BAY = [2, 3, 3];
const leftNiches = terraceBays(TERRACES[0]).flatMap((bay, b) => {
  const n = NICHES_PER_BAY[b];
  const x2 = Math.min(bay.x2, CX - TERRACES[0].stair - 14);
  const slot = (x2 - bay.x1) / n;
  return Array.from({ length: n }, (_, i) => ({
    x: Math.round(bay.x1 + slot * (i + 0.5) - NICHE.width / 2),
    y: NICHE.top - bay.lift,
  }));
});
export const NICHES = [
  ...leftNiches,
  ...leftNiches.map((n) => ({ ...n, x: SCENE.width - n.x - NICHE.width })).reverse(),
].map((n) => ({ ...n, width: NICHE.width, height: NICHE.height }));

/* A full-shouldered dome: a superellipse rather than a plain ellipse, so the
   crown is broad and the sides fall steeply, as Boudhanath's do. */
export function domePoint(t) {
  const { cx, base, rx, ry, fullness } = DOME;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const e = 2 / fullness;
  return { x: cx + rx * Math.sign(c) * Math.abs(c) ** e, y: base - ry * Math.abs(s) ** e };
}

export function domePath() {
  const steps = 64;
  const pts = Array.from({ length: steps + 1 }, (_, i) => domePoint((Math.PI * i) / steps));
  return `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')} Z`;
}
