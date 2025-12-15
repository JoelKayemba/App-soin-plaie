# 📚 Documentation Complète - App Soin Plaie

## 🎯 Vue d'ensemble du projet

**App Soin Plaie** est une application mobile React Native/Expo conçue pour aider les professionnels de santé dans la prise en charge des plaies. Elle offre des outils d'évaluation clinique, des références médicales et un lexique spécialisé.

## 🏗️ Architecture du projet

### Structure des dossiers
```
app-soin-plaie/
├── src/
│   ├── app/                 # Écrans principaux de l'application
│   ├── components/          # Composants réutilisables
│   ├── context/            # Contexte React (thème)
│   ├── data/               # Données JSON (lexique, références)
│   ├── features/           # Fonctionnalités spécialisées
│   ├── hooks/              # Hooks personnalisés
│   ├── navigation/         # Configuration de la navigation
│   ├── styles/             # Styles et thèmes
│   └── utils/              # Utilitaires
├── assets/                 # Images et ressources
└── App.js                  # Point d'entrée principal
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Expo CLI
- Android Studio (pour Android) ou Xcode (pour iOS)

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd app-soin-plaie

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

### Scripts disponibles
- `npm start` : Démarre le serveur de développement Expo
- `npm run android` : Lance sur émulateur Android
- `npm run ios` : Lance sur simulateur iOS
- `npm run web` : Lance la version web

## 📱 Navigation et écrans

### Structure de navigation
L'application utilise une navigation par onglets avec 4 sections principales :

1. **Accueil** (`HomeScreen`) - Page d'accueil avec outils principaux
2. **Soins** (`EvaluationScreen`) - Outils d'évaluation clinique
3. **Produits** (`ProductsScreen`) - Répertoire des produits et pansements
4. **Lexique** (`LexiqueScreen`) - Définitions médicales

### Navigation par onglets
```jsx
// TabNavigator.jsx
<Tab.Navigator>
  <Tab.Screen name="Accueil" component={HomeScreen} />
  <Tab.Screen name="Soins" component={EvaluationScreen} />
  <Tab.Screen name="Produits" component={ProductsScreen} />
  <Tab.Screen name="Lexique" component={LexiqueScreen} />
</Tab.Navigator>
```

## 🎨 Système de thème

### Gestion des thèmes
L'application supporte les thèmes clair et sombre avec persistance des préférences.

#### Contexte de thème (`ThemeContext.js`)
```jsx
const { theme, colors, isDark, toggleTheme } = useTheme();
```

#### Couleurs disponibles
- **Mode clair** : Fond blanc, bleus médicaux, texte foncé
- **Mode sombre** : Fond sombre, bleus plus clairs, texte clair

#### Utilisation dans les composants
```jsx
import { useThemeMode } from '@/hooks/useThemeMode';

const { colors, isDark, elevation } = useThemeMode();
const useStyles = makeStyles((c) => ({
  container: {
    backgroundColor: c.background,
    ...elevation(2)
  }
}));
```

### Composants thématisés
- `TView` : View avec couleurs automatiques
- `TText` : Texte avec couleurs automatiques
- `TIcon` : Icône avec couleurs automatiques
- `TGradientHeader` : En-tête avec dégradé

## 📱 Responsive Design

### Hook useResponsive
Gère l'adaptation aux différentes tailles d'écran :

```jsx
const { windowClass, spacing, typeScale, isTablet } = useResponsive();
```

#### Breakpoints
- `compact` : < 600px (téléphones)
- `medium` : 600-900px (grands téléphones)
- `expanded` : 900-1200px (tablettes portrait)
- `wide` : ≥ 1200px (tablettes landscape/desktop)

#### Échelles adaptatives
- **Spacing** : Espacement proportionnel à la taille d'écran
- **TypeScale** : Taille de police adaptative
- **GridColumns** : Nombre de colonnes adaptatif

## 🧩 Composants principaux

### SectionHeader
En-tête avec logo, barre de recherche et boutons d'action.

```jsx
<SectionHeader
  searchValue={searchQuery}
  onChangeSearch={setSearchQuery}
  onPressSettings={handleSettingsPress}
