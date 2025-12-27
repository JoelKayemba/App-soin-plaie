# Préparation : Routes vers Constats

## Structure actuelle

### Tables de constats existantes (col2_constats)
1. `table_01_cicatrisation_ralentie.json` (C2T01)
2. `table_02_statut_plaie.json` (C2T02)
3. `table_03_type_plaie.json` (C2T03)

### Tables d'évaluation (col1) - 34 tables
- C1T01 : Données de base
- C1T02 : Allergies
- C1T03 : Conditions de santé
- C1T04 : Poids et IMC
- C1T05 : Nutrition
- C1T06 : Facteurs de risque
- C1T07 : Médication active
- C1T08 : Psychosocial et environnement
- C1T09 : Assurance
- C1T10 : Niveau de soins
- C1T11 : Historique de la plaie
- C1T12 : Symptômes
- C1T13 : Perceptions et objectifs
- C1T14 : Localisation de la plaie
- C1T15 : Évaluation vasculaire
- C1T16 : BWAT - Taille
- C1T17 : BWAT - Forme
- C1T18 : BWAT - Profondeur
- C1T19 : BWAT - Bords
- C1T20 : BWAT - Décollement
- C1T21 : BWAT - Composition du lit de la plaie
- C1T22 : BWAT - Tissu nécrotique
- C1T23 : BWAT - Tissu de granulation
- C1T24 : BWAT - Épithélialisation
- C1T25 : BWAT - Exsudat
- C1T26 : BWAT - Peau péri-lésionnelle
- C1T27 : Signes et symptômes d'infection
- C1T28 : Tests de laboratoire
- C1T29 : Échelle de Braden
- C1T30 : Échelle de Braden-Q
- C1T31 : Lésion de pression
- C1T32 : Ulcère veineux
- C1T33 : Ulcère artériel
- C1T34 : Pied diabétique

## Format attendu pour les routes

Pour chaque élément de chaque table col1, les routes pointent vers des constats dans col2.

### Structure d'une route
```json
{
  "to": "ID_CONSTAT",  // ID du constat dans col2 (ex: "C2T01E01")
  "phase": "immediate" | "post_eval" | "on_plan" | "recap",
  "priority": 1,
  "condition": { ... },  // Optionnel
  "note": "Description de la route"
}
```

### Exemple de mapping
```json
// Dans C1T03 (Conditions de santé)
{
  "id": "C1T03E12",
  "label": "Diabète non contrôlé",
  "routes": [
    {
      "to": "C2T01E06",  // Pointe vers constat "Diabète non contrôlé" dans C2T01
      "phase": "post_eval",
      "priority": 1,
      "note": "Diabète non contrôlé détecté → constat de ralentissement de cicatrisation"
    }
  ]
}
```

## Template pour recevoir les informations

### Pour chaque table de constats (col2)

#### Table C2T01 - Cicatrisation ralentie
- [ ] Liste des constats disponibles
- [ ] Mapping avec les routes de col1

#### Table C2T02 - Statut de la plaie
- [ ] Liste des constats disponibles
- [ ] Mapping avec les routes de col1

#### Table C2T03 - Type de plaie
- [ ] Liste des constats disponibles
- [ ] Mapping avec les routes de col1

### Pour chaque table d'évaluation (col1)

#### C1T01 - Données de base
- [ ] Élément C1T01E01 : Routes → Constats
- [ ] Autres éléments...

#### C1T02 - Allergies
- [ ] Élément C1T02E01 : Routes → Constats
- [ ] Élément C1T02E02 : Routes → Constats
- [ ] Élément C1T02E03 : Routes → Constats
- [ ] Élément C1T02E04 : Routes → Constats

#### C1T03 - Conditions de santé
- [ ] Élément C1T03E01 : Routes → Constats
- [ ] Élément C1T03E02 : Routes → Constats
- [ ] ... (tous les éléments)

#### ... (continuer pour toutes les 34 tables)

## Notes importantes

1. **Phases des routes** :
   - `immediate` : Constat généré immédiatement (ex: infection suspectée)
   - `post_eval` : Constat généré après la fin de la colonne 1
   - `on_plan` : Constat utilisé pour le plan de traitement
   - `recap` : Constat affiché uniquement dans le récapitulatif

2. **Priorité** : Plus le nombre est bas, plus la priorité est élevée

3. **Conditions** : Optionnelles, permettent d'activer la route seulement si certaines conditions sont remplies

4. **Mapping** : Chaque route `to` doit correspondre à un `constat_id` dans les tables col2

## Prêt à recevoir

✅ Structure préparée
✅ Compréhension du système de routes
✅ Template créé pour organiser les informations
✅ Prêt à mapper les routes vers les constats

**En attente des informations de l'utilisateur :**
1. Liste complète des tables de constats (col2)
2. Routes de chaque élément de chaque table (col1)

