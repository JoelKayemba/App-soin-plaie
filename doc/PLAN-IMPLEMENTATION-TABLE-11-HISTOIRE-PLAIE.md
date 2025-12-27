# Plan d'Implémentation - Table 11 : Histoire de la plaie

## 📋 Vue d'ensemble

La table C1T11 (Histoire de la plaie) génère automatiquement :
- **Statut de la plaie** (C2T02) : Aiguë ou Chronique basé sur la date d'apparition
- **Type de plaie** (C2T03) : Basé sur l'étiologie sélectionnée
- **Routes conditionnelles** : Vers d'autres tables selon l'étiologie

---

## 1. Statut de la plaie (C2T02)

### 1.1. Calcul de l'âge de la plaie

**Source :**
- `C1T11E01` : Date d'apparition de la plaie

**Calcul :**
```javascript
woundAge = calculateWoundAge(C1T11E01);
// Retourne : { days, isRecent, isChronic }
```

### 1.2. Constat : Plaie Aiguë

**Condition :**
- `wound_age < 28 jours` (moins de 4 semaines)

**Affichage :**
- **Constat ID** : `C2T02E01`
- **Label** : "Aiguë"
- **Format d'affichage** : "Plaie aiguë (< 4 semaines)"
- **Badge** : Vert (#4CAF50)
- **Phase** : `immediate` (affiché dès que la date est saisie)

**Structure JSON :**
```json
{
  "id": "C1T11E01",
  "type": "date",
  "label": "À quel moment est apparue la plaie ?",
  "routes": [
    {
      "to": "C2T02E01",
      "phase": "immediate",
      "priority": 1,
      "condition": {
        "lt": {
          "var": "wound_age_days",
          "value": 28
        }
      },
      "note": "Plaie aiguë détectée (< 4 semaines)"
    }
  ]
}
```

**Affichage dans la table :**
- Afficher : **"< 4 semaines"** (remplacer le texte calculé)
- Sauvegarder : `C2T02E01` = true

---

### 1.3. Constat : Plaie Chronique

**Condition :**
- `wound_age >= 28 jours` (4 semaines ou plus)

**Affichage :**
- **Constat ID** : `C2T02E02`
- **Label** : "Chronique"
- **Format d'affichage** : "Plaie chronique (≥ 4 semaines)"
- **Badge** : Orange (#FF9800)
- **Phase** : `immediate` (affiché dès que la date est saisie)

**Structure JSON :**
```json
{
  "id": "C1T11E01",
  "type": "date",
  "label": "À quel moment est apparue la plaie ?",
  "routes": [
    {
      "to": "C2T02E02",
      "phase": "immediate",
      "priority": 1,
      "condition": {
        "gte": {
          "var": "wound_age_days",
          "value": 28
        }
      },
      "note": "Plaie chronique détectée (≥ 4 semaines)"
    }
  ]
}
```

**Affichage dans la table :**
- Afficher : **"≥ 4 semaines"** (remplacer le texte calculé)
- Sauvegarder : `C2T02E02` = true

---

## 2. Type de plaie (C2T03) - Basé sur l'étiologie

### 2.1. Ulcère veineux

**Condition :**
- `C1T11E06` contient `"insuffisance_veineuse"`
- ET `C1T11E06` ne contient PAS `"maladie_arterielle"`

**Constat :**
- **Constat ID** : `C2T03E01`
- **Label** : "Ulcère veineux"
- **Badge** : Bleu (#2196F3)
- **Phase** : `post_eval`

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "type": "multiple_choice",
  "label": "Quelle est l'étiologie de la plaie ?",
  "routes": [
    {
      "to": "C2T03E01",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "allOf": [
          {
            "contains": {
              "var": "C1T11E06",
              "value": "insuffisance_veineuse"
            }
          },
          {
            "notContains": {
              "var": "C1T11E06",
              "value": "maladie_arterielle"
            }
          }
        ]
      },
      "note": "Ulcère veineux détecté"
    }
  ]
}
```

---

### 2.2. Ulcère artériel

**Condition :**
- `C1T11E06` contient `"maladie_arterielle"`
- ET `C1T11E06` ne contient PAS `"insuffisance_veineuse"`

**Constat :**
- **Constat ID** : `C2T03E02`
- **Label** : "Ulcère artériel"
- **Badge** : Rouge (#F44336)
- **Phase** : `post_eval`

**Route supplémentaire :**
- **Ouvrir la table** : `C1T33` (Ulcère artériel) - comme fait pour pied diabétique

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E02",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "allOf": [
          {
            "contains": {
              "var": "C1T11E06",
              "value": "maladie_arterielle"
            }
          },
          {
            "notContains": {
              "var": "C1T11E06",
              "value": "insuffisance_veineuse"
            }
          }
        ]
      },
      "note": "Ulcère artériel détecté"
    },
    {
      "to": "C1T33",
      "phase": "immediate",
      "priority": 1,
      "condition": {
        "contains": {
          "var": "C1T11E06",
          "value": "maladie_arterielle"
        }
      },
      "note": "Ouvrir table Ulcère artériel",
      "action": "navigate_to_table"
    }
  ]
}
```

---

### 2.3. Ulcère mixte

**Condition :**
- `C1T11E06` contient `"insuffisance_veineuse"`
- ET `C1T11E06` contient `"maladie_arterielle"`

**Constat :**
- **Constat ID** : `C2T03E03`
- **Label** : "Ulcère mixte"
- **Badge** : Orange (#FF9800)
- **Phase** : `post_eval`

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E03",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "allOf": [
          {
            "contains": {
              "var": "C1T11E06",
              "value": "insuffisance_veineuse"
            }
          },
          {
            "contains": {
              "var": "C1T11E06",
              "value": "maladie_arterielle"
            }
          }
        ]
      },
      "note": "Ulcère mixte détecté"
    }
  ]
}
```

---

### 2.4. Brûlure (avec stades)

**Condition :**
- `C1T11E06` contient `"brulure"`

**Constats selon le stade (C1T11E08) :**

#### 2.4.1. Brûlure - 1er degré
- **Condition** : `C1T11E08 === "stage_1"`
- **Constat ID** : `C2T03E05`
- **Label** : "1er degré"
- **Badge** : Orange (#FF9800)

#### 2.4.2. Brûlure - 2e degré superficiel
- **Condition** : `C1T11E08 === "stage_2a"`
- **Constat ID** : `C2T03E06`
- **Label** : "2e degré superficiel"
- **Badge** : Orange (#FF5722)

#### 2.4.3. Brûlure - 2e degré profond
- **Condition** : `C1T11E08 === "stage_2b"`
- **Constat ID** : `C2T03E07`
- **Label** : "2e degré profond"
- **Badge** : Rouge (#F44336)

#### 2.4.4. Brûlure - 3e ou 4e degré
- **Condition** : `C1T11E08 === "stage_3" OR C1T11E08 === "stage_4"`
- **Constat ID** : `C2T03E08`
- **Label** : "3e ou 4e degré"
- **Badge** : Rouge foncé (#D32F2F)

**Structure JSON :**
```json
{
  "id": "C1T11E08",
  "type": "single_choice",
  "label": "Si Brûlure → Sélectionner le stade",
  "routes": [
    {
      "to": "C2T03E05",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E08",
          "value": "stage_1"
        }
      },
      "note": "Brûlure 1er degré"
    },
    {
      "to": "C2T03E06",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E08",
          "value": "stage_2a"
        }
      },
      "note": "Brûlure 2e degré superficiel"
    },
    {
      "to": "C2T03E07",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E08",
          "value": "stage_2b"
        }
      },
      "note": "Brûlure 2e degré profond"
    },
    {
      "to": "C2T03E08",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "anyOf": [
          {
            "eq": {
              "var": "C1T11E08",
              "value": "stage_3"
            }
          },
          {
            "eq": {
              "var": "C1T11E08",
              "value": "stage_4"
            }
          }
        ]
      },
      "note": "Brûlure 3e ou 4e degré"
    }
  ]
}
```

---

### 2.5. Déchirure cutanée

**Condition :**
- `C1T11E06` contient `"dechirure_cutanee"`

**Constat :**
- **Constat ID** : `C2T03E09`
- **Label** : "Déchirure cutanée"
- **Badge** : Violet (#9C27B0)
- **Phase** : `post_eval`

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E09",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "contains": {
          "var": "C1T11E06",
          "value": "dechirure_cutanee"
        }
      },
      "note": "Déchirure cutanée détectée"
    }
  ]
}
```

