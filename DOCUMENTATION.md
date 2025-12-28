# Documentation Technique - App Soin Plaie

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture générale](#architecture-générale)
3. [Structure du projet](#structure-du-projet)
4. [Installation et configuration](#installation-et-configuration)
5. [Point d'entrée et initialisation](#point-dentrée-et-initialisation)
6. [Système de navigation](#système-de-navigation)
7. [Système de thèmes](#système-de-thèmes)
8. [Architecture déclarative JSON](#architecture-déclarative-json)
9. [Système de rendu dynamique](#système-de-rendu-dynamique)
10. [Système de génération de constats](#système-de-génération-de-constats)
11. [Stockage local](#stockage-local)
12. [Calculatrices médicales](#calculatrices-médicales)
13. [Intégration Epic/HALO](#intégration-epichalo)
14. [Composants UI](#composants-ui)
15. [Hooks personnalisés](#hooks-personnalisés)
16. [Services](#services)
17. [Guide de développement](#guide-de-développement)
18. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

**App Soin Plaie** est une application mobile React Native/Expo conçue pour les professionnels de santé travaillant dans les soins de plaies. L'application fonctionne en mode **offline-first** et permet :

- L'évaluation clinique complète avec 34 tables d'évaluation
- La génération automatique de constats cliniques
- L'utilisation de calculatrices médicales (IPSCB, Braden, Braden Q)
- L'accès à un lexique dermatologique complet
- La consultation de références médicales
- La gestion d'un catalogue de produits et pansements
- L'intégration prévue avec Epic/HALO (en développement)

### Technologies principales

- **React Native** 0.81.5
- **Expo** 54.0.22
- **React** 19.1.0
- **React Navigation** 7.x (Stack + Bottom Tabs)
- **Redux Toolkit** 2.9.0
- **Expo Secure Store** 15.0.7
- **TypeScript-ready** (structure préparée mais code en JavaScript)

---

## Architecture générale

### Principes architecturaux

1. **Architecture déclarative** : Les formulaires sont définis dans des fichiers JSON plutôt que dans le code
2. **Séparation des responsabilités** : Logique métier, données et interface utilisateur sont séparées
3. **Rendu dynamique** : Système générique de rendu basé sur des configurations JSON
4. **Offline-first** : Toutes les données essentielles sont stockées localement
5. **Modularité** : Architecture modulaire facilitant l'ajout de nouvelles fonctionnalités

### Flux de données

```
JSON Tables (col1/col2_constats)
    ↓
TableDataLoader (chargement + cache)
    ↓
EvaluationEngine / ConstatsGenerator (logique métier)
    ↓
ContentDetector (routage vers renderer)
    ↓
TableRenderer spécifique / ElementRenderer générique
    ↓
Composants UI (RadioGroup, CheckboxGroup, etc.)
    ↓
Stockage local (Expo Secure Store)
```

---

## Structure du projet

```
app-soin-plaie/
├── App.js                    # Point d'entrée principal
├── index.js                  # Enregistrement React Native
├── app.json                  # Configuration Expo
├── babel.config.js           # Configuration Babel
├── package.json              # Dépendances
│
├── assets/                   # Images et ressources statiques
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
├── src/
│   ├── app/                  # Écrans principaux
│   │   ├── HomeScreen.jsx
│   │   ├── EvaluationScreen.jsx
│   │   ├── EvaluationSummaryScreen.jsx
│   │   ├── ConstatsScreen.jsx
│   │   ├── LexiqueScreen.jsx
│   │   ├── ProductsScreen.jsx
│   │   ├── IpscbScreen.jsx
│   │   ├── BradenScreen.jsx
│   │   ├── BradenQScreen.jsx
│   │   └── settings/
│   │
│   ├── components/           # Composants réutilisables
│   │   ├── ui/               # Composants UI de base
│   │   │   ├── forms/        # Composants de formulaire
│   │   │   │   ├── RadioGroup.jsx
│   │   │   │   ├── CheckboxGroup.jsx
│   │   │   │   ├── NumericInput.jsx
│   │   │   │   ├── DateInput.jsx
│   │   │   │   └── ...
│   │   │   ├── ContentDetector.jsx
│   │   │   ├── TableRenderer.jsx
│   │   │   └── Themed.js     # Composants thématisés
│   │   ├── common/           # Composants communs
│   │   ├── cards/            # Cartes de contenu
│   │   ├── epic/             # Composants Epic
│   │   └── layout/           # Composants de mise en page
│   │
│   ├── context/              # Contextes React
│   │   ├── ThemeContext.js   # Gestion du thème clair/sombre
│   │   └── EpicContext.jsx   # État Epic/HALO
│   │
│   ├── data/                 # Données statiques (JSON)
│   │   ├── evaluations/
│   │   │   ├── columns/
│   │   │   │   ├── col1/     # 34 tables d'évaluation
│   │   │   │   └── col2_constats/  # Tables de constats
│   │   │   ├── evaluation_steps.json
│   │   │   └── evaluation_helpers/
│   │   ├── lexiques.json
│   │   ├── products.json
│   │   ├── references.json
│   │   └── rules/
│   │       └── rulebook.json
│   │
│   ├── features/             # Fonctionnalités métier
│   │   ├── calculators/      # Calculatrices médicales
│   │   │   ├── ipscb/
│   │   │   ├── braden/
│   │   │   └── braden-q/
│   │   └── evaluation/       # Système d'évaluation
│   │       └── table-renderers/
│   │           ├── core/     # Renderers génériques
│   │           ├── tables/   # Renderers spécifiques (34 tables)
│   │           ├── components/  # Composants spéciaux
│   │           └── utils/    # Utilitaires
│   │
│   ├── hooks/                # Hooks personnalisés React
│   │   ├── useEvaluationRouting.js
│   │   ├── useTableData.js
│   │   ├── useThemeMode.js
│   │   ├── useResponsive.js
│   │   └── ...
│   │
│   ├── integration/          # Intégrations externes
│   │   └── epic/
│   │       ├── services/
│   │       ├── mappers/
│   │       └── utils/
│   │
│   ├── navigation/           # Configuration navigation
│   │   ├── AppNavigator.jsx  # Stack Navigator
│   │   └── TabNavigator.jsx  # Bottom Tabs
│   │
│   ├── services/             # Services métier
│   │   ├── TableDataLoader.js      # Chargement des tables JSON
│   │   ├── ConstatsGenerator.js    # Génération de constats
│   │   ├── EvaluationEngine.js     # Moteur d'évaluation
│   │   └── index.js
│   │
│   ├── storage/              # Gestion du stockage
│   │   └── evaluationLocalStorage.js
│   │
│   ├── store/                # Redux Store
│   │   ├── index.js
│   │   ├── favoritesSlice.js
│   │   └── favoritesPersistence.js
│   │
│   ├── styles/               # Styles et thèmes
│   │   ├── colors.js         # Palette de couleurs
│   │   └── spacing.js        # Espacements
│   │
│   └── utils/                # Utilitaires généraux
│       ├── formatters.js
│       └── jsonLoader.js
│
└── scripts/                  # Scripts utilitaires
    └── clean-json-tables.js  # Nettoyage des fichiers JSON
```

---

## Installation et configuration

### Prérequis

- **Node.js** 18.0.0 ou supérieur
- **npm** 9.0.0 ou supérieur
- **Git**
- **Expo CLI** : `npm install -g expo-cli`
- **Expo Go** sur votre téléphone (iOS/Android) OU un émulateur/simulateur

### Installation

1. **Cloner le projet** (si applicable)
```bash
git clone [url-du-repo]
cd app-soin-plaie
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
npm start
# ou
expo start
```

4. **Lancer sur un appareil**
   - **iOS** : `npm run ios` ou appuyer sur `i` dans le terminal
   - **Android** : `npm run android` ou appuyer sur `a` dans le terminal
   - **Web** : `npm run web` ou appuyer sur `w` dans le terminal

### Configuration de l'environnement

Le projet utilise `react-native-dotenv` pour les variables d'environnement. Créez un fichier `.env` à la racine (voir `env.template` si disponible) :

```env
# Epic/HALO Configuration (optionnel)
EPIC_CLIENT_ID=your_client_id
EPIC_REDIRECT_URI=app-soin-plaie://oauth
EPIC_SANDBOX_URL=https://fhir.epic.com/interconnect-fhir-oauth
```

---

## Point d'entrée et initialisation

### index.js

Point d'entrée React Native qui enregistre l'application :

```javascript
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

### App.js

Fichier principal qui configure tous les providers et la navigation :

```javascript
// Structure des providers (ordre important)
<Provider store={store}>              // Redux
  <SafeAreaProvider>                  // Safe Area
    <ThemeProvider>                   // Thème clair/sombre
      <FontSizeProvider>              // Taille de police
        <EpicProvider>                // État Epic/HALO
          <NavigationContainer>       // Navigation
            <AppNavigator />          // Stack Navigator
          </NavigationContainer>
        </EpicProvider>
      </FontSizeProvider>
    </ThemeProvider>
  </SafeAreaProvider>
</Provider>
```

**Points clés** :
- L'ordre des providers est important
- `SafeAreaProvider` doit envelopper l'application
- `ThemeProvider` initialise le thème depuis le stockage sécurisé
- Les favoris sont chargés automatiquement au démarrage

---

## Système de navigation

### Architecture de navigation

L'application utilise **React Navigation** avec deux niveaux :

1. **Stack Navigator** (`AppNavigator.jsx`) : Navigation principale entre écrans
2. **Bottom Tabs Navigator** (`TabNavigator.jsx`) : Onglets principaux

### Tab Navigator

Onglets principaux :
- **Accueil** : Écran d'accueil avec outils rapides
- **Soins** : Écran d'évaluation clinique
- **Produits** : Catalogue de produits et pansements
- **Lexique** : Lexique dermatologique

### Stack Navigator

Écrans principaux :
- `Main` : TabNavigator (écran principal)
- `EvaluationClinique` : Évaluation complète
- `EvaluationSummary` : Résumé de l'évaluation
- `Constats` : Affichage des constats générés
- `IPSCB`, `Braden`, `BradenQ` : Calculatrices médicales
- `References`, `News`, `Search` : Consultation de contenu
- `Settings`, `AppearanceSettings` : Paramètres
- `Favoris` : Favoris utilisateur
- `HelperDetails` : Modal d'aide

### Navigation programmatique

```javascript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Naviguer vers un écran
navigation.navigate('EvaluationClinique', { 
  evaluationId: 'eval_123',
  tableId: 'C1T01' 
});

// Retour en arrière
navigation.goBack();
```

---

## Système de thèmes

### ThemeContext

Le système de thème utilise React Context avec persistance dans Expo Secure Store.

**Fichier** : `src/context/ThemeContext.js`

**Utilisation** :
```javascript
import { useTheme } from '@/context/ThemeContext';

const { theme, colors, isDark, toggleTheme } = useTheme();

// theme : 'light' | 'dark'
// colors : objet avec toutes les couleurs du thème actif
// isDark : boolean
// toggleTheme() : fonction pour basculer le thème
```

### Palette de couleurs

Les couleurs sont définies dans `src/styles/colors.js` avec deux palettes :

- **light** : Palette pour le thème clair
- **dark** : Palette pour le thème sombre

**Structure des couleurs** :
```javascript
colors = {
  background,      // Fond principal
  surface,         // Cartes, zones secondaires
  primary,         // Couleur principale (bleu)
  text,            // Texte principal
  textSecondary,   // Texte secondaire
  border,          // Bordures
  success,         // Vert (succès)
  warning,         // Orange (avertissement)
  error,           // Rouge (erreur)
  // ... autres couleurs
}
```

### Composants thématisés

Le projet utilise des composants thématisés (`TView`, `TText`, `TIcon`) dans `src/components/ui/Themed.js` qui appliquent automatiquement les couleurs du thème.

**Exemple** :
```javascript
import { TView, TText } from '@/components/ui/Themed';

<TView style={{ backgroundColor: colors.surface }}>
  <TText style={{ color: colors.text }}>
    Texte thématisé
  </TText>
</TView>
```

---

## Architecture déclarative JSON

### Concept

L'application utilise une **architecture déclarative** où les formulaires d'évaluation sont définis dans des fichiers JSON plutôt que codés en dur. Cela permet :

- De modifier les formulaires sans toucher au code
- D'ajouter de nouvelles tables d'évaluation facilement
- De séparer la logique métier de l'interface utilisateur
- De faciliter la maintenance et les mises à jour

### Structure des tables d'évaluation (col1)

Les tables d'évaluation sont dans `src/data/evaluations/columns/col1/` avec la convention de nommage `table_XX_description.json`.

**Structure de base** :
```json
{
  "id": "C1T01",
  "title": "Données de base",
  "description": "Description de la table",
  "category": "patient_data",
  "column": 1,
  "table": 1,
  "elements": [
    {
      "id": "C1T01E01",
      "type": "date",
      "label": "Date de naissance",
      "required": true,
      "validation": {
        "min_date": "1900-01-01",
        "max_date": "today"
      },
      "routes": [
        {
          "to": "constat_redirect",
          "phase": "immediate",
          "condition": { ... }
        }
      ],
      "ui": {
        "component": "DateInput",
        "placeholder": "JJ/MM/AAAA"
      }
    }
  ]
}
```

**Propriétés principales** :
- `id` : Identifiant unique (format `C{col}T{tab}`)
- `title` : Titre affiché
- `elements` : Liste des champs du formulaire
- `routes` : Règles de navigation/redirection
- `validation_rules` : Règles de validation

### Types d'éléments

Les éléments peuvent être de différents types :

- `single_choice` : Choix unique (radio buttons)
- `multiple_choice` : Choix multiples (checkboxes)
- `text` : Texte libre
- `number` : Nombre
- `date` : Date
- `boolean` : Oui/Non
- `calculated` : Champ calculé automatiquement
- `constat` : Affichage d'un constat automatique
- `diabetes_glycemia_modal` : Modal spéciale pour la glycémie

### Structure des tables de constats (col2_constats)

Les tables de constats définissent les règles de génération automatique.

**Structure** :
```json
{
  "id": "C2T02",
  "title": "Statut de la plaie",
  "read_only": true,
  "auto_generated": true,
  "source_mapping": {
    "mapping_rules": [
      {
        "constat_id": "C2T02E01",
        "source": "C1T11E01",
        "condition": "wound_age_days <= 28",
        "description": "Plaie aiguë si ≤ 28 jours"
      }
    ]
  },
  "elements": [
    {
      "id": "C2T02E01",
      "type": "informational",
      "label": "Aiguë",
      "ui": {
        "component": "ResultBadge",
        "color": "#4CAF50"
      }
    }
  ]
}
```

**Propriétés principales** :
- `source_mapping` : Règles de mapping depuis les données d'évaluation
- `mapping_rules` : Liste des règles avec conditions
- `condition` : Condition JavaScript évaluée dynamiquement

### Système de routes

Les routes permettent la navigation conditionnelle et le déclenchement de constats.

**Phases de routage** :
- `immediate` : Exécution immédiate (ex: infection, urgence)
- `post_eval` : Après la fin de l'évaluation
- `on_plan` : Au moment d'ouvrir le plan de traitement
- `recap` : Inclusion dans le récapitulatif uniquement

**Exemple de route** :
```json
{
  "to": "C2T02",
  "phase": "immediate",
  "priority": 1,
  "condition": {
    "comparison": {
      "var": "age.days",
      "operator": "lt",
      "value": 30
    }
  },
  "note": "Redirection si patient < 1 mois"
}
```

### Système de conditions

Les conditions utilisent une grammaire spécifique pour évaluer les données :

**Opérateurs logiques** :
- `anyOf([...])` : Au moins un des IDs spécifiés
- `allOf([...])` : Tous les IDs spécifiés
- `noneOf([...])` : Aucun des IDs spécifiés

**Comparaisons** :
- `gte`, `lte`, `gt`, `lt`, `eq`, `neq`
- Variables : `age.days`, `age.years`, `bmi`, `wound_age_days`, `C1T01E01`, etc.

**Exemple** :
```json
"condition": "age.years >= 65"
"condition": "C1T15E01 === true && C1T15E02 === false"
"condition": {
  "anyOf": ["C1T27E01", "C1T27E02", "C1T27E03"]
}
```

---

## Système de rendu dynamique

### Architecture de rendu

Le système de rendu est hiérarchique :

```
ContentDetector
    ↓
getTableRenderer(tableId)
    ↓
TableRenderer spécifique (si existe) OU ElementRenderer générique
    ↓
Composants UI (RadioGroup, CheckboxGroup, etc.)
```

### ContentDetector

**Fichier** : `src/components/ui/ContentDetector.jsx`

Composant router qui :
1. Vérifie si un renderer spécifique existe pour la table
2. Si oui, l'utilise
3. Sinon, utilise le renderer générique via `ElementRenderer`

**Props** :
- `tableData` : Données de la table JSON
- `data` : Données de réponse de l'utilisateur
- `evaluationData` : Données complètes de l'évaluation
- `onDataChange` : Callback pour les changements de données
- `onNavigateToTable` : Callback pour navigation

### TableDataLoader

**Fichier** : `src/services/TableDataLoader.js`

Service pour charger les tables JSON avec système de cache.

**Méthodes principales** :
```javascript
import tableDataLoader from '@/services/TableDataLoader';

// Charger une table spécifique
const tableData = await tableDataLoader.loadTableData('C1T01');

// Charger toutes les tables
const allTables = await tableDataLoader.loadAllTables();
```

**Cache** :
- Les tables chargées sont mises en cache
- Les promesses de chargement sont également mises en cache pour éviter les doublons
- Cache persistant pendant la session

### ElementRenderer

**Fichier** : `src/features/evaluation/table-renderers/core/ElementRenderer.jsx`

Renderer générique qui interprète les éléments JSON et les convertit en composants React.

**Types d'éléments gérés** :
- `single_choice` → `RadioGroup`
- `multiple_choice` → `CheckboxGroup`
- `number` → `NumericInput`
- `text` → `TextInput`
- `date` → `DateInput`
- `boolean` → `BooleanInput`
- `calculated` → `CalculatedField`
- `constat` → `ConstatElement`
- `diabetes_glycemia_modal` → `DiabetesGlycemiaModalButton`

**Logique conditionnelle** :
L'ElementRenderer gère l'affichage conditionnel via `ConditionalLogic.js` :
- `conditional.depends_on` : Champs dont dépend l'élément
- `conditional.condition` : Type de condition (`anyOf`, `allOf`, etc.)
- `conditional.value` : Valeur attendue

### Renderers spécifiques

Certaines tables nécessitent une logique particulière et ont un renderer dédié dans `src/features/evaluation/table-renderers/tables/`.

**Tables avec renderers spécifiques** :
- `Table15Renderer.jsx` : Apport vasculaire (IPSCB complexe)
- `Table11Renderer.jsx` : Histoire de la plaie (logique spéciale)
- `Table27Renderer.jsx` : Signes d'infection (Continuum microbien)
- Et 31 autres renderers spécifiques

**Enregistrement** :
Les renderers sont enregistrés dans `src/features/evaluation/table-renderers/index.js` :

```javascript
const TABLE_RENDERERS = {
  'C1T01': Table01Renderer,
  'C1T15': Table15Renderer,
  // ...
};

export const getTableRenderer = (tableId) => {
  return TABLE_RENDERERS[tableId] || null;
};
```

---

## Système de génération de constats

### ConstatsGenerator

**Fichier** : `src/services/ConstatsGenerator.js`

Service principal pour générer les constats automatiquement à partir des données d'évaluation.

### Processus de génération

1. **Chargement de la table de constats** : Via `TableDataLoader`
2. **Évaluation des conditions** : Chaque règle de `source_mapping` est évaluée
3. **Construction du contexte** : Variables disponibles (`age`, `bmi`, `wound_age_days`, valeurs des champs)
4. **Sélection des constats** : Constats dont les conditions sont satisfaites
5. **Retour des résultats** : Liste des constats détectés + données de la table

### Utilisation

```javascript
import { constatsGenerator } from '@/services';

// Générer tous les constats pour une table
const result = await constatsGenerator.generateConstatsForTable(
  'C2T02',
  evaluationData
);

// result = {
//   detectedConstats: ['C2T02E01'],
//   constatTable: { ... },
//   evaluationContext: { ... }
// }

// Générer tous les constats
const allConstats = await constatsGenerator.generateAllConstats(evaluationData);
```

### Évaluation des conditions

Le système évalue les conditions JavaScript de manière sécurisée :

**Variables disponibles** :
- `age.years`, `age.months`, `age.days` : Âge du patient
- `bmi` : Indice de masse corporelle
- `wound_age_days` : Âge de la plaie en jours
- `C1T01E01`, `C1T03E12`, etc. : Valeurs des champs

**Exemples de conditions** :
```javascript
"wound_age_days <= 28"
"age.years >= 65"
"C1T15E01 === true && C1T15E02 === false"
"C1T27E01 === true || C1T27E02 === true"
```

### Affichage des constats

Les constats sont affichés via le composant `ConstatElement` dans `ElementRenderer.jsx` :

- **Type `informational`** : Badge informatif (`ResultBadge`)
- **Type `warning`** : Alerte clinique (`ClinicalAlert`)

**Intégration dans les tables** :
Les constats peuvent être intégrés directement dans les tables d'évaluation via un élément de type `constat` :

```json
{
  "id": "C1T11_WOUND_STATUS",
  "type": "constat",
  "label": "Statut de la plaie",
  "constat_table": "C2T02",
  "constat_element": "C2T02E01",
  "conditional": {
    "depends_on": "C1T11E01",
    "required": true
  }
}
```

---

## Stockage local

### evaluationLocalStorage

**Fichier** : `src/storage/evaluationLocalStorage.js`

Service de stockage local utilisant Expo Secure Store pour sauvegarder les données d'évaluation de manière sécurisée.

### Structure de stockage

Les données sont stockées avec des clés préfixées :
- Métadonnées : `app_soin_plaie_evaluations_{evaluationId}_meta`
- Données de table : `app_soin_plaie_evaluations_{evaluationId}_table_{tableId}`

### Fonctions principales

```javascript
import {
  loadEvaluationProgress,
  loadTableAnswers,
  saveTableProgress,
  deleteEvaluation,
  listAllEvaluations
} from '@/storage/evaluationLocalStorage';

// Charger la progression d'une évaluation
const progress = await loadEvaluationProgress('eval_123');

// Charger les réponses d'une table
const answers = await loadTableAnswers('eval_123', 'C1T01');

// Sauvegarder les réponses d'une table
await saveTableProgress('eval_123', 'C1T01', {
  answers: { C1T01E01: '1990-01-01', ... },
  completed: true
}, {
  lastVisitedTableId: 'C1T01'
});

// Supprimer une évaluation
await deleteEvaluation('eval_123');

// Lister toutes les évaluations
const evaluations = await listAllEvaluations();
```

### Métadonnées

Les métadonnées stockées incluent :
- `version` : Version du format de données
- `updatedAt` : Date de dernière mise à jour
- `lastVisitedTableId` : Dernière table visitée
- `savedTables` : Liste des tables sauvegardées avec leurs métadonnées

### Sauvegarde automatique

La sauvegarde se fait automatiquement à chaque modification via `onDataChange` dans les écrans d'évaluation.

---

## Calculatrices médicales

### IPSCB (Index de Pression Systolique Cheville-Bras)

**Fichier** : `src/features/calculators/ipscb/useIPSCBCalculator.js`

**Écran** : `src/app/IpscbScreen.jsx`

**Utilisation** :
```javascript
import { useIPSCBCalculator } from '@/features/calculators/ipscb';

const {
  pressures,
  indices,
  interpretation,
  handlePressureChange,
  calculateIndices
} = useIPSCBCalculator();
```

**Calcul** :
- IPSCB = max(PAS tibiale, PAS pédieuse) / max(PAS bras droit, PAS bras gauche)
- Calculé pour chaque jambe
- Interprétation automatique des résultats

### Échelle de Braden

**Fichier** : `src/features/calculators/braden/useBradenCalculator.js`

**Écran** : `src/app/BradenScreen.jsx`

**Composant** : `src/components/ui/special/BradenScale.jsx`

Évaluation du risque de lésions de pression avec 6 sous-échelles :
- Perception sensorielle
- Humidité
- Activité
- Mobilité
- Nutrition
- Friction et cisaillement

**Score** : 6-23 points
- 15-18 : Risque faible
- 13-14 : Risque modéré
- 10-12 : Risque élevé
- ≤9 : Risque très élevé

### Échelle de Braden Q (Pédiatrique)

**Fichier** : `src/features/calculators/braden-q/useBradenQCalculator.js`

**Écran** : `src/app/BradenQScreen.jsx`

Version pédiatrique de l'échelle de Braden avec adaptations pour les enfants.

---

## Intégration Epic/HALO

### État actuel

L'intégration Epic/HALO est en développement et en attente de validation par Epic pour accéder au sandbox.

### Architecture

**Fichiers principaux** :
- `src/context/EpicContext.jsx` : État global Epic
- `src/integration/epic/services/EpicAuthService.js` : Authentification OAuth
- `src/integration/epic/services/EpicFHIRService.js` : Requêtes FHIR
- `src/integration/epic/utils/PKCEService.js` : PKCE pour OAuth
- `src/hooks/useEpicAuth.js` : Hook pour l'authentification

### Configuration

Configuration dans `src/config/epic.js` et variables d'environnement :
- `EPIC_CLIENT_ID`
- `EPIC_REDIRECT_URI`
- `EPIC_SANDBOX_URL`

### Utilisation

```javascript
import { useEpicAuth } from '@/hooks/useEpicAuth';

const {
  isConnected,
  isConnecting,
  connect,
  disconnect,
  patientData
} = useEpicAuth();
```

---

## Composants UI

### Composants de formulaire

Tous les composants de formulaire sont dans `src/components/ui/forms/`.

#### RadioGroup

Choix unique (radio buttons).

**Props** :
```javascript
<RadioGroup
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onValueChange={setSelectedValue}
  label="Sélectionnez une option"
  required={true}
  error={errorMessage}
/>
```

#### CheckboxGroup

Choix multiples (checkboxes).

**Props** :
```javascript
<CheckboxGroup
  options={[...]}
  value={selectedValues}  // Array
  onValueChange={setSelectedValues}
  minSelections={0}
  maxSelections={3}
/>
```

#### NumericInput

Saisie numérique avec unités optionnelles.

**Props** :
```javascript
<NumericInput
  value={numericValue}
  onValueChange={setNumericValue}
  label="Poids"
  unit="kg"
  unit_options={[
    { unit: 'kg', label: 'Kilogrammes', min: 0, max: 300 },
    { unit: 'lbs', label: 'Livres', min: 0, max: 660 }
  ]}
  min={0}
  max={300}
  step={0.1}
  precision={1}
/>
```

#### DateInput

Saisie de date avec sélecteur.

**Props** :
```javascript
<DateInput
  value={dateValue}  // Format YYYY-MM-DD
  onValueChange={setDateValue}
  label="Date de naissance"
  minDate="1900-01-01"
  maxDate="today"
/>
```

#### BooleanInput

Choix Oui/Non.

**Props** :
```javascript
<BooleanInput
  value={booleanValue}
  onValueChange={setBooleanValue}
  label="Avez-vous des allergies ?"
/>
```

### Composants spéciaux

#### ClinicalAlert

Alerte clinique avec différents niveaux de sévérité.

**Fichier** : `src/components/ui/ClinicalAlert.jsx`

**Utilisation** :
```javascript
<ClinicalAlert
  alert={{
    type: 'warning',
    severity: 'important',
    message: 'Attention : ...',
    title: 'Avertissement'
  }}
/>
```

#### ResultBadge

Badge pour afficher des résultats.

**Fichier** : `src/components/ui/forms/ResultBadge.jsx`

**Utilisation** :
```javascript
<ResultBadge
  label="Plaie aiguë"
  value="< 4 semaines"
  color="#4CAF50"
/>
```

---

## Hooks personnalisés

### useEvaluationRouting

**Fichier** : `src/hooks/useEvaluationRouting.js`

Gère les redirections immédiates basées sur les routes définies dans les éléments JSON.

**Utilisation** :
```javascript
const {
  shouldRedirect,
  redirectReason,
  checkAndHandleRedirect,
  resetRedirect
} = useEvaluationRouting();

// Vérifier une redirection
const redirect = checkAndHandleRedirect(fieldId, value, element);
```

### useTableData

**Fichier** : `src/hooks/useTableData.js`

Gère le chargement et la sauvegarde des données d'une table.

**Utilisation** :
```javascript
const {
  data,
  errors,
  isLoading,
  handleDataChange,
  saveProgress,
  validate
} = useTableData(evaluationId, tableId);
```

### useThemeMode

**Fichier** : `src/hooks/useThemeMode.js`

Hook simplifié pour accéder au thème.

**Utilisation** :
```javascript
const { theme, colors, isDark, toggleTheme } = useThemeMode();
```

### useResponsive

**Fichier** : `src/hooks/useResponsive.js`

Gère la responsivité de l'interface.

**Utilisation** :
```javascript
const {
  windowClass,  // 'narrow' | 'expanded' | 'wide'
  isTablet,
  spacing,
  typeScale
} = useResponsive();
```

---

## Services

### TableDataLoader

**Fichier** : `src/services/TableDataLoader.js`

Service singleton pour charger les tables JSON avec cache.

**Méthodes** :
- `loadTableData(tableId)` : Charger une table
- `loadAllTables()` : Charger toutes les tables
- `clearCache()` : Vider le cache

### ConstatsGenerator

**Fichier** : `src/services/ConstatsGenerator.js`

Service singleton pour générer les constats.

**Méthodes** :
- `generateConstatsForTable(constatTableId, evaluationData)` : Générer les constats d'une table
- `generateAllConstats(evaluationData)` : Générer tous les constats
- `evaluateCondition(condition, context)` : Évaluer une condition
- `calculateAge(birthDate)` : Calculer l'âge
- `calculateWoundAge(appearanceDate)` : Calculer l'âge de la plaie

### EvaluationEngine

**Fichier** : `src/services/EvaluationEngine.js`

Moteur d'évaluation pour la logique métier (en développement).

---

## Guide de développement

### Ajouter une nouvelle table d'évaluation

1. **Créer le fichier JSON** dans `src/data/evaluations/columns/col1/` :
   - Nom : `table_XX_description.json`
   - ID : `C1TXX` (XX = numéro de table)

2. **Enregistrer dans TableDataLoader** :
   - Ajouter l'import dans `TableDataLoader.js`
   - Ajouter au mapping `_getAllTableImports()`

3. **Créer un renderer spécifique** (si nécessaire) :
   - Fichier : `src/features/evaluation/table-renderers/tables/TableXXRenderer.jsx`
   - Enregistrer dans `src/features/evaluation/table-renderers/index.js`

4. **Ajouter à evaluation_steps.json** :
   - Ajouter l'étape dans la liste des steps

### Ajouter un nouveau type de constat

1. **Créer le fichier JSON** dans `src/data/evaluations/columns/col2_constats/` :
   - Nom : `table_XX_description.json`
   - ID : `C2TXX`

2. **Définir les règles de mapping** :
   - `source_mapping.mapping_rules` avec conditions

3. **Enregistrer dans TableDataLoader** :
   - Ajouter l'import dans `TableDataLoader.js`

4. **Enregistrer dans ConstatsGenerator** :
   - Ajouter `C2TXX` à la liste `constatTableIds` dans `generateAllConstats()`

### Ajouter un nouveau composant de formulaire

1. **Créer le composant** dans `src/components/ui/forms/` :
   ```javascript
   const NewComponent = ({ value, onValueChange, label, ...props }) => {
     const { colors } = useTheme();
     // Implémentation
   };
   export default NewComponent;
   ```

2. **Exporter dans `src/components/ui/forms/index.js`**

3. **Intégrer dans ElementRenderer** :
   - Ajouter le case dans le switch de `renderElement()`

### Ajouter une nouvelle calculatrice médicale

1. **Créer le hook** dans `src/features/calculators/nom_calculatrice/` :
   - `useNomCalculator.js`

2. **Créer l'écran** dans `src/app/NomCalculatorScreen.jsx`

3. **Ajouter à la navigation** :
   - Dans `AppNavigator.jsx`

4. **Ajouter l'accès depuis l'accueil** :
   - Dans `HomeScreen.jsx` ou `ToolsSection.jsx`

### Modifier le système de thème

1. **Ajouter/modifier des couleurs** :
   - Modifier `src/styles/colors.js`
   - Ajouter dans les palettes `light` et `dark`

2. **Utiliser dans les composants** :
   - Via `useTheme()` ou `useThemeMode()`
   - Les composants `TView`, `TText` appliquent automatiquement les couleurs

### Ajouter une nouvelle route de navigation

1. **Créer l'écran** dans `src/app/`

2. **Ajouter au Stack Navigator** :
   - Dans `src/navigation/AppNavigator.jsx`
   ```javascript
   <Stack.Screen name="NouvelEcran" component={NouvelEcran} />
   ```

3. **Naviguer programmatiquement** :
   ```javascript
   navigation.navigate('NouvelEcran', { params });
   ```

---

## Bonnes pratiques

### Structure du code

- **Organisation modulaire** : Chaque fonctionnalité dans son dossier
- **Séparation des responsabilités** : UI, logique métier, données séparées
- **Nommage cohérent** : 
  - Composants : PascalCase (`TableRenderer`)
  - Hooks : camelCase avec préfixe `use` (`useTableData`)
  - Services : camelCase (`tableDataLoader`)
  - Fichiers : correspond au nom du composant/service

### Gestion des données

- **Sauvegarde automatique** : Toujours sauvegarder lors des modifications
- **Validation** : Valider les données avant sauvegarde
- **Gestion d'erreurs** : Toujours gérer les erreurs de manière appropriée
- **Cache** : Utiliser le cache pour les données fréquemment accédées

### Performance

- **Lazy loading** : Charger les tables à la demande
- **Memoization** : Utiliser `useMemo` et `useCallback` pour optimiser
- **Éviter les re-renders** : Utiliser `React.memo` si nécessaire
- **Optimiser les images** : Utiliser des images optimisées

### Accessibilité

- **Labels** : Toujours fournir des labels pour les champs
- **Descriptions** : Fournir des descriptions pour l'aide
- **Couleurs** : Ne pas se fier uniquement aux couleurs (utiliser des icônes)
- **Contraste** : Respecter les ratios de contraste

### Tests

- **Tests unitaires** : Tester les fonctions utilitaires
- **Tests d'intégration** : Tester les flux complets
- **Tests E2E** : Tester les scénarios utilisateur complets

### Documentation

- **Commentaires** : Documenter les fonctions complexes
- **README** : Maintenir la documentation à jour
- **Types** : Préparer pour TypeScript (JSDoc si nécessaire)

---

## Conclusion

Cette documentation couvre les aspects principaux de l'architecture et du fonctionnement de l'application **App Soin Plaie**. Pour toute question ou contribution, référez-vous à cette documentation et aux commentaires dans le code source.

**Points clés à retenir** :
- Architecture déclarative basée sur JSON
- Système de rendu dynamique générique
- Génération automatique de constats
- Stockage local sécurisé
- Thème clair/sombre avec persistance
- Navigation hiérarchique (Stack + Tabs)

Pour plus de détails sur des fonctionnalités spécifiques, consultez les fichiers sources et les commentaires dans le code.

