# Plan d'Implémentation - Table 15 : Apport Vasculaire

## 📋 Vue d'ensemble

La table C1T15 (Évaluation de l'apport vasculaire) génère plusieurs constats conditionnels basés sur :
- L'âge du patient (C1T01)
- Les résultats IPSCB
- Les signes d'inspection
- Les signes de palpation
- Le questionnaire d'Édimbourg

## 🎯 Constats à implémenter

### 1. Avertissement IPSCB (si âge >= 65 ans)

**Condition :**
- `C1T01E01` (Date de naissance) → Calculer l'âge
- Si `âge >= 65 ans`

**Affichage :**
- **Type** : Avertissement important
- **Position** : Juste avant le résultat IPSCB
- **Message** : 
  ```
  ⚠️ Important : Le résultat de l'IPSCB pourrait être altéré en raison de l'âge 
  avancé, le diabète, l'HTA non contrôlée, de l'arythmie ou l'IRC
  ```
- **Phase** : `immediate` (affiché dès que l'IPSCB est calculé)
- **Priorité** : 2

**Structure JSON :**
```json
{
  "id": "C1T15_WARNING_AGE",
  "type": "warning",
  "condition": {
    "gte": {
      "var": "age.years",
      "value": 65
    }
  },
  "message": "Le résultat de l'IPSCB pourrait être altéré en raison de l'âge avancé, le diabète, l'HTA non contrôlée, de l'arythmie ou l'IRC",
  "severity": "important",
  "display": {
    "position": "before_ipscb_result",
    "component": "ClinicalAlert",
    "type": "warning"
  },
  "phase": "immediate",
  "priority": 2
}
```

---

### 2. Constat : "Sans autre S/S d'insuffisance artérielle"

**Condition :**
- **Inspection** : Aucun signe d'inspection coché
  - `C1T15I01` = null OU aucun option sélectionnée
- **Palpation** : Seuls les pouls suivants sont cochés :
  - `C1T15P03` (Pouls pédieux) : 2/4, 3/4, ou 4/4
  - `C1T15P04` (Pouls tibial postérieur) : 2/4, 3/4, ou 4/4
  - ET `C1T15P01` (Froideur) = false
  - ET `C1T15P02` (Retour capillaire > 2s) = false

**Affichage :**
- **Type** : Constat informatif
- **Format** : Popup avec explication
- **Message** : 
  ```
  Sans autre S/S (signes/symptômes) d'insuffisance artérielle
  ```
- **Phase** : `post_eval`
- **Priorité** : 3

**Structure JSON :**
```json
{
  "id": "C1T15_CONSTAT_NO_ARTERIAL_SIGNS",
  "type": "informational",
  "label": "Sans autre S/S d'insuffisance artérielle",
  "description": "Aucun signe d'inspection et pouls normaux uniquement",
  "condition": {
    "allOf": [
      {
        "eq": {
          "var": "C1T15I01",
          "value": null
        }
      },
      {
        "or": [
          {
            "in": {
              "var": "C1T15P03",
              "values": ["C1T15P03_2", "C1T15P03_3", "C1T15P03_4"]
            }
          },
          {
            "in": {
              "var": "C1T15P04",
              "values": ["C1T15P04_2", "C1T15P04_3", "C1T15P04_4"]
            }
          }
        ]
      },
      {
        "eq": {
          "var": "C1T15P01",
          "value": false
        }
      },
      {
        "eq": {
          "var": "C1T15P02",
          "value": false
        }
      }
    ]
  },
  "ui": {
    "component": "ResultBadge",
    "color": "#4CAF50",
    "display_format": "Sans autre S/S d'insuffisance artérielle",
    "popup": {
      "title": "Signes d'insuffisance artérielle",
      "message": "Aucun signe d'inspection d'insuffisance artérielle détecté et pouls normaux uniquement."
    }
  },
  "phase": "post_eval",
  "priority": 3
}
```

---

### 3. Constat : "Avec S/S d'insuffisance artérielle" (Claudication intermittente faible)

**Condition :**
- **Palpation** : Au moins UN des éléments suivants :
  - `C1T15P01` (Peau froide) = true
  - OU `C1T15P02` (Retour capillaire > 2s) = true
  - OU `C1T15P03` (Pouls pédieux) = "1/4" (C1T15P03_1)
  - OU `C1T15P04` (Pouls tibial postérieur) = "1/4" (C1T15P04_1)
- **ET Questionnaire d'Édimbourg** :
  - `C1T15E01` (Q1) = "Oui" (C1T15E01_yes)
  - `C1T15E02` (Q2) = "Non" (C1T15E02_no)
  - `C1T15E03` (Q3) = "Oui" (C1T15E03_yes)
  - `C1T15E04` (Q4) = "Non" (C1T15E04_no)
  - `C1T15E05` (Q5) = "≤ 10 minutes" (C1T15E05_disappears)
  - `C1T15E06` (Q6) = Contient au moins un de : "fesses" (C1T15E06_buttocks), "cuisses" (C1T15E06_thighs), "mollets" (C1T15E06_calves)

**Résultat :**
- **Interprétation** : "Claudication intermittente faible"

**Affichage :**
- **Type** : Constat avec avertissement
- **Format** : Badge avec popup
- **Message** : 
  ```
  Avec S/S (signes/symptômes) d'insuffisance artérielle
  
  ⚠️ Important : Attention, la présence de pouls n'exclut pas de manière 
  fiable une maladie artérielle périphérique
  ```
- **Phase** : `post_eval`
- **Priorité** : 1

**Structure JSON :**
```json
{
  "id": "C1T15_CONSTAT_WITH_ARTERIAL_SIGNS_WEAK",
  "type": "warning",
  "label": "Avec S/S d'insuffisance artérielle",
  "description": "Claudication intermittente faible détectée",
  "condition": {
    "allOf": [
      {
        "anyOf": [
          {
            "eq": {
              "var": "C1T15P01",
              "value": true
            }
          },
          {
            "eq": {
              "var": "C1T15P02",
              "value": true
            }
          },
          {
            "eq": {
              "var": "C1T15P03",
              "value": "C1T15P03_1"
            }
          },
          {
            "eq": {
              "var": "C1T15P04",
              "value": "C1T15P04_1"
            }
          }
        ]
      },
      {
        "allOf": [
          {
            "eq": {
              "var": "C1T15E01",
              "value": "C1T15E01_yes"
            }
          },
          {
            "eq": {
              "var": "C1T15E02",
              "value": "C1T15E02_no"
            }
          },
          {
            "eq": {
              "var": "C1T15E03",
              "value": "C1T15E03_yes"
            }
          },
          {
            "eq": {
              "var": "C1T15E04",
              "value": "C1T15E04_no"
            }
          },
          {
            "eq": {
              "var": "C1T15E05",
              "value": "C1T15E05_disappears"
            }
          },
          {
            "anyOf": [
              {
                "eq": {
                  "var": "C1T15E06",
                  "value": "C1T15E06_buttocks"
                }
              },
              {
                "eq": {
                  "var": "C1T15E06",
                  "value": "C1T15E06_thighs"
                }
              },
              {
                "eq": {
                  "var": "C1T15E06",
                  "value": "C1T15E06_calves"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "interpretation": {
    "edinburgh_result": "claudication_intermittent_faible"
  },
  "ui": {
    "component": "ResultBadge",
    "color": "#FF9800",
    "display_format": "Avec S/S d'insuffisance artérielle",
    "popup": {
      "title": "Signes d'insuffisance artérielle détectés",
      "message": "Claudication intermittente faible détectée.\n\n⚠️ Important : Attention, la présence de pouls n'exclut pas de manière fiable une maladie artérielle périphérique.",
      "severity": "warning"
    }
  },
  "phase": "post_eval",
  "priority": 1,
  "routes": [
    {
      "to": "C2T01E17",
      "phase": "post_eval",
      "priority": 1,
      "note": "Vascularisation inadéquate détectée → constat synthétique"
    }
  ]
}
```

---

### 4. Constat : "Avec S/S d'insuffisance artérielle" (Claudication intermittente forte)

**Condition :**
- **Palpation** : Au moins UN des éléments suivants :
  - `C1T15P01` (Peau froide) = true
  - OU `C1T15P02` (Retour capillaire > 2s) = true
  - OU `C1T15P03` (Pouls pédieux) = "1/4" (C1T15P03_1)
  - OU `C1T15P04` (Pouls tibial postérieur) = "1/4" (C1T15P04_1)
- **ET Questionnaire d'Édimbourg** :
  - `C1T15E01` (Q1) = "Oui" (C1T15E01_yes)
  - `C1T15E02` (Q2) = "Non" (C1T15E02_no)
  - `C1T15E03` (Q3) = "Oui" (C1T15E03_yes)
  - `C1T15E04` (Q4) = "Oui" (C1T15E04_yes) ⚠️ **Différence avec faible**
  - `C1T15E05` (Q5) = "≤ 10 minutes" (C1T15E05_disappears)
  - `C1T15E06` (Q6) = Contient au moins un de : "fesses", "cuisses", "mollets"

**Résultat :**
- **Interprétation** : "Claudication intermittente forte"

**Affichage :**
- **Type** : Constat avec avertissement (plus urgent)
- **Format** : Badge avec popup
- **Message** : 
  ```
  Avec S/S (signes/symptômes) d'insuffisance artérielle
  
  ⚠️ Important : Attention, la présence de pouls n'exclut pas de manière 
  fiable une maladie artérielle périphérique
  ```
- **Phase** : `immediate` (plus urgent que faible)
- **Priorité** : 1

**Structure JSON :**
```json
{
  "id": "C1T15_CONSTAT_WITH_ARTERIAL_SIGNS_STRONG",
  "type": "warning",
  "label": "Avec S/S d'insuffisance artérielle",
  "description": "Claudication intermittente forte détectée",
  "condition": {
    "allOf": [
      {
        "anyOf": [
          {
            "eq": {
              "var": "C1T15P01",
              "value": true
            }
          },
          {
            "eq": {
              "var": "C1T15P02",
              "value": true
            }
          },
          {
            "eq": {
              "var": "C1T15P03",
              "value": "C1T15P03_1"
            }
          },
          {
            "eq": {
              "var": "C1T15P04",
              "value": "C1T15P04_1"
            }
          }
        ]
      },
      {
        "allOf": [
          {
            "eq": {
              "var": "C1T15E01",
              "value": "C1T15E01_yes"
            }
          },
          {
            "eq": {
              "var": "C1T15E02",
              "value": "C1T15E02_no"
            }
          },
          {
            "eq": {
              "var": "C1T15E03",
              "value": "C1T15E03_yes"
            }
          },
          {
            "eq": {
              "var": "C1T15E04",
              "value": "C1T15E04_yes"
            }
          },
          {
            "eq": {
              "var": "C1T15E05",
              "value": "C1T15E05_disappears"
            }
          },
          {
            "anyOf": [
              {
                "eq": {
                  "var": "C1T15E06",
                  "value": "C1T15E06_buttocks"
                }
              },
              {
                "eq": {
                  "var": "C1T15E06",
                  "value": "C1T15E06_thighs"
                }
              },
              {
                "eq": {
                  "var": "C1T15E06",
                  "value": "C1T15E06_calves"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "interpretation": {
    "edinburgh_result": "claudication_intermittent_forte"
  },
  "ui": {
    "component": "ResultBadge",
    "color": "#F44336",
    "display_format": "Avec S/S d'insuffisance artérielle",
    "popup": {
      "title": "Signes d'insuffisance artérielle détectés",
      "message": "Claudication intermittente forte détectée.\n\n⚠️ Important : Attention, la présence de pouls n'exclut pas de manière fiable une maladie artérielle périphérique.",
      "severity": "warning"
    }
  },
  "phase": "immediate",
  "priority": 1,
  "routes": [
    {
      "to": "C2T01E17",
      "phase": "immediate",
      "priority": 1,
      "note": "Vascularisation inadéquate détectée → constat synthétique urgent"
    }
  ]
}
```

---

### 5. Confirmation de l'apport vasculaire (Section obligatoire)

**Position :**
- Juste après l'affichage des résultats IPSCB
- Après tous les constats d'inspection, palpation et questionnaire d'Édimbourg

**Affichage :**
- **Titre** : "Vascularisation de la plaie 1"
- **Instruction** : "Veuillez confirmer l'apport vasculaire 1"
- **Type** : Sélection unique (radio buttons)
- **Options** :
  1. **Adéquat**
  2. **Insuffisant**
  3. **Incertain**
  4. **Suspicion d'ischémie aiguë**

**Structure JSON :**
```json
{
  "id": "C1T15_CONFIRMATION",
  "type": "single_choice",
  "label": "Vascularisation de la plaie 1",
  "description": "Veuillez confirmer l'apport vasculaire 1",
  "required": true,
  "position": "after_ipscb_results",
  "options": [
    {
      "id": "C1T15_CONF_01",
      "label": "Adéquat",
      "description": "Apport vasculaire adéquat",
      "value": "adequate"
    },
    {
      "id": "C1T15_CONF_02",
      "label": "Insuffisant",
      "description": "Apport vasculaire insuffisant",
      "value": "insufficient"
    },
    {
      "id": "C1T15_CONF_03",
      "label": "Incertain",
      "description": "Apport vasculaire incertain",
      "value": "uncertain"
    },
    {
      "id": "C1T15_CONF_04",
      "label": "Suspicion d'ischémie aiguë",
      "description": "Suspicion d'ischémie aiguë",
      "value": "acute_ischemia_suspected"
    }
  ],
  "ui": {
    "component": "RadioGroup",
    "layout": "vertical",
    "spacing": "medium",
    "help": "Sélectionnez l'option qui correspond à l'apport vasculaire évalué"
  },
  "validation": {
    "required": true,
    "message": "Veuillez confirmer l'apport vasculaire"
  },
  "routes": [
    {
      "to": "C2T01E17",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "anyOf": [
          {
            "eq": {
              "var": "C1T15_CONFIRMATION",
              "value": "insufficient"
            }
          },
          {
            "eq": {
              "var": "C1T15_CONFIRMATION",
              "value": "uncertain"
            }
          },
          {
            "eq": {
              "var": "C1T15_CONFIRMATION",
              "value": "acute_ischemia_suspected"
            }
          }
        ]
      },
      "note": "Apport vasculaire insuffisant/incertain/ischémie → constat synthétique C2T01E17 (Vascularisation inadéquate ou incertaine)"
    }
  ]
}
```

**Logique de routage :**
- Si sélection = **"Adéquat"** → Pas de route vers col2
- Si sélection = **"Insuffisant"** → Route vers `C2T01E17` (Vascularisation inadéquate ou incertaine)
- Si sélection = **"Incertain"** → Route vers `C2T01E17` (Vascularisation inadéquate ou incertaine)
- Si sélection = **"Suspicion d'ischémie aiguë"** → Route vers `C2T01E17` (Vascularisation inadéquate ou incertaine) + Phase `immediate`

**Constat généré :**
- **Constat ID** : `C2T01E17`
- **Label** : "Vascularisation inadéquate ou incertaine"
- **Description** : "Apport sanguin insuffisant ou incertain à la zone de la plaie"
- **Badge** : Rouge (#F44336)
- **Phase** : `post_eval` (ou `immediate` si ischémie aiguë)
- **Table de destination** : `C2T01` (Cicatrisation possiblement ralentie par)
- **Message affiché** : "Cicatrisation possiblement ralentie par : Vascularisation inadéquate ou incertaine"

**Note importante :**
- Si confirmation = **"Insuffisant"** OU **"Incertain"** → Le constat `C2T01E17` sera automatiquement ajouté à la table `C2T01` (Cicatrisation possiblement ralentie par)
- Ce constat apparaîtra dans la liste des constats de ralentissement de cicatrisation

**Affichage conditionnel :**
- Cette section s'affiche uniquement si le bloc IPSCB est visible (localisation = membre inférieur)

---

## 📊 Résumé des Constats

| ID Constat | Type | Condition | Phase | Priorité | Route vers col2 |
|-----------|------|-----------|-------|----------|----------------|
| `C1T15_WARNING_AGE` | Avertissement | Âge >= 65 ans | `immediate` | 2 | - |
| `C1T15_CONSTAT_NO_ARTERIAL_SIGNS` | Informatif | Aucune inspection + pouls normaux | `post_eval` | 3 | - |
| `C1T15_CONSTAT_WITH_ARTERIAL_SIGNS_WEAK` | Avertissement | Palpation + Claudication faible | `post_eval` | 1 | C2T01E17 |
| `C1T15_CONSTAT_WITH_ARTERIAL_SIGNS_STRONG` | Avertissement | Palpation + Claudication forte | `immediate` | 1 | C2T01E17 |
| `C1T15_CONFIRMATION` | Sélection obligatoire | Confirmation apport vasculaire | `post_eval` | 1 | C2T01E17 (si insuffisant/incertain/ischémie) |

---

## 🔄 Flux d'évaluation

```
1. Saisie des données (C1T15)
   ↓
2. Calcul IPSCB automatique
   ↓
3. Vérification âge (C1T01)
   ├─ Si >= 65 ans → Afficher avertissement IPSCB
   ↓
4. Évaluation Inspection
   ├─ Si aucune inspection → Vérifier palpation
   │  └─ Si pouls normaux uniquement → Constat "Sans S/S"
   ↓
5. Évaluation Palpation
   ├─ Si signes présents → Vérifier questionnaire Édimbourg
   ↓
6. Évaluation Questionnaire Édimbourg
   ├─ Si Q1=Oui, Q2=Non, Q3=Oui, Q4=Non, Q5≤10min, Q6=fesses/cuisses/mollets
   │  └─ → Claudication faible → Constat "Avec S/S" (post_eval)
   ├─ Si Q1=Oui, Q2=Non, Q3=Oui, Q4=Oui, Q5≤10min, Q6=fesses/cuisses/mollets
   │  └─ → Claudication forte → Constat "Avec S/S" (immediate)
   ↓
7. Confirmation de l'apport vasculaire (OBLIGATOIRE)
   ├─ Affichage : "Vascularisation de la plaie 1"
   ├─ Options : Adéquat / Insuffisant / Incertain / Suspicion d'ischémie aiguë
   ├─ Sélection requise avant de continuer
   └─ Si sélection = Insuffisant OU Incertain OU Ischémie → Route vers C2T01E17
   ↓
8. Génération routes vers col2
   ├─ Si constat "Avec S/S" → Route vers C2T01E17
   └─ Si confirmation = Insuffisant/Incertain/Ischémie → Route vers C2T01E17
       └─ Constat généré dans C2T01 : "Cicatrisation possiblement ralentie par : Vascularisation inadéquate ou incertaine"
       └─ Le constat C2T01E17 apparaît dans la table C2T01 (Cicatrisation possiblement ralentie par)
```

---

## 🛠️ Points d'implémentation

### 1. Calcul de l'âge
- Utiliser `ConstatsGenerator.calculateAge()` avec `C1T01E01`
- Vérifier si `age.years >= 65`

### 2. Évaluation des conditions
- Créer des fonctions helper pour :
  - Vérifier l'état de l'inspection
  - Vérifier l'état de la palpation
  - Évaluer le questionnaire d'Édimbourg

### 3. Affichage des constats
- Avertissement IPSCB : `ClinicalAlert` avant les résultats IPSCB
- Constats : `ResultBadge` avec popup optionnel

### 4. Routes vers col2
- Les constats "Avec S/S" doivent activer la route vers `C2T01E17`
- Phase différente selon claudication faible/forte

---

## ✅ Checklist d'implémentation

- [ ] Ajouter le calcul de l'âge dans `buildEvaluationContext()`
- [ ] Créer la fonction d'évaluation de l'inspection
- [ ] Créer la fonction d'évaluation de la palpation
- [ ] Créer la fonction d'évaluation du questionnaire d'Édimbourg
- [ ] Implémenter l'avertissement IPSCB (âge >= 65)
- [ ] Implémenter le constat "Sans S/S"
- [ ] Implémenter le constat "Avec S/S" (claudication faible)
- [ ] Implémenter le constat "Avec S/S" (claudication forte)
- [ ] Ajouter la section de confirmation de l'apport vasculaire
- [ ] Implémenter la validation (champ obligatoire)
- [ ] Ajouter les routes vers C2T01E17 (constats + confirmation)
- [ ] Tester tous les scénarios
- [ ] Vérifier l'affichage des popups
- [ ] Vérifier la cohérence avec l'architecture unifiée

---

## 📝 Notes importantes

1. **Ordre d'évaluation** : Les constats doivent être évalués dans l'ordre logique (inspection → palpation → questionnaire)

2. **Exclusivité** : Les constats "Sans S/S" et "Avec S/S" sont mutuellement exclusifs

3. **Claudication** : La différence entre faible et forte est Q4 (Q4=Non pour faible, Q4=Oui pour forte)

4. **Routes** : Seuls les constats "Avec S/S" génèrent des routes vers col2 (C2T01E17)

5. **Phase** : Claudication forte = `immediate`, Claudication faible = `post_eval`

6. **Confirmation obligatoire** : La section de confirmation de l'apport vasculaire doit être complétée avant de continuer

7. **Routes depuis confirmation** : Les sélections "Insuffisant", "Incertain" et "Suspicion d'ischémie aiguë" génèrent des routes vers C2T01E17

8. **Constat C2T01E17** : "Vascularisation inadéquate ou incertaine" est généré si :
   - Confirmation = "Insuffisant" OU
   - Confirmation = "Incertain" OU
   - Confirmation = "Suspicion d'ischémie aiguë" OU
   - Constat "Avec S/S" détecté (claudication faible/forte)
   
   **Affichage dans C2T01 :**
   - Le constat apparaît dans la table "Cicatrisation possiblement ralentie par" (C2T01)
   - Message : "Cicatrisation possiblement ralentie par : Vascularisation inadéquate ou incertaine"

---

**Status** : 📝 Plan créé - Prêt pour implémentation

