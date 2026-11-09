import { useEffect, useState } from 'react';

// Démonstration illustrative : un avis fictif, et l'extraction rejouée pas à pas.
const DOC = [
  { t: 'Avis d’appel d’offres n° 014/2026. ' },
  { t: 'Fourniture et installation d’équipements informatiques pour 12 centres de santé communaux', k: 'objet' },
  { t: '. Les offres doivent parvenir au plus tard le ' },
  { t: '18 décembre 2026 à 10 h 00', k: 'date' },
  { t: '. Chaque offre est accompagnée d’une ' },
  { t: 'garantie de soumission de 2 500 000 FCFA', k: 'caution' },
  { t: '. Le soumissionnaire fournit ' },
  { t: 'une attestation fiscale, une attestation CNSS et le registre de commerce', k: 'pieces' },
  { t: ' en cours de validité. Il justifie d’' },
  { t: 'au moins trois marchés similaires exécutés au cours des cinq dernières années', k: 'refs' },
  { t: '. Délai de livraison : ' },
  { t: '60 jours', k: 'delai' },
  { t: ' à compter de la notification.' },
];
const FIELDS = [
  ['objet', 'Objet', 'Équipements informatiques, 12 centres de santé'],
  ['date', 'Date limite', '18 déc. 2026, 10 h 00'],
  ['caution', 'Garantie', '2 500 000 FCFA'],
  ['pieces', 'Pièces', '3 pièces administratives'],
  ['refs', 'Références', '3 marchés similaires en 5 ans'],
  ['delai', 'Livraison', '60 jours'],
];

export default function DaoDemo() {
  const [step, setStep] = useState(0);           // nombre de champs extraits
  const [running, setRunning] = useState(false);
  const done = step > FIELDS.length;

  useEffect(() => {
    if (!running) return;
    if (step > FIELDS.length) { setRunning(false); return; }
    const id = setTimeout(() => setStep((s) => s + 1), 520);
    return () => clearTimeout(id);
  }, [running, step]);

  const found = new Set(FIELDS.slice(0, step).map((f) => f[0]));
  const start = () => { setStep(0); setRunning(true); };

  return (
    <div className="demo dao-demo">
      <p className="demo-note">Démonstration sur un avis fictif</p>
      <div className="dao-grid">
        <p className={`dao-doc ${running ? 'scanning' : ''}`}>
          {DOC.map((s, i) => (s.k ? <mark key={i} className={found.has(s.k) ? 'hit' : ''}>{s.t}</mark> : <span key={i}>{s.t}</span>))}
        </p>
        <div className="dao-card">
          <dl>
            {FIELDS.map(([k, label, value]) => (
              <div key={k} className={found.has(k) ? 'on' : ''}>
                <dt>{label}</dt><dd>{found.has(k) ? value : '…'}</dd>
              </div>
            ))}
          </dl>
          <p className={`dao-verdict ${done ? 'on' : ''}`} aria-live="polite">
            {done ? <><b>Go sous réserve</b> Vérifier les trois références de marchés similaires.</> : 'Avis en attente d’analyse'}
          </p>
        </div>
      </div>
      <button type="button" className="btn btn-night" onClick={start} disabled={running}>
        {running ? 'Analyse en cours' : step ? 'Rejouer l’analyse' : 'Analyser ce dossier'}
      </button>
    </div>
  );
}
