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

## 🎯 Fonctionnalités à implémenter

### Écrans en cours de développement
- **EvaluationScreen** : Outils d'évaluation clinique
- **ProductsScreen** : Catalogue des produits
- **LexiqueScreen** : Interface du lexique
- **ReferenceScreen** : Gestion des références

### Calculatrices médicales
- **IPSCB** : Index de pression systolique cheville/bras
- **Braden** : Échelle d'évaluation du risque
- **Braden Q** : Version pédiatrique

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

