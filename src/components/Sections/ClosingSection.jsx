import { closing } from '../../data/content';
import { createRandom } from '../../lib/random';
import StarField from '../Atmosphere/StarField';
import SectionHeading from './SectionHeading';
import styles from './Sections.module.css';

/*
 * The line of the range, drawn from ridged noise so the peaks come to
 * points while the shoulders stay soft. Generated once at import.
 */
function rangePath() {
  const random = createRandom(31);
  const octaves = [
    [2.2, 70],
    [5.3, 34],
    [11.7, 12],
    [27, 4],
  ].map(([f, a]) => ({ f, a, phase: random() * Math.PI * 2 }));
  const points = [];
  for (let x = 0; x <= 1600; x += 8) {
    const t = x / 1600;
    const lift = octaves.reduce((sum, o) => sum + o.a * Math.pow(1 - Math.abs(Math.sin(t * Math.PI * o.f + o.phase)), 2), 0);
    // highest toward the centre, falling away to the edges
    const envelope = 0.55 + 0.45 * Math.sin(t * Math.PI);
    points.push(`${x} ${(220 - lift * envelope).toFixed(1)}`);
  }
  return `M0 240 L${points.join(' L')} L1600 240 Z`;
}

const RANGE = rangePath();

/* The last light: a night sky, the line of the range, the name. */
export default function ClosingSection() {
  return (
    <section id="nepal" className={`${styles.section} ${styles.closing}`} aria-labelledby="nepal-title">
      <div className={styles.closingSky} aria-hidden="true">
        <StarField seed={19} />
      </div>

      <div className={styles.closingInner}>
        <p className={`${styles.closingNepali} devanagari`} lang="ne" data-reveal>
          {closing.nepali}
        </p>
        <SectionHeading id="nepal" title={closing.heading} headingId="nepal-title" />
        <p className={styles.lead} data-reveal>
          {closing.lead}
        </p>
      </div>

      <svg className={styles.range} viewBox="0 0 1600 240" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="range-light" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d9b46a" stopOpacity="0.7" />
            <stop offset="0.18" stopColor="#24395a" />
            <stop offset="0.6" stopColor="#0e1a2c" />
            <stop offset="1" stopColor="#070b14" />
          </linearGradient>
        </defs>
        <path d={RANGE} fill="url(#range-light)" />
      </svg>

      <footer className={styles.footer}>
        <span className={styles.ornament} aria-hidden="true" />
        {closing.credits.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </footer>
    </section>
  );
}
