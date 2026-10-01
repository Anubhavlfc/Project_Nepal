import { useEffect, useRef, useState } from 'react';
import { sections } from '../../data/content';
import SoundToggle from './SoundToggle';
import styles from './Navigation.module.css';

/* Which section holds the middle of the viewport */
function useActiveSection() {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function Navigation() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const firstLink = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    firstLink.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className={styles.bar}>
        <a href="#dusk" className={styles.mark} aria-label="नेपाल, Nepal: back to the beginning">
          <span className="devanagari" lang="ne">
            नेपाल
          </span>
        </a>
        <div className={styles.controls}>
          <SoundToggle />
          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="section-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <nav
        id="section-menu"
        className={`${styles.nav} ${open ? styles.open : ''}`}
        aria-label="Sections"
      >
        <ol className={styles.list}>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                ref={i === 0 ? firstLink : undefined}
                href={`#${s.id}`}
                className={`${styles.link} ${active === s.id ? styles.active : ''}`}
                aria-current={active === s.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                <span className={styles.label}>{s.label}</span>
                <span className={`${styles.number} devanagari`} lang="ne" aria-hidden="true">
                  {s.number}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