---

### 2.6. Lésion de pression (avec stades)

**Condition :**
- `C1T11E06` contient `"pression"`

**Constats selon le stade (C1T11E09) :**

#### 2.6.1. Lésion de pression - Stade 1
- **Condition** : `C1T11E09 === "stage_1"`
- **Constat ID** : `C2T03E11`
- **Label** : "Stade 1"
- **Badge** : Orange (#FF9800)

#### 2.6.2. Lésion de pression - Stade 2
- **Condition** : `C1T11E09 === "stage_2"`
- **Constat ID** : `C2T03E12`
- **Label** : "Stade 2"
- **Badge** : Orange (#FF5722)

#### 2.6.3. Lésion de pression - Stade 3
- **Condition** : `C1T11E09 === "stage_3"`
- **Constat ID** : `C2T03E13`
- **Label** : "Stade 3"
- **Badge** : Rouge (#F44336)

#### 2.6.4. Lésion de pression - Stade 4
- **Condition** : `C1T11E09 === "stage_4"`
- **Constat ID** : `C2T03E14`
- **Label** : "Stade 4"
- **Badge** : Rouge foncé (#D32F2F)

#### 2.6.5. Lésion de pression - LTP
- **Condition** : `C1T11E09 === "ltp"`
- **Constat ID** : `C2T03E15`
- **Label** : "LTP (lésion des tissus profonds)"
- **Badge** : Violet (#9C27B0)

#### 2.6.6. Lésion de pression - Stade indéterminé
- **Condition** : `C1T11E09 === "undetermined"`
- **Constat ID** : `C2T03E16`
- **Label** : "Stade indéterminé"
- **Badge** : Gris (#9E9E9E)

**Structure JSON :**
```json
{
  "id": "C1T11E09",
  "type": "single_choice",
  "label": "Si Lésion de pression → Sélectionner le stade",
  "routes": [
    {
      "to": "C2T03E11",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E09",
          "value": "stage_1"
        }
      },
      "note": "Lésion de pression stade 1"
    },
    {
      "to": "C2T03E12",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E09",
          "value": "stage_2"
        }
      },
      "note": "Lésion de pression stade 2"
    },
    {
      "to": "C2T03E13",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E09",
          "value": "stage_3"
        }
      },
      "note": "Lésion de pression stade 3"
    },
    {
      "to": "C2T03E14",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E09",
          "value": "stage_4"
        }
      },
      "note": "Lésion de pression stade 4"
    },
    {
      "to": "C2T03E15",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E09",
          "value": "ltp"
        }
      },
      "note": "Lésion de pression LTP"
    },
    {
      "to": "C2T03E16",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "eq": {
          "var": "C1T11E09",
          "value": "undetermined"
        }
      },
      "note": "Lésion de pression stade indéterminé"
    }
  ]
}
```

---

### 2.7. Plaie traumatique

**Condition :**
- `C1T11E06` contient `"autre_trauma"`

**Constat :**
- **Constat ID** : `C2T03E17`
- **Label** : "Plaie traumatique"
- **Badge** : Bleu-gris (#607D8B)
- **Phase** : `post_eval`

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E17",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "contains": {
          "var": "C1T11E06",
          "value": "autre_trauma"
        }
      },
      "note": "Plaie traumatique détectée"
    }
  ]
}
```

---

### 2.8. Dermite d'incontinence

**Condition :**
- `C1T11E06` contient `"incontinence"`

**Constat :**
- **Constat ID** : `C2T03E18`
- **Label** : "Dermite d'incontinence"
- **Badge** : Cyan (#00BCD4)
- **Phase** : `post_eval`

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E18",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "contains": {
          "var": "C1T11E06",
          "value": "incontinence"
        }
      },
      "note": "Dermite d'incontinence détectée"
    }
  ]
}
```

---

### 2.9. Ulcère du pied diabétique

**Condition :**
- `C1T11E06` contient `"pied_diabetique"`

**Constat :**
- **Constat ID** : `C2T03E19`
- **Label** : "Ulcère du pied diabétique"
- **Badge** : Rose (#E91E63)
- **Phase** : `post_eval`

**Route supplémentaire :**
- **Ouvrir la table** : `C1T34` (Pied diabétique) - comme déjà implémenté

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E19",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "contains": {
          "var": "C1T11E06",
          "value": "pied_diabetique"
        }
      },
      "note": "Ulcère du pied diabétique détecté"
    },
    {
      "to": "C1T34",
      "phase": "immediate",
      "priority": 1,
      "condition": {
        "contains": {
          "var": "C1T11E06",
          "value": "pied_diabetique"
        }
      },
      "note": "Ouvrir table Pied diabétique",
      "action": "navigate_to_table"
    }
  ]
}
```

---

### 2.10. Plaie chirurgicale

**Condition :**
- `C1T11E06` contient `"chirurgie"` OU `"atypique"`

**Constat :**
- **Constat ID** : `C2T03E20`
- **Label** : "Plaie chirurgicale"
- **Badge** : Indigo (#3F51B5)
- **Phase** : `post_eval`

**Note :** Les plaies atypiques sont aussi classées comme plaies chirurgicales.

**Structure JSON :**
```json
{
  "id": "C1T11E06",
  "routes": [
    {
      "to": "C2T03E20",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "anyOf": [
          {
            "contains": {
              "var": "C1T11E06",
              "value": "chirurgie"
            }
          },
          {
            "contains": {
              "var": "C1T11E06",
              "value": "atypique"
            }
          }
        ]
      },
      "note": "Plaie chirurgicale détectée"
    }
  ]
}
```

---

## 📊 Résumé des Routes et Constats

| Élément | Condition | Constat col2 | Route vers table | Phase |
|---------|-----------|--------------|------------------|-------|
| **C1T11E01** | `wound_age < 28 jours` | C2T02E01 (Aiguë) | - | `immediate` |
| **C1T11E01** | `wound_age >= 28 jours` | C2T02E02 (Chronique) | - | `immediate` |
| **C1T11E06** | Insuffisance veineuse seule | C2T03E01 (Ulcère veineux) | - | `post_eval` |
| **C1T11E06** | Maladie artérielle seule | C2T03E02 (Ulcère artériel) | C1T33 | `post_eval` + `immediate` |
| **C1T11E06** | Insuffisance veineuse + Artérielle | C2T03E03 (Ulcère mixte) | - | `post_eval` |
| **C1T11E08** | Brûlure + Stade 1 | C2T03E05 (1er degré) | - | `post_eval` |
| **C1T11E08** | Brûlure + Stade 2a | C2T03E06 (2e degré superficiel) | - | `post_eval` |
| **C1T11E08** | Brûlure + Stade 2b | C2T03E07 (2e degré profond) | - | `post_eval` |
| **C1T11E08** | Brûlure + Stade 3 ou 4 | C2T03E08 (3e ou 4e degré) | - | `post_eval` |
| **C1T11E06** | Déchirure cutanée | C2T03E09 (Déchirure cutanée) | - | `post_eval` |
| **C1T11E09** | Pression + Stade 1 | C2T03E11 (Stade 1) | - | `post_eval` |
| **C1T11E09** | Pression + Stade 2 | C2T03E12 (Stade 2) | - | `post_eval` |
| **C1T11E09** | Pression + Stade 3 | C2T03E13 (Stade 3) | - | `post_eval` |
| **C1T11E09** | Pression + Stade 4 | C2T03E14 (Stade 4) | - | `post_eval` |
| **C1T11E09** | Pression + LTP | C2T03E15 (LTP) | - | `post_eval` |
| **C1T11E09** | Pression + Indéterminé | C2T03E16 (Indéterminé) | - | `post_eval` |
| **C1T11E06** | Autre trauma | C2T03E17 (Plaie traumatique) | - | `post_eval` |
| **C1T11E06** | Incontinence | C2T03E18 (Dermite d'incontinence) | - | `post_eval` |
| **C1T11E06** | Pied diabétique | C2T03E19 (Ulcère pied diabétique) | C1T34 | `post_eval` + `immediate` |
| **C1T11E06** | Chirurgie ou Atypique | C2T03E20 (Plaie chirurgicale) | - | `post_eval` |

---

## 🔄 Flux d'évaluation

```
1. Saisie date d'apparition (C1T11E01)
   ↓
