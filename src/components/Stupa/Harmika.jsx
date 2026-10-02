import { CX, HARMIKA } from './geometry';

/*
 * The harmika: the gilded tower above the dome, with the eyes painted on
 * every face, right under the red cloth. Between the eyes is the sign shaped
 * like the Nepali numeral one (१), white with a dark outline; above, the
 * brows meet over it in a shallow V. The eyes look gently down and never
 * move.
 */

const INK = '#17120d';
const EYE_Y = 611;
const EYE_SPAN = 39; // from the centre line to the centre of each eye

/* One eye, drawn for the left side and mirrored for the right */
function Eye({ p, side }) {
  const s = side; // -1 left, 1 right
  const cx = CX + s * EYE_SPAN;
  const inner = { x: cx - s * 21, y: EYE_Y + 3 };
  const outer = { x: cx + s * 25, y: EYE_Y - 1 };
  // a heavy, lowered upper lid and an iris resting on the lower lid: the
  // half-closed eyes look down on the people below
  const upper = `M${inner.x} ${inner.y} C${cx - s * 8} ${EYE_Y - 8.5} ${cx + s * 12} ${EYE_Y - 8.5} ${outer.x} ${outer.y}`;
  const lower = `C${cx + s * 12} ${EYE_Y + 9.5} ${cx - s * 9} ${EYE_Y + 9.5} ${inner.x} ${inner.y}`;
  const shape = `${upper} ${lower} Z`;
  const clip = `${p}-eye${s < 0 ? 'l' : 'r'}`;
  const iris = { x: cx - s * 0.5, y: EYE_Y + 1.5 };
  return (
    <g>
      <clipPath id={clip}>
        <path d={shape} />
      </clipPath>
      <path d={shape} fill="#f2eee4" />
      <g clipPath={`url(#${clip})`}>
        <circle cx={iris.x} cy={iris.y} r="7.6" fill="#2b4a7e" />
        <circle cx={iris.x} cy={iris.y} r="7.6" fill="none" stroke="#14213d" strokeWidth="1.3" />
        <circle cx={iris.x} cy={iris.y} r="3.6" fill="#0a0c11" />
        {/* the lid's shadow on the eye */}
        <path d={upper} fill="none" stroke="#2a2118" strokeOpacity="0.2" strokeWidth="7" transform="translate(0 2)" />
      </g>
      <path d={`M${outer.x} ${outer.y} ${lower}`} fill="none" stroke={INK} strokeWidth="1.1" />
      <path
        d={`${upper} L${outer.x + s * 4} ${outer.y - 1.6}`}
        fill="none"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the brow rises from the V over the nose, arches over the eye and
          thins out past its outer corner */}
      <path
        d={`M${CX + s * 1} ${EYE_Y - 10}
            C${CX + s * 15} ${EYE_Y - 18} ${cx + s * 2} ${EYE_Y - 22.5} ${outer.x + s * 8} ${EYE_Y - 12}
            C${cx + s * 3} ${EYE_Y - 18.5} ${CX + s * 15} ${EYE_Y - 14} ${CX + s * 1} ${EYE_Y - 10} Z`}
        fill={INK}
      />
    </g>
  );
}

/* The numeral one: a white drop with a hooked head */
function Nose() {
  const y = EYE_Y - 7;
  const d = `M${CX - 0.5} ${y}
    C${CX + 5.5} ${y - 0.5} ${CX + 7} ${y + 6.5} ${CX + 3.6} ${y + 11.5}
    C${CX + 1.6} ${y + 15} ${CX + 2.4} ${y + 22} ${CX + 0.2} ${y + 31}
    C${CX - 1.6} ${y + 23} ${CX - 2.2} ${y + 16} ${CX - 3.4} ${y + 12}
    C${CX - 6.2} ${y + 7.5} ${CX - 5.6} ${y + 0.4} ${CX - 0.5} ${y} Z`;
  return (
    <g>
      <path d={d} fill="#f1ede3" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      <path
        d={`M${CX - 2.4} ${y + 8.6} C${CX - 3.2} ${y + 4.4} ${CX + 2.8} ${y + 3.2} ${CX + 2.6} ${y + 7}`}
        fill="none"
        stroke={INK}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

export default function Harmika({ p }) {
  const { plinth, face, cloth, trim } = HARMIKA;
  const fw = face.x2 - face.x1;
  const cw = cloth.x2 - cloth.x1;
  return (
    <g data-part="harmika">
      {/* the whitewashed plinth where the tower meets the crown */}
      <rect x={plinth.x1} y={plinth.top} width={plinth.x2 - plinth.x1} height={plinth.bottom - plinth.top} fill="#d3cdbf" />
      <rect x={plinth.x1} y={plinth.bottom - 5} width={plinth.x2 - plinth.x1} height="5" fill="#8d877b" opacity="0.5" />
      <rect x={plinth.x1} y={plinth.top} width={plinth.x2 - plinth.x1} height={plinth.bottom - plinth.top} fill={`url(#${p}-cool)`} />

      {/* the gilded face and its copper plates */}
      <rect x={face.x1} y={face.top} width={fw} height={face.bottom - face.top} fill={`url(#${p}-face)`} />
      <rect x={face.x1} y={face.top} width={fw} height={face.bottom - face.top} fill={`url(#${p}-plates)`} />
      <rect x={face.x1} y={face.bottom - 5} width={fw} height="5" fill="#4d3818" opacity="0.35" />
      <rect x={face.x1} y={face.top} width="2" height={face.bottom - face.top} fill="#e8cd92" opacity="0.55" />
      <rect x={face.x2 - 3} y={face.top} width="3" height={face.bottom - face.top} fill="#3e2c13" opacity="0.4" />

      <Eye p={p} side={-1} />
      <Eye p={p} side={1} />
      <Nose />

      {/* the red cloth hanging over the top of the face, in soft folds */}
      <path
        d={`M${cloth.x1} ${cloth.top} H${cloth.x2} V${cloth.bottom - 1}
            ${Array.from({ length: 12 }, (_, i) => {
              const x = cloth.x2 - ((i + 1) * cw) / 12;
              return `Q${x + cw / 24} ${cloth.bottom + (i % 3 === 1 ? 2.6 : 1.4)} ${x} ${cloth.bottom - 1}`;
            }).join(' ')} Z`}
        fill={`url(#${p}-pleats)`}
      />
      <rect x={cloth.x1} y={cloth.top} width={cw} height="6" fill="#2f0c08" opacity="0.4" />
      <rect x={cloth.x1} y={cloth.top} width={cw} height={cloth.bottom - cloth.top + 1} fill={`url(#${p}-drum)`} />

      {/* yellow trim between navy lines */}
      <rect x={trim.x1} y={trim.top} width={trim.x2 - trim.x1} height={trim.bottom - trim.top} fill="#1c2340" />
      <rect x={trim.x1} y={trim.top + 3} width={trim.x2 - trim.x1} height={trim.bottom - trim.top - 6} fill="#b38a3b" />
      <rect x={trim.x1} y={trim.top + 3} width={trim.x2 - trim.x1} height="1.2" fill="#e5c788" opacity="0.5" />
      <rect x={trim.x1} y={trim.top} width={trim.x2 - trim.x1} height={trim.bottom - trim.top} fill={`url(#${p}-drum)`} />
    </g>
  );
}
