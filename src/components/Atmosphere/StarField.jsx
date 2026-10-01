import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createRandom } from '../../lib/random';
import styles from './Atmosphere.module.css';

/*
 * A single canvas of stars. It draws on GSAP's shared ticker (no private
 * requestAnimationFrame loop), redraws at about 30 fps, and stops entirely
 * while off screen. With reduced motion it paints once and stays still.
 */

const STAR_TINTS = ['255,250,240', '226,234,255', '255,238,214'];

function makeStars(width, height, seed) {
  const random = createRandom(seed);
  const area = width * height;
  const count = Math.round(Math.min(260, Math.max(60, area / 5200)));
  return Array.from({ length: count }, () => {
    const bright = random() > 0.93;
    return {
      x: random() * width,
      // weighted toward the top, where the sky is darkest
      y: Math.pow(random(), 1.7) * height * 0.78,
      r: bright ? 0.9 + random() * 0.6 : 0.35 + random() * 0.6,
      base: bright ? 0.75 : 0.18 + random() * 0.45,
      speed: 0.2 + random() * 0.9,
      depth: bright ? 0.4 : 0.12 + random() * 0.18,
      phase: random() * Math.PI * 2,
      tint: STAR_TINTS[Math.floor(random() * STAR_TINTS.length)],
    };
  });
}

export default function StarField({ className = '', seed = 7 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = still ? 1 : 1 - s.depth + s.depth * Math.sin(time * s.speed + s.phase);
        ctx.globalAlpha = Math.max(0, s.base * twinkle);
        ctx.fillStyle = `rgb(${s.tint})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(width, height, seed);
      draw(gsap.ticker.time);
    };

    const tick = (time) => {
      frame += 1;
      if (visible && frame % 2 === 0) draw(time);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
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
  }, [seed]);

  return <canvas ref={canvasRef} className={`${styles.stars} ${className}`} aria-hidden="true" />;
}
