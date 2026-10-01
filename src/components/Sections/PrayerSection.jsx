import { prayer } from '../../data/content';
import PrayerFlags from '../PrayerFlags/PrayerFlags';
import PrayerWheelRow from '../PrayerWheels/PrayerWheelRow';
import SectionHeading from './SectionHeading';
import styles from './Sections.module.css';

/* One long line of flags slung across the width of the page */
const STRANDS = [
  {
    from: { x: -40, y: 40 },
    to: { x: 1640, y: 60 },
    sag: 150,
    width: 30,
    height: 36,
    gap: 6,
    grow: [1, 1],
    seed: 41,
    sway: 10,
  },
];
const VIEWBOX = [0, 0, 1600, 220];

export default function PrayerSection() {
  return (
    <section id="prayer" className={`${styles.section} ${styles.prayer}`} aria-labelledby="prayer-title">
      <div className={styles.flagLine} data-reveal>
        <PrayerFlags strands={STRANDS} viewBox={VIEWBOX} fit="slice" />
      </div>

      <div className={`${styles.copy} ${styles.centered}`}>
        <SectionHeading id="prayer" title={prayer.heading} headingId="prayer-title" />
        <p className={styles.lead} data-reveal>
          {prayer.lead}
        </p>
      </div>

      <div data-reveal>
        <PrayerWheelRow count={5} />
      </div>

      <div className={`${styles.copy} ${styles.centered}`}>
        <p className={styles.mantra} data-reveal>
          <span className={styles.mantraTibetan} lang="bo">
            {prayer.mantra}
          </span>
          <span className={styles.mantraLatin}>{prayer.mantraLatin}</span>
        </p>
        <p className={styles.body} data-reveal>
          {prayer.body}
        </p>
      </div>
    </section>
  );
}
