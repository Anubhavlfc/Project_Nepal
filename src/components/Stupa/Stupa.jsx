import { useId } from 'react';
import { SCENE } from './geometry';
import StupaDefs from './StupaDefs';
import StupaBase from './StupaBase';
import StupaDome from './StupaDome';
import Harmika from './Harmika';
import StupaShades from './StupaShades';
import { StupaCanopy, StupaPinnacle, StupaSpire } from './StupaSpire';
import styles from './Stupa.module.css';

/**
 * Boudhanath in elevation, an architectural drawing built from separate
 * parts so the intro can light each in turn. The drawing itself never
 * changes; lamplight lives in StupaLights, a layer of its own, and the
 * prayer wheels are buttons laid over their niches.
 */
export default function Stupa({ className = '', title = 'Boudhanath Stupa' }) {
  const p = useId().replace(/:/g, '');
  return (
    <svg
      className={`${styles.stupa} ${className}`}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMax meet"
    >
      <StupaDefs p={p} />
      <StupaBase p={p} />
      <StupaDome p={p} />
      <Harmika p={p} />
      <StupaSpire p={p} />
      <StupaCanopy p={p} />
      <StupaPinnacle p={p} />
      <StupaShades />
    </svg>
  );
}
