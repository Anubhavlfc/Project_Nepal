import { about } from '../../data/content';
import styles from './About.module.css';

/* A short colophon after the journey: what this is, and who made what */
export default function About() {
  return (
    <footer id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.heading}>
        {about.heading}
      </h2>
      <p className={styles.text}>{about.text}</p>
      <ul className={styles.credits}>
        {about.credits.map(({ text, placeholder }) => (
          <li key={text} className={placeholder ? styles.placeholder : undefined}>
            {text}
          </li>
        ))}
      </ul>
    </footer>
  );
}
