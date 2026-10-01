import { useState } from 'react';
import { boudhanath } from '../../data/content';
import Stupa from '../Stupa/Stupa';
import SectionHeading from './SectionHeading';
import styles from './Sections.module.css';

/*
 * An architectural reading of the stupa: choosing a part brings it forward
 * on the drawing and dims the rest.
 */
export default function BoudhanathSection() {
  const [focus, setFocus] = useState(null);

  return (
    <section id="boudhanath" className={`${styles.section} ${styles.boudhanath}`} aria-labelledby="boudhanath-title">
      <div className={styles.studyDrawing} data-reveal>
        <Stupa
          viewBox="200 40 1200 940"
          focus={focus}
          title="Elevation drawing of Boudhanath Stupa; its parts are described in the list beside it"
        />
      </div>

      <div className={styles.studyText}>
        <SectionHeading
          id="boudhanath"
          nepali={boudhanath.nepali}
          title={boudhanath.heading}
          headingId="boudhanath-title"
        />
        <p className={styles.lead} data-reveal>
          {boudhanath.lead}
        </p>
        <p className={styles.note} data-reveal>
          {boudhanath.note}
        </p>

        <div className={styles.parts} onMouseLeave={() => setFocus(null)}>
          <p className={styles.prompt} data-reveal>
            {boudhanath.prompt}
          </p>
          <ol className={styles.partList}>
            {boudhanath.parts.map((part) => (
              <li key={part.id} data-reveal>
                <button
                  type="button"
                  className={`${styles.part} ${focus === part.id ? styles.partActive : ''}`}
                  aria-pressed={focus === part.id}
                  onMouseEnter={() => setFocus(part.id)}
                  onFocus={() => setFocus(part.id)}
                  onBlur={() => setFocus(null)}
                  onClick={() => setFocus((f) => (f === part.id ? null : part.id))}
                >
                  <span className={styles.partName}>{part.name}</span>
                  <span className={styles.partText}>{part.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
