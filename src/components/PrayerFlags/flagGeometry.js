import { createRandom, lerp } from '../../lib/random';

/*
 * Builds one string of prayer flags.
 * The line is a quadratic curve that sags under its own weight; flags are
 * stitched along it by arc length with their top edge on the line. Each flag
 * gets its own height, phase, speed and swing so no two move in step.
 */

const SAMPLES = 240;

function quad(a, c, b, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

export function buildStrand({
  from,
  to,
  sag = 60,
  width = 22,
  height = 26,
  gap = 4,
  grow = [1, 1], // flag scale at the start and end of the line (perspective)
  bounds = [-Infinity, Infinity],
  seed = 1,
}) {
  const random = createRandom(seed);
  const control = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 + sag };

  // sample the curve and accumulate arc length
  const points = [];
  let length = 0;
  let prev = from;
  for (let i = 0; i <= SAMPLES; i += 1) {
    const t = i / SAMPLES;
    const pt = quad(from, control, to, t);
    length += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    points.push({ ...pt, s: length, t });
    prev = pt;
  }
  const at = (s) => {
    const i = points.findIndex((p) => p.s >= s);
    if (i <= 0) return points[Math.max(i, 0)];
    const a = points[i - 1];
    const b = points[i];
    const k = (s - a.s) / (b.s - a.s || 1);
    return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), t: lerp(a.t, b.t, k) };
  };

  const flags = [];
  let s = 14;
  let index = 0;
  while (s < length - 10) {
    const scale = lerp(grow[0], grow[1], s / length);
    const w = width * scale;
    const p0 = at(s);
    const p1 = at(Math.min(s + w, length));
    if (p0.x >= bounds[0] && p0.x <= bounds[1]) {
      flags.push({
        index,
        s,
        t: p0.t,
        t1: p1.t,
        x0: p0.x,
        y0: p0.y,
        x1: p1.x,
        y1: p1.y,
        h: height * scale * (0.92 + random() * 0.16),
        phase: random() * Math.PI * 2,
        speed: 1.3 + random() * 1.1,
        swing: 0.1 + random() * 0.1,
        shade: 0.84 + random() * 0.16,
      });
    }
    s += w + gap * scale;
    index += 1;
  }

  return { points, length, flags, direction: Math.sign(to.x - from.x) || 1 };
}
