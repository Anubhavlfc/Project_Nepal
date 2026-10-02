import { useId } from 'react';
import { createRandom } from '../../lib/random';
import { CX, NICHES, PLINTH, PLINTH_NICHES, SCENE, TERRACES, terraceBays } from './geometry';
import styles from './Stupa.module.css';

/*
 * The lamplight, in its own layer above the static drawing: a lamp in each
 * niche round the plinth, butter lamps along the walkways, gathered near
 * the stairs where people leave them, a glow in every prayer-wheel niche,
 * and the warm wash the lamps throw on the walls above them. Three groups
 * breathe slowly out of step; nothing flashes.
 */

function liftAt(t, x) {
  const d = Math.abs(x - CX);
  return terraceBays(t).find((b) => d >= CX - b.x2 && d <= CX - b.x1)?.lift ?? 0;
}

/* Butter lamps on the walkway on top of terrace `t` */
function walkwayLamps(t, seed) {
  const random = createRandom(seed);
  const lamps = [];
  for (const side of [-1, 1]) {
    let d = t.stair + 16;
    while (d < CX - t.x1 - 12) {
      // dense by the stair, thinning toward the corners
      if (random() < Math.exp(-(d - t.stair) / 170)) {
        const x = CX + side * d;
        lamps.push({ x, y: t.top - 3 - liftAt(t, x), size: 0.8 + random() * 0.45, group: lamps.length % 3 });
      }
      d += 7 + random() * 7;
    }
  }
  return lamps;
}

const WALK_LAMPS = [...walkwayLamps(TERRACES[0], 31), ...walkwayLamps(TERRACES[1], 32), ...walkwayLamps(TERRACES[2], 33)];

export default function StupaLights({ className = '' }) {
  const p = useId().replace(/:/g, '');
  const [b0, b1] = PLINTH.band;
  return (
    <svg
      className={`${styles.stupa} ${className}`}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${p}-glow`}>
          <stop offset="0" stopColor="#ffd28c" stopOpacity="0.75" />
          <stop offset="0.3" stopColor="#f2b765" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f2b765" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${p}-wash`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f0b462" stopOpacity="0" />
          <stop offset="1" stopColor="#f0b462" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id={`${p}-niche`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8642a" />
          <stop offset="1" stopColor="#ffcf86" />
        </linearGradient>
      </defs>

      {/* the ring of lamps round the plinth */}
      <g data-lamps="plinth">
        <rect x={PLINTH.x1 + 30} y={b0 - 8} width={PLINTH.x2 - PLINTH.x1 - 60} height={b1 - b0 + 16} rx="12" fill={`url(#${p}-glow)`} opacity="0.5" />
        {[0, 1, 2].map((group) => (
          <g key={group} className={styles[`breathe${group}`]}>
            {PLINTH_NICHES.filter((_, i) => i % 3 === group).map(({ x, w }) => {
              const r = Math.min(w / 2, 4) - 0.6;
              return (
                <path
                  key={x}
                  d={`M${(x + 0.8).toFixed(1)} ${b1} V${b0 + r + 1.5} Q${(x + w / 2).toFixed(1)} ${b0 + 0.6} ${(x + w - 0.8).toFixed(1)} ${b0 + r + 1.5} V${b1} Z`}
                  fill={`url(#${p}-niche)`}
                  opacity="0.9"
                />
              );
            })}
          </g>
        ))}
      </g>

      {/* butter lamps on the walkways, and the light they throw up the walls */}
      <g data-lamps="walk">
        {TERRACES.map((t, i) => {
          const above = TERRACES[i + 1] ?? { x1: PLINTH.x1, x2: PLINTH.x2, bottom: PLINTH.bottom };
          return <rect key={t.top} x={above.x1} y={above.bottom - 36} width={above.x2 - above.x1} height="34" fill={`url(#${p}-wash)`} />;
        })}
        {[0, 1, 2].map((group) => (
          <g key={group} className={styles[`breathe${group}`]}>
            {WALK_LAMPS.filter((l) => l.group === group).map((l) => (
              <g key={`${l.x}-${l.y}`}>
                <circle cx={l.x} cy={l.y - 2} r={11 * l.size} fill={`url(#${p}-glow)`} opacity="0.7" />
                <ellipse cx={l.x} cy={l.y - 2.2} rx={0.85 * l.size} ry={1.7 * l.size} fill="#f7cf8e" opacity="0.85" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* lamplight in the prayer-wheel niches */}
      <g data-lamps="wheels">
        {NICHES.map((n) => (
          <ellipse key={n.x} cx={n.x + n.width / 2} cy={n.y + n.height - 8} rx={n.width * 0.62} ry="22" fill={`url(#${p}-glow)`} opacity="0.75" />
        ))}
      </g>
    </svg>
  );
}
