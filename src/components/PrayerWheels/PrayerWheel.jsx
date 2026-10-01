import { forwardRef } from 'react';
import { prayer } from '../../data/content';
import styles from './PrayerWheel.module.css';

/*
 * A single prayer wheel, drawn in a 100×160 local box.
 * The engraved mantra sits on a strip that slides right-to-left inside a
 * clip: seen from the front, that is the surface of a cylinder turning
 * clockwise when viewed from above, the direction wheels are turned.
 */

export const WHEEL_BOX = { width: 100, height: 160 };
/* Distance after which the engraved strip repeats seamlessly */
export const STRIP_PERIOD = 124;

const PETALS = Array.from({ length: 9 }, (_, i) => 14 + i * 8);

export function PrayerWheelDefs({ prefix }) {
  return (
    <>
      <linearGradient id={`${prefix}-bronze`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#3b2614" />
        <stop offset="0.28" stopColor="#8a5c32" />
        <stop offset="0.42" stopColor="#c08a52" />
        <stop offset="0.58" stopColor="#8a5c32" />
        <stop offset="1" stopColor="#2e1d10" />
      </linearGradient>
      <linearGradient id={`${prefix}-gold`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#5e4220" />
        <stop offset="0.35" stopColor="#c49a52" />
        <stop offset="0.45" stopColor="#ecd29a" />
        <stop offset="0.65" stopColor="#a47c3e" />
        <stop offset="1" stopColor="#4a3318" />
      </linearGradient>
      <linearGradient id={`${prefix}-curve`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#120b05" stopOpacity="0.85" />
        <stop offset="0.22" stopColor="#120b05" stopOpacity="0.15" />
        <stop offset="0.45" stopColor="#fff2d6" stopOpacity="0.08" />
        <stop offset="0.78" stopColor="#120b05" stopOpacity="0.2" />
        <stop offset="1" stopColor="#120b05" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id={`${prefix}-warm`} cx="0.42" cy="0.45" r="0.7">
        <stop offset="0" stopColor="#ffd890" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ffd890" stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${prefix}-band`}>
        <rect x="14" y="56" width="72" height="58" />
      </clipPath>
    </>
  );
}

const PrayerWheel = forwardRef(function PrayerWheel(
  { prefix, transform, mode = 'hover', active = false, ...rest },
  stripRef,
) {
  return (
    <g
      className={`${styles.wheel} ${mode === 'hover' ? styles.hover : ''} ${active ? styles.active : ''}`}
      transform={transform}
      {...rest}
    >
      {/* axle and finial */}
      <rect x="47" y="0" width="6" height="16" fill="#3a2716" />
      <ellipse cx="50" cy="16" rx="6" ry="3" fill={`url(#${prefix}-gold)`} />

      {/* cap */}
      <path d="M14 34 Q50 10 86 34 Z" fill={`url(#${prefix}-gold)`} />
      <rect x="10" y="33" width="80" height="9" rx="2" fill={`url(#${prefix}-gold)`} />

      {/* body */}
      <rect x="14" y="42" width="72" height="86" fill={`url(#${prefix}-bronze)`} />

      {/* lotus petals along the upper rim, brought forward on hover */}
      <g className={styles.ornament} fill="none" stroke="#e8c98a" strokeWidth="1">
        {PETALS.map((x) => (
          <path key={x} d={`M${x} 52 Q${x + 4} 43 ${x + 8} 52`} />
        ))}
      </g>

      {/* engraved band */}
      <rect x="14" y="56" width="72" height="58" fill="#2a1a0d" opacity="0.45" />
      <g clipPath={`url(#${prefix}-band)`}>
        <g ref={stripRef} className={styles.strip}>
          {[0, 1, 2].map((i) => (
            <text
              key={i}
              x={14 + i * STRIP_PERIOD}
              y="94"
              textLength="112"
              lengthAdjust="spacingAndGlyphs"
              className={styles.mantra}
            >
              {prayer.mantra}
            </text>
          ))}
        </g>
      </g>
      <line x1="14" x2="86" y1="56" y2="56" stroke="#d9b46a" strokeWidth="1.2" />
      <line x1="14" x2="86" y1="114" y2="114" stroke="#d9b46a" strokeWidth="1.2" />

      {/* cylinder shading and the warm light that gathers on hover */}
      <rect x="14" y="42" width="72" height="86" fill={`url(#${prefix}-curve)`} />
      <rect className={styles.glow} x="10" y="30" width="80" height="106" fill={`url(#${prefix}-warm)`} />

      {/* foot */}
      <rect x="10" y="127" width="80" height="9" rx="2" fill={`url(#${prefix}-gold)`} />
      <rect x="47" y="136" width="6" height="24" fill="#3a2716" />
    </g>
  );
});

export default PrayerWheel;
