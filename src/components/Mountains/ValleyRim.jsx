import { useMemo } from 'react';
import { createRandom } from '../../lib/random';
import styles from './Mountains.module.css';

/*
 * The foothills that ring the Kathmandu Valley, as two dark silhouettes in
 * front of the snow peaks, with a scatter of lit windows on the nearer one.
 * They sit the photograph at a believable distance behind the stupa.
 */

function ridge(seed, baseline, waves) {
  const random = createRandom(seed);
  const phases = waves.map(() => random() * Math.PI * 2);
  const points = [];
  for (let x = 0; x <= 1000; x += 10) {
    const y = waves.reduce(
      (sum, [freq, amp], i) => sum + Math.sin((x / 1000) * Math.PI * 2 * freq + phases[i]) * amp,
      baseline,
    );
    points.push({ x, y });
  }
  return points;
}

const toPath = (points) =>
  `M0 200 L${points.map((p) => `${p.x} ${p.y.toFixed(1)}`).join(' L')} L1000 200 Z`;

export default function ValleyRim({ lights = 34 }) {
  const { far, near, windows } = useMemo(() => {
    const farPts = ridge(11, 72, [
      [1.6, 14],
      [3.7, 7],
      [9.1, 2.5],
      [21, 1],
    ]);
    const nearPts = ridge(23, 122, [
      [0.7, 8],
      [2.2, 6],
      [5.8, 2.5],
      [14, 1],
    ]);
    const random = createRandom(5);
    const lit = Array.from({ length: lights }, (_, i) => {
      const x = random() * 1000;
      const crest = nearPts[Math.round(x / 10)].y;
      return { key: i, x, y: crest + 4 + random() * 22, r: 0.5 + random() * 0.5, dim: random() > 0.5 };
    });
    return { far: toPath(farPts), near: toPath(nearPts), windows: lit };
  }, [lights]);

  return (
    <svg className={styles.rim} viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rim-far" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1c2d47" />
          <stop offset="1" stopColor="#111c30" />
        </linearGradient>
        <linearGradient id="rim-near" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0d1526" />
          <stop offset="1" stopColor="#080c15" />
        </linearGradient>
      </defs>
      <path d={far} fill="url(#rim-far)" opacity="0.92" />
      <path d={near} fill="url(#rim-near)" />
      <g className={styles.windows}>
        {windows.map((w) => (
          <ellipse key={w.key} cx={w.x} cy={w.y} rx={w.r} ry={w.r * 1.6} fill="#f2c879" opacity={w.dim ? 0.35 : 0.75} />
        ))}
      </g>
    </svg>
  );
}
