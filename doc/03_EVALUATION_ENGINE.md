# Moteur Evaluation et Constats

## Principe

Le module evaluation est base sur un schema declaratif:

1. Les tables sont definies en JSON (`col1`)
2. Le loader lit les schemas
3. Le routeur (`ContentDetector`) choisit le renderer
4. Les renderers affichent les composants de formulaire
5. Les reponses sont persistees localement
6. Les constats sont derives depuis `col2_constats` + `ConstatsGenerator`

## Pipeline complet (de la saisie aux constats)

### A. Chargement d'une table

1. `EvaluationScreen` determine l'etape courante via `evaluation_steps.json`.
2. Appel `tableDataLoader.loadTableData(currentStep.id)`.
3. `TableDataLoader` mappe `C1Txx` vers `table_xx_*.json`.
4. Fusion schema + reponses locales (`loadTableAnswers`) dans `evaluationData[tableId]`.

### B. Rendu dynamique de la table

1. `EvaluationScreen` passe les donnees a `ContentDetector`.
2. `ContentDetector` recupere le renderer via `getTableRenderer(tableId)`.
3. Le renderer specifique appelle `renderElement` (ou convertisseurs) pour chaque element.
4. Les composants formulaire emettent `handleDataChange(fieldId, value)`.

### C. Effets et calculs automatiques

`useTableEffects` applique des calculs metier selon la table:

- IPSCB (table 15)
- Surface BWAT (table 16)
- IMC (table 04)
- alertes specialisees (table 11)

Puis la valeur est remontee vers `EvaluationScreen`.

### D. Persistance de progression

Au changement de champ, `EvaluationScreen`:

1. met a jour `evaluationData`
2. extrait les reponses de la table (`extractAnswersFromTable`)
3. sauve via `saveTableProgress(evaluationId, tableId, { answers, ...meta })`

### E. Finalisation

1. Construction du resume (`EvaluationSummary`).
2. Acces optionnel a `ConstatsScreen`.
3. Purge locale a la fermeture du recapitulatif (`clearEvaluationProgress`).

## Flux d'execution

### Evaluation

- `EvaluationScreen` lit `evaluation_steps.json`
- Charge table courante via `tableDataLoader.loadTableData(tableId)`
- Rend via `ContentDetector` puis renderer specifique
- Sauvegarde progression/reponses via `saveTableProgress`

### Finalisation

- `EvaluationScreen` construit un resume
- Navigation vers `EvaluationSummary`
- `EvaluationSummary` peut vider les donnees via `clearEvaluationProgress`

### Constats

- `ConstatsScreen` recharge les donnees de tables
- `constatsGenerator.generateAllConstats(evaluationData)` calcule les constats actifs
- Affichage des constats detectes + source table

## Algorithme de generation des constats (detail)

### 1) Tables constats ciblees

`generateAllConstats` traite explicitement:

- `C2T01`
- `C2T02`
- `C2T03`
- `C2T04`
- `C2T05`

### 2) Construction du contexte

`buildEvaluationContext(evaluationData)`:

- injecte toutes les valeurs `C1T..` disponibles
- calcule des derivees:
  - `age`, `age_years`, `age_days`
  - `bmi`, `bmi_category`
  - `wound_age`, `wound_age_days`
- derive des flags metier:
  - `infection_signs_present`
  - `biofilm_suspected`
  - `smoking_present`
  - `autoimmune_disease_present`
  - `thyroid_disorder_present`
  - `nutrition_insufficient`
  - `vascular_assessment_inadequate`
  - `medication_affecting_healing`

### 3) Evaluation des regles

Pour chaque table `C2Txx`:

1. Lecture `source_mapping.mapping_rules`
2. Evaluation de `condition` via `evaluateCondition`
3. Si `true`:
   - ajout `constat_id` dans `detectedConstats`
   - stockage des metadonnees source/regle dans `constatData`

### 4) Evaluation des conditions au niveau element

Le generateur evalue aussi `element.condition` (si present), en excluant:

- elements manuels (`read_only === false`)
- elements de type `single_choice`

### 5) Regle de priorisation intra-section

Pour les sections avec `display_logic.rule === "most_severe_only"`:

- tri selon `priority_order`
- conservation du constat le plus prioritaire
- suppression des constats concurrents moins severes

### 6) Sortie

Pour chaque table:

- `detectedConstats: string[]`
- `constatData: object`
- `constatTable: schema JSON de la table`

## Routes/logique de redirection menant aux constats

Il existe deux logiques distinctes:

1. **Redirection clinique immediate intra-evaluation**
   - geree par `useEvaluationRouting`
   - ex: `C1T01E01` (date naissance) + regles `routes` dans le schema
   - active `RedirectAlert` / changement de trajectoire

2. **Navigation vers constats en fin de flux**
   - depuis `EvaluationSummaryScreen` vers `ConstatsScreen`
   - `ConstatsScreen` regenere les constats a partir des reponses stockees

## Comment integrer une nouvelle table (C1 ou C2)

### Ajouter une table C1 (evaluation)

1. Creer JSON dans `src/data/evaluations/columns/col1/`.
2. Ajouter l'etape dans `evaluation_steps.json`.
3. Declarer le mapping de fichier dans `TableDataLoader`:
   - import/require dans `_getAllTableImports`
   - mapping nom fichier dans `_getTableFileName`
4. Creer `TableXXRenderer.jsx` dans `table-renderers/tables/`.
5. Enregistrer le renderer dans `table-renderers/index.js`.
6. Ajouter/adapter composants forms si un nouveau type est necessaire.
7. Tester:
   - affichage
   - validation
   - persistance
   - reprise apres fermeture

### Ajouter une table C2 (constats)

1. Creer JSON dans `src/data/evaluations/columns/col2_constats/`.
2. Ajouter table dans `TableDataLoader` (imports + mapping).
3. Ajouter l'ID dans `ConstatsGenerator.generateAllConstats`.
4. Definir les `mapping_rules` et/ou `element.condition`.
5. Si necessaire, etendre `buildEvaluationContext` (nouveaux derivees).
6. Valider les priorites de section (`most_severe_only`) si utilisees.
7. Tester sur jeux de donnees reels.

## Fichiers clefs

- `src/app/EvaluationScreen.jsx`
- `src/app/EvaluationSummaryScreen.jsx`
- `src/app/ConstatsScreen.jsx`
- `src/services/TableDataLoader.js`
- `src/services/ConstatsGenerator.js`
- `src/features/evaluation/table-renderers/index.js`

## Etat reel du module constats

Ce module est operationnel mais incomplet.

- Ce qui est present:
  - structure col2 constats
  - generation dynamique
  - affichage par tables de constats
  - mapping source -> constat
- Ce qui reste:
  - validation clinique exhaustive des regles
  - couverture de tous les cas metier attendus
  - durcissement de l'evaluation de conditions (fiabilite/robustesse)
  - plan de tests automatises cible constats

## Dette technique identifiee

1. **Evaluation de conditions**
   - `ConstatsGenerator` manipule des expressions dynamiques.
   - A securiser et standardiser.
2. **Stockage des evaluations**
   - SecureStore utilise pour des blobs de reponses.
   - A reevaluer selon taille/strategie de retention.
3. **Conventions heterogenes**
   - imports env et patterns de persistance a normaliser.

## Reprise recommandee

1. Verrouiller les regles constats prioritaires (metier clinique).
2. Ajouter tests d'integration `evaluation -> constats`.
3. Stabiliser persistance + purge finale.
4. Documenter table par table les regles confirmees.

