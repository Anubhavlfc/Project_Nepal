import { gsap } from 'gsap';

/*
 * Pointer depth for the hero. Each `[data-depth]` layer drifts by at most
 * its depth in pixels, so the mountains move 2px and the nearest flags 7px.
 * The same pointer position steers the light on the dome (--light-x/y) and
 * the soft aura around the cursor.
 */
export function createPointerParallax(root) {
  const layers = gsap.utils.toArray(root.querySelectorAll('[data-depth]')).map((el) => ({
    depth: Number(el.dataset.depth),
    x: gsap.quickTo(el, 'x', { duration: 1.6, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 1.6, ease: 'power3.out' }),
  }));

  const aura = root.querySelector('[data-aura]');
  const auraX = aura && gsap.quickTo(aura, 'x', { duration: 0.9, ease: 'power3.out' });
  const auraY = aura && gsap.quickTo(aura, 'y', { duration: 0.9, ease: 'power3.out' });

  const onMove = (event) => {
    const rect = root.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    for (const layer of layers) {
      layer.x(-nx * layer.depth);
      layer.y(-ny * layer.depth * 0.6);
    }
    root.style.setProperty('--light-x', nx.toFixed(3));
    root.style.setProperty('--light-y', ny.toFixed(3));
    if (aura) {
      auraX(event.clientX - rect.left);
      auraY(event.clientY - rect.top);
      aura.style.opacity = '1';
    }
  };
  const onLeave = () => {
    if (aura) aura.style.opacity = '0';
  };

  root.addEventListener('pointermove', onMove, { passive: true });
  root.addEventListener('pointerleave', onLeave);
  return () => {
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerleave', onLeave);
  };
}