/>
```

**Fonctionnalités :**
- Logo et nom de l'application
- Barre de recherche intégrée
- Bouton de basculement thème (soleil/lune)
- Bouton paramètres

### SearchBar
Barre de recherche personnalisée avec support des thèmes.

```jsx
<SearchBar
  value={searchValue}
  onChangeText={onChangeText}
  placeholder="Rechercher..."
/>
```

### ToolsSection
Grille d'outils avec design adaptatif et couleurs personnalisées.

```jsx
<ToolsSection
  items={tools}
  onPressItem={handleOpenTool}
  onPressVoirTout={handleVoirTout}
/>
```

**Caractéristiques :**
- Grille responsive (2-4 colonnes selon l'écran)
- Couleurs personnalisées pour chaque outil
- Icônes avec contraste automatique
- Support des thèmes clair/sombre

## 🏠 Écran d'accueil (HomeScreen)

### Structure
1. **En-tête** avec barre de recherche
2. **Carte de bienvenue** avec image
3. **Section outils** avec grille d'outils

### Outils disponibles
- **Démarche clinique** : Parcours guidé étape par étape
- **Calcul IPSCB** : Mesure IPS Cheville/Bras
- **Échelle de Braden** : Évaluation risque lésion de pression
- **Échelle de Braden Q** : Version pédiatrique
- **Lexique** : Définitions et illustrations
- **Références** : Guides et articles
- **Produits & Pansements** : Répertoire illustré

## 📊 Données et contenu

### Lexique médical (`lexiques.json`)
Contient les définitions des termes dermatologiques :
- Macule, Papule, Plaque
- Vésicule, Bulle, Pustule
- Érosion, Ulcère, Fissure
- Et bien d'autres...

### Structure des données
```json
{
  "terme": "Macule",
  "definition": "Lésion plane, non palpable",
  "taille": "<=10mm",
  "image": null
}
```

## 🔧 Hooks personnalisés

### useThemeMode
Hook étendu pour la gestion des thèmes avec utilitaires.

```jsx
const { 
  theme, 
  isDark, 
  colors, 
  toggleTheme, 
  makeStyles, 
  t, 
  elevation 
} = useThemeMode();
```

**Fonctionnalités :**
- `makeStyles` : Factory de styles avec couleurs automatiques
- `t` : Fonction de transparence pour les couleurs
- `elevation` : Ombres et élévation prédéfinies

### useResponsive
Gestion de la responsivité et des breakpoints.

```jsx
const { 
  windowClass, 
  spacing, 
  typeScale, 
  isTablet, 
  gridColumns 
} = useResponsive();
```

## 🏗️ Système de Renderers de Tables (Architecture Modulaire)

### Vue d'ensemble

Le système de renderers permet de gérer dynamiquement le rendu de 34 tables d'évaluation différentes. Chaque table a son propre renderer spécialisé, tandis que la logique commune est centralisée dans des modules réutilisables.

**Avant la refactorisation :** `ContentDetector.jsx` faisait 1272 lignes avec toute la logique mélangée.  
**Après la refactorisation :** `ContentDetector.jsx` fait 147 lignes (routeur uniquement) + 34 renderers spécialisés + modules réutilisables.

### Architecture en couches

```
┌─────────────────────────────────────────────────────────┐
│  EvaluationScreen                                       │
│  (Charge tableData JSON)                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ContentDetector.jsx (Routeur - 147 lignes)             │
│  • Vérifie si renderer spécifique existe                │
│  • Route vers le renderer approprié                    │
│  • Gère les états globaux (alertes, modals)            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  index.js (Registre centralisé)                         │
│  • Mappe tableId → Renderer spécifique                  │
│  • Ex: 'C1T01' → Table01Renderer                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  TableXXRenderer.jsx (Renderer spécifique)              │
│  • Gère la structure unique de la table                │
│  • Utilise les modules core/ et utils/                 │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐    ┌──────────────────┐
│ core/         │    │ utils/           │
│ • ElementRenderer │ │ • calculations   │
│ • ConditionalLogic│ │ • helpers        │
│ • ElementFactory  │ │ • converters     │
│ • Subquestion...  │ │ • useTableEffects│
└───────────────┘    └──────────────────┘
```

### Flux de données complet

#### 1. Chargement de la table

```javascript
// EvaluationScreen.jsx
const tableData = loadTableData('C1T01'); // Charge le JSON de la table
// tableData = {
//   id: 'C1T01',
//   elements: [...],
//   ui_configuration: {...}
// }
```

#### 2. Routage dans ContentDetector

```javascript
// ContentDetector.jsx
const SpecificRenderer = getTableRenderer(tableData?.id);
// Si tableData.id = 'C1T01' → retourne Table01Renderer

