import { CX, GROUND_Y, NICHES, PLINTH, PLINTH_NICHES, TERRACES, terraceBays } from './geometry';

/*
 * The stepped mandala base and the round plinth under the dome.
 *
 * Each terrace wall is split into bays: the central bay projects toward
 * the viewer and the outer bays step back, sitting a little higher on the
 * page, which gives the zig-zag plan its depth without perspective maths.
 * Between the walls, the walkways show as thin bands of pale stone. The
 * stairs climb the middle of every terrace, one above the other.
 */

const mirror = (x) => 2 * CX - x;

function Terrace({ t, p, walkTop }) {
  const height = t.bottom - t.top;
  // outer bays first, so the nearer ones paint over them
  const bays = terraceBays(t).flatMap((b) => [
    { x: b.x1, w: b.x2 - b.x1, lift: b.lift, side: -1 },
    { x: mirror(b.x2), w: b.x2 - b.x1, lift: b.lift, side: 1 },
  ]);
  return (
    <g>
      {/* the walkway on top of this terrace, up to the foot of the next */}
      {walkTop !== undefined && (
        <rect x={t.x1 + 4} y={walkTop} width={t.x2 - t.x1 - 8} height={t.top - walkTop} fill="#8f908d" />
      )}

      {bays.map((b) => (
        <g key={`${b.x}-${b.lift}`} transform={b.lift ? `translate(0 ${-b.lift})` : undefined}>
          <rect x={b.x} y={t.top} width={b.w} height={height} fill={`url(#${p}-wall)`} />
          {/* recessed bays are a shade darker */}
          {b.lift > 0 && <rect x={b.x} y={t.top} width={b.w} height={height} fill="#2c3340" opacity={b.lift * 0.012} />}
          {/* cornice and its shadow line */}
          <rect x={b.x - 2} y={t.top} width={b.w + 4} height={t.cornice} fill="#d6d0c2" />
          <rect x={b.x - 2} y={t.top} width={b.w + 4} height="1.5" fill="#eee8db" />
          <rect x={b.x - 2} y={t.top + t.cornice} width={b.w + 4} height="2.5" fill="#5f5a50" opacity="0.5" />
          {/* footing */}
          <rect x={b.x} y={t.bottom - 4} width={b.w} height="4" fill="#8e826d" opacity="0.5" />
          {/* the shadow of the nearer bay in the inside corner */}
          {b.lift > 0 && (
            <rect x={b.side < 0 ? b.x + b.w - 6 : b.x} y={t.top + t.cornice} width="6" height={height - t.cornice} fill="#4b4a47" opacity="0.4" />
          )}
        </g>
      ))}

      {/* the stair, flanked by low walls */}
      <rect x={CX - t.stair} y={t.top - 2} width={t.stair * 2} height={height + 2} fill="#a39d90" />
      <path
        d={Array.from({ length: Math.floor(height / 5.5) }, (_, i) => `M${CX - t.stair} ${t.top + 3 + i * 5.5} H${CX + t.stair}`).join(' ')}
        stroke="#d8d2c4"
        strokeWidth="1.3"
      />
      <rect x={CX - t.stair - 8} y={t.top - 6} width="8" height={height + 6} fill="#cbc4b5" />
      <rect x={CX + t.stair} y={t.top - 6} width="8" height={height + 6} fill="#9a9384" />

      {/* cool on the far side, lamplight rising from the walkway below */}
      <rect x={t.x1 - 2} y={t.top - 8} width={t.x2 - t.x1 + 4} height={height + 8} fill={`url(#${p}-cool)`} />
      <rect x={t.x1 - 2} y={t.top - 8} width={t.x2 - t.x1 + 4} height={height + 8} fill={`url(#${p}-lamplit)`} />
    </g>
  );
}

function Plinth({ p }) {
  const { x1, x2, top, bottom, band } = PLINTH;
  const [b0, b1] = band;
  const niches = PLINTH_NICHES.map(({ x, w }) => {
    const r = Math.min(w / 2, 4);
    return `M${x.toFixed(1)} ${b1} V${b0 + r} Q${(x + w / 2).toFixed(1)} ${b0 - r * 0.6} ${(x + w).toFixed(1)} ${b0 + r} V${b1} Z`;
  });
  return (
    <g>
      <rect x={x1} y={top} width={x2 - x1} height={bottom - top} fill={`url(#${p}-wall)`} />
      <rect x={x1} y={top} width={x2 - x1} height="2" fill="#e9e2d3" />
      <path d={niches.join(' ')} fill="#2a1c10" />
      <rect x={x1} y={b1 + 1} width={x2 - x1} height="2" fill="#5f5a50" opacity="0.45" />
      {/* a drum, not a wall: dark toward both ends */}
      <rect x={x1} y={top} width={x2 - x1} height={bottom - top} fill={`url(#${p}-drum)`} />
    </g>
  );
}

export default function StupaBase({ p }) {
  const [t0, t1, t2] = TERRACES;
  return (
    <g data-part="base">
      {/* the plaza, running out of the frame, warm where the lamps reach it */}
      <rect x="-2600" y={GROUND_Y - 40} width="6800" height="1000" fill={`url(#${p}-ground)`} />
      <ellipse cx={CX} cy={GROUND_Y + 46} rx="760" ry="64" fill={`url(#${p}-pool)`} />
      <ellipse cx={CX} cy={GROUND_Y + 2} rx="680" ry="12" fill="#030407" opacity="0.6" />

      <Terrace t={t0} p={p} walkTop={t1.bottom - 8} />
      <g>
        {NICHES.map((n) => (
          <path
            key={n.x}
            d={`M${n.x} ${n.y + n.height} V${n.y + 14} Q${n.x + n.width / 2} ${n.y - 6} ${n.x + n.width} ${n.y + 14} V${n.y + n.height} Z`}
            fill="#24180d"
          />
        ))}
      </g>
      <Terrace t={t1} p={p} walkTop={t2.bottom - 8} />
      <Terrace t={t2} p={p} walkTop={PLINTH.bottom} />
      <Plinth p={p} />
    </g>
  );
}
