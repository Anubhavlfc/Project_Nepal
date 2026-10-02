import { HARMIKA, domePath } from './geometry';

/*
 * Gradients, patterns and clips shared by the stupa parts. `p` keeps ids
 * unique per instance.
 *
 * The light: a cold evening sky above, late warm light from the west on the
 * metal, and lamplight rising from the plaza. Whitewash runs from warm ivory
 * through stone to a cool blue-grey shadow; gilding is aged and bronze-dark
 * at the edges, never flat yellow.
 */
export default function StupaDefs({ p }) {
  const { face, cloth } = HARMIKA;
  return (
    <defs>
      {/* whitewashed dome: ivory where the last light falls, cool in shadow */}
      <radialGradient id={`${p}-dome`} cx="0.3" cy="0.1" r="0.92" fx="0.3" fy="0.06">
        <stop offset="0" stopColor="#f0e7d4" />
        <stop offset="0.28" stopColor="#d8cfbe" />
        <stop offset="0.56" stopColor="#a8a399" />
        <stop offset="0.8" stopColor="#737b88" />
        <stop offset="1" stopColor="#525b6d" />
      </radialGradient>
      <linearGradient id={`${p}-cool`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0.4" stopColor="#1b2c44" stopOpacity="0" />
        <stop offset="1" stopColor="#1b2c44" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`${p}-lamplit`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0.5" stopColor="#e9b46a" stopOpacity="0" />
        <stop offset="1" stopColor="#e9b46a" stopOpacity="0.3" />
      </linearGradient>

      {/* aged gilding across a flat face: lit edge at the left, bronze at the right */}
      <linearGradient id={`${p}-gold`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#6e5126" />
        <stop offset="0.06" stopColor="#c9a35a" />
        <stop offset="0.2" stopColor="#b8914c" />
        <stop offset="0.55" stopColor="#a17c3c" />
        <stop offset="0.86" stopColor="#7a5a2b" />
        <stop offset="1" stopColor="#4f3818" />
      </linearGradient>
      {/* round gilded forms (canopy rim, finial) */}
      <linearGradient id={`${p}-gold-round`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#5b4220" />
        <stop offset="0.28" stopColor="#c9a35a" />
        <stop offset="0.42" stopColor="#e2c68b" />
        <stop offset="0.62" stopColor="#a8823f" />
        <stop offset="1" stopColor="#4a3417" />
      </linearGradient>
      <linearGradient id={`${p}-riser`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff1cc" stopOpacity="0.1" />
        <stop offset="0.5" stopColor="#3a2810" stopOpacity="0" />
        <stop offset="1" stopColor="#3a2810" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id={`${p}-bronze`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#2a1f14" />
        <stop offset="0.3" stopColor="#5a4428" />
        <stop offset="0.5" stopColor="#3c2d1b" />
        <stop offset="1" stopColor="#1c150d" />
      </linearGradient>

      {/* gilded copper plates of the harmika face */}
      <linearGradient id={`${p}-face`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#a8833f" />
        <stop offset="0.25" stopColor="#c6a05a" />
        <stop offset="0.6" stopColor="#b18b47" />
        <stop offset="1" stopColor="#7c5c2c" />
      </linearGradient>
      <pattern id={`${p}-plates`} x={face.x1} y={face.top} width="28" height="30" patternUnits="userSpaceOnUse">
        <path d="M0 0.5 H28 M0.5 0 V15 M14.5 15 V30 M0 15.5 H28" stroke="#5c4120" strokeWidth="0.7" strokeOpacity="0.16" fill="none" />
      </pattern>

      {/* the red cloth above the eyes, hanging in soft folds */}
      <linearGradient id={`${p}-fold`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#62201a" />
        <stop offset="0.35" stopColor="#82291f" />
        <stop offset="0.6" stopColor="#8f3024" />
        <stop offset="1" stopColor="#62201a" />
      </linearGradient>
      <pattern id={`${p}-pleats`} x={cloth.x1} y={cloth.top} width="17" height="40" patternUnits="userSpaceOnUse">
        <rect width="17" height="40" fill={`url(#${p}-fold)`} />
      </pattern>

      {/* whitewashed terrace walls, warmed from below by the lamps */}
      <linearGradient id={`${p}-wall`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#bdb6a8" />
        <stop offset="0.55" stopColor="#a69e8f" />
        <stop offset="1" stopColor="#b08d62" />
      </linearGradient>
      {/* round forms in elevation (the plinth, the canopy) darken at both ends */}
      <linearGradient id={`${p}-drum`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#101622" stopOpacity="0.55" />
        <stop offset="0.2" stopColor="#101622" stopOpacity="0" />
        <stop offset="0.68" stopColor="#101622" stopOpacity="0" />
        <stop offset="1" stopColor="#101622" stopOpacity="0.62" />
      </linearGradient>

      <linearGradient id={`${p}-ground`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#07080b" stopOpacity="0" />
        <stop offset="0.06" stopColor="#0b0b0d" />
        <stop offset="0.5" stopColor="#060709" />
        <stop offset="1" stopColor="#030407" />
      </linearGradient>
      <radialGradient id={`${p}-pool`}>
        <stop offset="0" stopColor="#e9ac5c" stopOpacity="0.14" />
        <stop offset="1" stopColor="#e9ac5c" stopOpacity="0" />
      </radialGradient>

      <clipPath id={`${p}-dome-clip`}>
        <path d={domePath()} />
      </clipPath>
    </defs>
  );
}