2. Calcul âge de la plaie
   ├─ Si < 28 jours → Constat "Plaie aiguë" (C2T02E01) - Afficher "< 4 semaines"
   └─ Si >= 28 jours → Constat "Plaie chronique" (C2T02E02) - Afficher "≥ 4 semaines"
   ↓
3. Sélection étiologie (C1T11E06)
   ↓
4. Évaluation étiologie
   ├─ Insuffisance veineuse seule → C2T03E01
   ├─ Maladie artérielle seule → C2T03E02 + Ouvrir C1T33
   ├─ Insuffisance veineuse + Artérielle → C2T03E03
   ├─ Brûlure → Évaluer stade (C1T11E08) → C2T03E05-08
   ├─ Déchirure cutanée → C2T03E09
   ├─ Pression → Évaluer stade (C1T11E09) → C2T03E11-16
   ├─ Autre trauma → C2T03E17
   ├─ Incontinence → C2T03E18
   ├─ Pied diabétique → C2T03E19 + Ouvrir C1T34
   └─ Chirurgie ou Atypique → C2T03E20
   ↓
5. Génération constats col2
   └─ Tous les constats générés en phase `post_eval`
```

---

## 🛠️ Points d'implémentation

### 1. Calcul de l'âge de la plaie
- Utiliser `ConstatsGenerator.calculateWoundAge()` avec `C1T11E01`
- Vérifier si `wound_age_days < 28` ou `>= 28`

### 2. Affichage du statut
- Remplacer le texte calculé par :
  - **"< 4 semaines"** pour plaie aiguë
  - **"≥ 4 semaines"** pour plaie chronique

### 3. Évaluation de l'étiologie
- Vérifier les valeurs dans `C1T11E06` (tableau)
- Gérer les combinaisons (veineuse + artérielle = mixte)

### 4. Routes vers tables spécialisées
- Maladie artérielle → Ouvrir C1T33 (comme C1T34 pour pied diabétique)
- Pied diabétique → Ouvrir C1T34 (déjà implémenté)

### 5. Stades conditionnels
- Brûlure : Évaluer `C1T11E08` si `C1T11E06` contient "brulure"
- Pression : Évaluer `C1T11E09` si `C1T11E06` contient "pression"

---

## ✅ Checklist d'implémentation

- [ ] Ajouter le calcul de l'âge de la plaie dans `buildEvaluationContext()`
- [ ] Implémenter l'affichage "< 4 semaines" / "≥ 4 semaines"
- [ ] Implémenter le constat "Plaie aiguë" (C2T02E01)
- [ ] Implémenter le constat "Plaie chronique" (C2T02E02)
- [ ] Implémenter le constat "Ulcère veineux" (C2T03E01)
- [ ] Implémenter le constat "Ulcère artériel" (C2T03E02)
- [ ] Ajouter la route vers C1T33 pour maladie artérielle
- [ ] Implémenter le constat "Ulcère mixte" (C2T03E03)
- [ ] Implémenter les constats de brûlure selon stades (C2T03E05-08)
- [ ] Implémenter le constat "Déchirure cutanée" (C2T03E09)
- [ ] Implémenter les constats de pression selon stades (C2T03E11-16)
- [ ] Implémenter le constat "Plaie traumatique" (C2T03E17)
- [ ] Implémenter le constat "Dermite d'incontinence" (C2T03E18)
- [ ] Implémenter le constat "Ulcère pied diabétique" (C2T03E19)
- [ ] Vérifier la route vers C1T34 pour pied diabétique (déjà implémenté)
- [ ] Implémenter le constat "Plaie chirurgicale" (C2T03E20) pour chirurgie ET atypique
- [ ] Tester tous les scénarios
- [ ] Vérifier l'affichage des badges
- [ ] Vérifier la cohérence avec l'architecture unifiée

---

## 📝 Notes importantes

1. **Priorité des étiologies** : Si plusieurs étiologies sont sélectionnées, évaluer dans l'ordre de priorité (mixte > veineux/artériel seul)

2. **Stades conditionnels** : Les stades de brûlure et pression ne sont évalués que si l'étiologie correspondante est sélectionnée

3. **Routes vers tables** : Maladie artérielle et pied diabétique ouvrent des tables spécialisées

4. **Plaie atypique** : Classée comme plaie chirurgicale (C2T03E20)

5. **Affichage statut** : Remplacer le texte calculé par "< 4 semaines" ou "≥ 4 semaines"

---

**Status** : 📝 Plan créé - Prêt pour implémentation

