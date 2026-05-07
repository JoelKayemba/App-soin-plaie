# Architecture Applicative

## Vue globale

L'application suit une architecture modulaire:

- `App.js` compose les providers (Redux, Theme, FontSize, Epic, Navigation).
- Navigation principale en Stack (`AppNavigator`) + tabs (`TabNavigator`).
- Moteur d'evaluation declaratif base sur JSON + renderers dynamiques.

## Couches principales

### 1) UI / Ecrans (`src/app`)

Exemples:

- `HomeScreen`
- `EvaluationScreen`
- `EvaluationSummaryScreen`
- `ConstatsScreen`
- `BodyModel3DScreen`

Responsabilite:

- orchestration UX
- navigation
- affichage des donnees renderisees par le moteur

### 2) Composants (`src/components`)

- `ui/` composants thematises et formulaires (`RadioGroup`, `NumericInput`, etc.)
- `common/` composants transverses
- `cards/` composants de listing

### 3) Features (`src/features`)

- `evaluation/table-renderers/`
  - `core/`: logique generique de rendu
  - `tables/`: renderers specifiques par table (`C1T01` a `C1T34`)
  - `utils/`: calculs, conversions, helpers, effets
- `calculators/`: IPSCB, Braden, Braden Q

### 4) Services (`src/services`)

- `TableDataLoader`: charge/cashe les tables JSON
- `ConstatsGenerator`: evalue les regles de constats
- `EvaluationEngine`: logique metier transversale

### 5) Donnees (`src/data`)

- `evaluations/columns/col1`: tables d'evaluation (source de formulaire)
- `evaluations/columns/col2_constats`: tables de constats (rules/mapping)
- autres jeux de donnees: lexique, references, produits

### 6) Integration externe (`src/integration/epic`)

- Auth SMART on FHIR
- services FHIR
- mappers Epic -> modele evaluation

## Navigation

### Stack principal (`src/navigation/AppNavigator.jsx`)

Routes majeures:

- `Main` (tabs)
- `EvaluationClinique`
- `EvaluationSummary`
- `Constats`
- `BodyModel3D`

### Tabs (`src/navigation/TabNavigator.jsx`)

- `Accueil`
- `Soins`
- `Produits`
- `Lexique`

## Etat global et contextes

- Redux: favoris
- ThemeContext: theme + couleurs
- EpicContext: etat auth/patient Epic
- FontSizeProvider: taille de police persistante

## Stockage

- Evaluation en cours: `src/storage/evaluationLocalStorage.js` (SecureStore)
- Favoris/theme/font size: stockage local dedie

## Notes architecture

- Design orientee configuration: ajout de champs majoritairement via JSON.
- Bonne base de maintenabilite, mais heterogeneite des conventions (imports env, stockage, etat de completion des modules) a harmoniser.

