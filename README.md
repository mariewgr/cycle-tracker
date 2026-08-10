# Mon Cycle

Application de suivi de cycle menstruel façon Lively : calendrier, prédictions de règles/ovulation,
journal de symptômes et humeur, statistiques.

App React + Vite, 100% statique (aucun serveur, aucun compte) — les données restent dans le
`localStorage` du navigateur.

## Développement

```bash
npm install
npm run dev
```

## Déploiement (Vercel)

Le repo est prêt à être déployé tel quel :

1. Pousse le repo sur GitHub.
2. Sur [vercel.com](https://vercel.com), *Add New* → *Project* → importe ce repo GitHub.
3. Vercel détecte Vite automatiquement (`npm run build`, dossier `dist`) — laisse les réglages
   par défaut et déploie.
4. Chaque `git push` sur la branche principale redéploie automatiquement.

Le routage interne utilise un `HashRouter` (URLs en `#/calendrier`, `#/journal`...) exprès pour
ne nécessiter aucune règle de réécriture côté serveur — ça marche tel quel sur Vercel, Netlify,
GitHub Pages ou n'importe quel hébergement statique.

⚠️ Les données étant en `localStorage`, elles sont propres à chaque navigateur/appareil (pas de
compte ni de synchronisation). Si tu veux retrouver tes données sur plusieurs appareils, il
faudrait ajouter un backend (ex. Supabase, comme dans `series-tracker`).

## Apple Santé (import/export par fichier)

L'app reste 100% web (pas d'app iOS native, pas de HealthKit — Apple ne l'expose qu'aux apps
natives, ce qui demanderait un empaquetage type Capacitor + Xcode). À la place, l'onglet **Santé**
(`src/pages/Parametres.jsx`) fonctionne par fichier :

- **Import** : sur l'iPhone, app Santé → photo de profil → *Exporter toutes les données de
  santé* → transférer le `.zip` obtenu sur cet ordinateur et le sélectionner dans l'app (pas
  besoin de le dézipper, `src/healthImport.js` le fait en JS via `fflate`). Le fichier
  `export.xml` qu'il contient est scanné pour en extraire les jours de règles (type
  `HKCategoryTypeIdentifierMenstrualFlow`, avec le flux si connu) et les symptômes
  (crampes, maux de tête, fatigue, ballonnements, douleurs dos, nausées, acné, seins sensibles),
  puis fusionnés avec les données déjà dans l'app (sans écraser les entrées existantes).
- **Export** : bouton *Télécharger une sauvegarde* qui génère un JSON des données de l'app
  (`src/backup.js`), réimportable via *Restaurer une sauvegarde*. ⚠️ Ce n'est **pas** un format
  qu'Apple Santé sait relire — l'app Santé n'a pas de fonction d'import de fichier, uniquement
  l'export. Ce JSON sert de sauvegarde/portabilité pour Mon Cycle (changement d'appareil ou de
  navigateur), pas de pont retour vers Santé.

## Structure du projet

| Fichier | Rôle |
|---|---|
| `src/cycle.js` | Calculs de dates, regroupement des cycles, prédictions (règles, ovulation, fenêtre fertile) |
| `src/store.jsx` | État global (jours de règles, journal) persisté en `localStorage` |
| `src/pages/Dashboard.jsx` | Accueil : jour du cycle, phase, prochaine échéance |
| `src/pages/Calendrier.jsx` | Calendrier mensuel avec règles réelles/prévues, fenêtre fertile, ovulation |
| `src/pages/Journal.jsx` | Historique et saisie du journal (flux, symptômes, humeur, notes) |
| `src/pages/Statistiques.jsx` | Durée moyenne des cycles, régularité, symptômes/humeurs fréquents |
| `src/components/DayEditor.jsx` | Formulaire de saisie du journal pour une date donnée (réutilisé calendrier + journal) |
| `src/pages/Parametres.jsx` | Onglet Santé : import Apple Santé, sauvegarde/restauration |
| `src/healthImport.js` | Parsing de l'export Apple Santé (.zip/.xml) → jours de règles + symptômes |
| `src/backup.js` | Export/import JSON de sauvegarde des données de l'app |

## Fonctionnalités

- Suivi des règles en tapant les jours sur le calendrier
- Prédiction de la prochaine période, de l'ovulation et de la fenêtre de fertilité, basée sur la
  moyenne des derniers cycles
- Journal quotidien : flux, symptômes, humeur, notes libres
- Statistiques : longueur moyenne des cycles/règles, régularité, graphique des derniers cycles,
  symptômes et humeurs les plus fréquents
- Import de l'export Apple Santé (.zip/.xml), sauvegarde/restauration JSON
