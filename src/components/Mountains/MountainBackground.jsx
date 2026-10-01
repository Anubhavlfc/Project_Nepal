import styles from './Mountains.module.css';

const base = import.meta.env.BASE_URL;

/*
 * The Himalaya photograph. It is graded only lightly: the top dissolves into
 * the painted sky, and a blue dusk shadow climbs its lower slopes so the
 * peaks keep the last warm light.
 */
export default function MountainBackground({ className = '' }) {
  return (
    <div className={`${styles.mountains} ${className}`}>
      <img
        className={styles.photo}
        src={`${base}images/himalaya-dusk-1064.webp`}
        srcSet={`${base}images/himalaya-dusk-768.webp 768w, ${base}images/himalaya-dusk-1064.webp 1064w`}
        sizes="100vw"
        width="1064"
        height="484"
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      <div className={styles.dusk} />
    </div>
  );
}
