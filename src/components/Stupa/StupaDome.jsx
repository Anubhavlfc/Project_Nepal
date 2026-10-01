import { DOME, domePath } from './geometry';
import styles from './Stupa.module.css';

/*
 * Meridians of the hemisphere, drawn as the saffron washes devotees throw
 * over the dome. Each one is the projection of a line of longitude, which
 * is what makes the flat shape read as round.
 */
const MERIDIANS = [-68, -44, -21, 0, 21, 44, 68];

function meridian(deg) {
  const { cx, cy, rx, ry } = DOME;
  const phi = (deg * Math.PI) / 180;
  const alpha = (58 * Math.PI) / 180; // how far down the dome the wash runs
  const x = cx + rx * Math.sin(alpha) * Math.sin(phi);
  const y = cy - ry * Math.cos(alpha);
  if (deg === 0) return `M${cx} ${cy - ry} L${cx} ${y}`;
  return `M${cx} ${cy - ry} A${rx * Math.abs(Math.sin(phi))} ${ry} 0 0 ${deg > 0 ? 1 : 0} ${x} ${y}`;
}

export default function StupaDome({ p }) {
  const { cx, cy, rx, ry } = DOME;
  return (
    <g data-part="dome">
      <path d={domePath()} fill={`url(#${p}-dome)`} />
      <g clipPath={`url(#${p}-dome-clip)`}>
        <g fill="none" stroke="#d39a3c" strokeLinecap="round" opacity="0.22">
          {MERIDIANS.map((m) => (
            <path key={m} d={meridian(m)} strokeWidth={9 - Math.abs(m) / 12} />
          ))}
        </g>
        {/* soft light that follows the pointer across the lime-wash */}
        <ellipse className={styles.domeSheen} cx={cx - 70} cy={cy - 140} rx="190" ry="120" fill={`url(#${p}-sheen)`} />
        <path d={domePath()} fill={`url(#${p}-uplight)`} />
        <path d={domePath()} fill={`url(#${p}-dusk-side)`} />
        {/* shadow cast by the harmika onto the crown */}
        <ellipse cx={cx + 10} cy={cy - ry + 10} rx="105" ry="22" fill="#5a5143" opacity="0.22" />
      </g>
      {/* cool sky light catching the rim */}
      <path
        d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`}
        fill="none"
        stroke="#b9c8de"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
    </g>
  );
}
