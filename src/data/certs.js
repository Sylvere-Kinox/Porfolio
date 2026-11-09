// Règle d'interaction de la galerie, décidée par kindOf() :
//   status: 'en-cours'   -> carte inactive avec badge « En cours »
//   verifyUrl renseigné  -> la carte est un lien vers la page officielle
//   image renseignée     -> la carte ouvre la visionneuse plein écran
//   rien                 -> carte simple, sans action (image ou lien à ajouter plus tard)
//
// Pour ajouter un scan : déposer le fichier dans public/certs/, puis retirer
// `placeholder: true` de l'entrée correspondante.

const DC = 'https://www.datacamp.com/completed/statement-of-accomplishment/course/';

export const CERTS = [
  { id: 'prix-sentinelle', title: 'Lauréat, concours créatif sur les applications de l’IA (octobre 2026)', issuer: 'Comité chinois de suivi du Forum sur la coopération sino-africaine', short: 'Lauréat', cat: 'prix' },
  { id: 'data-tour', title: 'Certificat de participation, Data Tour 2026 (phase nationale)', issuer: 'Data Afrique Hub', cat: 'prix', image: '/certs/data-tour-2026.jpg' },
  { id: 'gci-tokyo', title: 'GCI (Global Consumer Intelligence)', issuer: 'Matsuo-Iwasawa Lab, Université de Tokyo', short: 'GCI', cat: 'ia', status: 'en-cours' },
  { id: 'mle', title: 'Machine Learning Engineer', issuer: 'iSHEERO × DataCamp', cat: 'ia', status: 'en-cours' },
  { id: 'udemy-100', title: '100 Days of Python', issuer: 'Udemy', cat: 'prog', status: 'en-cours' },
  { id: 'dc-1', title: 'Data Types in Python', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + 'f1095a189ae00cc1ebf8a85f1e1272268929e679' },
  { id: 'dc-2', title: 'Boîte à outils Python', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + '2e1607589a30c1f2951fd963064fc835eacb2bf8' },
  { id: 'dc-3', title: 'Introduction à FastAPI', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + 'd3582971fdc327d38bf8fe5c449f61cfd8f3e6ba' },
  { id: 'dc-4', title: 'Introduction aux API en Python', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + 'd24f5d18b4ae739bcee5163ace33440597d49953' },
  { id: 'dc-5', title: 'Python intermédiaire pour développeurs', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + '317a3cf5dcf3729371ba31573edcd7f3033e1dab' },
  { id: 'dc-6', title: 'Introduction à Python pour les développeurs', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + '2b81e09e76d2c1f96664aafc6cd4f2bd880f28a9' },
  { id: 'dc-7', title: 'Structures de données et algorithmes en Python', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + '9c62652b6248c410e747bd6c578f081af789e98d' },
  { id: 'dc-8', title: 'Introduction au SQL', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + '24a1eafac2dcade708fe65bd7bf3afa4a020f4f8' },
  { id: 'dc-9', title: 'Validation de modèles en Python', issuer: 'DataCamp', cat: 'datacamp', verifyUrl: DC + '5e9c08f7a3502a34d92da41de09455cc23ce2436' },
];

export const CATS = [
  { key: 'all', label: 'Toutes' },
  { key: 'prix', label: 'Prix et compétitions' },
  { key: 'ia', label: 'IA et machine learning' },
  { key: 'prog', label: 'Programmation' },
  { key: 'datacamp', label: 'DataCamp' },
];

export const kindOf = (c) =>
  c.status === 'en-cours' ? 'progress' : c.verifyUrl ? 'link' : c.image ? 'image' : 'pending';

// Image de remplacement générée tant que le scan n'est pas déposé.
function placeholderSrc(cert) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const size = cert.title.length > 48 ? 30 : cert.title.length > 30 ? 44 : 62;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" font-family="Arial, sans-serif">
<rect width="1200" height="900" fill="#FFF6E5"/><rect x="40" y="40" width="1120" height="820" fill="none" stroke="#17124F" stroke-width="8"/>
<rect x="64" y="64" width="1072" height="772" fill="none" stroke="#FF4B2B" stroke-width="3"/>
<circle cx="600" cy="190" r="46" fill="#FFC914" stroke="#17124F" stroke-width="6"/>
<text x="600" y="320" text-anchor="middle" font-size="32" fill="#17124F" opacity=".7">${esc(cert.issuer)}</text>
<text x="600" y="430" text-anchor="middle" font-size="${size}" font-weight="700" fill="#17124F">${esc(cert.title)}</text>
<text x="600" y="520" text-anchor="middle" font-size="34" fill="#17124F">Sylvère Kinox Kouffossi</text>
<rect x="300" y="650" width="600" height="64" rx="32" fill="#17124F"/>
<text x="600" y="692" text-anchor="middle" font-size="24" fill="#FFF6E5">Scan à déposer : public${esc(cert.image)}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export const srcOf = (cert) => (cert.placeholder ? placeholderSrc(cert) : cert.image);
