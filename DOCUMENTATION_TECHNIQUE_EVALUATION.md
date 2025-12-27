# Documentation Technique - Système d'Évaluation

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture générale](#architecture-générale)
3. [Structure des données](#structure-des-données)
4. [Flux de données complet](#flux-de-données-complet)
5. [Système de rendu](#système-de-rendu)
6. [Système de constats](#système-de-constats)
7. [Routage et conditions](#routage-et-conditions)
8. [Calculs et dérivations](#calculs-et-dérivations)
9. [Stockage local](#stockage-local)
10. [Exemples concrets](#exemples-concrets)
11. [Guide pour ajouter une nouvelle table](#guide-pour-ajouter-une-nouvelle-table)

---

## Vue d'ensemble

Le système d'évaluation est une application React Native qui permet de collecter des données cliniques structurées sur les patients et leurs plaies. L'architecture est basée sur une séparation claire entre :

- **Données (JSON)** : Structure déclarative des tables, éléments, et règles
- **Logique (JavaScript)** : Moteur d'évaluation, calculs, et génération de constats
- **Interface (React)** : Composants de rendu et gestion de l'état

### Principes fondamentaux

1. **Déclaratif** : Les tables sont définies en JSON, pas en code
2. **Modulaire** : Chaque table peut avoir son propre renderer ou utiliser le renderer générique
3. **Extensible** : Facile d'ajouter de nouvelles tables sans modifier le code existant
4. **Offline-first** : Toutes les données sont stockées localement
5. **Type-safe** : Validation des données à chaque étape

---

## Architecture générale

### Structure des fichiers

```
src/
├── app/
│   └── EvaluationScreen.jsx          # Écran principal de l'évaluation
│
├── data/evaluations/
│   ├── evaluation_steps.json         # Configuration des étapes
│   └── columns/
│       ├── col1/                     # Tables d'évaluation (C1T01 à C1T34)
│       │   ├── table_01_basic_data.json
│       │   ├── table_11_wound_history.json
│       │   └── ...
│       └── col2_constats/            # Tables de constats (C2T01 à C2T05)
│           ├── table_02_statut_plaie.json
│           └── ...
│
├── services/
│   ├── TableDataLoader.js            # Chargement des tables JSON
│   ├── ConstatsGenerator.js          # Génération des constats
│   └── EvaluationEngine.js           # Moteur d'évaluation
│
├── features/evaluation/table-renderers/
│   ├── core/
│   │   ├── ElementRenderer.jsx       # Rendu générique des éléments
│   │   ├── ConditionalLogic.js       # Logique conditionnelle
│   │   └── ElementFactory.jsx        # Factory pour créer les composants
│   ├── tables/
│   │   ├── Table01Renderer.jsx       # Renderers spécifiques
│   │   ├── Table15Renderer.jsx       # (pour tables complexes)
│   │   └── ...
│   ├── components/
│   │   ├── ContinuumMicrobien.jsx    # Composants spéciaux
│   │   └── DiabetesGlycemiaModal.jsx
│   └── utils/
│       ├── calculations.js           # Fonctions de calcul
│       ├── converters.js             # Conversion de structures
│       └── useTableEffects.js        # Effets et calculs automatiques
│
├── hooks/
│   ├── useTableData.js               # Gestion des données d'une table
│   └── useEvaluationRouting.js       # Gestion du routage
│
└── storage/
    └── evaluationLocalStorage.js     # Stockage local (AsyncStorage)
```

### Flux principal

```
1. EvaluationScreen charge evaluation_steps.json
   ↓
2. Pour chaque étape, charge la table JSON via TableDataLoader
   ↓
3. ContentDetector détermine le renderer à utiliser
   ↓
4. Le renderer (spécifique ou générique) rend les éléments
   ↓
5. Les données sont sauvegardées localement à chaque modification
   ↓
6. Les constats sont générés automatiquement via ConstatsGenerator
   ↓
7. Navigation vers l'étape suivante ou affichage du résumé
```

---

## Structure des données

### Format JSON des tables (col1)

Chaque table d'évaluation suit cette structure :

```json
{
  "id": "C1T01",
  "version": "1.0.0",
  "title": "Données de base",
  "description": "Informations générales du patient",
  "category": "patient_data",
  "column": 1,
  "table": 1,
  "metadata": {
    "created": "2025-01-05",
    "updated": "2025-01-05",
    "author": "Système d'évaluation clinique",
    "language": "fr-CA"
  },
  "elements": [
    {
      "id": "C1T01E01",
      "type": "date",
      "label": "Date de naissance",
      "description": "Date de naissance du patient",
      "required": true,
      "validation": {
        "min_date": "1900-01-01",
        "max_date": "today"
      },
      "routes": [
        {
          "to": "constat_redirect",
          "phase": "immediate",
          "condition": {
            "comparison": {
              "var": "age.days",
              "operator": "lt",
              "value": 30
            }
          }
        }
      ],
      "ui": {
        "component": "DateInput",
        "placeholder": "JJ/MM/AAAA"
      }
    }
  ],
  "validation_rules": {
    "required_fields": ["C1T01E01"]
  },
  "derived_data": {
    "age_calculations": {
      "source": "C1T01E01",
      "outputs": ["age_days", "age_months", "age_years"]
    }
  }
}
```

### Types d'éléments

Les éléments peuvent être de différents types :

| Type | Description | Composant UI |
|------|-------------|--------------|
| `single_choice` | Choix unique (radio buttons) | `RadioGroup` |
| `multiple_choice` | Choix multiples (checkboxes) | `CheckboxGroup` |
| `text` | Texte libre | `TextInput` |
| `number` | Nombre | `NumericInput` |
| `date` | Date | `DateInput` |
| `boolean` | Oui/Non | `SimpleCheckbox` |
| `calculated` | Champ calculé | `CalculatedField` |
| `constat` | Constat automatique | `ConstatElement` |
| `photo` | Upload de photos | `PhotoUpload` |
| `scale` | Échelle visuelle | `ScaleInput` |

### Tables avec blocs (ex: Table 15)

Certaines tables utilisent une structure de blocs :

```json
{
  "id": "C1T15",
  "blocks": {
    "inspection": {
      "id": "C1T15A",
      "title": "Inspection",
      "elements": [...]
    },
    "palpation": {
      "id": "C1T15B",
      "title": "Palpation",
      "elements": [...]
    },
    "ipscb": {
      "id": "C1T15D",
      "title": "IPSCB",
      "measurements": [...],
      "results": [...]
    }
  }
}
```

### Format JSON des constats (col2_constats)

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
        "calculation": "calculateWoundAge(C1T11E01).isRecent === true"
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

---

## Flux de données complet

### 1. Initialisation de l'évaluation

```javascript
// EvaluationScreen.jsx
const steps = evaluationSteps.evaluation_flow.column_1.steps;
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [evaluationData, setEvaluationData] = useState({});
```

1. Charge `evaluation_steps.json` pour obtenir la liste des étapes
2. Charge la progression sauvegardée depuis AsyncStorage
3. Restaure la dernière table visitée
4. Initialise l'état avec les données sauvegardées

### 2. Chargement d'une table

```javascript
// EvaluationScreen.jsx - loadCurrentTableData()
const tableData = await tableDataLoader.loadTableData(currentStep.id);
const savedAnswers = await loadTableAnswers(evaluationId, currentStep.id);

setEvaluationData(prev => ({
  ...prev,
  [currentStep.id]: {
    ...tableData,
    ...savedAnswers,
    ...existingData,
  }
}));
```

**TableDataLoader.js** :
- Vérifie le cache
- Charge le fichier JSON correspondant
- Retourne les données de la table

### 3. Rendu de la table

```javascript
// ContentDetector.jsx
const SpecificRenderer = getTableRenderer(tableData?.id);

if (SpecificRenderer) {
  return <SpecificRenderer {...props} />;
}
```

**Détection du renderer** :
- Si un renderer spécifique existe (ex: `Table15Renderer`), l'utilise
- Sinon, utilise le renderer générique via `ElementRenderer`

### 4. Rendu des éléments

```javascript
// Table01Renderer.jsx (exemple simple)
const renderElements = () => {
  return tableData.elements
    .filter(element => shouldShowElement(element, data, tableData.id))
    .map((element, index) => {
      const renderedElement = renderElement(element, renderProps);
      return (
        <TView key={element.id || index}>
          {renderedElement}
        </TView>
      );
    });
};
```

**ElementRenderer.jsx** :
- Reçoit l'élément et ses props
- Détermine le type d'élément
- Crée le composant UI approprié
- Applique la validation et les erreurs

### 5. Modification des données

```javascript
// EvaluationScreen.jsx - handleDataChange()
const handleDataChange = useCallback((fieldId, value) => {
  // Mise à jour locale
  setEvaluationData(prev => ({
    ...prev,
    [currentStep.id]: {
      ...prev[currentStep.id],
      [fieldId]: value
    }
  }));

  // Sauvegarde automatique
  saveTableProgress(evaluationId, currentStep.id, {
    ...evaluationData[currentStep.id],
    [fieldId]: value
  });

  // Vérification du routage
  processFieldChange(fieldId, value, element);
}, [currentStep, evaluationData]);
```

### 6. Génération des constats

```javascript
// ConstatsGenerator.js - generateConstatsForTable()
const constatResult = await constatsGenerator.generateConstatsForTable(
  'C2T02',
  evaluationData
);

// Évalue les conditions de source_mapping
// Retourne les constats détectés
```

---

## Système de rendu

### Architecture de rendu

```
ContentDetector
    ↓
getTableRenderer(tableId)
    ↓
[Renderer Spécifique OU Renderer Générique]
    ↓
ElementRenderer.renderElement()
    ↓
[Composant UI approprié]
```

### Renderers spécifiques

Certaines tables nécessitent une logique spéciale :

- **Table15Renderer** : Gestion des blocs, calculs IPSCB, questionnaire d'Édimbourg
- **Table11Renderer** : Gestion des routes vers tables conditionnelles
- **Table27Renderer** : Affichage conditionnel du continuum microbien

### Renderer générique

Pour les tables simples, `ElementRenderer` gère automatiquement :

1. **Filtrage conditionnel** : `shouldShowElement()` vérifie les conditions
2. **Création du composant** : `createElementWithCommonProps()` crée le composant UI
3. **Gestion des erreurs** : Affichage des erreurs de validation
4. **Calculs automatiques** : Via `useTableEffects`

### Logique conditionnelle

```javascript
// ConditionalLogic.js
export const shouldShowElement = (element, data, tableId) => {
  if (!element.conditional) return true;

  const { depends_on, value, condition } = element.conditional;

  // Condition "anyOf" : au moins un des champs doit être vrai
  if (condition === 'anyOf' && Array.isArray(depends_on)) {
    return depends_on.some(fieldId => {
      const fieldValue = data[fieldId];
      return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    });
  }

  // Condition "allOf" : tous les champs doivent être vrais
  if (condition === 'allOf' && Array.isArray(depends_on)) {
    return depends_on.every(fieldId => {
      const fieldValue = data[fieldId];
      return fieldValue === true || fieldValue === 'true' || fieldValue === 1;
    });
  }

  // Condition simple
  if (depends_on && !Array.isArray(depends_on)) {
    return data[depends_on] === value;
  }

  return true;
};
```

---

## Système de constats

### Architecture des constats

Les constats sont des conclusions automatiques générées à partir des données d'évaluation. Ils sont définis dans `col2_constats` et générés par `ConstatsGenerator`.

### Types de constats

1. **Constats calculés** : Générés directement dans les tables (ex: IPSCB, Braden)
2. **Constats synthétiques** : Générés depuis `col2_constats` (ex: Statut de la plaie, Type de plaie)

### Processus de génération

```javascript
// ConstatsGenerator.js
async generateConstatsForTable(constatTableId, evaluationData) {
  // 1. Charge la table de constats
  const constatTable = await tableDataLoader.loadTableData(constatTableId);
  
  // 2. Évalue les règles de source_mapping
  const detectedConstats = [];
  
  for (const rule of constatTable.source_mapping.mapping_rules) {
    const conditionMet = this.evaluateCondition(
      rule.condition,
      this.buildEvaluationContext(evaluationData)
    );
    
    if (conditionMet) {
      detectedConstats.push(rule.constat_id);
    }
  }
  
  // 3. Retourne les constats détectés
  return { detectedConstats, constatTable };
}
```

### Affichage des constats

Les constats peuvent être affichés de deux manières :

1. **Dans la table d'évaluation** : Via un élément de type `constat`
   ```json
   {
     "id": "C1T11_WOUND_STATUS",
     "type": "constat",
     "constat_table": "C2T02",
     "conditional": {
       "depends_on": "C1T11E01",
       "value": true
     }
   }
   ```

2. **Dans l'écran de constats** : Page dédiée affichant tous les constats

### Exemple : Statut de la plaie

```javascript
// Table 11 (Histoire de la plaie)
// L'utilisateur saisit la date d'apparition : C1T11E01 = "2024-12-01"

// ConstatsGenerator calcule :
const woundAge = calculateWoundAge("2024-12-01");
// { days: 45, isRecent: false, isChronic: true }

// Évalue la condition :
// "wound_age_days > 28" → true

// Génère le constat :
// C2T02E02 (Plaie chronique)
```

---

## Routage et conditions

### Système de routes

Les routes permettent de déclencher des actions basées sur les réponses :

```json
{
  "routes": [
    {
      "to": "C2T03E01",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "anyOf": ["C1T11E06_venous"]
      },
      "note": "Ulcère veineux détecté"
    }
  ]
}
```

### Phases de routage

| Phase | Description | Moment d'exécution |
|-------|-------------|-------------------|
| `immediate` | Redirection immédiate | Dès la modification du champ |
| `post_eval` | Après l'évaluation | À la fin de l'évaluation |
| `on_plan` | Lors de la création du plan | Pendant la création du plan de soins |
| `recap` | Dans le récapitulatif | Affichage du résumé |

### Conditions

Les conditions peuvent être :

1. **Simple** : `C1T03E08 === true`
2. **Comparaison** : `age >= 65`
3. **Logique** : `anyOf`, `allOf`, `noneOf`
4. **Complexe** : Combinaison de plusieurs conditions

```javascript
// ConstatsGenerator.js - evaluateCondition()
evaluateCondition(condition, context) {
  // Remplace les variables contextuelles
  let conditionStr = condition;
  conditionStr = conditionStr.replace(/\bage\b/g, context.age_years);
  conditionStr = conditionStr.replace(/\bwound_age_days\b/g, context.wound_age_days);
  
  // Remplace les références de champs
  for (const [fieldId, value] of Object.entries(context.fields)) {
    const regex = new RegExp(`\\b${fieldId}\\b`, 'g');
    conditionStr = conditionStr.replace(regex, JSON.stringify(value));
  }
  
  // Évalue la condition
  try {
    return eval(conditionStr);
  } catch (error) {
    console.warn('Erreur évaluation condition:', error);
    return false;
  }
}
```

---

## Calculs et dérivations

### Calculs automatiques

Certains champs sont calculés automatiquement :

1. **Âge** : Calculé depuis la date de naissance
2. **IMC** : Calculé depuis le poids et la taille
3. **Âge de la plaie** : Calculé depuis la date d'apparition
4. **IPSCB** : Calculé depuis les mesures de pression
5. **Surface BWAT** : Calculé depuis longueur × largeur

### Fonctions de calcul

```javascript
// calculations.js

// Calcul de l'âge
calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
  return {
    days: totalDays,
    months: Math.floor(totalDays / 30),
    years: Math.floor(totalDays / 365.25)
  };
}

// Calcul de l'âge de la plaie
calculateWoundAge(appearanceDate) {
  const today = new Date();
  const woundDate = new Date(appearanceDate);
  const diffDays = Math.ceil((today - woundDate) / (1000 * 60 * 60 * 24));
  return {
    days: diffDays,
    isRecent: diffDays <= 28,
    isChronic: diffDays > 28
  };
}

// Interprétation IPSCB
interpretIPSCB(valeur) {
  const num = parseFloat(valeur);
  if (num >= 1.0) return { niveau: 'Normal', color: '#4CAF50' };
  if (num >= 0.9) return { niveau: 'Limite', color: '#FF9800' };
  // ...
}
```

### useTableEffects

Ce hook gère les calculs automatiques lors des modifications :

```javascript
// useTableEffects.js
const { handleDataChange } = useTableEffects({
  tableData,
  data,
  onDataChange,
  setQuestionnaireKey,
  setSpecializedCondition,
  setSpecializedAlertVisible,
});

// Exemple : Calcul automatique de la surface BWAT
if (tableData.id === 'C1T16' && fieldId === 'C1T16E01') {
  const longueur = value;
  const largeur = data['C1T16E02'];
  if (longueur && largeur) {
    const surface = calculateBWATSurface(longueur, largeur);
    onDataChange('C1T16_SURFACE', surface);
  }
}
```

---

## Stockage local

### Structure de stockage

Les données sont stockées dans AsyncStorage avec cette structure :

```javascript
{
  "evaluation_C1": {
    "version": 1,
    "updatedAt": "2025-01-15T10:30:00Z",
    "lastVisitedTableId": "C1T11",
    "savedTables": {
      "C1T01": {
        "C1T01E01": "1990-05-15",
        "C1T01E02": "M",
        // ...
      },
      "C1T11": {
        "C1T11E01": "2024-12-01",
        "C1T11E06": ["C1T11E06_venous"],
        // ...
      }
    }
  }
}
```

### Fonctions de stockage

```javascript
// evaluationLocalStorage.js

// Sauvegarder les réponses d'une table
async saveTableProgress(evaluationId, tableId, tableData) {
  const progress = await loadEvaluationProgress(evaluationId);
  progress.savedTables[tableId] = extractAnswersFromTable(tableId, tableData);
  progress.updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(`evaluation_${evaluationId}`, JSON.stringify(progress));
}

// Charger les réponses d'une table
async loadTableAnswers(evaluationId, tableId) {
  const progress = await loadEvaluationProgress(evaluationId);
  return progress.savedTables[tableId] || {};
}

// Mettre à jour la dernière table visitée
async updateLastVisitedTable(evaluationId, tableId) {
  const progress = await loadEvaluationProgress(evaluationId);
  progress.lastVisitedTableId = tableId;
  await AsyncStorage.setItem(`evaluation_${evaluationId}`, JSON.stringify(progress));
  return progress;
}
```

### Sauvegarde automatique

Les données sont sauvegardées automatiquement à chaque modification :

```javascript
// EvaluationScreen.jsx
const handleDataChange = useCallback((fieldId, value) => {
  // Mise à jour de l'état
  setEvaluationData(prev => ({
    ...prev,
    [currentStep.id]: {
      ...prev[currentStep.id],
      [fieldId]: value
    }
  }));

  // Sauvegarde automatique
  saveTableProgress(evaluationId, currentStep.id, {
    ...evaluationData[currentStep.id],
    [fieldId]: value
  });
}, [currentStep, evaluationData]);
```

---

## Exemples concrets

### Exemple 1 : Table simple (Table 01 - Données de base)

**Fichier JSON** : `table_01_basic_data.json`

```json
{
  "id": "C1T01",
  "elements": [
    {
      "id": "C1T01E01",
      "type": "date",
      "label": "Date de naissance",
      "required": true,
      "ui": {
        "component": "DateInput"
      }
    }
  ]
}
```

**Flux** :
1. `EvaluationScreen` charge la table
2. `ContentDetector` détecte qu'il n'y a pas de renderer spécifique
3. Utilise le renderer générique (via `ElementRenderer`)
4. `ElementRenderer` crée un `DateInput` pour `C1T01E01`
5. L'utilisateur saisit la date
6. `handleDataChange` est appelé
7. Les données sont sauvegardées automatiquement

### Exemple 2 : Table avec constat (Table 11 - Histoire de la plaie)

**Fichier JSON** : `table_11_wound_history.json`

```json
{
  "id": "C1T11",
  "elements": [
    {
      "id": "C1T11E01",
      "type": "date",
      "label": "Moment d'apparition",
      "routes": [
        {
          "to": "C2T02",
          "phase": "immediate"
        }
      ]
    },
    {
      "id": "C1T11_WOUND_STATUS",
      "type": "constat",
      "constat_table": "C2T02",
      "conditional": {
        "depends_on": "C1T11E01",
        "value": true
      }
    }
  ]
}
```

**Flux** :
1. L'utilisateur saisit la date d'apparition (`C1T11E01`)
2. `useTableEffects` calcule l'âge de la plaie
3. L'élément `C1T11_WOUND_STATUS` devient visible (condition remplie)
4. `ConstatElement` charge `C2T02` via `ConstatsGenerator`
5. `ConstatsGenerator` évalue les conditions de `source_mapping`
6. Le constat approprié est affiché (Aiguë ou Chronique)

### Exemple 3 : Table complexe avec blocs (Table 15 - Apport vasculaire)

**Fichier JSON** : `table_15_vascular_assessment.json`

```json
{
  "id": "C1T15",
  "blocks": {
    "inspection": {
      "id": "C1T15A",
      "title": "Inspection",
      "elements": [...]
    },
    "ipscb": {
      "id": "C1T15D",
      "title": "IPSCB",
      "measurements": [
        {
          "id": "C1T15D01",
          "type": "number",
          "label": "Pression systolique cheville"
        }
      ],
      "results": [
        {
          "id": "C1T15D_RESULT",
          "type": "calculated",
          "label": "Résultat IPSCB"
        }
      ]
    }
  }
}
```

**Flux** :
1. `Table15Renderer` charge la table
2. Itère sur les blocs dans l'ordre défini
3. Pour chaque bloc, rend les éléments
4. Pour le bloc IPSCB :
   - Rend les champs de mesure
   - Calcule automatiquement le résultat IPSCB
   - Affiche l'interprétation colorée
   - Affiche les constats d'apport vasculaire

### Exemple 4 : Constat avec conditions complexes

**Fichier JSON** : `table_05_vascularisation_plaie.json`

```json
{
  "id": "C2T05",
  "source_mapping": {
    "mapping_rules": [
      {
        "constat_id": "C2T05E01",
        "condition": "age >= 65 || C1T03E08 === true || C1T03E09 === true || C1T03E11 === true || C1T03E12 === true",
        "description": "Avertissement IPSCB si âge >= 65 ou conditions médicales"
      },
      {
        "constat_id": "C2T05E02",
        "condition": "(C1T15P01 === false && C1T15P02 === false && C1T15P03 === false && C1T15P04 === false) && (C1T15P03 === 'C1T15P03_2' || C1T15P03 === 'C1T15P03_3' || C1T15P03 === 'C1T15P03_4' || C1T15P04 === 'C1T15P04_2' || C1T15P04 === 'C1T15P04_3' || C1T15P04 === 'C1T15P04_4')",
        "description": "Sans autre S/S si aucun signe d'inspection et pouls normaux"
      }
    ]
  }
}
```

**Flux** :
1. `ConstatsGenerator` charge `C2T05`
2. Construit le contexte d'évaluation avec toutes les données
3. Pour chaque règle, évalue la condition
4. Si la condition est remplie, ajoute le constat à la liste
5. Retourne les constats détectés
6. `ConstatElement` affiche les constats avec les badges appropriés

---

## Guide pour ajouter une nouvelle table

### Étape 1 : Créer le fichier JSON

Créez `src/data/evaluations/columns/col1/table_XX_nom.json` :

```json
{
  "id": "C1TXX",
  "version": "1.0.0",
  "title": "Titre de la table",
  "description": "Description",
  "category": "category_name",
  "column": 1,
  "table": XX,
  "elements": [
    {
      "id": "C1TXXE01",
      "type": "single_choice",
      "label": "Question",
      "required": true,
      "options": [
        {
          "id": "C1TXXE01_option1",
          "label": "Option 1",
          "value": "option1"
        }
      ],
      "ui": {
        "component": "RadioGroup"
      }
    }
  ]
}
```

### Étape 2 : Ajouter à TableDataLoader

Dans `src/services/TableDataLoader.js`, ajoutez l'import :

```javascript
const tableXX = await import('@/data/evaluations/columns/col1/table_XX_nom.json');
```

Et ajoutez au mapping :

```javascript
const tableMapping = {
  'C1TXX': tableXX.default,
  // ...
};
```

### Étape 3 : Ajouter à evaluation_steps.json

Dans `src/data/evaluations/evaluation_steps.json` :

```json
{
  "id": "C1TXX",
  "order": XX,
  "title": "Titre de la table",
  "description": "Description",
  "required": false,
  "category": "category_name"
}
```

### Étape 4 : Créer un renderer (si nécessaire)

Si la table nécessite une logique spéciale, créez `src/features/evaluation/table-renderers/tables/TableXXRenderer.jsx` :

```javascript
import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';

const TableXXRenderer = ({ tableData, data, errors, handleDataChange, evaluationData, showHelper }) => {
  const { colors } = useTheme();

  const renderProps = {
    tableData,
    data,
    errors,
    handleDataChange,
    evaluationData,
    colors,
    showHelper,
  };

  return (
    <TView>
      {tableData.elements
        .filter(element => shouldShowElement(element, data, tableData.id))
        .map((element, index) => (
          <TView key={element.id || index}>
            {renderElement(element, renderProps)}
          </TView>
        ))}
    </TView>
  );
};

export default TableXXRenderer;
```

Et enregistrez-le dans `src/features/evaluation/table-renderers/index.js` :

```javascript
import TableXXRenderer from './tables/TableXXRenderer';

export const getTableRenderer = (tableId) => {
  const renderers = {
    'C1TXX': TableXXRenderer,
    // ...
  };
  return renderers[tableId];
};
```

### Étape 5 : Tester

1. Lancez l'application
2. Naviguez jusqu'à votre nouvelle table
3. Vérifiez que les éléments s'affichent correctement
4. Testez la validation et la sauvegarde

---

## Points importants

### Performance

- **Cache** : `TableDataLoader` met en cache les tables chargées
- **Lazy loading** : Les tables ne sont chargées que lorsqu'elles sont nécessaires
- **Optimisation React** : Utilisation de `useCallback` et `useMemo` pour éviter les re-renders

### Sécurité

- **Validation** : Toutes les données sont validées avant sauvegarde
- **Sanitization** : Les conditions sont évaluées dans un contexte sécurisé
- **Type checking** : Validation des types de données

### Extensibilité

- **Nouveaux types d'éléments** : Ajoutez simplement un nouveau case dans `ElementRenderer`
- **Nouveaux calculs** : Ajoutez les fonctions dans `calculations.js`
- **Nouveaux constats** : Créez simplement un nouveau fichier JSON dans `col2_constats`

---

## Glossaire

- **Table** : Une unité d'évaluation (ex: C1T01 = Table 1 de la colonne 1)
- **Élément** : Un champ dans une table (ex: C1T01E01 = Élément 1 de la table 1)
- **Constat** : Conclusion automatique générée à partir des données
- **Route** : Règle de redirection ou d'action basée sur une condition
- **Bloc** : Section dans une table complexe (ex: Table 15 a plusieurs blocs)
- **Renderer** : Composant React qui affiche une table
- **Source mapping** : Règle qui lie une donnée d'évaluation à un constat

---

## Conclusion

Ce système d'évaluation est conçu pour être :
- **Maintenable** : Séparation claire des responsabilités
- **Extensible** : Facile d'ajouter de nouvelles fonctionnalités
- **Robuste** : Validation et gestion d'erreurs à tous les niveaux
- **Performant** : Optimisations pour une expérience fluide

Pour toute question ou amélioration, référez-vous à cette documentation ou consultez le code source.

