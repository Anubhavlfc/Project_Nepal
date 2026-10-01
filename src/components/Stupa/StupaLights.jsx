import { useId } from 'react';
import { CX, SCENE, SPIRE, SPIRE_TOP, TERRACES } from './geometry';
import styles from './Stupa.module.css';

/*
 * The moving light on the stupa, kept in its own layer above the static
 * drawing: butter lamps along each cornice, flickering out of step, and an
 * occasional slow band of light crossing the gilded tiers.
 */

function lampPositions() {
  const lamps = [];
  TERRACES.forEach((t, ti) => {
    for (let x = t.x1 + 10; x <= t.x2 - 10; x += 19) {
      if (Math.abs(x - CX) < t.stair + 10) continue;
      lamps.push({ x, y: t.top - 3, group: (lamps.length + ti) % 3 });
    }
  });
  return lamps;
}

const LAMPS = lampPositions();

export default function StupaLights({ className = '' }) {
  const p = useId().replace(/:/g, '');
  const half = SPIRE.widthBottom / 2;
  return (
    <svg
      className={`${styles.stupa} ${className}`}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${p}-lamp`}>
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#f2c879" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f2c879" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${p}-shimmer`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff6dc" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${p}-spire`}>
          <path
            d={`M${CX - half} ${SPIRE.bottom} L${CX - SPIRE.widthTop / 2 - 4} ${SPIRE_TOP} L${CX + SPIRE.widthTop / 2 + 4} ${SPIRE_TOP} L${CX + half} ${SPIRE.bottom} Z`}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#${p}-spire)`}>
        <rect
          className={styles.shimmer}
          x={CX - 160}
          y={SPIRE_TOP - 10}
          width="60"
          height={SPIRE.bottom - SPIRE_TOP + 20}
          fill={`url(#${p}-shimmer)`}
          transform={`rotate(14 ${CX} ${(SPIRE.bottom + SPIRE_TOP) / 2})`}
        />
      </g>

      {[0, 1, 2].map((group) => (
        <g key={group} className={styles[`lampGroup${group}`]}>
          {LAMPS.filter((l) => l.group === group).map((l) => (
            <g key={`${l.x}-${l.y}`}>
              <circle cx={l.x} cy={l.y} r="9" fill={`url(#${p}-lamp)`} />
              <circle cx={l.x} cy={l.y} r="1.8" fill="#ffe6ad" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
