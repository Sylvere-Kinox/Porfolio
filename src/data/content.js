// Tout le contenu du site est ici. Les composants ne contiennent aucun texte en dur
// (hors libellés d'interface). Une valeur entre crochets [ ... ] est à compléter :
// elle apparaît surlignée sur le site tant que le mode relecture est actif.

export const PROFILE = {
  name: ['Sylvère', 'Kinox', 'Kouffossi'],
  role: 'Ingénieur IA et machine learning en formation',
  school: 'IFRI, Université d’Abomey-Calavi, Bénin',
  thesis:
    'J’apprends aux machines à lire des dossiers d’appel d’offres interminables, à flairer une arnaque Mobile Money et à trouver le bon chemin quand il en existe des milliers.',
  email: 'sylkinko@gmail.com',
  github: 'https://github.com/Sylvere-Kinox',
  linkedin: 'https://www.linkedin.com/in/sylv%C3%A8re-kinox-kouffossi-059951340/',
};

export const MARQUEE = [
  'Machine learning', 'Traitement du langage', 'Optimisation stochastique', 'Programmation dynamique',
  'Métaheuristiques', 'OCR', 'Cybersécurité', 'Python', 'C++', 'Java', 'Recherche heuristique', 'LLM',
];

export const ABOUT = {
  title: 'Moi, c’est Sylvère.',
  paragraphs: [
    'Je suis en troisième année d’intelligence artificielle à l’IFRI, et je mène une licence d’anglais en parallèle. Deux cursus, une seule obsession : comprendre comment une chose marche, puis la faire marcher mieux.',
    'Cette année, c’est l’optimisation qui m’a accroché. Optimisation stochastique, programmation dynamique, heuristiques et techniques de recherche : j’aime les problèmes où la solution parfaite est hors de portée et où il faut être malin. L’essaim qui poursuit votre curseur en haut de cette page, je l’ai codé à la main.',
    'Je construis pour des problèmes d’ici. Des dossiers d’appel d’offres que personne n’a le temps de lire. Des arnaques qui vident des comptes Mobile Money. Et j’écris tout ce que j’apprends : 87 pages rien que pour l’école d’été EEML 2026.',
  ],
  stickers: [
    { text: 'Cotonou, Bénin', tone: 'sun', tilt: -3 },
    { text: 'Français natif, anglais B2+', tone: 'leaf', tilt: 2 },
    { text: 'Python, C++, Java', tone: 'fire', tilt: -1.5 },
    { text: 'Diplôme prévu en 2027', tone: 'night', tilt: 3 },
  ],
  seal: 'ouvert aux stages ✺ et aux collaborations ✺ ',
};

export const PROJECTS = [
  {
    id: 'dao',
    tone: 'fire',
    name: 'DAO Assistant',
    tagline: 'Un dossier d’appel d’offres lu, résumé et évalué avant que le café refroidisse.',
    facts: [
      ['Domaine', 'NLP, LLM, intelligence documentaire'],
      ['Format', 'Projet solo de R&D, depuis 2026'],
      ['Mon rôle', 'Seul développeur du projet'],
    ],
    problem: [
      'Répondre à un marché public commence par la lecture d’un DAO : des dizaines de pages, souvent scannées, où les informations décisives sont dispersées. Date limite, garantie de soumission, pièces administratives, références exigées.',
      'Une petite entreprise y passe des heures, pour découvrir parfois à la dernière page qu’elle n’était pas éligible. Chaque dossier mal trié est du temps perdu ou une opportunité manquée.',
    ],
    steps: [
      ['Lecture', 'Le dossier est ingéré tel quel, PDF natif ou scan. L’OCR reconstitue le texte et la structure.'],
      ['Découpage', 'Le texte est segmenté par sections pour rester dans la fenêtre de contexte du modèle.'],
      ['Extraction', 'Qwen, guidé par des prompts structurés, repère les exigences, les montants et les échéances.'],
      ['Synthèse', 'Les informations sont rassemblées dans une fiche courte, toujours dans le même ordre.'],
      ['Décision', 'Le système confronte les exigences au profil de l’entreprise et propose un Go, un No-Go ou un Go sous réserve.'],
    ],
    outcomes: [
      ['Objectif', 'Une décision Go ou No-Go en moins de 2 minutes'],
      ['Gain visé', 'Moins de lecture manuelle, des analyses plus régulières'],
      ['État', 'Prototype fonctionnel, développé seul'],
    ],
    stack: ['Python', 'Qwen', 'OCR', 'NLP', 'Prompt engineering', 'Aide à la décision'],
    learned:
      'Le plus dur n’est pas de faire répondre un LLM, c’est de le faire répondre pareil deux fois. J’ai appris à contraindre les sorties et à vérifier chaque champ extrait contre le texte source.',
  },
  {
    id: 'sentinelle',
    tone: 'night',
    name: 'Sentinelle',
    tagline: 'Une vigie numérique contre le hameçonnage et les arnaques au Mobile Money.',
    facts: [
      ['Domaine', 'IA, cybersécurité, OSINT'],
      ['Format', 'Projet en équipe, depuis 2026'],
      ['Distinction', 'Lauréat, octobre 2026'],
    ],
    problem: [
      'Au Bénin, le Mobile Money est le compte en banque de tout le monde. Les escrocs le savent. Faux messages de dépôt « par erreur », faux agents, faux gains, faux comptes sur les réseaux : les mêmes scénarios reviennent chaque jour.',
      'Les outils de sécurité existants sont pensés pour d’autres contextes, d’autres langues, d’autres usages. Sentinelle part des arnaques telles qu’elles circulent ici.',
    ],
    steps: [
      ['Hameçonnage', 'Analyse des messages et des liens pour repérer les signaux d’une tentative de phishing.'],
      ['Faux comptes', 'Repérage des profils frauduleux qui usurpent une marque, un agent ou un proche.'],
      ['Arnaques Mobile Money', 'Reconnaissance des scénarios types : dépôt par erreur, faux gain, demande de code.'],
      ['Signalement', 'Des rapports clairs qui expliquent la menace à l’utilisateur au lieu de seulement la bloquer.'],
      ['Veille OSINT', 'Collecte de sources ouvertes pour suivre l’apparition de nouvelles arnaques.'],
    ],
    outcomes: [
      ['État', 'Conception et prototypage'],
      ['Reconnaissance', 'Lauréat du concours créatif sur les applications de l’IA pour les jeunes des pays africains'],
      ['Cap', 'Des outils accessibles aux particuliers comme aux organisations'],
    ],
    stack: ['Python', 'Machine learning', 'OSINT', 'Linux', 'Git', 'Architecture sécurisée'],
    award:
      'Sentinelle est lauréat du Concours créatif sur les cas d’application de l’intelligence artificielle à l’intention des jeunes des pays africains, organisé par le secrétariat du Comité chinois de suivi du Forum sur la coopération sino-africaine (octobre 2026).',
    learned:
      'Une alerte que personne ne comprend ne protège personne. Sentinelle m’a appris à penser la détection et l’explication ensemble.',
  },
];

