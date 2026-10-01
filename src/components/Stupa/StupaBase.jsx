import { CX, DRUM, GROUND_Y, NICHES, TERRACES } from './geometry';
import PrayerWheel, { WHEEL_BOX } from '../PrayerWheels/PrayerWheel';

/*
 * The stepped mandala base. Each terrace is drawn as a front wall split into
 * bays: the central bay projects toward the viewer, the outer bays step back
 * and so sit a little higher on the page, which gives the zig-zag plan its
 * depth without any perspective maths.
 */

const RECESS = [0, 4, 8]; // vertical lift of each bay as it steps back

function bays({ x1, returns }) {
  const left = [x1, ...returns]; // outermost → innermost
  const mirror = (x) => 2 * CX - x;
  const result = [];
  // outer bays first so the nearer ones paint over them
  for (let i = 0; i < left.length; i += 1) {
    const from = left[i];
    const to = i + 1 < left.length ? left[i + 1] : CX;
    const depth = RECESS[left.length - 1 - i] ?? RECESS[RECESS.length - 1];
    result.push({ x: from, w: to - from, depth });
    result.push({ x: mirror(to), w: to - from, depth });
  }
  return result.sort((a, b) => b.depth - a.depth);
}

/* How far the bay containing `x` steps back */
function depthAt(t, x) {
  const d = Math.abs(x - CX);
  const inner = t.returns.map((r) => CX - r).sort((a, b) => a - b);
  const index = inner.findIndex((r) => d < r);
  return RECESS[index === -1 ? inner.length : index];
}

function Terrace({ t, p, index }) {
  const height = t.bottom - t.top;
  const shade = 1 - index * 0.04;
  return (
    <g>
      {/* walkway on top of the wall */}
      <path
        d={`M${t.x1 + 22} ${t.top - t.walk} L${t.x2 - 22} ${t.top - t.walk} L${t.x2} ${t.top} L${t.x1} ${t.top} Z`}
        fill={`url(#${p}-walk)`}
      />
      {bays(t).map((b) => (
        <g key={`${b.x}-${b.depth}`} transform={`translate(0 ${-b.depth})`}>
          <rect x={b.x} y={t.top} width={b.w} height={height} fill={`url(#${p}-wall)`} opacity={shade - b.depth * 0.012} />
          {/* cornice */}
          <rect x={b.x - 2} y={t.top - 2} width={b.w + 4} height="7" fill="#d3cbbb" />
          <rect x={b.x - 2} y={t.top + 5} width={b.w + 4} height="2" fill="#8f8673" opacity="0.55" />
          {/* return face where this bay steps back */}
          {b.depth > 0 && (
            <rect
              x={b.x < CX ? b.x + b.w - 5 : b.x}
              y={t.top}
              width="5"
              height={height}
              fill="#7d7462"
              opacity="0.55"
            />
          )}
        </g>
      ))}
      {/* central stair */}
      <g>
        <rect x={CX - t.stair} y={t.top - t.walk} width={t.stair * 2} height={height + t.walk} fill="#a8a092" />
        {Array.from({ length: Math.floor((height + t.walk) / 6) }, (_, i) => (
          <line
            key={i}
            x1={CX - t.stair}
            x2={CX + t.stair}
            y1={t.top - t.walk + 4 + i * 6}
            y2={t.top - t.walk + 4 + i * 6}
            stroke="#8f8673"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
        ))}
        <rect x={CX - t.stair - 6} y={t.top - t.walk - 2} width="6" height={height + t.walk + 2} fill="#c9c1b1" />
        <rect x={CX + t.stair} y={t.top - t.walk - 2} width="6" height={height + t.walk + 2} fill="#7b7466" />
      </g>
      {/* warm light washing up the wall, cool dusk on the far side */}
      <rect x={t.x1} y={t.top - t.walk} width={t.x2 - t.x1} height={height + t.walk} fill={`url(#${p}-uplight)`} />
      <rect x={t.x1} y={t.top - t.walk} width={t.x2 - t.x1} height={height + t.walk} fill={`url(#${p}-dusk-side)`} />
    </g>
  );
}

export default function StupaBase({ p, wheels = true }) {
  const scale = NICHES[0].width / WHEEL_BOX.width;
  return (
    <g data-part="base">
      {/* contact shadow and the lit plaza */}
      <ellipse cx={CX} cy={GROUND_Y + 4} rx="660" ry="16" fill="#05080f" opacity="0.55" />

      {[...TERRACES].map((t, i) => (
        <Terrace key={t.top} t={t} p={p} index={i} />
      ))}

      {/* niches and prayer wheels set into the lowest wall */}
      <g>
        {NICHES.map((n) => (
          <g key={n.x} transform={`translate(0 ${-depthAt(TERRACES[0], n.x + n.width / 2)})`}>
            <path
              d={`M${n.x} ${n.y + n.height} V${n.y + 12} Q${n.x + n.width / 2} ${n.y - 4} ${n.x + n.width} ${n.y + 12} V${n.y + n.height} Z`}
              fill="#241a10"
            />
            {wheels && (
              <PrayerWheel
                prefix={`${p}-wheel`}
                transform={`translate(${n.x + 3} ${n.y + 2}) scale(${scale * 0.87})`}
                style={{ '--turn-duration': `${4.5 + (n.x % 5) * 0.4}s` }}
              />
            )}
          </g>
        ))}
      </g>

      {/* drum rings the dome rests on */}
      {DRUM.map((d) => (
        <g key={d.top}>
          <rect x={d.x1} y={d.top} width={d.x2 - d.x1} height={d.bottom - d.top} fill={`url(#${p}-wall)`} />
          <rect x={d.x1} y={d.top} width={d.x2 - d.x1} height="2" fill="#d8d0c0" />
          <rect x={d.x1} y={d.top} width={d.x2 - d.x1} height={d.bottom - d.top} fill={`url(#${p}-dusk-side)`} />
        </g>
      ))}

    </g>
  );
}
