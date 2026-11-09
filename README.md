# Portfolio de Sylvère Kinox Kouffossi

React 19 + Vite. Aucune bibliothèque d'animation : tout est en CSS et en hooks maison.

## Lancer

```bash
npm install
npm run dev
```

## Où modifier quoi

| Besoin | Fichier |
| --- | --- |
| Textes, projets, parcours, communautés | `src/data/content.js` |
| Certifications (ajout, lien, image) | `src/data/certs.js` |
| Couleurs, typographie, animations | `src/styles.css` (bloc `:root` en tête) |

Un texte écrit `[entre crochets]` est à compléter : il s'affiche surligné et la barre
« Brouillon » en bas de page les compte. Quand tout est rempli, retirer `<ReviewBar />`
dans `src/App.jsx`.

## Ajouter un certificat

1. Scan : déposer l'image dans `public/certs/`, renseigner `image: '/certs/nom.jpg'`
   et retirer `placeholder: true`. La carte s'ouvre en plein écran.
2. Sans image ni lien, la carte s'affiche simplement, sans action.
3. Lien officiel (DataCamp, Udemy) : coller l'adresse dans `verifyUrl`. La carte devient un lien.
4. Programme non terminé : `status: 'en-cours'`.

## Composants

- `Hero` + `SwarmCanvas` : essaim particulaire (PSO) qui poursuit le pointeur.
- `About`, `Projects` (+ `DaoDemo`, `SentinelleDemo`), `Timeline`, `Certifications` (galerie + visionneuse),
  `Sections` (journal, communauté, recommandation, contact).
- `ui.jsx` : briques réutilisables (`Reveal`, `Marquee`, `WaxBand`, `Seal`, `Magnetic`, `CursorRing`, `ScrollProgress`).
