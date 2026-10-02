import { DOME, domePath, domePoint } from './geometry';

/*
 * The whitewashed dome. Saffron water thrown from the harmika dries in
 * arcs, the petals of a lotus seen from above; drawn on the surface of the
 * dome, their curves are what make the flat shape read as round. A narrow
 * stair climbs the right flank for the whitewashers.
 */

const E = 2 / DOME.fullness;

/* A point on the dome's surface: `t` runs from the base (0) to the crown
   (π/2) along the profile, `lon` is the longitude, 0 facing the viewer. */
function surface(t, lon) {
  const { cx, base, rx, ry } = DOME;
  const r = rx * Math.cos(t) ** E;
  return { x: cx + r * Math.sin(lon), y: base - ry * Math.sin(t) ** E };
}

function polyline(points) {
  return `M${points.map((pt) => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' L')}`;
}

const DEG = Math.PI / 180;
const CROWN = 1.33; // where the harmika's plinth meets the dome
const PETAL_WIDTH = 22.5 * DEG;

/* Sixteen petals around the crown; the ones turned away are hidden */
const PETALS = Array.from({ length: 16 }, (_, i) => -180 + 11.25 + i * 22.5)
  .filter((deg) => Math.abs(deg) < 84)
  .map((deg, i) => {
    const depth = 0.62 + ((i * 7) % 5) * 0.05; // thrown by hand, never even
    const points = Array.from({ length: 25 }, (_, k) => {
      const u = -1 + k / 12;
      const t = CROWN - depth * Math.cos((u * Math.PI) / 2) ** 0.8;
      return surface(t, deg * DEG + (u * PETAL_WIDTH) / 2);
    });
    return { deg, d: polyline(points) };
  });

const STAIR_LON = 36 * DEG;
const STAIR_HALF = 1.3 * DEG;

function stair() {
  const steps = 40;
  const at = (k, side) => surface(0.04 + ((CROWN - 0.04) * k) / steps, STAIR_LON + side * STAIR_HALF);
  const edges = [-1, 1].map((side) => polyline(Array.from({ length: steps + 1 }, (_, k) => at(k, side))));
  const treads = Array.from({ length: steps }, (_, k) => {
    const a = at(k + 0.5, -1);
    const b = at(k + 0.5, 1);
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  });
  return { edges, treads: treads.join(' ') };
}

const STAIR = stair();

/* The upper-left shoulder, which faces the evening sky */
const RIM = polyline(Array.from({ length: 21 }, (_, k) => domePoint(Math.PI * (0.93 - k * 0.019))));

export default function StupaDome({ p }) {
  const { cx, base, ry } = DOME;
  const outline = domePath();
  return (
    <g data-part="dome">
      <path d={outline} fill={`url(#${p}-dome)`} />
      <g clipPath={`url(#${p}-dome-clip)`}>
        <g fill="none" stroke="#c4843a" strokeLinecap="round" strokeLinejoin="round">
          {PETALS.map(({ deg, d }, i) => (
            <path key={deg} d={d} strokeWidth={2.6 + (i % 3) * 0.5} strokeOpacity={0.3 - Math.abs(deg) / 360} />
          ))}
        </g>
        <g stroke="#6d6b66" fill="none" opacity="0.4">
          {STAIR.edges.map((d) => (
            <path key={d} d={d} strokeWidth="1.2" />
          ))}
          <path d={STAIR.treads} strokeWidth="0.9" />
        </g>
        {/* cool shadow on the far flank, lamplight rising from below */}
        <path d={outline} fill={`url(#${p}-cool)`} />
        <path d={outline} fill={`url(#${p}-lamplit)`} />
        {/* the harmika's shadow on the crown */}
        <ellipse cx={cx + 22} cy={base - ry + 10} rx="100" ry="11" fill="#3c4250" opacity="0.16" />
      </g>
      {/* sky light along the shoulder facing the moon */}
      <path d={RIM} fill="none" stroke="#dfe7f2" strokeOpacity="0.3" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}
