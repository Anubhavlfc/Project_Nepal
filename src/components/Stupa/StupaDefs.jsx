import { domePath } from './geometry';
import { PrayerWheelDefs } from '../PrayerWheels/PrayerWheel';

/** Gradients and clips shared by the stupa parts. `p` keeps ids unique per instance. */
export default function StupaDefs({ p }) {
  return (
    <defs>
      {/* lime-washed dome lit from the upper left, darkening toward the base */}
      <radialGradient id={`${p}-dome`} cx="0.36" cy="0.18" r="0.95">
        <stop offset="0" stopColor="#efe8d9" />
        <stop offset="0.4" stopColor="#d6ccb8" />
        <stop offset="0.75" stopColor="#a49c8c" />
        <stop offset="1" stopColor="#6f6c6a" />
      </radialGradient>
      <linearGradient id={`${p}-uplight`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0.55" stopColor="#f2c879" stopOpacity="0" />
        <stop offset="1" stopColor="#f2c879" stopOpacity="0.32" />
      </linearGradient>
      <linearGradient id={`${p}-dusk-side`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0.45" stopColor="#1b3350" stopOpacity="0" />
        <stop offset="1" stopColor="#1b3350" stopOpacity="0.55" />
      </linearGradient>
      <radialGradient id={`${p}-sheen`}>
        <stop offset="0" stopColor="#fffaf0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
      </radialGradient>

      {/* gilding, as if each tier were a lit cylinder */}
      <linearGradient id={`${p}-gold`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#5a3f1d" />
        <stop offset="0.24" stopColor="#b48a45" />
        <stop offset="0.4" stopColor="#efd59c" />
        <stop offset="0.58" stopColor="#c49a52" />
        <stop offset="0.85" stopColor="#7a5a2a" />
        <stop offset="1" stopColor="#4a3317" />
      </linearGradient>
      <linearGradient id={`${p}-harmika`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#a9884f" />
        <stop offset="0.35" stopColor="#dcc08a" />
        <stop offset="0.7" stopColor="#c8a76a" />
        <stop offset="1" stopColor="#8d6d3a" />
      </linearGradient>

      {/* terrace walls: pale stone with warm light rising from the lamps */}
      <linearGradient id={`${p}-wall`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#b3ada1" />
        <stop offset="0.55" stopColor="#9c9586" />
        <stop offset="1" stopColor="#c8a676" />
      </linearGradient>
      <linearGradient id={`${p}-walk`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#6f6a62" />
        <stop offset="1" stopColor="#c4bba9" />
      </linearGradient>

      <clipPath id={`${p}-dome-clip`}>
        <path d={domePath()} />
      </clipPath>

      <PrayerWheelDefs prefix={`${p}-wheel`} />
    </defs>
  );
}

