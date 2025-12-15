# Table Renderers - Documentation

## 📁 Structure

```
table-renderers/
├── index.js                 # Point d'entrée, registre des renderers
├── core/                    # Logique commune
│   ├── ElementFactory.jsx   # Factory pour créer des éléments React
│   ├── ConditionalLogic.js  # Logique conditionnelle d'affichage
│   └── ElementRenderer.jsx  # Renderer générique (à implémenter)
├── utils/                   # Utilitaires partagés
│   ├── calculations.js      # Fonctions de calcul (BMI, IPSCB, BWAT, etc.)
│   ├── helpers.js           # Helpers et navigation
│   └── converters.js       # Conversion de structures (questions, sub_blocks, etc.)
└── tables/                  # Renderers spécifiques par table
    └── (à créer progressivement)
```

## 🎯 Objectif

Refactoriser `ContentDetector.jsx` (1272 lignes → 147 lignes) en modules séparés et maintenables, sans casser le code existant.

## ✅ État actuel - REFACTORISATION TERMINÉE

- ✅ **Structure créée** : Tous les dossiers et fichiers de base
- ✅ **Extraction des calculs** : calculations.js
- ✅ **Extraction des helpers** : helpers.js
- ✅ **Extraction de ElementFactory** : core/ElementFactory.jsx
- ✅ **Extraction de ConditionalLogic** : core/ConditionalLogic.js
- ✅ **Extraction de converters** : utils/converters.js
- ✅ **Extraction de ElementRenderer** : core/ElementRenderer.jsx
- ✅ **Extraction de useTableEffects** : utils/useTableEffects.js
- ✅ **Extraction de SubquestionRenderer** : core/SubquestionRenderer.jsx
- ✅ **Registre centralisé** : index.js
- ✅ **34 renderers spécifiques créés** : tables/Table01Renderer.jsx à Table34Renderer.jsx
- ✅ **ContentDetector allégé** : 147 lignes (routeur uniquement)

## 🔄 Utilisation

### Dans ContentDetector.jsx

```javascript
import { getTableRenderer } from '@/features/evaluation/table-renderers';

const SpecificRenderer = getTableRenderer(tableData?.id);
if (SpecificRenderer) {
  return <SpecificRenderer {...props} />;
}
// Fallback : message d'erreur (ne devrait plus arriver)
```

### Ajouter un nouveau renderer

1. Créer `tables/TableXXRenderer.jsx`
2. Enregistrer dans `index.js` :
   ```javascript
   import TableXXRenderer from './tables/TableXXRenderer';
   const TABLE_RENDERERS = {
     'C1TXX': TableXXRenderer,
   };
   ```

## 📚 Fichiers

### `index.js`
- Registre centralisé des renderers
- Fonction `getTableRenderer(tableId)`
- Exports des utilitaires

### `core/ElementFactory.jsx`
- `createElement()` - Crée un élément React avec gestion flexible
- `createElementWithCommonProps()` - Crée avec props communes

### `core/ConditionalLogic.js`
- `shouldShowElement()` - Détermine si un élément doit être affiché
- `shouldShowSubquestion()` - Détermine si une sous-question doit être affichée

### `utils/calculations.js`
- `calculateWoundAge()` - Calcule l'âge de la plaie
- `interpretIPSCB()` - Interprète un résultat IPSCB
- `calculateBWATSurface()` - Calcule la surface BWAT
- `classifyBWATSize()` - Classe la taille selon BWAT
- `calculateBMI()` - Calcule l'IMC
- `getBMICategory()` - Détermine la catégorie IMC
- `evaluateBMICondition()` - Évalue une condition BMI

### `utils/helpers.js`
- `showHelper()` - Affiche un helper (modal)
- `showSpecializedAlert()` - Affiche une alerte spécialisée

### `utils/converters.js`
- `convertQuestionsToElements()` - Pour table 13
- `convertAdditionalFieldsToElements()` - Pour table 14
- `convertTable20FieldsToElements()` - Pour table 20
- `convertTable22SubBlocksToElements()` - Pour table 22
- `convertTable25SubBlocksToElements()` - Pour table 25

## 🚀 Prochaines étapes

Voir `REFACTORING_PLAN.md` pour le plan complet.