if (SpecificRenderer) {
  return <SpecificRenderer {...props} />;
}
```

#### 3. Rendu par le renderer spécifique

```javascript
// Table01Renderer.jsx
const renderElements = () => {
  return tableData.elements
    .filter(element => shouldShowElement(element, data, tableData.id))
    .map(element => renderElement(element, renderProps));
};
```

#### 4. Logique conditionnelle

```javascript
// ConditionalLogic.js
shouldShowElement(element, data, tableId) {
  // Vérifie si l'élément doit être affiché selon les conditions
  // Ex: Afficher seulement si une autre valeur est sélectionnée
}
```

#### 5. Rendu générique de l'élément

```javascript
// ElementRenderer.jsx
renderElement(element, props) {
  switch(element.type) {
    case 'single_choice': return <RadioGroup ... />;
    case 'multiple_choice': return <CheckboxGroup ... />;
    case 'text': return <TextInput ... />;
    // ... etc
  }
}
```

### Structure des fichiers

```
src/features/evaluation/table-renderers/
├── index.js                    # Registre centralisé
│   ├── TABLE_RENDERERS         # Map tableId → Renderer
│   └── getTableRenderer()      # Fonction de récupération
│
├── core/                       # Logique commune
│   ├── ElementRenderer.jsx     # Rend un élément selon son type
│   ├── ConditionalLogic.js     # Détermine l'affichage conditionnel
│   ├── ElementFactory.jsx      # Factory pour créer des éléments React
│   └── SubquestionRenderer.jsx # Gère les sous-questions complexes
│
├── utils/                       # Utilitaires partagés
│   ├── calculations.js         # Calculs (BMI, IPSCB, BWAT, etc.)
│   ├── helpers.js              # Helpers (modals, alerts, navigation)
│   ├── converters.js           # Convertit structures JSON complexes
│   └── useTableEffects.js      # Hook pour effets/calculs automatiques
│
└── tables/                      # Renderers spécifiques (34 fichiers)
    ├── Table01Renderer.jsx     # Données de base
    ├── Table02Renderer.jsx     # Allergies
    ├── Table03Renderer.jsx     # Conditions santé
    ├── ...
    └── Table34Renderer.jsx     # Pied diabétique
```

### Modules Core expliqués

#### ElementRenderer.jsx
**Rôle :** Rendu générique des éléments selon leur type.

```javascript
// Exemple d'utilisation
renderElement({
  id: 'C1T01E01',
  type: 'single_choice',
  label: 'Sexe',
  options: [...]
}, renderProps);
// → Retourne <RadioGroup ... />
```

**Types supportés :**
- `single_choice` → RadioGroup
- `multiple_choice` → CheckboxGroup
- `text` → TextInput
- `numeric` → NumericInput
- `boolean` → SimpleCheckbox
- `date` → DateInput
- `calculated` → CalculatedField
- Et bien d'autres...

#### ConditionalLogic.js
**Rôle :** Détermine si un élément doit être affiché.

```javascript
// Exemple : Afficher un champ seulement si une valeur est sélectionnée
shouldShowElement({
  id: 'C1T11E05',
  conditional: {
    depends_on: 'C1T11E01',
    value: 'burn'
  }
}, data, 'C1T11');
// → Retourne true/false selon si C1T11E01 === 'burn'
```

#### ElementFactory.jsx
**Rôle :** Factory pour créer des éléments React avec gestion flexible des props.

```javascript
createElement(Component, props, key, children);
// Simplifie la création d'éléments React
```

#### SubquestionRenderer.jsx
**Rôle :** Gère le rendu des sous-questions conditionnelles (ex: Table 12).

```javascript
renderSubquestion(subquestion, props);
// Rend une sous-question avec sa logique conditionnelle
```

### Modules Utils expliqués

#### calculations.js
**Fonctions de calcul médicales :**
- `calculateBMI()` - Calcule l'IMC
- `interpretIPSCB()` - Interprète un résultat IPSCB
- `calculateBWATSurface()` - Calcule la surface BWAT
- `calculateWoundAge()` - Calcule l'âge de la plaie
- Et autres...

#### helpers.js
**Fonctions d'aide :**
- `showHelper()` - Affiche un modal d'aide (ex: stades de pression)
- `showSpecializedAlert()` - Affiche une alerte spécialisée

#### converters.js
**Conversion de structures JSON complexes :**
- `convertQuestionsToElements()` - Pour table 13 (structure `questions`)
- `convertAdditionalFieldsToElements()` - Pour table 14 (`additional_fields`)
- `convertTable20FieldsToElements()` - Pour table 20 (champs complémentaires)
- `convertTable22SubBlocksToElements()` - Pour table 22 (`sub_blocks`)
- `convertTable25SubBlocksToElements()` - Pour table 25 (`sub_blocks`)

#### useTableEffects.js
**Hook personnalisé pour :**
- Calculs automatiques (IPSCB, BWAT, BMI)
- Gestion des effets de bord
- Mise à jour des données dérivées
- Gestion des clés de re-render (ex: questionnaire d'Édimbourg)

### Exemple concret : Table 01 (Données de base)

```javascript
// 1. ContentDetector reçoit tableData avec id="C1T01"
const SpecificRenderer = getTableRenderer('C1T01');
// → Retourne Table01Renderer

