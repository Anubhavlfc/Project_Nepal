import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
 * Scroll choreography for the chapters below the hero. Everything is a
 * gentle fade-and-rise or a slow scrubbed drift; nothing pins, so native
 * scrolling stays exactly as the reader expects.
 */
export function createScrollStory() {
  // a context so every tween and trigger made here reverts together
  const ctx = gsap.context(() => {
    gsap.utils.toArray('[data-reveal]').forEach((el) =>
      gsap.from(el, {
        autoAlpha: 0,
        y: 26,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    );

    // the photograph settles as it comes into view
    gsap.utils.toArray('[data-scrub-zoom]').forEach((el) =>
      gsap.fromTo(
        el,
        { scale: 1.12 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 30%', scrub: 1 } },
      ),
    );

    // as the reader leaves the hero, the far peaks sink slightly and the title lifts away
    const hero = document.getElementById('dusk');
    if (hero) {
      gsap
        .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to(hero.querySelectorAll('[data-layer="mountains"]'), { yPercent: 6, ease: 'none' }, 0)
        .to(hero.querySelectorAll('header'), { autoAlpha: 0, y: -40, ease: 'none' }, 0);
    }
  });

  return () => ctx.revert();
}
