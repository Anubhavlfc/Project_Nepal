import styles from './Atmosphere.module.css';

/*
 * One slow haze between the mountains and the stupa: the evening air of
 * the valley, which pushes the range back. It drifts across over a minute
 * or so and stays still under reduced motion.
 */
export default function Haze({ className = '', ...rest }) {
  return (
    <div className={`${styles.haze} ${className}`} aria-hidden="true" {...rest}>
      <div className={styles.band} />
    </div>
  );
}
