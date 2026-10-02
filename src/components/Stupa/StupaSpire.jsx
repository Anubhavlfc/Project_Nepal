import { CANOPY, CX, GAJUR, SPIRE } from './geometry';

/* Thirteen gilded tiers, the steps to enlightenment, each one narrower */
export const TIERS = Array.from({ length: SPIRE.tiers }, (_, i) => {
  const { tiers: n, bottom, top, widthBottom, widthTop } = SPIRE;
  const h = (bottom - top) / n;
  return {
    i,
    w: widthBottom - ((widthBottom - widthTop) * i) / (n - 1),
    y0: bottom - i * h,
    y1: bottom - (i + 1) * h,
  };
});

export function StupaSpire({ p }) {
  return (
    <g data-part="spire">
      {TIERS.map(({ i, w, y0, y1 }) => (
        <g key={i}>
          <rect x={CX - w / 2} y={y1} width={w} height={y0 - y1} fill={`url(#${p}-gold)`} />
          {/* each riser darkens toward its foot; its lip catches the sky */}
          <rect x={CX - w / 2} y={y1} width={w} height={y0 - y1} fill={`url(#${p}-riser)`} />
          <rect x={CX - w / 2 - 1} y={y1} width={w + 2} height="1.2" fill="#f1d9a3" opacity="0.5" />
        </g>
      ))}
    </g>
  );
}

/* The striped band above the skirt, stacked from the bottom up */
const BANDS = [
  ['#8b2a21', 3],
  ['#d8d2c4', 5],
  ['#1d2440', 5],
  ['#8b2a21', 3],
].reduce((stack, [color, h]) => [...stack, { color, h, y: (stack.at(-1)?.y ?? CANOPY.stripes.bottom) - h }], []);

/* The canopy: a yellow cloth skirt, the striped band, the dark metal drum
   and its gilded eave */
export function StupaCanopy({ p }) {
  const { collar, skirt, stripes, drum, eave } = CANOPY;
  const folds = 7;
  const hem = Array.from({ length: folds }, (_, i) => {
    const x = CX + skirt.widthBottom / 2 - ((i + 1) * skirt.widthBottom) / folds;
    return `Q${x + skirt.widthBottom / folds / 2} ${skirt.bottom + (i % 2 ? 3 : 1.6)} ${x} ${skirt.bottom}`;
  });
  return (
    <g data-part="canopy">
      <rect x={CX - collar.width / 2} y={collar.top} width={collar.width} height={collar.bottom - collar.top} fill={`url(#${p}-bronze)`} />

      {/* the skirt flares a little and hangs in folds */}
      <path
        d={`M${CX - skirt.widthTop / 2} ${skirt.top} H${CX + skirt.widthTop / 2} L${CX + skirt.widthBottom / 2} ${skirt.bottom} ${hem.join(' ')} Z`}
        fill="#b58a35"
      />
      <path
        d={Array.from({ length: folds - 1 }, (_, i) => {
          const k = (i + 1) / folds;
          return `M${CX - skirt.widthTop / 2 + k * skirt.widthTop} ${skirt.top + 2} L${CX - skirt.widthBottom / 2 + k * skirt.widthBottom} ${skirt.bottom - 1}`;
        }).join(' ')}
        stroke="#6f4f17"
        strokeOpacity="0.3"
        strokeWidth="1.6"
      />
      <path
        d={`M${CX - skirt.widthTop / 2} ${skirt.top} H${CX + skirt.widthTop / 2} L${CX + skirt.widthBottom / 2} ${skirt.bottom} H${CX - skirt.widthBottom / 2} Z`}
        fill={`url(#${p}-drum)`}
      />

      {BANDS.map(({ color, y, h }) => (
        <rect key={y} x={CX - stripes.width / 2} y={y} width={stripes.width} height={h} fill={color} />
      ))}
      <rect x={CX - stripes.width / 2} y={stripes.top} width={stripes.width} height={stripes.bottom - stripes.top} fill={`url(#${p}-drum)`} />

      {/* the drum, dark repoussé metal between gilded rings */}
      <rect x={CX - drum.width / 2} y={drum.top} width={drum.width} height={drum.bottom - drum.top} fill={`url(#${p}-bronze)`} />
      <path
        d={`M${CX - drum.width / 2} ${drum.top + 13} H${CX + drum.width / 2} M${CX - drum.width / 2} ${drum.bottom - 12} H${CX + drum.width / 2}`}
        stroke="#9b7a40"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <path
        d={Array.from({ length: 15 }, (_, i) => `M${CX - drum.width / 2 + 5 + i * ((drum.width - 10) / 14)} ${(drum.top + drum.bottom) / 2 + 0.5} h0.01`).join(' ')}
        stroke="#b08a48"
        strokeOpacity="0.55"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x={CX - drum.width / 2} y={drum.bottom - 4} width={drum.width} height="4" fill={`url(#${p}-gold-round)`} />
      <rect x={CX - drum.width / 2} y={drum.top} width={drum.width} height="4" fill={`url(#${p}-gold-round)`} />

      <path
        d={`M${CX - eave.width / 2} ${eave.bottom} L${CX - eave.width / 2 + 8} ${eave.top} H${CX + eave.width / 2 - 8} L${CX + eave.width / 2} ${eave.bottom} Z`}
        fill={`url(#${p}-gold-round)`}
      />
      <rect x={CX - eave.width / 2} y={eave.bottom - 1} width={eave.width} height="1.6" fill="#3a2810" opacity="0.6" />
    </g>
  );
}

/* The gajur: a dark gilt cone ribbed with struts, a vase, and the finial */
export function StupaPinnacle({ p }) {
  const { base, top } = GAJUR;
  const cone = { half: 33, top: base - 66 };
  return (
    <g data-part="pinnacle">
      <path d={`M${CX - cone.half} ${base} L${CX - 2.5} ${cone.top} H${CX + 2.5} L${CX + cone.half} ${base} Z`} fill={`url(#${p}-bronze)`} />
      <path
        d={`M${CX - cone.half} ${base} L${CX - 2.5} ${cone.top} M${CX + cone.half} ${base} L${CX + 2.5} ${cone.top} M${CX - 11} ${base} L${CX - 1} ${cone.top} M${CX + 11} ${base} L${CX + 1} ${cone.top}`}
        stroke="#a9843f"
        strokeOpacity="0.6"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* the vase and the jewel */}
      <path
        d={`M${CX - 3} ${cone.top + 2} C${CX - 9} ${cone.top - 1} ${CX - 8.5} ${cone.top - 12} ${CX - 2.4} ${cone.top - 15} L${CX - 1.6} ${top + 10} H${CX + 1.6} L${CX + 2.4} ${cone.top - 15} C${CX + 8.5} ${cone.top - 12} ${CX + 9} ${cone.top - 1} ${CX + 3} ${cone.top + 2} Z`}
        fill={`url(#${p}-gold-round)`}
      />
      <ellipse cx={CX} cy={top + 7} rx="2.6" ry="4.6" fill={`url(#${p}-gold-round)`} />
      <path d={`M${CX} ${top} V${top + 3}`} stroke="#d9b56c" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}
