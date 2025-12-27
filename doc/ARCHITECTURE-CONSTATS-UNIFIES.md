# Architecture Unifiée des Constats

## 🔍 Problème identifié

Il existe **deux types de constats** dans l'application :

### 1. **Constats Calculés** (dans col1 - évaluation)
- **IPSCB** (C1T15) : Interprétations automatiques (Normal, Limite, Anormal léger/moderé/sévère)
- **Braden** (C1T29) : Niveaux de risque calculés (Risque faible/moyen/élevé)
- **Braden-Q** (C1T30) : Niveaux de risque pédiatriques
- **BWAT** : Scores calculés (0-5 par sous-table, score total)
- **Pied diabétique** (C1T34) : Conclusion sensorielle automatique

### 2. **Constats Déclaratifs** (dans col2_constats - JSON)
- **C2T01** : Cicatrisation ralentie par...
- **C2T02** : Statut de la plaie
- **C2T03** : Type de plaie

## ⚠️ Risque d'incohérence

Si on ajoute des constats JSON (col2) basés sur les mêmes données que les constats calculés (col1), on risque :
- **Duplication** : Même constat généré deux fois
- **Incohérence** : Constats contradictoires
- **Confusion** : Où chercher le constat ?

## ✅ Solution proposée : Architecture à deux niveaux

### Niveau 1 : Constats Calculés (col1) - **Résultats directs**
Ces constats sont **intrinsèques** aux tables d'évaluation :
- Calculés automatiquement
- Affichés directement dans la table
- Ne doivent **PAS** être dupliqués dans col2

**Exemples :**
- IPSCB < 0.4 → "Anormal, atteinte sévère" (affiché dans C1T15)
- Braden score < 12 → "Risque élevé" (affiché dans C1T29)
- BWAT score total → Affiché dans le récapitulatif

### Niveau 2 : Constats Synthétiques (col2) - **Constats dérivés**
Ces constats sont **synthétisés** à partir de plusieurs sources :
- Basés sur plusieurs tables
- Générés après l'évaluation complète
- Stockés dans col2_constats

