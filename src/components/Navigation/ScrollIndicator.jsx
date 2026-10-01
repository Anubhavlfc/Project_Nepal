import { useEffect, useState } from 'react';
import styles from './ScrollIndicator.module.css';

/* A quiet cue to scroll, gone as soon as the reader moves */
export default function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a href="#himalaya" className={`${styles.cue} ${hidden ? styles.hidden : ''}`} data-intro="ui">
      <span>Scroll to explore</span>
      <span className={styles.line} aria-hidden="true" />
    </a>
  );
}
