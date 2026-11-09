import { useRef, useState } from 'react';
import { Reveal, T } from './ui';
import { useScrollFrame } from '../hooks';
import { TIMELINE } from '../data/content';

export default function Timeline() {
  const [open, setOpen] = useState(2);           // l'étape la plus récente et la plus dense est ouverte
  const listRef = useRef(null), lineRef = useRef(null);

  // Le trait se trace à mesure que la liste traverse l'écran.
  useScrollFrame(() => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    lineRef.current.style.transform = `scaleY(${p})`;
  });

  return (
    <section className="block tone-cream" id="parcours">
      <div className="wrap">
        <Reveal as="h2" className="display xl">Parcours</Reveal>
        <ol className="timeline" ref={listRef}>
          <li className="timeline-line" aria-hidden="true"><span ref={lineRef} /></li>
          {TIMELINE.map((step, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={step.title} className={isOpen ? 'open' : ''} delay={60 * i}>
                <span className="timeline-dot" aria-hidden="true">{i + 1}</span>
                <button type="button" className="timeline-head" aria-expanded={isOpen} aria-controls={`step-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="timeline-title">{step.title}</span>
                  <span className="timeline-when"><T>{step.when}</T></span>
                  <span className="timeline-gist">{step.gist}</span>
                  <span className="timeline-plus" aria-hidden="true" />
                </button>
                <div className="timeline-panel" id={`step-${i}`} hidden={!isOpen}>
                  <ul>{step.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