// 2. Table01Renderer est appelé
<Table01Renderer
  tableData={tableData}
  data={data}
  handleDataChange={handleDataChange}
  ...
/>

// 3. Table01Renderer parcourt les éléments
tableData.elements.forEach(element => {
  // 4. Vérifie si l'élément doit être affiché
  if (shouldShowElement(element, data, 'C1T01')) {
    // 5. Rend l'élément selon son type
    const rendered = renderElement(element, renderProps);
    // → Si type='date' et id contient 'birth' → DateTextInput
    // → Si type='text' → TextInput
    // → etc.
  }
});
```

### Exemple complexe : Table 15 (Vasculaire)

La Table 15 est la plus complexe avec :
- **Blocs multiples** : inspection, palpation, questionnaire d'Édimbourg, IPSCB
- **Calculs automatiques** : IPSCB avec interprétation colorée
- **Questions conditionnelles** : Questionnaire d'Édimbourg
- **Affichage conditionnel** : Blocs spécifiques aux membres inférieurs

```javascript
// Table15Renderer.jsx
const renderTable15Blocks = () => {
  const allBlocks = [
    tableData.blocks.inspection,
    tableData.blocks.palpation,
    tableData.blocks.edinburgh_questionnaire,
    tableData.blocks.ipscb
  ];
  
  return allBlocks.map(block => {
    // Rend les éléments du bloc
    // Gère les calculs IPSCB avec interprétation
    // Gère les questions conditionnelles
  });
};
```

### Avantages de cette architecture

1. **Séparation des responsabilités**
   - Chaque renderer gère uniquement sa table
   - Logique commune dans `core/` et `utils/`

2. **Maintenabilité**
   - Modifier une table n'affecte pas les autres
   - Code organisé et facile à trouver

3. **Réutilisabilité**
   - Fonctions communes utilisées par tous
   - Pas de duplication de code

4. **Testabilité**
   - Chaque renderer peut être testé indépendamment
   - Modules isolés faciles à mocker

5. **Extensibilité**
   - Ajouter une nouvelle table = créer un renderer + l'enregistrer
   - Pas besoin de modifier le code existant

6. **Performance**
   - Chargement à la demande (lazy loading possible)
   - Optimisations ciblées par table

### Comment ajouter une nouvelle table

1. **Créer le renderer spécifique**
```javascript
// tables/Table35Renderer.jsx
const Table35Renderer = ({ tableData, data, ... }) => {
  // Logique spécifique à la table 35
  return <TView>...</TView>;
};
```

2. **Enregistrer dans le registre**
```javascript
// index.js
import Table35Renderer from './tables/Table35Renderer';

