import { CX, FLAG_ANCHOR } from '../Stupa/geometry';

/*
 * Lines of flags tied round the top of the spire, under the canopy, and
 * carried down to the ground far outside the frame on both sides. The back
 * lines run away behind the stupa, so they are tied behind the spire, hang
 * higher and their flags shrink with distance; the front lines come toward
 * the viewer, lower and heavier, their flags growing along the line.
 *
 * On small screens the flags are drawn larger so they stay legible as
 * cloth, and the extra line on the right is left out.
 */
export function makeStrands({ compact = false } = {}) {
  const k = compact ? 1.4 : 1;
  const { y } = FLAG_ANCHOR;
  const flag = { width: 10 * k, height: 12.5 * k, gap: 2.2 * k };
  const sides = [-1, 1];

  const back = [
    ...sides.map((s, i) => ({ ...flag, from: { x: CX + s * 10, y: y - 2 }, to: { x: CX + s * 2600, y: 760 }, sag: 160, grow: [0.95, 0.62], seed: 21 + i, sway: 11 + i })),
    // one more line on the right only: the lines are many, and never quite symmetrical
    ...(compact ? [] : [{ ...flag, from: { x: CX + 22, y }, to: { x: CX + 2400, y: 940 }, sag: 190, grow: [1, 0.85], seed: 23, sway: 12.5 }]),
  ];

  const front = sides.map((s, i) => ({
    ...flag,
    from: { x: CX + s * 17, y: y + 3 },
    to: { x: CX + s * 2200, y: 1250 },
    sag: 200,
    grow: [1, 1.7],
    seed: 31 + i,
    sway: 9.5 + i * 1.3,
  }));

  return { back, front };
}
