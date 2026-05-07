# Playbook - Integrer une nouvelle table

Ce document detaille la procedure d'integration d'une table, du schema JSON au rendu et aux constats.

## Cas 1 - Nouvelle table d'evaluation (C1Txx)

## 1. Schema JSON

- Creer le fichier dans `src/data/evaluations/columns/col1/`
- Respecter l'ID (`C1Txx`) et les IDs element (`C1TxxEyy`)
- Definir `elements`, `validation`, `ui`, `condition` si necessaire

## 2. Flux d'etapes

- Ajouter l'etape dans `src/data/evaluations/evaluation_steps.json`
- Verifier `order`, `title`, `description`, `required`

## 3. Chargement (TableDataLoader)

Dans `src/services/TableDataLoader.js`:

- ajouter le `require()` du fichier dans `_getAllTableImports`
- ajouter la cle dans `this.allTablesCache`
- ajouter la correspondance dans `_getTableFileName`

## 4. Rendu

- Creer `src/features/evaluation/table-renderers/tables/TableXXRenderer.jsx`
- Utiliser `renderElement` + `shouldShowElement`
- Ajouter logique specifique si table complexe (sub blocks, additional fields)

## 5. Registre central

Dans `src/features/evaluation/table-renderers/index.js`:

- importer `TableXXRenderer`
- enregistrer `'C1TXX': TableXXRenderer` dans `TABLE_RENDERERS`

## 6. Si nouveau type de composant

- etendre `ElementRenderer` (`switch element.type`)
- ajouter/exporter composant dans `src/components/ui/forms/index.js`

## 7. Persistance

- verifier que les champs sont bien prefixes `C1Txx...`
- confirmer que `extractAnswersFromTable` les capte
- verifier `saveTableProgress` et `loadTableAnswers`

## 8. Tests manuels minimum

- affichage initial
- affichage conditionnel
- sauvegarde auto
- reprise apres fermeture/reouverture
- navigation precedent/suivant sans perte

---

## Cas 2 - Nouvelle table de constats (C2Txx)

## 1. Schema C2

- creer JSON dans `src/data/evaluations/columns/col2_constats/`
- definir `source_mapping.mapping_rules`
- optionnel: `sections` + `display_logic` pour priorisation

## 2. Chargement

- ajouter `require()` + mapping dans `TableDataLoader`

## 3. Generation

- ajouter l'ID C2 dans `generateAllConstats()`
- valider les conditions avec `buildEvaluationContext`
- enrichir `buildEvaluationContext` si nouveaux derivees necessaires

## 4. Priorisation

Si plusieurs constats concurrents:

- configurer `display_logic.rule = "most_severe_only"`
- definir `priority_order`

## 5. Tests manuels minimum

- scenario positif (constat attendu detecte)
- scenario negatif (faux positif non detecte)
- scenario conflit (priorite bien appliquee)
- verification source affichee dans `ConstatsScreen`

---

## Gabarit de check PR (recommande)

- [ ] JSON table valide
- [ ] Etape ajoutee (si C1)
- [ ] Loader mis a jour
- [ ] Renderer ajoute et enregistre
- [ ] Conditions testees (C2)
- [ ] Persistance/reprise verifiee
- [ ] Documentation mise a jour (`doc/03` + checklist)