const TABLE_RENDERERS = {
  // ... autres tables
  'C1T35': Table35Renderer,
};
```

3. **C'est tout !** ContentDetector trouvera automatiquement le renderer.

### Cas spéciaux gérés

- **Table 04** : Calculs BMI automatiques
- **Table 11** : Helpers pour stades de brûlure/pression
- **Table 12** : Sous-questions conditionnelles
- **Table 14** : VisualSelector + additional_fields
- **Table 15** : Blocs multiples avec calculs IPSCB
- **Table 20** : Champs complémentaires conditionnels
- **Table 22/25** : Sub_blocks avec conversion
- **Table 27** : Alerts d'urgence conditionnelles
- **Table 29/30** : Composants BradenScale intégrés
- **Table 34** : Blocks multiples (pied diabétique)

### Bonnes pratiques

1. **Utiliser les modules core**
   - Toujours utiliser `renderElement()` au lieu de créer manuellement
   - Utiliser `shouldShowElement()` pour l'affichage conditionnel

2. **Respecter la structure**
   - Chaque renderer doit avoir la même structure de base
   - Titre, instructions, éléments

3. **Gérer les cas spéciaux**
   - Si une table a une logique unique, la mettre dans son renderer
   - Si la logique est réutilisable, l'extraire dans `utils/`

4. **Documentation**
   - Commenter les cas spéciaux dans chaque renderer
   - Documenter les nouvelles fonctions dans `utils/`

## 🎯 Fonctionnalités à implémenter

### Écrans en cours de développement
- **EvaluationScreen** : Outils d'évaluation clinique ✅ (Implémenté avec système de renderers)
- **ProductsScreen** : Catalogue des produits
- **LexiqueScreen** : Interface du lexique
- **ReferenceScreen** : Gestion des références

### Calculatrices médicales
- **IPSCB** : Index de pression systolique cheville/bras ✅ (Intégré dans Table 15)
- **Braden** : Échelle d'évaluation du risque ✅ (Intégré dans Table 29)
- **Braden Q** : Version pédiatrique ✅ (Intégré dans Table 30)

## 🚧 Dépendances principales

### React Native & Expo
- `expo` : Framework principal
- `react-native` : Base React Native
- `@expo/vector-icons` : Icônes

### Navigation
- `@react-navigation/native` : Navigation de base
- `@react-navigation/bottom-tabs` : Navigation par onglets
- `@react-navigation/native-stack` : Navigation par pile

### UI & Animations
- `expo-linear-gradient` : Dégradés
- `react-native-reanimated` : Animations avancées
- `react-native-gesture-handler` : Gestion des gestes

### Stockage
- `expo-secure-store` : Stockage sécurisé des préférences
- `@react-native-async-storage/async-storage` : Stockage local

## 📝 Bonnes pratiques

### Structure des composants
1. **Imports** : React, composants, hooks
2. **Styles** : Définition des styles avec makeStyles
3. **Logique** : Gestion des états et événements
4. **Rendu** : JSX avec composants thématisés

### Gestion des thèmes
- Utiliser `useThemeMode()` pour les composants
- Créer des styles avec `makeStyles()`
- Appliquer les couleurs via le paramètre `c`

### Responsive Design
- Utiliser `useResponsive()` pour l'adaptation
- Appliquer `spacing` et `typeScale` aux styles
- Adapter le nombre de colonnes avec `gridColumns`

## 🔍 Développement et débogage

### Logs et erreurs
- Vérifier la console pour les erreurs
- Utiliser `console.log()` pour le débogage
- Vérifier la persistance des thèmes

### Tests
- Tester sur différents appareils
- Vérifier les thèmes clair/sombre
- Tester la responsivité sur différentes tailles

### Performance
- Utiliser `useMemo` pour les calculs coûteux
- Optimiser les re-renders avec les hooks
- Gérer la mémoire des images

## 📚 Ressources et références

### Documentation officielle
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

### Icônes disponibles
- [Ionicons](https://ionic.io/ionicons) via @expo/vector-icons

### Standards médicaux
- Échelle de Braden
- Calcul IPSCB
- Terminologie dermatologique

## 🤝 Contribution

### Ajout de nouvelles fonctionnalités
1. Créer le composant dans le dossier approprié
2. Ajouter la navigation si nécessaire
3. Implémenter le support des thèmes
4. Tester la responsivité
5. Mettre à jour la documentation

### Modification des styles
1. Utiliser le système de thème existant
2. Respecter les breakpoints responsive
3. Tester sur différents appareils
4. Maintenir la cohérence visuelle

---

**Dernière mise à jour :** 23 Aout 2025 
**Version :** 1.0.0  
**Auteur :** Équipe de développement App Soin Plaie









