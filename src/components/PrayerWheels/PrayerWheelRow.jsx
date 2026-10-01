import { useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PrayerWheel, { PrayerWheelDefs, STRIP_PERIOD, WHEEL_BOX } from './PrayerWheel';
import styles from './PrayerWheelRow.module.css';

/*
 * Wheels you can turn. A leftward drag, a click, Enter or Space gives the
 * wheel a push; it then slows under friction. Wheels only ever turn
 * clockwise, as they are turned in practice. The physics runs on GSAP's
 * shared ticker, and only while a wheel is actually moving.
 */

const RETAIN = 0.12; // share of its speed a wheel keeps after one second
const PUSH = 190; // units per second added by a click or key press

function TurnableWheel({ index, total, prefix }) {
  const strip = useRef(null);
  const state = useRef({ offset: 0, velocity: 0, dragX: null, moved: 0 });
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const s = state.current;
    const tick = (time, deltaMs) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      s.offset = (s.offset + s.velocity * dt) % STRIP_PERIOD;
      s.velocity *= Math.pow(RETAIN, dt);
      if (strip.current) strip.current.style.transform = `translateX(${-s.offset}px)`;
      if (s.velocity < 2 && s.dragX === null) {
        s.velocity = 0;
        gsap.ticker.remove(tick);
        setMoving(false);
      }
    };
    s.start = () => {
      gsap.ticker.remove(tick);
      gsap.ticker.add(tick);
      setMoving(true);
    };
    return () => gsap.ticker.remove(tick);
  }, []);

  const push = (amount) => {
    const s = state.current;
    s.velocity = Math.min(s.velocity + amount, 900);
    s.start();
  };

  const onPointerDown = (e) => {
    state.current.dragX = e.clientX;
    state.current.moved = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const s = state.current;
    if (s.dragX === null) return;
    const dx = e.clientX - s.dragX;
    s.dragX = e.clientX;
    s.moved += Math.abs(dx);
    // only a leftward drag turns the wheel: clockwise, seen from above
    if (dx < 0) push(-dx * 7);
  };
  const onPointerUp = () => {
    state.current.dragX = null;
  };
  const onClick = (e) => {
    // a drag already turned the wheel; a plain click or key press pushes it
    if (e.detail !== 0 && state.current.moved > 6) return;
    push(PUSH);
  };

  return (
    <button
      type="button"
      className={`${styles.wheel} ${moving ? styles.moving : ''}`}
      aria-label={`Turn prayer wheel ${index + 1} of ${total}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <svg viewBox={`0 0 ${WHEEL_BOX.width} ${WHEEL_BOX.height}`} aria-hidden="true" focusable="false">
        <PrayerWheel ref={strip} prefix={prefix} mode="manual" active={moving} />
      </svg>
    </button>
  );
}

export default function PrayerWheelRow({ count = 5 }) {
  const prefix = `row${useId().replace(/:/g, '')}`;
  return (
    <div className={styles.row}>
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <defs>
          <PrayerWheelDefs prefix={prefix} />
        </defs>
      </svg>
      <div className={styles.rail} aria-hidden="true" />
      {Array.from({ length: count }, (_, i) => (
        <TurnableWheel key={i} index={i} total={count} prefix={prefix} />
      ))}
    </div>
  );
}
