import { CANOPY, CX, SPIRE } from './geometry';

/* Thirteen gilded tiers, each a little narrower than the one below */
function tiers() {
  const { tiers: n, bottom, tierHeight, widthBottom, widthTop } = SPIRE;
  return Array.from({ length: n }, (_, i) => {
    const w0 = widthBottom - ((widthBottom - widthTop) * i) / n;
    const w1 = widthBottom - ((widthBottom - widthTop) * (i + 1)) / n;
    const y0 = bottom - i * tierHeight;
    const y1 = y0 - tierHeight;
    return { i, w0, w1, y0, y1 };
  });
}

export function StupaSpire({ p }) {
  return (
    <g data-part="spire">
      {tiers().map(({ i, w0, w1, y0, y1 }) => (
        <g key={i}>
          {/* each tier: a sloped face, then a thin ledge */}
          <path
            d={`M${CX - w0 / 2} ${y0} L${CX - w1 / 2 - 3} ${y1 + 3} L${CX + w1 / 2 + 3} ${y1 + 3} L${CX + w0 / 2} ${y0} Z`}
            fill={`url(#${p}-gold)`}
          />
          <rect x={CX - w1 / 2 - 4} y={y1 + 1} width={w1 + 8} height="3" fill="#f0d9a4" opacity="0.75" />
          <rect x={CX - w0 / 2} y={y0 - 1.5} width={w0} height="1.5" fill="#3d2a12" opacity="0.5" />
        </g>
      ))}
    </g>
  );
}

/* The canopy over the spire, with its cloth skirt */
export function StupaCanopy({ p }) {
  const { brim, top, x1, x2 } = CANOPY;
  const stripes = ['#8e2a22', '#e6e0d1', '#2f5d9a', '#d2a83c'];
  return (
    <g data-part="pinnacle">
      {stripes.map((color, i) => (
        <rect key={color} x={x1 + 12} y={brim + i * 4} width={x2 - x1 - 24} height="4" fill={color} opacity="0.92" />
      ))}
      <path d={`M${x1} ${brim} Q${x1 + 4} ${top + 8} ${CX} ${top} Q${x2 - 4} ${top + 8} ${x2} ${brim} Z`} fill={`url(#${p}-gold)`} />
      <path d={`M${x1} ${brim} H${x2}`} stroke="#f0d9a4" strokeWidth="2" opacity="0.8" />
    </g>
  );
}

/* The pinnacle: vase, crown and finial */
export function StupaPinnacle({ p }) {
  return (
    <g data-part="pinnacle">
      <rect x={CX - 8} y="164" width="16" height="16" fill={`url(#${p}-gold)`} />
      <ellipse cx={CX} cy="154" rx="15" ry="13" fill={`url(#${p}-gold)`} />
      <rect x={CX - 12} y="138" width="24" height="5" rx="2" fill={`url(#${p}-gold)`} />
      <path d={`M${CX - 19} 136 Q${CX} 120 ${CX + 19} 136 Z`} fill={`url(#${p}-gold)`} />
      <path d={`M${CX - 4} 126 L${CX} 76 L${CX + 4} 126 Z`} fill={`url(#${p}-gold)`} />
      <circle cx={CX} cy="74" r="3.5" fill="#efd59c" />
    </g>
  );
}
