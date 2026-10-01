import { himalaya } from '../../data/content';
import SectionHeading from './SectionHeading';
import styles from './Sections.module.css';

const base = import.meta.env.BASE_URL;

export default function HimalayaSection() {
  return (
    <section id="himalaya" className={`${styles.section} ${styles.himalaya}`} aria-labelledby="himalaya-title">
      <div className={styles.copy}>
        <SectionHeading id="himalaya" nepali={himalaya.nepali} title={himalaya.heading} headingId="himalaya-title" />
        <p className={styles.lead} data-reveal>
          {himalaya.lead}
        </p>
        <p className={`${styles.body} ${himalaya.bodyPlaceholder ? styles.placeholder : ''}`} data-reveal>
          {himalaya.body}
        </p>
      </div>

      <figure className={styles.plate} data-reveal>
        <div className={styles.plateFrame}>
          <img
            className={styles.plateImage}
            src={`${base}images/himalaya-dusk-1064.webp`}
            srcSet={`${base}images/himalaya-dusk-768.webp 768w, ${base}images/himalaya-dusk-1064.webp 1064w`}
            sizes="(max-width: 820px) 100vw, 60vw"
            width="1064"
            height="484"
            alt={himalaya.image.alt}
            loading="lazy"
            decoding="async"
            data-scrub-zoom
          />
        </div>
        <figcaption className={`${styles.caption} ${himalaya.image.captionPlaceholder ? styles.placeholder : ''}`}>
          {himalaya.image.caption}
        </figcaption>
      </figure>
    </section>
  );
}
