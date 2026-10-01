import { useMemo } from 'react';
import { createRandom } from '../../lib/random';
import styles from './Atmosphere.module.css';

/* A few specks of warm light rising off the lamps; pure CSS, no loop */
export default function Motes({ count = 14, seed = 3 }) {
  const motes = useMemo(() => {
    const random = createRandom(seed);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      left: `${22 + random() * 56}%`,
      bottom: `${4 + random() * 22}%`,
      size: `${1.5 + random() * 2}px`,
      duration: `${14 + random() * 12}s`,
      delay: `${-random() * 26}s`,
      drift: `${(random() - 0.5) * 60}px`,
    }));
  }, [count, seed]);

  return (
    <div className={styles.motes} aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.key}
          className={styles.mote}
          style={{
            left: m.left,
            bottom: m.bottom,
            width: m.size,
            height: m.size,
            animationDuration: m.duration,
            animationDelay: m.delay,
            '--drift': m.drift,
          }}
        />
      ))}
    </div>
  );
}
