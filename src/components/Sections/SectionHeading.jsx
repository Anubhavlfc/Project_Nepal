import { sections } from '../../data/content';
import styles from './Sections.module.css';

/* Number, Nepali name and title, shared by every chapter after the hero */
export default function SectionHeading({ id, nepali, title, headingId }) {
  const { number } = sections.find((s) => s.id === id);
  return (
    <header className={styles.heading} data-reveal>
      <p className={styles.kicker}>
        <span className="devanagari" lang="ne" aria-hidden="true">
          {number}
        </span>
        <span className={styles.rule} aria-hidden="true" />
        {nepali && (
          <span className="devanagari" lang="ne">
            {nepali}
          </span>
        )}
      </p>
      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>
    </header>
  );
}
