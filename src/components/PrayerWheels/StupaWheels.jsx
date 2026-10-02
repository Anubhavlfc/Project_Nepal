import { useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { NICHES, SCENE } from '../Stupa/geometry';
import PrayerWheel, { PrayerWheelDefs, STRIP_PERIOD, WHEEL_BOX } from './PrayerWheel';
import styles from './StupaWheels.module.css';

/*
 * The prayer wheels in the niches of the lowest wall, as buttons laid
 * exactly over the drawing. They rest until someone turns them, and they
 * only ever turn clockwise, as they are turned in practice. A click, Enter
 * or Space gives one slow turn; a leftward drag spins a wheel, which then
 * slows to rest. The arrow keys move from wheel to wheel.
 */

const RETAIN = 0.12; // share of its speed a spun wheel keeps after one second
const TURN = 3.2; // seconds for one slow, full turn

const percent = (value, of) => `${(value / of) * 100}%`;

function Wheel({ index, prefix, niche, focusable, onKeyDown, onFocus, buttonRef }) {
  const strip = useRef(null);
  const state = useRef({ offset: 0, velocity: 0, dragX: null, moved: 0, turn: null });
  const [moving, setMoving] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const s = state.current;
    const render = () => {
      if (strip.current) strip.current.style.transform = `translateX(${-(s.offset % STRIP_PERIOD)}px)`;
    };
    const spin = (time, deltaMs) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      s.offset += s.velocity * dt;
      s.velocity *= RETAIN ** dt;
      render();
      if (s.velocity < 2 && s.dragX === null) {
        s.velocity = 0;
        gsap.ticker.remove(spin);
        setMoving(false);
      }
    };
    s.push = (amount) => {
      s.turn?.kill();
      s.velocity = Math.min(s.velocity + amount, 900);
      gsap.ticker.remove(spin);
      gsap.ticker.add(spin);
      setMoving(true);
    };
    s.turnOnce = () => {
      if (s.velocity > 0) return;
      const to = (s.turn?.isActive() ? s.turn.vars.offset : s.offset) + STRIP_PERIOD;
      s.turn?.kill();
      setMoving(true);
      s.turn = gsap.to(s, {
        offset: to,
        duration: TURN,
        ease: 'power2.inOut',
        onUpdate: render,
        onComplete: () => setMoving(false),
      });
    };
    return () => {
      gsap.ticker.remove(spin);
      s.turn?.kill();
    };
  }, []);

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
    if (dx < 0) s.push(-dx * 7);
  };
  const onPointerUp = () => {
    state.current.dragX = null;
  };
  const onClick = (e) => {
    // a drag has already turned the wheel; a click or a key press turns it once
    if (e.detail !== 0 && state.current.moved > 6) return;
    state.current.turnOnce();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.wheel}
      style={{
        left: percent(niche.x, SCENE.width),
        top: percent(niche.y, SCENE.height),
        width: percent(niche.width, SCENE.width),
        height: percent(niche.height, SCENE.height),
      }}
      tabIndex={focusable ? 0 : -1}
      aria-label={`Turn prayer wheel ${index + 1} of ${NICHES.length}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => setLit(false)}
      onFocus={() => {
        setLit(true);
        onFocus();
      }}
      onBlur={() => setLit(false)}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <svg viewBox={`0 0 ${WHEEL_BOX.width} ${WHEEL_BOX.height}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
        <PrayerWheel ref={strip} prefix={prefix} active={lit || moving} />
      </svg>
    </button>
  );
}

/* The wheel just left of the stair, in view whenever the wheels are */
const FIRST = NICHES.length / 2 - 1;

export default function StupaWheels() {
  const prefix = `wheel${useId().replace(/:/g, '')}`;
  const buttons = useRef([]);
  const [current, setCurrent] = useState(FIRST);

  // the arrow keys move between the wheels on screen; the camera may be
  // close enough that the outermost ones are out of the frame
  const onScreen = (i) => {
    const box = buttons.current[i]?.getBoundingClientRect();
    return !!box && box.right > 0 && box.left < window.innerWidth && box.bottom > 0 && box.top < window.innerHeight;
  };
  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: -1, End: 1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const far = e.key === 'Home' || e.key === 'End';
    let next = current;
    for (let i = current + step; i >= 0 && i < NICHES.length && onScreen(i); i += step) {
      next = i;
      if (!far) break;
    }
    setCurrent(next);
    buttons.current[next]?.focus();
  };

  return (
    <div className={styles.wheels} role="group" aria-label="Prayer wheels" data-intro="wheels" data-wheels>
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <defs>
          <PrayerWheelDefs prefix={prefix} />
        </defs>
      </svg>
      {NICHES.map((niche, i) => (
        <Wheel
          key={niche.x}
          index={i}
          prefix={prefix}
          niche={niche}
          focusable={i === current}
          onFocus={() => setCurrent(i)}
          onKeyDown={onKeyDown}
          buttonRef={(el) => {
            buttons.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
