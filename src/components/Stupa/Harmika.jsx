import { CX, HARMIKA } from './geometry';

/*
 * The harmika: the square tower above the dome, painted on every face with
 * the eyes. Between and below them is the sign shaped like the Nepali
 * numeral one (१); above, between the brows, the small third eye.
 * The eyes look gently down and never animate.
 */

const INK = '#1d1813';

function Eye({ p, cx, cy, mirror }) {
  const s = mirror ? -1 : 1;
  const outer = cx - 22 * s;
  const inner = cx + 22 * s;
  const lid = `M${outer} ${cy} Q${cx - 4 * s} ${cy - 13} ${inner} ${cy + 2}`;
  const shape = `${lid} Q${cx} ${cy + 9} ${outer} ${cy} Z`;
  return (
    <g>
      <path d={shape} fill="#f3eee2" />
      <clipPath id={`${p}-eye-${cx}`}>
        <path d={shape} />
      </clipPath>
      <g clipPath={`url(#${p}-eye-${cx})`}>
        <circle cx={cx + 2 * s} cy={cy + 1} r="7.2" fill="#1f3a63" />
        <circle cx={cx + 2 * s} cy={cy + 1} r="3.6" fill="#0c0f16" />
      </g>
      <path d={shape} fill="none" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      {/* the heavy upper lid gives the downward gaze */}
      <path d={lid} fill="none" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
      {/* brow */}
      <path
        d={`M${outer - 4 * s} ${cy - 13} Q${cx - 2 * s} ${cy - 29} ${inner + 2 * s} ${cy - 15} Q${cx - 2 * s} ${cy - 24} ${outer - 4 * s} ${cy - 13} Z`}
        fill={INK}
      />
    </g>
  );
}

export default function Harmika({ p }) {
  const { plinth, body, band } = HARMIKA;
  const eyeY = 470;
  return (
    <g data-part="harmika">
      <rect x={plinth.x1} y={plinth.top} width={plinth.x2 - plinth.x1} height={plinth.bottom - plinth.top} fill="#d8cfbd" />
      <rect x={body.x1} y={body.top} width={body.x2 - body.x1} height={body.bottom - body.top} fill={`url(#${p}-harmika)`} />
      <rect x={body.x1} y={body.bottom - 4} width={body.x2 - body.x1} height="4" fill="#6f5530" opacity="0.6" />

      {/* sindoor-red band with a small gilded torana at its centre */}
      <rect x={band.x1} y={band.top} width={band.x2 - band.x1} height={band.bottom - band.top} fill="#8e2a22" />
      <rect x={band.x1} y={band.top} width={band.x2 - band.x1} height="3" fill={`url(#${p}-gold)`} />
      <rect x={band.x1} y={band.bottom - 3} width={band.x2 - band.x1} height="3" fill={`url(#${p}-gold)`} />
      <path
        d={`M${CX - 16} ${band.bottom - 3} V${band.top + 10} Q${CX} ${band.top + 1} ${CX + 16} ${band.top + 10} V${band.bottom - 3}`}
        fill="none"
        stroke="#e3c48f"
        strokeWidth="2"
      />

      <Eye p={p} cx={CX - 34} cy={eyeY} />
      <Eye p={p} cx={CX + 34} cy={eyeY} mirror />

      {/* third eye */}
      <circle cx={CX} cy={eyeY - 22} r="2.6" fill={INK} />
      {/* the numeral one, १ */}
      <path
        d={`M${CX - 5} ${eyeY + 8} C${CX - 5} ${eyeY + 1} ${CX + 7} ${eyeY + 1} ${CX + 6} ${eyeY + 9} C${CX + 5} ${eyeY + 15} ${CX - 3} ${eyeY + 16} ${CX - 1} ${eyeY + 22} C${CX + 1} ${eyeY + 27} ${CX + 5} ${eyeY + 29} ${CX + 3} ${eyeY + 34}`}
        fill="none"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}
