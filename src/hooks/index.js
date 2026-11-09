import { useEffect, useRef, useState } from 'react';

/** true quand l'utilisateur demande moins d'animations. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** [ref, visible] : visible passe à true dès que l'élément entre dans l'écran. */
export function useInView({ once = true, margin = '0px 0px -12% 0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect(); }
      else if (!once) setInView(false);
    }, { rootMargin: margin });
    io.observe(node);
    return () => io.disconnect();
  }, [once, margin]);
  return [ref, inView];
}

/** Appelle fn(scrollY) à chaque image pendant le défilement, sans re-rendu React. */
export function useScrollFrame(fn) {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    let raf = 0;
    const tick = () => { raf = 0; saved.current(window.scrollY); };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
}

/** Compte de 0 à `to` quand `start` devient vrai. */
export function useCountUp(to, start, duration = 1400) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!start || reduced) { setN(to); return; }
    let raf; const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setN(0); raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, start, duration, reduced]);
  return n;
}
