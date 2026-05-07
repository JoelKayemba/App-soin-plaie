# Runbook Installation et Lancement

## Prerequis

- Node.js 18+
- npm 9+
- Expo Go (mobile) ou emulateur/simulateur

## Installation

Depuis la racine du projet:

```bash
npm install
```

## Lancement

```bash
npm start
```

Raccourcis Expo:

- `a` -> Android
- `i` -> iOS
- `w` -> Web

Commandes equivalentes:

```bash
npm run android
npm run ios
npm run web
```

## Variables d'environnement

Le projet charge les variables via `babel-plugin-react-native-dotenv`.

Fichiers/points clefs:

- `.env` (racine)
- `babel.config.js`
- `src/config/epic.js` (imports `@env`)
- `src/config/env.js` (acces `process.env` auxiliaire)

Variables attendues:

- `EPIC_CLIENT_ID_SANDBOX`
- `EPIC_SANDBOX_BASE_URL`
- `EPIC_REDIRECT_URI_SANDBOX`
- `EPIC_SCOPES_SANDBOX`
- `EPIC_MODE`
- etc. (voir `.env` et `src/config/epic.js`)

## Verification rapide post-install

1. Ouvrir l'app (`Accueil`, `Soins`, `Produits`, `Lexique`).
2. Aller dans `Soins` et verifier le chargement des tables d'evaluation.
3. Parcourir quelques etapes, revenir, verifier persistance de progression.
4. Finaliser l'evaluation pour ouvrir `EvaluationSummary`.
5. Ouvrir `Constats` et verifier la generation.

## Depannage

### Metro cache incoherent

```bash
npx expo start --clear
```

### Reinstallation complete

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreurs de chargement JSON tables

- Verifier `src/services/TableDataLoader.js`
- Verifier la presence des JSON dans `src/data/evaluations/columns/col1/` et `col2_constats/`

### Viewer 3D ne s'affiche pas

- Verifier `src/components/ui/BodyModelViewer.jsx`
- Verifier route `BodyModel3D` dans `src/navigation/AppNavigator.jsx`
- Tester sur appareil reel si possible

