# Algorithme Constats - Specification technique

## Objectif

Transformer les reponses de l'evaluation (C1) en constats cliniques detectes (C2), avec priorisation des severites.

## Entrees

- `evaluationData` (objet par table C1, rempli dans `EvaluationScreen`)
- Schemas C2 dans `src/data/evaluations/columns/col2_constats/`

## Sortie

Objet par table C2:

```text
{
  C2T01: { detectedConstats: [...], constatData: {...}, constatTable: {...} },
  C2T02: { ... },
  ...
}
```

## Etapes algorithmiques

### 1) Build context

`buildEvaluationContext(evaluationData)`:

- copie toutes les valeurs champs (C1T..)
- calcule derivees:
  - age (years/days/months)
  - BMI + categorie
  - age de plaie
- derive booleens metier (infection, biofilm, tabagisme, nutrition, etc.)

### 2) Mapping rules

Pour chaque table C2:

- lire `source_mapping.mapping_rules`
- pour chaque regle:
  - evaluer `condition`
  - si vrai, ajouter `constat_id`

### 3) Conditions directes element

Si un element C2 porte `condition`, l'evaluer aussi.

Exclusions:

- element manuel (`read_only === false`)
- `single_choice`

### 4) Priorisation severite

Si section avec:

```text
display_logic.rule = "most_severe_only"
```

alors:

- trier les constats detectes de section selon `priority_order`
- conserver le plus prioritaire
- retirer les autres

## Evaluation des conditions

`evaluateCondition` supporte:

- references directes champs (`C1TxxEyy`)
- comparaisons booleennes/numeriques/strings
- cas tableaux (`includes`)
- helpers simples (`contains`, `gte`, `lte`, etc.)

Limitation connue:

- evaluation basee sur expression dynamique; necessite durcissement pour robustesse/securite.

## Couplage navigation/routes

Routes menant aux constats:

1. Saisie des tables dans `EvaluationScreen`
2. Finalisation -> `EvaluationSummary`
3. Navigation utilisateur vers `ConstatsScreen`
4. `ConstatsScreen` recharge donnees et appelle `generateAllConstats`

## Etat actuel

- Pipeline en place et fonctionnel.
- Regles partiellement completees selon les tables.
- Validation clinique exhaustive encore necessaire.

## Recommandations d'amelioration

1. Introduire des tests de non-regression sur regles critiques.
2. Isoler et normaliser le mini-langage de conditions.
3. Ajouter traces structurées (debug context, regle, resultat).
4. Produire matrice de test metier par table C2.

