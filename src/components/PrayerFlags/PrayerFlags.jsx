import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { buildStrand } from './flagGeometry';
import { makeStrands } from './strands';
import { camera, project, view } from '../Journey/camera';
import useMediaQuery from '../../hooks/useMediaQuery';
import { flagColors } from '../../data/content';
import styles from './PrayerFlags.module.css';

/*
 * Prayer flags, drawn on one canvas per depth (behind the stupa, in front
 * of it). Hundreds of flags as DOM or SVG nodes would cost a style
 * recalculation per flag per frame; here a frame is one pass of a few
 * hundred small shapes on GSAP's shared ticker, paused while off screen
 * and drawn once under reduced motion.
 *
 * The canvas is never scaled with CSS: it applies the camera's mapping
 * itself, so the lines stay sharp at any zoom.
 *
 * Wind: an evening breeze. Each flag swings a little on its stitched edge
 * at its own slow pace, a wave runs along the line, a gust swells and
 * fades over half a minute, and the whole line lifts and settles.
 */

/* Shared with the intro, which pays the lines out from the spire */
export const flagReveal = { value: 1 };

const TAU = Math.PI * 2;
const LEAN = 0.06; // the steady push of the breeze on the free edge, in radians
const LEVELS = 6; // shades per flag, from turned away to facing the light
const DRIFT = { back: 2.5, front: 5 }; // pointer parallax, in pixels

/* Cloth colours, faded by sun and weather toward the colour of old cotton */
function palette(age) {
  const root = getComputedStyle(document.documentElement);
  const bleach = [132, 126, 114];
  return flagColors.map((token) => {
    const hex = root.getPropertyValue(token).trim() || '#999999';
    const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const faded = rgb.map((c, i) => c + (bleach[i] - c) * age * 0.45);
    return Array.from({ length: LEVELS }, (_, level) => {
      // night: cloth catches a little lamplight, never full colour
      const light = 0.46 + (level / (LEVELS - 1)) * 0.24;
      return `rgb(${faded.map((c) => Math.round(c * light)).join(',')})`;
    });
  });
}

export default function PrayerFlags({ tone = 'front', className = '' }) {
  const canvasRef = useRef(null);
  const compact = useMediaQuery('(max-width: 700px)');
  const strands = useMemo(() => {
    const set = makeStrands({ compact })[tone];
    return set.map((options, i) => ({ ...buildStrand(options), sway: options.sway, phase: i * 1.7 }));
  }, [compact, tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alpha = tone === 'back' ? 0.82 : 1;
    const drift = DRIFT[tone];
    // a few ages of fading, shared across flags
    const palettes = [0.1, 0.4, 0.7, 1].map(palette);
    let size = { width: 0, height: 0, dpr: 1 };
    let visible = true;
    let frame = 0;
    let lastPose = '';

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      size = { width: box.width, height: box.height, dpr };
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      lastPose = '';
    };

    const draw = (time) => {
      const { layout, pointer } = view;
      if (!layout) return;
      const p = project(camera, layout, 1);
      const unit = layout.unit * p.scale;
      const ox = p.x + layout.left * p.scale + pointer.x * drift;
      const oy = p.y + layout.top * p.scale + pointer.y * drift;
      const { dpr, width, height } = size;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * unit, 0, 0, dpr * unit, dpr * ox, dpr * oy);

      // the part of the scene on screen, with a margin for hanging flags
      const view0 = { x: -ox / unit - 40, y: -oy / unit - 40 };
      const view1 = { x: (width - ox) / unit + 40, y: (height - oy) / unit + 40 };
      const shown = flagReveal.value * 1.04;
      const fadeIn = (t) => Math.min(1, Math.max(0, (shown - t) / 0.04));

      for (const strand of strands) {
        const lift = still ? 0 : Math.sin((time * TAU) / strand.sway + strand.phase) * 2.4;
        const gust = still ? 0.55 : 0.6 + 0.4 * Math.sin((time * TAU) / 29 + strand.phase * 1.7);
        const drop = (t) => lift * Math.sin(Math.PI * t);

        // the cord
        ctx.globalAlpha = alpha * 0.34;
        ctx.strokeStyle = '#cbbd9e';
        ctx.lineWidth = 1 / unit;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < strand.points.length; i += 3) {
          const pt = strand.points[i];
          if (pt.t > shown) break;
          if (pt.x < view0.x - 200 || pt.x > view1.x + 200) {
            started = false;
            continue;
          }
          if (started) ctx.lineTo(pt.x, pt.y + drop(pt.t));
          else ctx.moveTo(pt.x, pt.y + drop(pt.t));
          started = true;
        }
        ctx.stroke();

        for (const f of strand.flags) {
          if (f.t > shown) break;
          if (f.x0 < view0.x || f.x0 > view1.x || f.y0 < view0.y || f.y0 > view1.y) continue;
          const wave = still ? 0.2 : Math.sin(time * f.speed + f.phase - f.s * 0.01);
          const a0 = LEAN * gust + f.swing * gust * wave;
          const a1 = a0 + (still ? 0 : 0.04 * Math.sin(time * f.speed * 1.3 + f.phase));
          const y0 = f.y0 + drop(f.t);
          const y1 = f.y1 + drop(f.t1);
          const bx0 = f.x0 + f.h * Math.sin(a0);
          const by0 = y0 + f.h * Math.cos(a0);
          const bx1 = f.x1 + f.h * Math.sin(a1);
          const by1 = y1 + f.h * Math.cos(a1);
          // the cloth billows a little at its free edge
          const billow = f.h * (0.05 + 0.04 * wave);
          const level = Math.round(((wave * 0.5 + 0.5) * 0.7 + f.age * 0.3) * (LEVELS - 1));

          ctx.globalAlpha = alpha * fadeIn(f.t);
          ctx.fillStyle = palettes[Math.floor(f.age * 3.99)][f.index % 5][level];
          ctx.beginPath();
          ctx.moveTo(f.x0, y0);
          ctx.lineTo(f.x1, y1);
          ctx.lineTo(bx1, by1);
          ctx.quadraticCurveTo((bx0 + bx1) / 2, (by0 + by1) / 2 + billow, bx0, by0);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (time) => {
      if (!visible) return;
      frame += 1;
      // small screens draw at half rate, except while the camera moves
      const pose = `${camera.z},${camera.x},${camera.y},${view.pointer.x},${view.pointer.y},${flagReveal.value}`;
      if (compact && frame % 2 && pose === lastPose) return;
      lastPose = pose;
      draw(time);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(gsap.ticker.time);
    });
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);
    // under reduced motion the camera never moves: draw once the stage is laid out
    const once = still ? gsap.delayedCall(0.05, () => draw(0)) : null;
    if (!still) gsap.ticker.add(tick);

    return () => {
      once?.kill();
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [strands, tone, compact]);

  return <canvas ref={canvasRef} className={`${styles.canvas} ${className}`} aria-hidden="true" data-flags={tone} />;
}
