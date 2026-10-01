import { useId } from 'react';
import { SCENE } from './geometry';
import StupaDefs from './StupaDefs';
import StupaBase from './StupaBase';
import StupaDome from './StupaDome';
import Harmika from './Harmika';
import { StupaCanopy, StupaPinnacle, StupaSpire } from './StupaSpire';
import styles from './Stupa.module.css';

/**
 * Boudhanath in elevation, built from separate layers so each part can be
 * revealed, lit or highlighted on its own.
 *
 * `focus` dims every part except the named one (used by the anatomy study).
 * Animated light (lamps, the shimmer on the gilding) lives in StupaLights,
 * a separate layer, so this drawing stays static and is painted once.
 */
export default function Stupa({
  viewBox = `0 0 ${SCENE.width} ${SCENE.height}`,
  className = '',
  focus = null,
  wheels = true,
  title = 'Boudhanath Stupa',
}) {
  const p = useId().replace(/:/g, '');
  return (
    <svg
      className={`${styles.stupa} ${className}`}
      viewBox={viewBox}
      data-focus={focus ?? undefined}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMax meet"
    >
      <StupaDefs p={p} />
      <g data-intro="base">
        <StupaBase p={p} wheels={wheels} />
      </g>
      <g data-intro="dome">
        <StupaDome p={p} />
      </g>
      <g data-intro="harmika">
        <Harmika p={p} />
      </g>
      <g data-intro="spire">
        <StupaSpire p={p} />
        <StupaCanopy p={p} />
        <StupaPinnacle p={p} />
      </g>
    </svg>
  );
}
