import { useEffect, useRef } from 'react';
import { useInView, useScrollFrame, useReducedMotion } from '../hooks';

/** Affiche un texte ; les passages [entre crochets] sont marqués « à compléter ». */
export function T({ children }) {
  const parts = String(children).split(/(\[[^\]]+\])/g);
  return parts.map((p, i) => (p.startsWith('[') ? <mark className="todo" key={i}>{p}</mark> : p));
}

/** Entrée au défilement. Le contenu reste lisible avant l'animation. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/** Bandeau défilant en continu. */
export function Marquee({ items, tone = 'sun' }) {
  const row = items.map((t, i) => <span key={i}>{t}<i aria-hidden="true">✺</i></span>);
  return (
    <div className={`marquee tone-${tone}`} aria-hidden="true">
      <div className="marquee-track">{row}{row}</div>
    </div>
  );
}

/** Frise géométrique animée, inspirée des motifs wax, entre deux sections. */
export function WaxBand({ variant = 'a' }) {
  return <div className={`wax wax-${variant}`} aria-hidden="true" />;
}

/** Sceau circulaire qui tourne avec le défilement. */
export function Seal({ text }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useScrollFrame((y) => { if (ref.current && !reduced) ref.current.style.transform = `rotate(${y * 0.18}deg)`; });
  return (
    <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="58" />
      <g ref={ref} style={{ transformOrigin: '60px 60px' }}>
        <path id="seal-path" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" fill="none" />
        <text><textPath href="#seal-path">{text}</textPath></text>
      </g>
      <text className="seal-star" x="60" y="72" textAnchor="middle">✺</text>
    </svg>
  );
}

/** Barre de progression de lecture, en haut de page. */
export function ScrollProgress() {
  const ref = useRef(null);
  useScrollFrame((y) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  });
  return <div className="progress" ref={ref} aria-hidden="true" />;
}

/** Anneau qui suit le pointeur et grossit sur les éléments cliquables (souris uniquement). */
export function CursorRing() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const ring = ref.current;
    let x = -100, y = -100, tx = -100, ty = -100, raf;
    const move = (e) => {
      tx = e.clientX; ty = e.clientY; ring.classList.add('on');
      ring.classList.toggle('big', !!e.target.closest?.('a, button, summary, [data-cursor]'));
    };
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      ring.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move); loop();
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [reduced]);
  return <div className="cursor-ring" ref={ref} aria-hidden="true" />;
}

/** Bouton ou lien « aimanté » : il se déplace légèrement vers le pointeur. */
export function Magnetic({ as: Tag = 'a', children, className = '', ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const move = (e) => {
    if (reduced) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  };
  const leave = () => { ref.current.style.transform = ''; };
  return <Tag ref={ref} className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>{children}</Tag>;
}
