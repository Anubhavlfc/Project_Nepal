import styles from './Atmosphere.module.css';

/* Slow banks of haze drifting between the far peaks and the valley rim */
export default function Mist({ className = '' }) {
  return (
    <div className={`${styles.mist} ${className}`} aria-hidden="true">
      <div className={styles.mistBankFar} />
      <div className={styles.mistBankNear} />
    </div>
  );
}
