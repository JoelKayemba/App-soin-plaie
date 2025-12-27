# Architecture des Constats

## Vue d'ensemble

Les constats sont générés automatiquement à partir des réponses de l'évaluation (colonne 1). Chaque table de sélection de l'évaluation peut générer un ou plusieurs constats.

## Format des données : JSON vs JavaScript

### ✅ **Recommandation : JSON pour les données, JavaScript pour la logique**

### JSON (dans `src/data/evaluations/columns/col2_constats/`)
- **Structure des constats** : labels, descriptions, configuration UI
- **Règles de mapping** : conditions déclaratives (ex: `"age >= 65"`, `"C1T03E12 === true"`)
- **Métadonnées** : version, auteur, dates

### JavaScript (dans `src/services/ConstatsGenerator.js`)
- **Logique d'évaluation** : évaluation des conditions, calculs
- **Génération des constats** : détection automatique basée sur les règles

## Structure d'une table de constats

```json
{
  "id": "C2T01",
  "title": "Cicatrisation possiblement ralentie par",
  "auto_generated": true,
  "source_mapping": {
    "mapping_rules": [
      {
        "constat_id": "C2T01E01",
        "source": "C1T01",
        "condition": "age >= 65",
        "description": "Vieillissement détecté si âge >= 65 ans"
      }
    ]
  },
  "elements": [
    {
      "id": "C2T01E01",
      "type": "informational",
      "label": "Vieillissement",
      "read_only": true
    }
  ]
}
```

## Utilisation du service ConstatsGenerator

### Exemple 1 : Générer tous les constats

```javascript
import { constatsGenerator } from '@/services';
import { loadEvaluationProgress } from '@/storage/evaluationLocalStorage';

// Charger les données d'évaluation
const evaluationId = 'eval-123';
const progress = await loadEvaluationProgress(evaluationId);
const evaluationData = progress.tables || {};

// Générer tous les constats
const allConstats = await constatsGenerator.generateAllConstats(evaluationData);

// Résultat :
// {
//   C2T01: {
//     detectedConstats: ['C2T01E01', 'C2T01E03'],
//     constatData: { ... },
//     constatTable: { ... }
//   },
//   C2T02: { ... },
//   C2T03: { ... }
// }
```

### Exemple 2 : Générer les constats pour une table spécifique

```javascript
import { constatsGenerator } from '@/services';

const constats = await constatsGenerator.generateConstatsForTable(
  'C2T01',
  evaluationData
);

console.log('Constats détectés:', constats.detectedConstats);
// ['C2T01E01', 'C2T01E03']
```

### Exemple 3 : Intégration dans l'écran d'évaluation

```javascript
// Dans EvaluationScreen.jsx ou EvaluationSummaryScreen.jsx
import { constatsGenerator } from '@/services';

// Après avoir terminé l'évaluation
const handleFinishEvaluation = async () => {
  // ... sauvegarder l'évaluation ...
  
  // Générer les constats
  const allConstats = await constatsGenerator.generateAllConstats(evaluationData);
  
  // Naviguer vers l'écran des constats avec les données
  navigation.navigate('ConstatsScreen', {
    constats: allConstats,
    evaluationId
  });
};
```

## Types de conditions supportées

### 1. Comparaisons simples
```json
"condition": "age >= 65"
"condition": "bmi_category === 'surpoids'"
"condition": "C1T03E12 === true"
```

### 2. Comparaisons avec opérateurs logiques
```json
"condition": "bmi_category === 'surpoids' || bmi_category === 'obesite'"
"condition": "age >= 65 && C1T03E12 === true"
```

### 3. Conditions sur les tableaux
```json
"condition": "contains(C1T11E06, 'insuffisance_veineuse')"
```

### 4. Conditions calculées
```json
"condition": "wound_age <= 28"
"condition": "wound_age > 28"
```

## Variables disponibles dans le contexte

Le service `ConstatsGenerator` construit automatiquement un contexte avec :

- **Champs de l'évaluation** : `C1T01E01`, `C1T03E12`, etc.
- **Âge** : `age` (années), `age_days`, `age_months`
- **IMC** : `bmi`, `bmi_category` ('sous_poids', 'normal', 'surpoids', 'obesite', etc.)
- **Âge de la plaie** : `wound_age`, `wound_age_days`
- **Indicateurs** : `infection_signs_present`, `biofilm_suspected`, `smoking_present`, etc.

## Ajouter un nouveau constat

### Étape 1 : Ajouter la règle dans le JSON

Dans `table_01_cicatrisation_ralentie.json` :

```json
{
  "constat_id": "C2T01E19",
  "source": "C1TXX",
  "condition": "nouvelle_condition",
  "description": "Description du nouveau constat"
}
```

### Étape 2 : Ajouter l'élément dans `elements`

```json
{
  "id": "C2T01E19",
  "type": "informational",
  "label": "Nouveau constat",
  "description": "Description du nouveau constat",
  "read_only": true,
  "ui": {
    "component": "ResultBadge",
    "color": "#FF9800",
    "display_format": "Détecté"
  }
}
```

### Étape 3 : Ajouter la logique dans `buildEvaluationContext` (si nécessaire)

Si vous avez besoin d'une nouvelle variable calculée :

```javascript
// Dans ConstatsGenerator.js
buildEvaluationContext(evaluationData) {
  // ... code existant ...
  
  // Nouvelle variable
  context.nouvelle_variable = this.calculerNouvelleVariable(evaluationData);
  
  return context;
}
```

## Avantages de cette architecture

1. **Séparation des préoccupations** : Données (JSON) vs Logique (JS)
2. **Maintenabilité** : Facile d'ajouter/modifier des constats sans toucher au code
3. **Performance** : Les JSON sont chargés une fois et mis en cache
4. **Offline** : Tout fonctionne sans connexion internet
5. **Testabilité** : La logique peut être testée indépendamment

## Notes importantes

- Les conditions sont évaluées de manière sécurisée (pas d'injection de code)
- Les constats sont générés à la demande (lazy loading)
- Le cache est utilisé pour optimiser les performances
- Les erreurs sont gérées gracieusement (retourne un tableau vide en cas d'erreur)

