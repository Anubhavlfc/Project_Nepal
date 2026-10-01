import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { buildStrand } from './flagGeometry';
import { flagColors } from '../../data/content';
import styles from './PrayerFlags.module.css';

/*
 * Prayer flags drawn on one canvas per layer. Hundreds of flags animated
 * as DOM or SVG nodes would cost a style recalculation per flag per frame;
 * here a frame is a single pass of a few hundred quads on GSAP's shared
 * ticker, paused while off screen and drawn once under reduced motion.
 *
 * Wind: each flag swings on its stitched edge with its own phase and speed;
 * a wave runs outward along the line, a slow gust envelope swells and
 * fades, and the whole string lifts and settles.
 */

/* Shared with the hero intro, which pays the lines out from the pinnacle */
export const flagReveal = { value: 1 };

const TAU = Math.PI * 2;
const WIND_LEAN = 0.1; // steady push of the free edge, in radians, from the west

function resolveColors() {
  const root = getComputedStyle(document.documentElement);
  return flagColors.map((token) => root.getPropertyValue(token).trim() || '#ccc');
}

/**
 * `viewBox` is [x, y, width, height] in strand units. Without `frameRef`
 * the canvas maps that box onto itself (`fit` meet or slice, bottom-aligned).
 * With `frameRef`, the box maps onto that element instead, which lets a
 * full-bleed canvas share coordinates with the stupa's SVG.
 */
export default function PrayerFlags({ strands, viewBox, frameRef = null, fit = 'meet', tone = 'front', reveal = false }) {
  const canvasRef = useRef(null);
  const built = useMemo(
    () =>
      strands.map((options, i) => ({
        ...buildStrand(options),
        sway: options.sway ?? 9,
        phase: i * 1.7,
      })),
    [strands],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 700px)').matches;
    const colors = resolveColors();
    const [vbX, vbY, vbW, vbH] = viewBox;
    const alpha = tone === 'back' ? 0.58 : 1;
    let map = { scale: 1, x: 0, y: 0, dpr: 1 };
    let visible = true;
    let frame = 0;

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const box = canvas.getBoundingClientRect();
      let scale;
      let x;
      let y;
      if (frameRef?.current) {
        const ref = frameRef.current.getBoundingClientRect();
        scale = ref.width / vbW;
        x = ref.left - box.left - vbX * scale;
        y = ref.top - box.top - vbY * scale;
      } else {
        const fitScale = fit === 'slice' ? Math.max : Math.min;
        scale = fitScale(box.width / vbW, box.height / vbH);
        x = (box.width - vbW * scale) / 2 - vbX * scale;
        y = box.height - vbH * scale - vbY * scale;
      }
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      map = { scale, x, y, dpr };
    };

    const draw = (time) => {
      const { scale, x, y, dpr } = map;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * x, dpr * y);
      const shown = reveal ? flagReveal.value * 1.05 : 1.05;

      for (const strand of built) {
        const lift = still ? 0 : Math.sin((time * TAU) / strand.sway + strand.phase) * 5;
        const gust = still ? 0.6 : 0.55 + 0.45 * Math.sin(time * 0.31 + strand.phase * 1.7);
        const drop = (t) => lift * Math.sin(Math.PI * t);

        // the string itself
        ctx.globalAlpha = alpha * 0.45;
        ctx.strokeStyle = '#d9ceb6';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < strand.points.length; i += 4) {
          const p = strand.points[i];
          if (p.t > shown) break;
          if (i === 0) ctx.moveTo(p.x, p.y + drop(p.t));
          else ctx.lineTo(p.x, p.y + drop(p.t));
        }
        ctx.stroke();

        for (const f of strand.flags) {
          if (f.t > shown) break;
          const wave = still ? 0.3 : Math.sin(time * f.speed + f.phase - f.s * 0.012);
          const a0 = WIND_LEAN * gust + f.swing * gust * wave;
          const a1 = a0 + (still ? 0 : 0.07 * Math.sin(time * f.speed * 1.37 + f.phase));
          const y0 = f.y0 + drop(f.t);
          const y1 = f.y1 + drop(f.t1);
          ctx.globalAlpha = alpha * f.shade;
          ctx.fillStyle = colors[f.index % colors.length];
          ctx.beginPath();
          ctx.moveTo(f.x0, y0);
          ctx.lineTo(f.x1, y1);
          ctx.lineTo(f.x1 + f.h * Math.sin(a1), y1 + f.h * Math.cos(a1));
          ctx.lineTo(f.x0 + f.h * Math.sin(a0), y0 + f.h * Math.cos(a0));
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (time) => {
      frame += 1;
      if (!visible || (compact && frame % 2)) return;
      draw(time);
    };

    const resize = () => {
      measure();
      draw(gsap.ticker.time);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (frameRef?.current) resizeObserver.observe(frameRef.current);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);
    if (!still) gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [built, viewBox, frameRef, fit, tone, reveal]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
