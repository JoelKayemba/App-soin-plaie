# Plan d'Implémentation Complet - Système de Constats

## 📋 Vue d'ensemble

Ce document décrit l'implémentation complète du système de constats pour l'application d'évaluation clinique des plaies. Le système comprend :

1. **Page de constats dédiée** (après l'évaluation)
2. **Constats intégrés dans l'évaluation** (statut, vascularisation)
3. **Système de routage** (liens entre choix et constats)
4. **Génération automatique** des constats basés sur les réponses

---

## 🎯 Architecture du Système

### 1. Types de Constats et Leurs Emplacements

#### A. Constats affichés à la fin (Page Constats)
- **C2T01** : Cicatrisation possiblement ralentie par
- **C2T03** : Type de plaie
- **C2T04** : Stade du continuum microbien

#### B. Constats affichés dans l'évaluation (intégrés)
- **C2T02** : Statut de la plaie (aiguë/chronique) → Table 11
- **Vascularisation de la plaie** → Table 15
  - Avertissement IPSCB (si âge >= 65)
  - Constat "Sans autre S/S"
  - Constat "Avec S/S" (claudication faible/forte)
  - Confirmation de l'apport vasculaire (choix unique)

---

## 📐 Structure de Navigation

```
Évaluation (EvaluationScreen)
    ↓ [Terminer l'évaluation]
Récapitulatif (EvaluationSummaryScreen)
    ↓ [Voir les constats]
Page Constats (ConstatsScreen) ← NOUVELLE PAGE
    ├─ Section 1 : Constats automatiques
    │   ├─ C2T01 : Cicatrisation ralentie
    │   ├─ C2T03 : Type de plaie
    │   └─ C2T04 : Stade du continuum microbien
    └─ Section 2 : Constats synthétiques
        └─ (constats générés via routes)
```

---

## 🏗️ Implémentation - Phase 1 : Infrastructure

### 1.1 Créer la page ConstatsScreen

**Fichier :** `src/app/ConstatsScreen.jsx`

**Fonctionnalités :**
- Afficher tous les constats générés
- Grouper par catégorie
- Permettre la navigation vers les constats intégrés
- Afficher les constats par phase (post_eval, recap)

**Structure :**
```jsx
const ConstatsScreen = () => {
  // Charger les données d'évaluation
  // Générer tous les constats via ConstatsGenerator
  // Grouper par table de constats
  // Afficher avec sections
}
```

### 1.2 Ajouter la route dans AppNavigator

**Fichier :** `src/navigation/AppNavigator.jsx`

**Modification :**
```jsx
import ConstatsScreen from '../app/ConstatsScreen';

// Dans Stack.Navigator :
<Stack.Screen
  name="Constats"
  component={ConstatsScreen}
  options={{ 
    headerShown: true,
    title: 'Constats de l\'évaluation',
    presentation: 'modal',
    animation: 'slide_from_bottom'
  }}
/>
```

### 1.3 Modifier EvaluationSummaryScreen

**Fichier :** `src/app/EvaluationSummaryScreen.jsx`

**Ajout d'un bouton :**
```jsx
<TouchableOpacity 
  onPress={() => navigation.navigate('Constats', { evaluationId, evaluationData })}
  style={styles.constatsButton}
>
  <TText>Voir les constats</TText>
</TouchableOpacity>
```

---

## 🏗️ Implémentation - Phase 2 : Constats Intégrés dans l'Évaluation

### 2.1 Statut de la plaie (C2T02) dans Table 11

**Fichier :** `src/data/evaluations/columns/col1/table_11_wound_history.json`

**Modification :**
- Ajouter une section "Statut de la plaie" après le champ date d'apparition
- Afficher automatiquement "Aiguë" ou "Chronique" selon l'âge de la plaie
- Utiliser `calculateWoundAge()` du ConstatsGenerator

**Logique d'affichage :**
```javascript
// Dans ContentDetector ou TableRenderer
if (tableId === 'C1T11') {
  const appearanceDate = evaluationData['C1T11']['C1T11E01'];
  const woundAge = constatsGenerator.calculateWoundAge(appearanceDate);
  
  if (woundAge) {
    // Afficher badge "Aiguë" ou "Chronique"
    renderWoundStatusBadge(woundAge.isRecent ? 'Aiguë' : 'Chronique');
  }
}
```

### 2.2 Vascularisation dans Table 15

**Fichier :** `src/data/evaluations/columns/col1/table_15_vascular_assessment.json`

**Modifications nécessaires :**

#### A. Avertissement IPSCB (si âge >= 65)
- **Position** : Juste après l'affichage du résultat IPSCB
- **Condition** : `age.years >= 65`
- **Composant** : `ClinicalAlert` avec type "warning"

#### B. Constat "Sans autre S/S"
- **Condition** : 
  - Aucun signe d'inspection coché
  - Seuls pouls 2/4, 3/4, 4/4 cochés
- **Affichage** : Badge informatif avec popup explicative

#### C. Constat "Avec S/S" (Claudication)
- **Condition** : 
  - Palpation : Peau froide OU retour capillaire lent OU 1/4 coché
  - Questionnaire Édimbourg : Q1=Oui, Q2=Non, Q3=Oui, Q4=Non, Q5<=10min, Q6=fesses/cuisses/mollets
- **Variantes** :
  - **Claudication faible** : Q4=Non
  - **Claudication forte** : Q4=Oui

#### D. Confirmation de l'apport vasculaire
- **Position** : Après tous les constats ci-dessus
- **Type** : Choix unique (RadioGroup)
- **Options** :
  - Adéquat
  - Insuffisant
  - Incertain
  - Suspicion d'ischémie aiguë

**Structure JSON à ajouter dans table_15 :**
```json
{
  "sections": [
    {
      "id": "ipscb_section",
      "type": "result_section",
      "elements": ["C1T15E01", "C1T15E02", "C1T15_WARNING_AGE", "C1T15_IPSCB_RESULT"]
    },
    {
      "id": "constats_section",
      "type": "conditional_section",
      "title": "Constats d'apport vasculaire",
      "elements": [
        "C1T15_CONSTAT_NO_ARTERIAL_SIGNS",
        "C1T15_CONSTAT_WITH_ARTERIAL_SIGNS"
      ]
    },
    {
      "id": "confirmation_section",
      "type": "form_section",
      "title": "Veuillez confirmer l'apport vasculaire 1",
      "elements": ["C1T15_CONFIRMATION"]
    }
  ]
}
```

---

## 🏗️ Implémentation - Phase 3 : Système de Routage

### 3.1 Service de Routage des Constats

**Fichier :** `src/services/ConstatsRouter.js` (NOUVEAU)

**Responsabilités :**
- Évaluer les routes définies dans les éléments
- Activer les constats selon les phases
- Gérer les priorités
- Lier les choix aux constats

**Structure :**
```javascript
class ConstatsRouter {
  constructor() {
    this.routes = new Map();
    this.activatedConstats = new Map();
  }

  /**
   * Évalue toutes les routes d'un élément
   * @param {string} elementId - ID de l'élément
   * @param {any} value - Valeur de l'élément
   * @param {Object} evaluationData - Données complètes
   * @param {string} phase - Phase actuelle (immediate, post_eval, etc.)
   */
  evaluateRoutes(elementId, value, evaluationData, phase) {
    // Charger les routes de l'élément
    // Évaluer les conditions
    // Activer les constats correspondants
  }

  /**
   * Génère les constats activés pour une phase donnée
   * @param {string} phase - Phase (immediate, post_eval, on_plan, recap)
   * @returns {Array} - Liste des constats activés
   */
  getActivatedConstats(phase) {
    // Retourner les constats activés pour cette phase
  }
}
```

### 3.2 Intégration dans EvaluationScreen

**Fichier :** `src/app/EvaluationScreen.jsx`

**Modifications :**
```javascript
import { constatsRouter } from '@/services';

// Dans handleDataChange :
const handleDataChange = useCallback((fieldId, value) => {
  // ... code existant ...
  
  // Évaluer les routes pour cet élément
  const element = currentTableData.elements?.find?.((el) => el.id === fieldId);
  if (element && element.routes) {
    constatsRouter.evaluateRoutes(
      fieldId, 
      value, 
      newEvaluationData, 
      'immediate' // ou la phase appropriée
    );
  }
  
  // ... reste du code ...
}, [/* deps */]);
```

### 3.3 Intégration dans ConstatsGenerator

**Fichier :** `src/services/ConstatsGenerator.js`

**Ajout de méthodes :**
```javascript
/**
 * Génère tous les constats activés via routes
 * @param {Object} evaluationData - Données d'évaluation
 * @param {string} phase - Phase (post_eval, recap, etc.)
 * @returns {Array} - Liste des constats générés
 */
generateRoutedConstats(evaluationData, phase) {
  // Utiliser ConstatsRouter pour obtenir les constats activés
  // Générer les constats correspondants
  // Retourner la liste complète
}
```

---

## 🏗️ Implémentation - Phase 4 : Composants UI

### 4.1 Composant ConstatBadge

**Fichier :** `src/components/ui/ConstatBadge.jsx` (NOUVEAU)

**Fonctionnalités :**
- Afficher un constat avec badge coloré
- Support des types : informational, warning, error
- Support des popups explicatives
- Support des liens vers les sources

**Structure :**
```jsx
const ConstatBadge = ({ 
  constat, 
  onPress, 
  showPopup = false 
}) => {
  // Afficher badge avec couleur selon type
  // Gérer popup si nécessaire
  // Afficher lien vers source si disponible
}
```

### 4.2 Composant ConstatsSection

**Fichier :** `src/components/ui/ConstatsSection.jsx` (NOUVEAU)

**Fonctionnalités :**
- Grouper les constats par table
- Afficher le titre et la description
- Gérer l'affichage conditionnel
- Support des sections (auto_detected, manual_confirmation)

**Structure :**
```jsx
const ConstatsSection = ({ 
  tableId, 
  constats, 
  evaluationData 
}) => {
  // Charger la définition de la table de constats
  // Grouper par sections si nécessaire
  // Afficher chaque constat avec ConstatBadge
}
```

### 4.3 Composant ConstatsList

**Fichier :** `src/components/ui/ConstatsList.jsx` (NOUVEAU)

**Fonctionnalités :**
- Liste complète de tous les constats
- Filtrage par phase
- Tri par priorité
- Groupement par catégorie

---

## 🏗️ Implémentation - Phase 5 : Logique de Génération

### 5.1 Extension de ConstatsGenerator

**Méthodes à ajouter :**

#### A. Génération par table
```javascript
/**
 * Génère tous les constats pour une table spécifique
 * @param {string} tableId - ID de la table (ex: "C2T01")
 * @param {Object} evaluationData - Données d'évaluation
 * @returns {Array} - Liste des constats générés
 */
async generateConstatsForTable(tableId, evaluationData) {
  // Charger la table de constats
  // Évaluer les conditions de chaque élément
  // Générer les constats actifs
  // Appliquer la logique d'affichage (most_severe_only, etc.)
}
```

#### B. Génération complète
```javascript
/**
 * Génère tous les constats pour toutes les tables
 * @param {Object} evaluationData - Données d'évaluation
 * @param {string} phase - Phase (post_eval, recap, etc.)
 * @returns {Object} - Objet avec constats groupés par table
 */
async generateAllConstats(evaluationData, phase = 'post_eval') {
  const allConstats = {};
  
  // Générer constats des tables C2T01, C2T02, C2T03, C2T04
  // Générer constats activés via routes
  // Grouper par table
  
  return allConstats;
}
```

### 5.2 Logique d'affichage conditionnel

**Pour les constats avec "most_severe_only" :**
```javascript
function applyDisplayLogic(constats, displayLogic) {
  if (displayLogic.rule === 'most_severe_only') {
    // Trier par priorité
    const sorted = constats.sort((a, b) => {
      const priorityA = displayLogic.priority_order.indexOf(a.id);
      const priorityB = displayLogic.priority_order.indexOf(b.id);
      return priorityA - priorityB;
    });
    // Retourner uniquement le premier (le plus grave)
    return [sorted[0]];
  }
  return constats;
}
```

---

## 🏗️ Implémentation - Phase 6 : Intégration dans les Tables

### 6.1 Table 11 - Statut de la plaie

**Modifications dans `table_11_wound_history.json` :**

1. Ajouter un élément calculé après `C1T11E01` :
```json
{
  "id": "C1T11_WOUND_STATUS",
  "type": "calculated_constat",
  "label": "Statut de la plaie",
  "source": "C2T02",
  "calculation": "calculateWoundAge(C1T11E01)",
  "display": {
    "component": "ResultBadge",
    "position": "after_C1T11E01"
  }
}
```

2. Ajouter une route dans `C1T11E01` :
```json
{
  "routes": [
    {
      "to": "C2T02E01",
      "phase": "immediate",
      "condition": "calculateWoundAge(C1T11E01).isRecent === true"
    },
    {
      "to": "C2T02E02",
      "phase": "immediate",
      "condition": "calculateWoundAge(C1T11E01).isChronic === true"
    }
  ]
}
```

### 6.2 Table 15 - Vascularisation

**Modifications dans `table_15_vascular_assessment.json` :**

1. Ajouter les éléments de constats dans la structure
2. Définir les conditions pour chaque constat
3. Ajouter la section de confirmation

**Éléments à ajouter :**
- `C1T15_WARNING_AGE` : Avertissement IPSCB
- `C1T15_CONSTAT_NO_ARTERIAL_SIGNS` : Sans S/S
- `C1T15_CONSTAT_WITH_ARTERIAL_SIGNS` : Avec S/S
- `C1T15_CONFIRMATION` : Confirmation apport vasculaire

---

## 📝 Ordre d'Implémentation Recommandé

### Étape 1 : Infrastructure de base
1. ✅ Créer `ConstatsScreen.jsx`
2. ✅ Ajouter la route dans `AppNavigator.jsx`
3. ✅ Modifier `EvaluationSummaryScreen.jsx` pour ajouter le bouton

### Étape 2 : Service de routage
4. ✅ Créer `ConstatsRouter.js`
5. ✅ Intégrer dans `EvaluationScreen.jsx`
6. ✅ Tester le routage basique

### Étape 3 : Constats intégrés
7. ✅ Implémenter statut de la plaie dans Table 11
8. ✅ Implémenter vascularisation dans Table 15
9. ✅ Tester l'affichage conditionnel

### Étape 4 : Composants UI
10. ✅ Créer `ConstatBadge.jsx`
11. ✅ Créer `ConstatsSection.jsx`
12. ✅ Créer `ConstatsList.jsx`
13. ✅ Intégrer dans `ConstatsScreen.jsx`

### Étape 5 : Génération complète
14. ✅ Étendre `ConstatsGenerator.js`
15. ✅ Implémenter la génération par table
16. ✅ Implémenter la génération complète
17. ✅ Tester avec toutes les tables

### Étape 6 : Intégration finale
18. ✅ Ajouter les routes dans toutes les tables concernées
19. ✅ Tester le flux complet
20. ✅ Optimiser les performances

---

## 🔍 Points d'Attention

### 1. Performance
- Mettre en cache les constats générés
- Éviter de régénérer à chaque changement
- Utiliser `useMemo` pour les calculs coûteux

### 2. Synchronisation
- S'assurer que les constats sont à jour avec les données
- Gérer les cas où les données changent après génération
- Invalider le cache quand nécessaire

### 3. Affichage conditionnel
- Respecter les règles "most_severe_only"
- Gérer les phases correctement
- Afficher uniquement les constats pertinents

### 4. Navigation
- Permettre de revenir à l'évaluation depuis les constats
- Permettre de modifier les données et régénérer
- Sauvegarder l'état des constats

---

## 📊 Structure de Données

### Format d'un constat généré :
```javascript
{
  id: "C2T01E01",
  tableId: "C2T01",
  type: "informational",
  label: "Vieillissement",
  description: "Âge >= 65 ans",
  priority: 1,
  phase: "post_eval",
  source: {
    tableId: "C1T01",
    elementId: "C1T01E01",
    condition: "age.years >= 65"
  },
  ui: {
    component: "ResultBadge",
    color: "#FF9800"
  },
  data: {
    // Données spécifiques au constat
  }
}
```

### Format des routes :
```javascript
{
  from: "C1T27E01", // Élément source
  to: "C2T04E01", // Constat cible
  phase: "immediate",
  priority: 1,
  condition: "C1T27E01 === true",
  note: "Description de la route"
}
```

---

## ✅ Checklist de Validation

- [ ] Page ConstatsScreen créée et fonctionnelle
- [ ] Navigation entre EvaluationSummary et Constats fonctionne
- [ ] ConstatsRouter évalue correctement les routes
- [ ] Statut de la plaie s'affiche dans Table 11
- [ ] Vascularisation s'affiche dans Table 15
- [ ] Tous les constats C2T01, C2T02, C2T03, C2T04 s'affichent
- [ ] Les routes activent correctement les constats
- [ ] L'affichage conditionnel fonctionne (most_severe_only, etc.)
- [ ] Les phases sont respectées (immediate, post_eval, etc.)
- [ ] Les performances sont acceptables
- [ ] Les tests passent

---

## 🚀 Prochaines Étapes

Une fois cette implémentation terminée, on pourra :
1. Ajouter d'autres tables de constats
2. Implémenter les constats pour le plan de traitement
3. Ajouter des visualisations graphiques
4. Exporter les constats en PDF
5. Ajouter des notifications pour les constats critiques

