import useAmbientSound from '../../hooks/useAmbientSound';
import styles from './Navigation.module.css';

export default function SoundToggle() {
  const { enabled, toggle } = useAmbientSound();
  return (
    <button type="button" className={styles.sound} aria-pressed={enabled} onClick={toggle}>
      <span>Sound</span>
      <span className={`${styles.soundDot} ${enabled ? styles.soundOn : ''}`} aria-hidden="true" />
      <span className="visually-hidden">{enabled ? 'on' : 'off'}</span>
    </button>
  );
}
