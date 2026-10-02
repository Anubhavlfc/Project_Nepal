import { CANOPY, CX, GAJUR, HARMIKA, PLINTH, TERRACES, domePath } from './geometry';
import { TIERS } from './StupaSpire';

/*
 * Silhouettes of each part in the colour of the night, laid over the
 * drawing. They stay invisible unless the intro is playing: it opens on the
 * stupa as a dark shape against the sky and lifts them one by one, so the
 * light seems to find the architecture rather than build it.
 */

const NIGHT = '#06090f';

const box = (x1, y1, x2, y2) => `M${x1} ${y1} H${x2} V${y2} H${x1} Z`;
const centred = (w, y1, y2) => box(CX - w / 2, y1, CX + w / 2, y2);
const trapezoid = (wTop, wBottom, y1, y2) =>
  `M${CX - wTop / 2} ${y1} H${CX + wTop / 2} L${CX + wBottom / 2} ${y2} H${CX - wBottom / 2} Z`;

const BASE = [...TERRACES.map((t) => box(t.x1 - 2, t.top - 10, t.x2 + 2, t.bottom)), box(PLINTH.x1, PLINTH.top, PLINTH.x2, PLINTH.bottom)].join(' ');

const { plinth, cloth, trim } = HARMIKA;
const HARMIKA_SHAPE = [box(cloth.x1, trim.top, cloth.x2, cloth.bottom + 4), box(plinth.x1, cloth.bottom, plinth.x2, plinth.bottom)].join(' ');

const { collar, skirt, stripes, drum, eave } = CANOPY;
const CANOPY_SHAPE = [
  trapezoid(eave.width - 16, eave.width, eave.top, eave.bottom),
  centred(drum.width, eave.bottom - 1, drum.bottom),
  centred(stripes.width, stripes.top - 1, stripes.bottom),
  trapezoid(skirt.widthTop, skirt.widthBottom, skirt.top - 1, skirt.bottom + 3),
  centred(collar.width, collar.top - 1, collar.bottom + 1),
].join(' ');

const { base, top } = GAJUR;
const PINNACLE = `M${CX - 33} ${base} L${CX - 3} ${base - 66} L${CX - 9} ${base - 65} L${CX - 3} ${base - 82} L${CX - 3} ${top} H${CX + 3} L${CX + 3} ${base - 82} L${CX + 9} ${base - 65} L${CX + 3} ${base - 66} L${CX + 33} ${base} Z`;

export default function StupaShades() {
  return (
    <g fill={NIGHT} stroke={NIGHT} strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path data-shade="base" d={BASE} />
      <path data-shade="dome" d={domePath()} />
      <path data-shade="harmika" d={HARMIKA_SHAPE} />
      {TIERS.map((t) => (
        <path key={t.i} data-shade="tier" d={box(CX - t.w / 2 - 2, t.y1 - 0.5, CX + t.w / 2 + 2, t.y0 + 0.5)} />
      ))}
      <path data-shade="canopy" d={CANOPY_SHAPE} />
      <path data-shade="pinnacle" d={PINNACLE} />
    </g>
  );
}
