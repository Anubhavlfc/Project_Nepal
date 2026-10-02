import SoundToggle from './SoundToggle';
import styles from './Navigation.module.css';

/* Three quiet words in the top corner: the way home, sound, and about */
export default function Navigation() {
  return (
    <nav className={styles.bar} aria-label="Site">
      <a href="#boudhanath" className={styles.mark} aria-label="नेपाल, Nepal: back to the beginning">
        <span className="devanagari" lang="ne">
          नेपाल
        </span>
      </a>
      <SoundToggle />
      <a href="#about" className={styles.link}>
        About
      </a>
    </nav>
  );
}
