import { useEffect, useMemo, useState } from 'react';

// Démonstration simplifiée : quelques règles lisibles, pour montrer l'idée.
// Le projet réel vise des modèles entraînés sur des messages collectés localement.
const RULES = [
  { id: 'urgence', label: 'Pression et urgence', w: 25, re: /(urgent\w*|imm[ée]diatement|tout de suite|dernier d[ée]lai|sinon|bloqu\w+|suspendu\w*)/gi },
  { id: 'secret', label: 'Demande de code ou de PIN', w: 35, re: /(code (secret|pin|de confirmation)|\bpin\b|mot de passe|\botp\b)/gi },
  { id: 'lien', label: 'Lien suspect', w: 30, re: /(https?:\/\/\S+|\b\S+\.(xyz|top|click)\b\S*)/gi },
  { id: 'gain', label: 'Gain inattendu', w: 20, re: /(gagn[ée]\w*|f[ée]licitations|cadeau\w*|bonus|loterie)/gi },
  { id: 'transfert', label: 'Demande de renvoi d’argent', w: 35, re: /(renvoy\w+|transf[ée]r\w+|par erreur)/gi },
];
const SAMPLES = [
  'MoMo : vous avez reçu 45 000 FCFA par erreur. Renvoyez immédiatement au 01 00 00 00 00 sinon votre compte sera bloqué.',
  'Félicitations ! Vous avez gagné un bonus de 100 000 FCFA. Confirmez avec votre code PIN ici : http://momo-bonus.xyz/claim',
  'Bonjour, la réunion du Club IA IoT est déplacée à samedi 10 h, salle B. À samedi !',
];

function analyse(text) {
  const ranges = [], signals = [];
  let score = 0;
  for (const rule of RULES) {
    const hits = [...text.matchAll(rule.re)];
    if (!hits.length) continue;
    score += rule.w; signals.push(rule.label);
    for (const m of hits) ranges.push([m.index, m.index + m[0].length]);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const parts = []; let at = 0;
  for (const [s, e] of ranges) {
    if (s < at) continue;
    if (s > at) parts.push({ t: text.slice(at, s) });
    parts.push({ t: text.slice(s, e), hit: true }); at = e;
  }
  if (at < text.length) parts.push({ t: text.slice(at) });
  score = Math.min(100, score);
  const level = score >= 60 ? 'high' : score >= 25 ? 'mid' : 'low';
  return { parts, signals, score, level };
}
const LEVELS = { high: 'Risque élevé', mid: 'À vérifier', low: 'Rien de suspect' };

export default function SentinelleDemo() {
  const [text, setText] = useState(SAMPLES[0]);
  const [scanning, setScanning] = useState(false);
  const result = useMemo(() => analyse(text), [text]);

  useEffect(() => {
    setScanning(true);
    const id = setTimeout(() => setScanning(false), 700);
    return () => clearTimeout(id);
  }, [text]);

  return (
    <div className="demo sen-demo">
      <p className="demo-note">Démonstration simplifiée à base de règles</p>
      <div className="sen-samples" role="group" aria-label="Messages d’exemple">
        {SAMPLES.map((s, i) => (
          <button type="button" key={i} aria-pressed={text === s} onClick={() => setText(s)}>Message {i + 1}</button>
        ))}
      </div>
      <div className="sen-grid">
        <div>
          <label htmlFor="sen-input">Ou collez un message reçu</label>
          <textarea id="sen-input" rows="4" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className={`sen-result level-${result.level} ${scanning ? 'scanning' : ''}`} aria-live="polite">
          <p className="sen-bubble">{result.parts.map((p, i) => (p.hit ? <mark key={i}>{p.t}</mark> : <span key={i}>{p.t}</span>))}</p>
          <div className="sen-meter"><span style={{ width: `${scanning ? 0 : result.score}%` }} /></div>
          <p className="sen-verdict"><b>{scanning ? 'Analyse…' : LEVELS[result.level]}</b>{!scanning && <span>score {result.score} sur 100</span>}</p>
          {!scanning && result.signals.length > 0 && <ul>{result.signals.map((s) => <li key={s}>{s}</li>)}</ul>}
        </div>
      </div>
    </div>
  );
}