export const TIMELINE = [
  {
    title: 'Les fondations',
    when: '2024',
    gist: 'Entrée à l’IFRI, premiers programmes, double cursus.',
    items: [
      'Licence en intelligence artificielle à l’IFRI, Université d’Abomey-Calavi.',
      'Licence d’anglais menée en parallèle, pour lire la recherche dans le texte.',
      'Bases solides en Python, C et C++, Java, algorithmique et structures de données.',
    ],
  },
  {
    title: 'La spécialisation en machine learning',
    when: '2025',
    gist: 'Du code qui marche au modèle qui généralise.',
    items: [
      'Parcours Machine Learning Engineer, formation iSHEERO avec DataCamp.',
      'Neuf cours DataCamp validés, de Python à la validation de modèles.',
    ],
  },
  {
    title: 'L’optimisation et le terrain',
    when: '2026, troisième année',
    gist: 'L’année où tout s’est accéléré.',
    items: [
      'Algorithmes d’optimisation : optimisation stochastique, programmation dynamique, métaheuristiques.',
      'Techniques de recherche : exploration d’espaces d’états, heuristiques, recherche locale.',
      'Stage en IA chez Digital World Technologies : OCR, NLP et extraction d’information.',
      'DAO Assistant, développé seul jusqu’au prototype, et conception de Sentinelle.',
    ],
  },
  {
    title: 'La recherche et l’ouverture',
    when: '2026 à aujourd’hui',
    gist: 'Écoles d’été, mathématiques appliquées, communauté.',
    items: [
      'Data Tour 2026 : phase nationale de la Coupe d’Afrique des Nations en Science des Données, avec l’équipe BEST (Bénin).',
      'École d’été EEML 2026, documentée dans un journal d’apprentissage de 87 pages.',
      'Deep Learning Indaba 2026.',
      'Sélection à l’Académie des Mathématiques Appliquées.',
      'Programme GCI du Matsuo-Iwasawa Lab, Université de Tokyo, en cours.',
      'Sentinelle lauréat du concours créatif IA du Forum sur la coopération sino-africaine, octobre 2026.',
      'Candidature au rôle d’ambassadeur IndabaX.',
    ],
  },
];

export const JOURNAL = {
  pages: 87,
  title: 'Mon journal de l’EEML 2026',
  text:
    'Pendant l’Eastern European Machine Learning Summer School, j’ai réécrit chaque cours avec mes mots : les démonstrations refaites à la main, les questions restées ouvertes, les liens avec mes projets. Si je ne peux pas l’expliquer par écrit, c’est que je ne l’ai pas compris.',
  link: 'https://github.com/Sylvere-Kinox/eeml-2026-learning-journal',
};

export const COMMUNITY = [
  { name: 'Club IA IoT', role: 'Participant actif', text: 'Le club étudiant où l’on apprend en construisant.' },
  { name: 'BCAI', role: 'Membre', text: 'Benin Community IA, la communauté béninoise des praticiens de l’IA.' },
  { name: 'DevBénin', role: 'Membre', text: 'La communauté des développeurs du Bénin.' },
  { name: 'SGAC', role: 'Membre', text: 'Space Generation Advisory Council, réseau mondial des jeunes du spatial.' },
  { name: 'GDG Abomey-Calavi', role: 'Nouveau membre', text: 'Google Developer Group local, rencontres et ateliers.' },
  { name: 'Deep Learning Indaba', role: 'Participant 2026', text: 'Candidat ambassadeur IndabaX.' },
];

export const TESTIMONIAL = {
  quote:
    'Sylvère fait preuve d’une rigueur analytique et d’une curiosité intellectuelle remarquables pour un étudiant de son niveau. Sa capacité à comprendre des systèmes complexes et à en extraire des structures exploitables le distingue clairement.',
  author: 'Dr Pierre Jérôme Zohou',
  title: 'Docteur en informatique appliquée à l’hydrologie, chercheur et encadrant académique, CIPMA, Université d’Abomey-Calavi',
};

export const CONTACT = {
  title: ['Un stage,', 'un projet,', 'une idée ?'],
  text: 'Je cherche des équipes qui s’attaquent à des problèmes concrets avec de l’IA. Écrivez-moi, je réponds sous 48 heures.',
};
