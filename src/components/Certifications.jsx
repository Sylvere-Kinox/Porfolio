import { useEffect, useMemo, useRef, useState } from 'react';
import { Reveal, T } from './ui';
import { CERTS, CATS, kindOf, srcOf } from '../data/certs';

const IconExternal = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" /></svg>
);
const IconExpand = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" /></svg>
);
const brand = (issuer) => issuer.split(' × ').pop();

/** Une carte. Son comportement dépend de kindOf(cert). */
function CertCard({ cert, onOpen }) {
  const kind = kindOf(cert);
  const meta = (action) => (
    <span className="cert-meta">
      <span className="cert-issuer"><T>{cert.issuer}</T></span>
      <span className="cert-name"><T>{cert.title}</T></span>
      {action && <span className="cert-act">{action}</span>}
    </span>
  );
  if (kind === 'link') {
    return (
      <a className="cert" href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
        <span className="cert-thumb linked">{brand(cert.issuer)}</span>
        {meta(<><IconExternal />Vérifier sur le site de {brand(cert.issuer)}</>)}
      </a>
    );
  }
  if (kind === 'image') {
    return (
      <button type="button" className="cert" aria-haspopup="dialog" onClick={() => onOpen(cert.id)}>
        <span className="cert-thumb"><img src={srcOf(cert)} alt="" loading="lazy" /></span>
        {meta(<><IconExpand />Ouvrir en plein écran</>)}
      </button>
    );
  }
  if (kind === 'progress') {
    return (
      <div className="cert inactive">
        <span className="cert-thumb linked"><span className="badge">En cours</span>{cert.short || brand(cert.issuer)}</span>
        {meta('Certificat ajouté dès la fin de la formation')}
      </div>
    );
  }
  return (
    <div className="cert inactive plain">
      <span className="cert-thumb linked">{cert.short || brand(cert.issuer)}</span>
      {meta(null)}
    </div>
  );
}

/** Visionneuse plein écran. <dialog> natif : piège à focus, Échap et retour du focus sont gérés par le navigateur. */
function Lightbox({ items, index, onStep, onClose }) {
  const ref = useRef(null);
  const [zoom, setZoom] = useState(false);
  const cert = index >= 0 ? items[index] : null;

  useEffect(() => {
    const dlg = ref.current;
    if (cert && !dlg.open) dlg.showModal();
    if (!cert && dlg.open) dlg.close();
  }, [cert]);
  useEffect(() => setZoom(false), [index]);

  const close = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); onClose(); };
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else ref.current.requestFullscreen?.().catch(() => {});
  };
  const onKey = (e) => { if (e.key === 'ArrowLeft') onStep(-1); if (e.key === 'ArrowRight') onStep(1); };
  const onBackdrop = (e) => { if (e.target === ref.current || e.target.tagName === 'FIGURE') close(); };

  return (
    <dialog className="lightbox" ref={ref} aria-label="Certificat en plein écran" onClose={onClose} onKeyDown={onKey} onClick={onBackdrop}>
      {cert && (
        <div className="lb">
          <div className="lb-bar">
            <span className="lb-pos">{index + 1} sur {items.length}</span>
            <div>
              {cert.verifyUrl && <a className="lb-btn" href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">Vérifier en ligne</a>}
              <button type="button" className="lb-btn" onClick={fullscreen}>Plein écran</button>
              <button type="button" className="lb-btn" onClick={close}>Fermer</button>
            </div>
          </div>
          <div className="lb-stage">
            <button type="button" className="lb-btn lb-arrow" onClick={() => onStep(-1)} aria-label="Certificat précédent" hidden={items.length < 2}>‹</button>
            <figure>
              <img key={cert.id} src={srcOf(cert)} alt={`Certificat ${cert.title}, ${cert.issuer}`} className={zoom ? 'zoomed' : ''} onClick={() => setZoom((z) => !z)} />
            </figure>
            <button type="button" className="lb-btn lb-arrow" onClick={() => onStep(1)} aria-label="Certificat suivant" hidden={items.length < 2}>›</button>
          </div>
          <div className="lb-cap"><strong>{cert.title}</strong><span>{cert.issuer}</span></div>
        </div>
      )}
    </dialog>
  );
}

export default function Certifications() {
  const [filter, setFilter] = useState('all');
  const [openIndex, setOpenIndex] = useState(-1);

  const list = useMemo(() => CERTS.filter((c) => filter === 'all' || c.cat === filter), [filter]);
  const images = useMemo(() => list.filter((c) => kindOf(c) === 'image'), [list]);   // ce que la visionneuse parcourt

  const open = (id) => setOpenIndex(images.findIndex((c) => c.id === id));
  const step = (d) => setOpenIndex((i) => (i + d + images.length) % images.length);

  return (
    <section className="block tone-leaf" id="certifications">
      <div className="wrap">
        <Reveal as="h2" className="display xl">Certifications</Reveal>
        <p className="section-lede">Chaque carte s’ouvre en plein écran ou mène à la page de vérification de l’organisme.</p>
        <div className="filters" role="group" aria-label="Filtrer les certifications">
          {CATS.map((c) => (
            <button type="button" key={c.key} aria-pressed={filter === c.key} onClick={() => setFilter(c.key)}>{c.label}</button>
          ))}
        </div>
        <p className="cert-count" aria-live="polite">{list.length} certification{list.length > 1 ? 's' : ''} affichée{list.length > 1 ? 's' : ''}</p>
        <ul className="certs">
          {list.map((c, i) => <li key={c.id} style={{ '--i': i }}><CertCard cert={c} onOpen={open} /></li>)}
        </ul>
      </div>
      <Lightbox items={images} index={openIndex} onStep={step} onClose={() => setOpenIndex(-1)} />
    </section>
  );
}
