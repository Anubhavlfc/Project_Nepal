import { FLAG_ANCHOR, CX } from '../Stupa/geometry';

/*
 * Strings of flags tied under the pinnacle. Front strings come down toward
 * the viewer, so their flags grow along the line; back strings run away
 * behind the dome and shrink. On small screens the flags are drawn larger
 * so they stay legible as cloth rather than confetti.
 */
export function heroStrands({ compact }) {
  const k = compact ? 1.55 : 1;
  const { y, spread } = FLAG_ANCHOR;
  const common = { width: 21 * k, height: 25 * k, gap: 4 * k, bounds: [-720, 2320] };

  const front = [
    { ...common, from: { x: CX - spread, y }, to: { x: -900, y: 1250 }, sag: 95, grow: [0.85, 1.5], seed: 11, sway: 9.5 },
    { ...common, from: { x: CX - spread / 2, y: y + 4 }, to: { x: 110, y: 1160 }, sag: 45, grow: [0.85, 1.9], seed: 12, sway: 8 },
    { ...common, from: { x: CX + spread, y }, to: { x: 2500, y: 1250 }, sag: 95, grow: [0.85, 1.5], seed: 13, sway: 10.5 },
    { ...common, from: { x: CX + spread / 2, y: y + 4 }, to: { x: 1490, y: 1160 }, sag: 45, grow: [0.85, 1.9], seed: 14, sway: 8.6 },
  ];

  const back = [
    { ...common, from: { x: CX - 2, y }, to: { x: -200, y: 800 }, sag: 60, grow: [0.8, 0.62], seed: 21, sway: 11 },
    { ...common, from: { x: CX + 2, y }, to: { x: 1800, y: 800 }, sag: 60, grow: [0.8, 0.62], seed: 22, sway: 12 },
  ];

  return { front, back };
}
