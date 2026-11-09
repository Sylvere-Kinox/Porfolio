import { useEffect, useState } from 'react';
import { Reveal, Magnetic } from './ui';
import { useInView, useCountUp } from '../hooks';
import { JOURNAL, COMMUNITY, TESTIMONIAL, CONTACT, PROFILE } from '../data/content';

export function Journal() {
  const [ref, inView] = useInView();
  const n = useCountUp(JOURNAL.pages, inView);
  return (
    <section className="block tone-sun" id="recherche">
      <div className="wrap journal" ref={ref}>
        <p className="journal-n" aria-label={`${JOURNAL.pages} pages`}><span>{n}</span><small>pages</small></p>
        <div>
          <Reveal as="h2" className="display">{JOURNAL.title}</Reveal>
          <Reveal as="p" delay={80}>{JOURNAL.text}</Reveal>
          <p><Magnetic className="btn btn-night" href={JOURNAL.link} target="_blank" rel="noopener noreferrer">Lire le journal sur GitHub</Magnetic></p>
        </div>
      </div>
    </section>
  );
}

export function Community() {
  return (
    <section className="block tone-night" id="communaute">
      <div className="wrap">
        <Reveal as="h2" className="display xl">Communauté</Reveal>
        <p className="section-lede">Ce que j’apprends, je le remets en circulation.</p>
        <ul className="orgs">
          {COMMUNITY.map((o, i) => (
            <Reveal as="li" key={o.name} delay={60 * i} data-cursor>
              <span className="org-role">{o.role}</span>
              <b>{o.name}</b>
              <span className="org-text">{o.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="block tone-fire" aria-label="Recommandation">
      <figure className="wrap quote">
        <span className="quote-mark" aria-hidden="true">“</span>
        <Reveal as="blockquote">{TESTIMONIAL.quote}</Reveal>
        <figcaption><b>{TESTIMONIAL.author}</b><span>{TESTIMONIAL.title}</span></figcaption>
      </figure>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); setCopied('Adresse copiée'); }
    catch { setCopied('Copie refusée, sélectionnez l’adresse'); }
  };
  return (
    <section className="block tone-night contact" id="contact">
      <div className="wrap">
        <h2 className="display xxl">
          {CONTACT.title.map((l, i) => <Reveal as="span" key={l} delay={90 * i} className={i === 1 ? 'hollow' : ''}>{l}</Reveal>)}
        </h2>
        <p className="section-lede">{CONTACT.text}</p>
        <div className="contact-row">
          <Magnetic className="btn btn-sun btn-big" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</Magnetic>
          <button type="button" className="btn btn-line" onClick={copy}>{copied || 'Copier l’adresse'}</button>
        </div>
        <p className="contact-links">
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </p>
        <p className="colophon">Cotonou, Bénin. Site écrit en React, animations codées à la main.</p>
      </div>
    </section>
  );
}

/** Barre de relecture : compte les passages à compléter. À retirer avant la mise en ligne. */
export function ReviewBar() {
  const [count, setCount] = useState(0);
  const [clean, setClean] = useState(false);
  useEffect(() => {
    const tick = () => setCount(document.querySelectorAll('mark.todo').length);
    tick();
    const mo = new MutationObserver(tick);
    mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  useEffect(() => { document.body.classList.toggle('clean', clean); }, [clean]);
  if (!count) return null;
  return (
    <div className="review">
      <span>Brouillon : {count} information{count > 1 ? 's' : ''} à compléter</span>
      <button type="button" aria-pressed={clean} onClick={() => setClean((c) => !c)}>{clean ? 'Afficher les repères' : 'Masquer les repères'}</button>
    </div>
  );
}