**Exemples :**
- "Cicatrisation ralentie par : vieillissement, diabète, vascularisation inadéquate"
- "Statut de la plaie : aiguë/chronique" (basé sur date d'apparition)
- "Type de plaie : ulcère veineux" (basé sur étiologie)

## 📊 Mapping des Constats

### Constats Calculés (col1) → Routes vers Constats Synthétiques (col2)

| Table | Constat Calculé | Route vers col2 | Phase |
|-------|----------------|-----------------|-------|
| **C1T15** (IPSCB) | IPSCB < 0.4 (sévère) | C2T01E17 (Vascularisation inadéquate) | `post_eval` |
| **C1T15** (IPSCB) | IPSCB 0.4-0.69 (modéré) | C2T01E17 (Vascularisation inadéquate) | `post_eval` |
| **C1T29** (Braden) | Risque élevé (< 12) | C2T01EXX (Risque de lésion de pression) | `post_eval` |
| **C1T30** (Braden-Q) | Risque élevé | C2T01EXX (Risque de lésion de pression) | `post_eval` |
| **C1T34** (Pied diabétique) | Sensation protectrice perdue | C2T01E06 (Diabète non contrôlé) | `post_eval` |

### Constats Synthétiques (col2) - Sources multiples

| Constat col2 | Sources (col1) | Type |
|-------------|----------------|------|
| **C2T01E01** (Vieillissement) | C1T01 (âge >= 65) | Direct |
| **C2T01E06** (Diabète non contrôlé) | C1T03E12 (diabète) | Direct |
| **C2T01E17** (Vascularisation inadéquate) | C1T15 (IPSCB < 0.7) | **Calculé** |
| **C2T02E01** (Plaie aiguë) | C1T11E01 (date < 28 jours) | Calculé |
| **C2T02E02** (Plaie chronique) | C1T11E01 (date >= 28 jours) | Calculé |

## 🏗️ Architecture Technique

### 1. Constats Calculés (col1)
```javascript
// Dans la table C1T15 (IPSCB)
{
  "interpretation": {
    "severe": {
      "condition": "< 0.4",
      "label": "Anormal, atteinte sévère",
      "routes": [
        {
          "to": "C2T01E17",  // Route vers constat synthétique
          "phase": "post_eval",
          "priority": 1,
          "note": "IPSCB sévère → vascularisation inadéquate"
        }
      ]
    }
  }
}
```

### 2. Constats Synthétiques (col2)
```json
// Dans table_01_cicatrisation_ralentie.json
{
  "source_mapping": {
    "mapping_rules": [
      {
        "constat_id": "C2T01E17",
        "source": "C1T15",  // Table source
        "condition": "ipscb_severe OR ipscb_moderate",
        "description": "Vascularisation inadéquate si IPSCB < 0.7"
      }
    ]
  }
}
```

### 3. Service de Génération Unifié
```javascript
// ConstatsGenerator.js
class ConstatsGenerator {
  // 1. Générer les constats calculés (col1)
  generateCalculatedConstats(evaluationData) {
    // IPSCB, Braden, BWAT, etc.
  }
  
  // 2. Générer les constats synthétiques (col2)
  generateSyntheticConstats(evaluationData, calculatedConstats) {
    // Utilise les constats calculés comme source
  }
  
  // 3. Unifier tous les constats
  generateAllConstats(evaluationData) {
    const calculated = this.generateCalculatedConstats(evaluationData);
    const synthetic = this.generateSyntheticConstats(evaluationData, calculated);
    return { calculated, synthetic };
  }
}
```

## 📋 Règles de Mapping

### Règle 1 : Pas de duplication
- Si un constat est **calculé dans col1**, ne pas le recréer dans col2
- Utiliser une **route** pour lier le constat calculé au constat synthétique

### Règle 2 : Constats synthétiques uniquement
- Les constats col2 doivent être des **synthèses** de plusieurs sources
- Exemple : "Cicatrisation ralentie par X, Y, Z" (plusieurs facteurs)

### Règle 3 : Phases distinctes
- **`immediate`** : Constats critiques (ex: IPSCB < 0.4)
- **`post_eval`** : Constats synthétiques après évaluation complète
- **`on_plan`** : Constats pour le plan de traitement
- **`recap`** : Constats pour le récapitulatif

## 🔄 Flux de Génération

```
1. Évaluation (col1)
   ↓
2. Calculs automatiques
   - IPSCB → Interprétation
   - Braden → Niveau de risque
   - BWAT → Scores
   ↓
3. Routes activées
   - IPSCB sévère → Route vers C2T01E17
   - Braden élevé → Route vers C2T01EXX
   ↓
4. Génération constats synthétiques (col2)
   - Utilise les routes activées
   - Combine plusieurs sources
   ↓
5. Affichage unifié
   - Constats calculés : Dans leurs tables respectives
   - Constats synthétiques : Dans la colonne Constats
```

## ✅ Checklist pour éviter les incohérences

- [ ] Identifier tous les constats calculés existants (IPSCB, Braden, BWAT, etc.)
- [ ] Ne pas créer de constats col2 qui dupliquent les constats calculés
- [ ] Utiliser des routes pour lier constats calculés → constats synthétiques
- [ ] Documenter chaque constat : calculé ou synthétique ?
- [ ] Tester qu'il n'y a pas de duplication
- [ ] S'assurer que les constats synthétiques combinent plusieurs sources

## 📝 Exemple concret

### ❌ MAUVAIS (Duplication)
```json
// Dans col2_constats/table_01_cicatrisation_ralentie.json
{
  "constat_id": "C2T01E17",
  "source": "C1T15",
  "condition": "ipscb < 0.4",  // ❌ Duplique le constat calculé
  "description": "IPSCB sévère"
}
```

### ✅ BON (Route depuis constat calculé)
```json
// Dans col1/table_15_vascular_assessment.json
{
  "interpretation": {
    "severe": {
      "condition": "< 0.4",
      "label": "Anormal, atteinte sévère",
      "routes": [
        {
          "to": "C2T01E17",  // ✅ Route vers constat synthétique
          "phase": "post_eval"
        }
      ]
    }
  }
}

// Dans col2_constats/table_01_cicatrisation_ralentie.json
{
  "constat_id": "C2T01E17",
  "source": "C1T15",  // ✅ Source : table IPSCB
  "condition": "route_activated_from_C1T15",  // ✅ Vérifie la route
  "description": "Vascularisation inadéquate (détectée via IPSCB)"
}
```

## 🎯 Conclusion

**Principe fondamental :**
- **Constats calculés (col1)** = Résultats directs, affichés dans leurs tables
- **Constats synthétiques (col2)** = Synthèses de plusieurs sources, affichés dans la colonne Constats
- **Routes** = Lien entre les deux niveaux

Cette architecture évite les duplications et les incohérences !

