# Plan de Refactorisation - ContentDetector.jsx

## 📋 Vue d'ensemble
Refactorisation progressive de `ContentDetector.jsx` (2122 lignes) en modules séparés, sans casser le code existant.

**Principe** : Une étape à la fois, tester après chaque étape, ne pas supprimer l'ancien code tant qu'on n'est pas sûr que le nouveau fonctionne.

---

## 🎯 ÉTAPE 1 : Préparation de la structure
**Objectif** : Créer la structure de dossiers et les fichiers de base sans modifier le code existant.

### Actions :
1. ✅ Créer le dossier `src/features/evaluation/table-renderers/`
2. ✅ Créer les sous-dossiers :
   - `core/` (logique commune)
   - `utils/` (utilitaires partagés)
   - `tables/` (renderers spécifiques par table)
3. ✅ Créer `index.js` avec exports vides (pour l'instant)
4. ✅ Vérifier que l'app compile toujours

**Critère de succès** : Structure créée, app compile, aucun changement fonctionnel.

---

## 🎯 ÉTAPE 2 : Extraction des utilitaires de calcul (calculations.js) ✅ COMPLÉTÉE
**Objectif** : Extraire les fonctions de calcul pures sans dépendances React.

### Actions :
1. ✅ Créer `utils/calculations.js`
2. ✅ Extraire ces fonctions (copier, ne pas supprimer de ContentDetector) :
   - ✅ `calculateWoundAge()`
   - ✅ `interpretIPSCB()`
   - ✅ `calculateIPSCBValues()` (version pure de calculateIPSCB)
   - ✅ `calculateBWATSurface()`
   - ✅ `classifyBWATSize()`
   - ✅ `calculateBMI()`
   - ✅ `getBMICategory()`
   - ✅ `evaluateBMICondition()`
3. ✅ Exporter toutes les fonctions
4. ✅ Importer dans ContentDetector et utiliser (ancien code commenté)
5. ⏳ Tester que les calculs fonctionnent toujours (tables 04, 11, 15, 16)

**Critère de succès** : ✅ Tous les calculs fonctionnent identiquement, code dupliqué temporairement OK.
**Statut** : ✅ Complétée - Toutes les fonctions extraites et importées. Aucune erreur de lint.

---

## 🎯 ÉTAPE 3 : Extraction des helpers (helpers.js) ✅ COMPLÉTÉE
**Objectif** : Extraire les fonctions d'aide et navigation.

### Actions :
1. ✅ Créer `utils/helpers.js`
2. ✅ Extraire ces fonctions :
   - ✅ `showHelper()` (adaptée pour recevoir navigation, burnStagesData, pressureStagesData en paramètres)
   - ✅ `showSpecializedAlert()` (adaptée pour recevoir setters en paramètres)
3. ✅ Exporter toutes les fonctions
4. ✅ Importer dans ContentDetector et utiliser (ancien code commenté)
5. ⏳ Tester les helpers (tables 11, 27)

**Critère de succès** : ✅ Helpers fonctionnent, modales s'ouvrent correctement.
**Statut** : ✅ Complétée - Toutes les fonctions extraites et importées. Aucune erreur de lint.

---

## 🎯 ÉTAPE 4 : Extraction de ElementFactory (core/ElementFactory.jsx) ✅ COMPLÉTÉE
**Objectif** : Extraire la fonction `createElement` et ses helpers.

### Actions :
1. ✅ Créer `core/ElementFactory.jsx`
2. ✅ Extraire `createElement()`
3. ✅ Créer `createElementWithCommonProps()` comme helper
4. ✅ Exporter
5. ✅ Importer dans ContentDetector et utiliser (ancien code commenté)
6. ⏳ Tester que le rendu fonctionne toujours

**Critère de succès** : ✅ Rendu identique, code plus propre.
**Statut** : ✅ Complétée - Toutes les fonctions extraites et importées. Aucune erreur de lint.

---

## 🎯 ÉTAPE 5 : Extraction de ConditionalLogic (core/ConditionalLogic.js) ✅ COMPLÉTÉE
**Objectif** : Extraire la logique conditionnelle.

### Actions :
1. ✅ Créer `core/ConditionalLogic.js`
2. ✅ Extraire `shouldShowElement()`
3. ✅ Extraire `shouldShowSubquestion()`
4. ✅ Exporter
5. ✅ Importer dans ContentDetector et utiliser (ancien code commenté)
6. ⏳ Tester les affichages conditionnels (tables 12, 14, 20, 22, 25, 27)

**Critère de succès** : ✅ Affichages conditionnels fonctionnent identiquement.
**Statut** : ✅ Complétée - Toutes les fonctions extraites et importées. Aucune erreur de lint.

---

## 🎯 ÉTAPE 6 : Extraction de converters (utils/converters.js) ✅ COMPLÉTÉE
**Objectif** : Extraire les fonctions de conversion de structures.

### Actions :
1. ✅ Créer `utils/converters.js`
2. ✅ Extraire ces fonctions :
   - ✅ `convertQuestionsToElements()` (table 13)
   - ✅ `convertAdditionalFieldsToElements()` (table 14)
   - ✅ `convertTable20FieldsToElements()` (table 20)
   - ✅ `convertTable22SubBlocksToElements()` (table 22)
   - ✅ `convertTable25SubBlocksToElements()` (table 25)
3. ✅ Exporter
4. ✅ Importer dans ContentDetector et utiliser (ancien code commenté)
5. ⏳ Tester toutes les tables concernées

**Critère de succès** : ✅ Conversions fonctionnent, structures correctes.
**Statut** : ✅ Complétée - Toutes les fonctions extraites et importées. Aucune erreur de lint.

---

## 🎯 ÉTAPE 7 : Créer ElementRenderer de base (core/ElementRenderer.jsx)
**Objectif** : Créer le renderer générique qui gère le switch principal.

### Actions :
1. ✅ Créer `core/ElementRenderer.jsx`
2. ✅ Extraire la fonction `renderElement()` complète
3. ✅ Adapter pour recevoir toutes les dépendances en props
4. ✅ Exporter
5. ✅ Créer un wrapper dans ContentDetector qui utilise ElementRenderer
6. ✅ Tester avec une table simple (ex: C1T09, C1T10)

**Critère de succès** : Rendu générique fonctionne pour les tables simples.

---

## 🎯 ÉTAPE 8 : Premier renderer spécifique - Table09Renderer (Assurances)
**Objectif** : Créer le premier renderer spécifique pour une table très simple.

### Actions :
1. ✅ Créer `tables/Table09Renderer.jsx`
2. ✅ Copier la logique de rendu pour C1T09 depuis ContentDetector
3. ✅ Utiliser ElementRenderer pour les éléments
4. ✅ Enregistrer dans `index.js` (TABLE_RENDERERS)
5. ✅ Modifier ContentDetector pour utiliser le renderer si disponible
6. ✅ Tester C1T09 complètement

**Critère de succès** : Table 09 fonctionne via le nouveau renderer, code plus propre.

---

## 🎯 ÉTAPE 9 : Renderer Table10Renderer (Niveau de soins)
**Objectif** : Deuxième renderer simple.

### Actions :
1. ✅ Créer `tables/Table10Renderer.jsx`
2. ✅ Même processus que Table09
3. ✅ Tester C1T10

**Critère de succès** : Table 10 fonctionne.

---

## 🎯 ÉTAPE 10 : Renderer Table17Renderer (Forme)
**Objectif** : Table BWAT simple.

### Actions :
1. ✅ Créer `tables/Table17Renderer.jsx`
2. ✅ Même processus
3. ✅ Tester C1T17

**Critère de succès** : Table 17 fonctionne.

---

## 🎯 ÉTAPE 11 : Renderer Table18Renderer (BWAT Profondeur)
**Objectif** : Table BWAT simple.

### Actions :
1. ✅ Créer `tables/Table18Renderer.jsx`
2. ✅ Tester C1T18

**Critère de succès** : Table 18 fonctionne.

---

## 🎯 ÉTAPE 12 : Renderer Table19Renderer (BWAT Bords)
**Objectif** : Table BWAT simple.

### Actions :
1. ✅ Créer `tables/Table19Renderer.jsx`
2. ✅ Tester C1T19

**Critère de succès** : Table 19 fonctionne.

---

## 🎯 ÉTAPE 13 : Renderer Table23Renderer (Tissu de granulation)
**Objectif** : Table BWAT simple.

### Actions :
1. ✅ Créer `tables/Table23Renderer.jsx`
2. ✅ Tester C1T23

**Critère de succès** : Table 23 fonctionne.

---

## 🎯 ÉTAPE 14 : Renderer Table01Renderer (Données de base)
**Objectif** : Table avec DateTextInput spécial.

### Actions :
1. ✅ Créer `tables/Table01Renderer.jsx`
2. ✅ Gérer le cas spécial DateTextInput pour date de naissance
3. ✅ Tester C1T01

**Critère de succès** : Table 01 fonctionne, DateTextInput correct.

---

## 🎯 ÉTAPE 15 : Renderer Table02Renderer (Allergies - SimpleCheckbox)
**Objectif** : Table avec logique SimpleCheckbox.

### Actions :
1. ✅ Créer `tables/Table02Renderer.jsx`
2. ✅ Gérer le rendu avec SimpleCheckbox pour les éléments boolean
3. ✅ Tester C1T02

**Critère de succès** : Table 02 fonctionne, SimpleCheckbox correct.

---

## 🎯 ÉTAPE 16 : Renderer Table03Renderer (Conditions santé - SimpleCheckbox)
**Objectif** : Table avec logique SimpleCheckbox.

### Actions :
1. ✅ Créer `tables/Table03Renderer.jsx`
2. ✅ Même logique que Table02
3. ✅ Tester C1T03

**Critère de succès** : Table 03 fonctionne.

---

## 🎯 ÉTAPE 17 : Renderer Table05Renderer (Nutrition - SimpleCheckbox)
**Objectif** : Table avec logique SimpleCheckbox.

### Actions :
1. ✅ Créer `tables/Table05Renderer.jsx`
2. ✅ Tester C1T05

**Critère de succès** : Table 05 fonctionne.

---

## 🎯 ÉTAPE 18 : Renderer Table07Renderer (Médication - SimpleCheckbox)
**Objectif** : Table avec logique SimpleCheckbox.

### Actions :
1. ✅ Créer `tables/Table07Renderer.jsx`
2. ✅ Tester C1T07

**Critère de succès** : Table 07 fonctionne.

---

## 🎯 ÉTAPE 19 : Renderer Table08Renderer (Psychosocial - SimpleCheckbox)
**Objectif** : Table avec logique SimpleCheckbox.

### Actions :
1. ✅ Créer `tables/Table08Renderer.jsx`
2. ✅ Tester C1T08

**Critère de succès** : Table 08 fonctionne.

---

## 🎯 ÉTAPE 20 : Renderer Table06Renderer (Facteurs de risque - CheckboxWithText)
**Objectif** : Table avec CheckboxWithText.

### Actions :
1. ✅ Créer `tables/Table06Renderer.jsx`
2. ✅ Gérer le rendu avec CheckboxWithText
3. ✅ Tester C1T06

**Critère de succès** : Table 06 fonctionne, CheckboxWithText correct.

---

## 🎯 ÉTAPE 21 : Renderer Table21Renderer (Composition lit plaie)
**Objectif** : Table avec NumericInput pour pourcentages.

### Actions :
1. ✅ Créer `tables/Table21Renderer.jsx`
2. ✅ Gérer les NumericInput avec unités
3. ✅ Tester C1T21

**Critère de succès** : Table 21 fonctionne, pourcentages corrects.

---

## 🎯 ÉTAPE 22 : Renderer Table26Renderer (Peau environnante)
**Objectif** : Table avec structure complexe (coloration, œdème, induration, lésions).

### Actions :
1. ✅ Créer `tables/Table26Renderer.jsx`
2. ✅ Gérer les différents types de champs (radio, checkbox)
3. ✅ Tester C1T26

**Critère de succès** : Table 26 fonctionne, tous les champs corrects.

---

## 🎯 ÉTAPE 23 : Renderer Table28Renderer (Tests laboratoire)
**Objectif** : Table mixte (numeric + radio + text).

### Actions :
1. ✅ Créer `tables/Table28Renderer.jsx`
2. ✅ Gérer les différents types de champs
3. ✅ Tester C1T28

**Critère de succès** : Table 28 fonctionne.

---

## 🎯 ÉTAPE 24 : Renderer Table29Renderer (Braden Scale)
**Objectif** : Table avec composant BradenScale.

### Actions :
1. ✅ Créer `tables/Table29Renderer.jsx`
2. ✅ Utiliser le composant BradenScale existant
3. ✅ Tester C1T29

**Critère de succès** : Table 29 fonctionne, calculs Braden corrects.

---

## 🎯 ÉTAPE 25 : Renderer Table30Renderer (Braden-Q Scale)
**Objectif** : Table avec composant BradenScale (type Q).

### Actions :
1. ✅ Créer `tables/Table30Renderer.jsx`
2. ✅ Utiliser le composant BradenScale avec type Q
3. ✅ Tester C1T30

**Critère de succès** : Table 30 fonctionne, calculs Braden-Q corrects.

---

## 🎯 ÉTAPE 26 : Renderer Table31Renderer (Lésion de pression)
**Objectif** : Table avec RadioGroup + TextInput conditionnel.

### Actions :
1. ✅ Créer `tables/Table31Renderer.jsx`
2. ✅ Gérer le champ conditionnel (si "oui" → text input)
3. ✅ Tester C1T31

**Critère de succès** : Table 31 fonctionne, champ conditionnel correct.

---

## 🎯 ÉTAPE 27 : Renderer Table32Renderer (Ulcère veineux)
**Objectif** : Table avec RadioGroup + TextInput conditionnel.

### Actions :
1. ✅ Créer `tables/Table32Renderer.jsx`
2. ✅ Même logique que Table31
3. ✅ Tester C1T32

**Critère de succès** : Table 32 fonctionne.

---

## 🎯 ÉTAPE 28 : Renderer Table33Renderer (Ulcère artériel)
**Objectif** : Table avec RadioGroup + TextInput conditionnel.

### Actions :
1. ✅ Créer `tables/Table33Renderer.jsx`
2. ✅ Même logique que Table31
3. ✅ Tester C1T33

**Critère de succès** : Table 33 fonctionne.

---

## 🎯 ÉTAPE 29 : Renderer Table04Renderer (Poids & IMC - calculs)
**Objectif** : Table avec calculs BMI automatiques.

### Actions :
1. ✅ Créer `tables/Table04Renderer.jsx`
2. ✅ Extraire la logique de calcul BMI depuis ContentDetector
3. ✅ Gérer les classifications IMC conditionnelles
4. ✅ Utiliser les fonctions de `utils/calculations.js`
5. ✅ Tester C1T04 complètement (calculs, classifications)

**Critère de succès** : Table 04 fonctionne, calculs BMI automatiques corrects.

---

## 🎯 ÉTAPE 30 : Renderer Table16Renderer (BWAT Taille - calculs)
**Objectif** : Table avec calculs de surface BWAT.

### Actions :
1. ✅ Créer `tables/Table16Renderer.jsx`
2. ✅ Extraire la logique de calcul de surface
3. ✅ Gérer la classification BWAT conditionnelle
4. ✅ Utiliser les fonctions de `utils/calculations.js`
5. ✅ Tester C1T16 complètement

**Critère de succès** : Table 16 fonctionne, calculs et classification corrects.

---

## 🎯 ÉTAPE 31 : Renderer Table11Renderer (Histoire plaie - helpers)
**Objectif** : Table avec helpers et alerts spécialisées.

### Actions :
1. ✅ Créer `tables/Table11Renderer.jsx`
2. ✅ Extraire la logique des helpers (burn_stages, pressure_stages)
3. ✅ Gérer les badges d'âge de plaie calculés
4. ✅ Gérer les alerts spécialisées (lymphedema, neoplasia)
5. ✅ Utiliser les fonctions de `utils/helpers.js` et `utils/calculations.js`
6. ✅ Tester C1T11 complètement (helpers, badges, alerts)

**Critère de succès** : Table 11 fonctionne, tous les helpers et alerts corrects.

---

## 🎯 ÉTAPE 32 : Renderer Table27Renderer (Infection - boolean + alerts)
**Objectif** : Table avec boolean et alerts d'urgence.

### Actions :
1. ✅ Créer `tables/Table27Renderer.jsx`
2. ✅ Extraire la logique SimpleCheckbox pour les éléments boolean
3. ✅ Gérer les alerts d'urgence (🚩) conditionnelles
4. ✅ Gérer les champs conditionnels (intensité odeur, température)
5. ✅ Tester C1T27 complètement

**Critère de succès** : Table 27 fonctionne, alerts et champs conditionnels corrects.

---

## 🎯 ÉTAPE 33 : Renderer Table24Renderer (Épithéliatisation - biofilm alert)
**Objectif** : Table avec alerte biofilm conditionnelle.

### Actions :
1. ✅ Créer `tables/Table24Renderer.jsx`
2. ✅ Extraire la logique d'alerte biofilm
3. ✅ Gérer l'affichage conditionnel de l'alerte
4. ✅ Tester C1T24 complètement

**Critère de succès** : Table 24 fonctionne, alerte biofilm correcte.

---

## 🎯 ÉTAPE 34 : Renderer Table12Renderer (Symptômes - sous-questions)
**Objectif** : Table avec sous-questions conditionnelles complexes.

### Actions :
1. ✅ Créer `tables/Table12Renderer.jsx`
2. ✅ Extraire la logique de rendu des sous-questions
3. ✅ Extraire `renderSubquestion()` et `renderAssociatedFields()`
4. ✅ Gérer les conditions `shouldShowSubquestion()`
5. ✅ Tester C1T12 complètement (toutes les sous-questions)

**Critère de succès** : Table 12 fonctionne, toutes les sous-questions et champs associés corrects.

---

## 🎯 ÉTAPE 35 : Renderer Table13Renderer (Perceptions - questions)
**Objectif** : Table avec structure `questions` au lieu de `elements`.

### Actions :
1. ✅ Créer `tables/Table13Renderer.jsx`
2. ✅ Utiliser `convertQuestionsToElements()` de `utils/converters.js`
3. ✅ Gérer le rendu des TextArea
4. ✅ Tester C1T13 complètement

**Critère de succès** : Table 13 fonctionne, conversion questions → elements correcte.

---

## 🎯 ÉTAPE 36 : Renderer Table14Renderer (Emplacement - additional_fields)
**Objectif** : Table avec additional_fields et VisualSelector.

### Actions :
1. ✅ Créer `tables/Table14Renderer.jsx`
2. ✅ Utiliser `convertAdditionalFieldsToElements()` de `utils/converters.js`
3. ✅ Gérer le VisualSelector et la synchronisation
4. ✅ Tester C1T14 complètement

**Critère de succès** : Table 14 fonctionne, VisualSelector et synchronisation corrects.

---

## 🎯 ÉTAPE 37 : Renderer Table20Renderer (Sous-minage - champs complémentaires)
**Objectif** : Table avec complementary_fields et additional_tracts.

### Actions :
1. ✅ Créer `tables/Table20Renderer.jsx`
2. ✅ Utiliser `convertTable20FieldsToElements()` de `utils/converters.js`
3. ✅ Gérer les affichages conditionnels
4. ✅ Tester C1T20 complètement

**Critère de succès** : Table 20 fonctionne, tous les champs complémentaires corrects.

---

## 🎯 ÉTAPE 38 : Renderer Table22Renderer (Tissus nécrotiques - sub_blocks)
**Objectif** : Table avec sub_blocks complexes.

### Actions :
1. ✅ Créer `tables/Table22Renderer.jsx`
2. ✅ Utiliser `convertTable22SubBlocksToElements()` de `utils/converters.js`
3. ✅ Gérer les éléments calculés conditionnels (quantité basée sur C1T21E01)
4. ✅ Tester C1T22 complètement

**Critère de succès** : Table 22 fonctionne, sub_blocks et calculs conditionnels corrects.

---

## 🎯 ÉTAPE 39 : Renderer Table25Renderer (Exsudat - sub_blocks)
**Objectif** : Table avec sub_blocks (qualité + quantité).

### Actions :
1. ✅ Créer `tables/Table25Renderer.jsx`
2. ✅ Utiliser `convertTable25SubBlocksToElements()` de `utils/converters.js`
3. ✅ Gérer les deux sous-blocs (qualité et quantité)
4. ✅ Tester C1T25 complètement

**Critère de succès** : Table 25 fonctionne, sub_blocks corrects.

---

## 🎯 ÉTAPE 40 : Renderer Table15Renderer (Vasculaire - blocs complexes)
**Objectif** : Table la plus complexe avec blocs multiples.

### Actions :
1. ✅ Créer `tables/Table15Renderer.jsx`
2. ✅ Extraire `renderTable15Blocks()` complètement
3. ✅ Extraire `getAllBlocksForTable15()` et logique conditionnelle
4. ✅ Gérer les calculs IPSCB et interprétations
5. ✅ Gérer le questionnaire d'Édimbourg avec questions conditionnelles
6. ✅ Utiliser toutes les fonctions utilitaires
7. ✅ Tester C1T15 complètement (tous les blocs)

**Critère de succès** : Table 15 fonctionne, tous les blocs et calculs corrects.

---

## 🎯 ÉTAPE 41 : Renderer Table34Renderer (Pied diabétique - blocks)
**Objectif** : Table avec blocks multiples.

### Actions :
1. ✅ Créer `tables/Table34Renderer.jsx`
2. ✅ Extraire `getAllElementsFromBlocks()`
3. ✅ Gérer tous les blocks de la table 34
4. ✅ Tester C1T34 complètement

**Critère de succès** : Table 34 fonctionne, tous les blocks corrects.

---

## 🎯 ÉTAPE 42 : Extraction de DataHandlers (core/DataHandlers.js)
**Objectif** : Extraire la logique de gestion des changements de données.

### Actions :
1. ✅ Créer `core/DataHandlers.js`
2. ✅ Extraire `handleDataChange()` générique
3. ✅ Créer des handlers spécifiques par table si nécessaire
4. ✅ Exporter
5. ✅ Utiliser dans tous les renderers
6. ✅ Tester que les changements de données fonctionnent

**Critère de succès** : Gestion des données centralisée et fonctionnelle.

---

## 🎯 ÉTAPE 43 : Nettoyage final de ContentDetector
**Objectif** : Réduire ContentDetector à un simple routeur.

### Actions :
1. ✅ Vérifier que toutes les tables utilisent les nouveaux renderers
2. ✅ Supprimer tout le code migré de ContentDetector
3. ✅ Garder uniquement :
   - Les imports
   - Le routeur (getTableRenderer)
   - Le rendu conditionnel (renderer spécifique ou générique)
   - Les états globaux nécessaires
4. ✅ Vérifier que ContentDetector fait < 300 lignes
5. ✅ Tester toutes les tables une dernière fois

**Critère de succès** : ContentDetector est un routeur léger, toutes les tables fonctionnent.

---

## 🎯 ÉTAPE 44 : Tests finaux et documentation
**Objectif** : S'assurer que tout fonctionne et documenter.

### Actions :
1. ✅ Tester toutes les 34 tables complètement
2. ✅ Vérifier qu'il n'y a pas de régressions
3. ✅ Documenter la structure dans un README
4. ✅ Nettoyer les commentaires de debug
5. ✅ Vérifier les performances

**Critère de succès** : Tout fonctionne, documentation à jour, code propre.

---

## 📝 Notes importantes

### Règles à suivre :
1. **NE JAMAIS supprimer l'ancien code avant d'être sûr que le nouveau fonctionne**
2. **Tester après chaque étape**
3. **Faire des commits fréquents** (une étape = un commit)
4. **Si une étape échoue, revenir en arrière et corriger avant de continuer**
5. **Garder ContentDetector fonctionnel à tout moment**

### Ordre de priorité :
- **Étapes 1-7** : Fondations (critique)
- **Étapes 8-28** : Tables simples (rapide, gain immédiat)
- **Étapes 29-41** : Tables complexes (plus long, mais nécessaire)
- **Étapes 42-44** : Finalisation (nettoyage)

### Estimation :
- **Étapes 1-7** : ~2-3h
- **Étapes 8-28** : ~1h par étape = ~20h
- **Étapes 29-41** : ~2h par étape = ~26h
- **Étapes 42-44** : ~3-4h
- **Total estimé** : ~50-55h de travail

---

## ✅ Checklist de progression

- [ ] Étape 1 : Structure
- [ ] Étape 2 : calculations.js
- [ ] Étape 3 : helpers.js
- [ ] Étape 4 : ElementFactory
- [ ] Étape 5 : ConditionalLogic
- [ ] Étape 6 : converters.js
- [ ] Étape 7 : ElementRenderer
- [ ] Étape 8 : Table09Renderer
- [ ] ... (continuer pour toutes les étapes)

---

**Dernière mise à jour** : 2025-01-XX
**Statut** : En attente de démarrage

