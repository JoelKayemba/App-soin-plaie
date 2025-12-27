# Plan d'Implémentation - Table 27 : Statut Infectieux de la Plaie

## 📋 Vue d'ensemble

La table C1T27 (Signes et symptômes d'infection) déclenche automatiquement une **nouvelle table de constats** (C2T04) dès qu'un élément est coché. Cette table de constats comporte deux sections :
1. **Section 1** : Détection automatique du stade le plus grave
2. **Section 2** : Confirmation manuelle du statut infectieux

---

## 🎯 Déclenchement de la table de constats

**Condition d'activation :**
- Dès qu'**au moins un élément** de C1T27 est coché
- Phase : `immediate` (affichage immédiat)

**Table de constats à créer :**
- **ID** : `C2T04`
- **Titre** : "Statut infectieux de la plaie"
- **Description** : "Évaluation du continuum microbien et confirmation du statut infectieux"

---

## 1. Section 1 : Détection automatique du stade le plus grave

### 1.1. Titre de la section
**"Stade du continuum microbien"**

**Sous-titre :**
**"L'évaluation démontre un ou plusieurs des signes de (prendre le plus grave) :"**

### 1.2. Logique de détection

La détection se fait en analysant les choix cochés dans C1T27 et en prenant **le plus grave** :

#### 1.2.1. Infection locale

**Choix concernés (C1T27) :**
- `C1T27E01` : Hypergranulation friable (choix 1)
- `C1T27E02` : Granulation friable qui saigne facilement au toucher (choix 2)
- `C1T27E03` : Exsudat changé ou augmenté (choix 3)
- `C1T27E04` : Retard de cicatrisation malgré les bonnes pratiques (choix 4)
- `C1T27E06` : Chaleur locale (choix 6)
- `C1T27E07` : Rougeur < 2 cm au pourtour de la plaie (choix 7)
- `C1T27E08` : Œdème (choix 8)
- `C1T27E10` : Stagnation ou grandissement de la plaie (choix 10)
- `C1T27E11` : Douleur augmentée ou nouvelle (choix 11)
- `C1T27E12` : Mauvaise odeur après le nettoyage ou odeur changée (choix 12)
- `C1T27E16` : Nouvelles lésions satellites (choix 16)
- `C1T27E26` : Placard érythémateux avec lésions satellites ponctiformes prurigineuses (choix 26)

**Constat :**
- **Label** : "infection locale"
- **Type** : Badge informatif
- **Couleur** : Orange (#FF9800)
- **Affichage** : Automatique si au moins un de ces choix est coché

**Structure JSON :**
```json
{
  "id": "C2T04E01",
  "type": "informational",
  "label": "infection locale",
  "description": "Signes d'infection locale détectés",
  "read_only": true,
  "auto_detected": true,
  "condition": {
    "anyOf": [
      { "eq": { "var": "C1T27E01", "value": true } },
      { "eq": { "var": "C1T27E02", "value": true } },
      { "eq": { "var": "C1T27E03", "value": true } },
      { "eq": { "var": "C1T27E04", "value": true } },
      { "eq": { "var": "C1T27E06", "value": true } },
      { "eq": { "var": "C1T27E07", "value": true } },
      { "eq": { "var": "C1T27E08", "value": true } },
      { "eq": { "var": "C1T27E10", "value": true } },
      { "eq": { "var": "C1T27E11", "value": true } },
      { "eq": { "var": "C1T27E12", "value": true } },
      { "eq": { "var": "C1T27E16", "value": true } },
      { "eq": { "var": "C1T27E26", "value": true } }
    ]
  },
  "ui": {
    "component": "ResultBadge",
    "color": "#FF9800",
    "display_format": "infection locale"
  },
  "phase": "immediate",
  "priority": 2
}
```

---

#### 1.2.2. Infection fongique

**Choix concerné (C1T27) :**
- `C1T27E26` : Placard érythémateux avec lésions satellites ponctiformes prurigineuses (choix 26)

**Constat :**
- **Label** : "fongique"
- **Type** : Badge informatif
- **Couleur** : Violet (#9C27B0)
- **Affichage** : Automatique si ce choix est coché

**Note :** Ce constat peut apparaître en même temps que "infection locale" (même choix), mais "fongique" est plus spécifique.

**Structure JSON :**
```json
{
  "id": "C2T04E02",
  "type": "informational",
  "label": "fongique",
  "description": "Signes d'infection fongique détectés",
  "read_only": true,
  "auto_detected": true,
  "condition": {
    "eq": {
      "var": "C1T27E26",
      "value": true
    }
  },
  "ui": {
    "component": "ResultBadge",
    "color": "#9C27B0",
    "display_format": "fongique"
  },
  "phase": "immediate",
  "priority": 1
}
```

---

#### 1.2.3. Infection profonde

**Choix concernés (C1T27) :**
- `C1T27E05` : Érythème, rougeur > 2 cm au pourtour de la plaie (choix 5)
- `C1T27E09` : Cellulite (choix 9)
- `C1T27E15` : Induration (choix 15)
- `C1T27E17` : Lymphadénopathie (choix 17)
- `C1T27E18` : Leucocytose (choix 18)
- `C1T27E19` : Déhiscence ou réouverture de la plaie (choix 19)
- `C1T27E20` : Hyperglycémie (choix 20)
- `C1T27E21` : Fièvre (choix 21)
- `C1T27E22` : Signes de septicémie (choix 22)
- `C1T27E27` : Contact osseux avec un stylet stérile (choix 27 - dernier choix)

**Constat :**
- **Label** : "infection profonde"
- **Type** : Badge d'alerte
- **Couleur** : Rouge (#F44336)
- **Affichage** : Automatique si au moins un de ces choix est coché

**Structure JSON :**
```json
{
  "id": "C2T04E03",
  "type": "warning",
  "label": "infection profonde",
  "description": "Signes d'infection profonde détectés",
  "read_only": true,
  "auto_detected": true,
  "condition": {
    "anyOf": [
      { "eq": { "var": "C1T27E05", "value": true } },
      { "eq": { "var": "C1T27E09", "value": true } },
      { "eq": { "var": "C1T27E15", "value": true } },
      { "eq": { "var": "C1T27E17", "value": true } },
      { "eq": { "var": "C1T27E18", "value": true } },
      { "eq": { "var": "C1T27E19", "value": true } },
      { "eq": { "var": "C1T27E20", "value": true } },
      { "eq": { "var": "C1T27E21", "value": true } },
      { "eq": { "var": "C1T27E22", "value": true } },
      { "eq": { "var": "C1T27E27", "value": true } }
    ]
  },
  "ui": {
    "component": "ResultBadge",
    "color": "#F44336",
    "display_format": "infection profonde"
  },
  "phase": "immediate",
  "priority": 1
}
```

---

### 1.3. Priorité d'affichage (prendre le plus grave)

**Ordre de priorité :**
1. **Infection profonde** (priorité 1) - Le plus grave
2. **Infection fongique** (priorité 1) - Spécifique
3. **Infection locale** (priorité 2) - Moins grave

**Logique :**
- Si infection profonde détectée → Afficher uniquement "infection profonde"
- Sinon, si infection fongique détectée → Afficher "fongique"
- Sinon, si infection locale détectée → Afficher "infection locale"
- Si plusieurs détectées → Afficher le plus grave uniquement

---

## 2. Section 2 : Confirmation du statut infectieux

### 2.1. Titre et instruction

**Titre :** "Veuillez confirmer le statut infectieux de la plaie 1"

**Type :** Sélection unique (radio buttons)

**Obligatoire :** Oui (doit être complété)

### 2.2. Options de confirmation

#### 2.2.1. Contamination*

**ID :** `C2T04_CONF_01`

**Label :** "contamination*"

**Description :** "microbes présents à la surface de la plaie, mais ne se multiplient pas"

**Structure JSON :**
```json
{
  "id": "C2T04_CONF_01",
  "type": "single_choice_option",
  "label": "contamination*",
  "description": "microbes présents à la surface de la plaie, mais ne se multiplient pas",
  "value": "contamination"
}
```

---

#### 2.2.2. Colonisation*

**ID :** `C2T04_CONF_02`

**Label :** "colonisation*"

**Description :** "microbes qui prolifèrent dans la plaie, mais sans entraver la cicatrisation"

**Structure JSON :**
```json
{
  "id": "C2T04_CONF_02",
  "type": "single_choice_option",
  "label": "colonisation*",
  "description": "microbes qui prolifèrent dans la plaie, mais sans entraver la cicatrisation",
  "value": "colonisation"
}
```

---

#### 2.2.3. Infection locale

**ID :** `C2T04_CONF_03`

**Label :** "infection locale"

**Description :** "Infection localisée à la plaie"

**Structure JSON :**
```json
{
  "id": "C2T04_CONF_03",
  "type": "single_choice_option",
  "label": "infection locale",
  "description": "Infection localisée à la plaie",
  "value": "local_infection"
}
```

---

#### 2.2.4. Infection locale d'allure fongique

**ID :** `C2T04_CONF_04`

**Label :** "infection locale d'allure fongique"

**Description :** "Infection locale présentant des caractéristiques fongiques"

**Structure JSON :**
```json
{
  "id": "C2T04_CONF_04",
  "type": "single_choice_option",
  "label": "infection locale d'allure fongique",
  "description": "Infection locale présentant des caractéristiques fongiques",
  "value": "local_fungal_infection"
}
```

---

#### 2.2.5. Infection profonde

**ID :** `C2T04_CONF_05`

**Label :** "infection profonde"

**Description :** "Infection étendue aux tissus profonds"

**Structure JSON :**
```json
{
  "id": "C2T04_CONF_05",
  "type": "single_choice_option",
  "label": "infection profonde",
  "description": "Infection étendue aux tissus profonds",
  "value": "deep_infection"
}
```

---

### 2.3. Structure complète de la section de confirmation

```json
{
  "id": "C2T04_CONFIRMATION",
  "type": "single_choice",
  "label": "Veuillez confirmer le statut infectieux de la plaie 1",
  "description": "Sélectionnez le statut infectieux confirmé",
  "required": true,
  "position": "after_auto_detection",
  "options": [
    {
      "id": "C2T04_CONF_01",
      "label": "contamination*",
      "description": "microbes présents à la surface de la plaie, mais ne se multiplient pas",
      "value": "contamination"
    },
    {
      "id": "C2T04_CONF_02",
      "label": "colonisation*",
      "description": "microbes qui prolifèrent dans la plaie, mais sans entraver la cicatrisation",
      "value": "colonisation"
    },
    {
      "id": "C2T04_CONF_03",
      "label": "infection locale",
      "description": "Infection localisée à la plaie",
      "value": "local_infection"
    },
    {
      "id": "C2T04_CONF_04",
      "label": "infection locale d'allure fongique",
      "description": "Infection locale présentant des caractéristiques fongiques",
      "value": "local_fungal_infection"
    },
    {
      "id": "C2T04_CONF_05",
      "label": "infection profonde",
      "description": "Infection étendue aux tissus profonds",
      "value": "deep_infection"
    }
  ],
  "ui": {
    "component": "RadioGroup",
    "layout": "vertical",
    "spacing": "medium",
    "help": "Sélectionnez le statut infectieux confirmé basé sur l'évaluation"
  },
  "validation": {
    "required": true,
    "message": "Veuillez confirmer le statut infectieux de la plaie"
  }
}
```

---

## 3. Constat : Charge microbienne élevée (C2T01E02)

### 3.1. Condition d'activation

**Déclenchement :**
- Si la confirmation (Section 2) = **"colonisation"** OU **"infection locale"** OU **"infection profonde"**
- Ne se déclenche PAS si confirmation = "contamination"

**Constat :**
- **Constat ID** : `C2T01E02`
- **Label** : "Charge microbienne élevée"
- **Description** : "Présence importante de micro-organismes dans la plaie"
- **Badge** : Rouge (#F44336)
- **Phase** : `post_eval`

**Structure JSON :**
```json
{
  "id": "C2T04_CONFIRMATION",
  "routes": [
    {
      "to": "C2T01E02",
      "phase": "post_eval",
      "priority": 1,
      "condition": {
        "anyOf": [
          {
            "eq": {
              "var": "C2T04_CONFIRMATION",
              "value": "colonisation"
            }
          },
          {
            "eq": {
              "var": "C2T04_CONFIRMATION",
              "value": "local_infection"
            }
          },
          {
            "eq": {
              "var": "C2T04_CONFIRMATION",
              "value": "deep_infection"
            }
          }
        ]
      },
      "note": "Charge microbienne élevée détectée → constat synthétique"
    }
  ]
}
```

---

## 📊 Résumé des Constats et Routes

| Section | Élément | Condition | Constat col2 | Phase | Priorité |
|---------|---------|-----------|--------------|-------|----------|
| **Section 1** | Infection locale | Choix 1-4, 6-8, 10-12, 16, 26 | C2T04E01 | `immediate` | 2 |
| **Section 1** | Infection fongique | Choix 26 | C2T04E02 | `immediate` | 1 |
| **Section 1** | Infection profonde | Choix 5, 9, 15, 17-22, 27 | C2T04E03 | `immediate` | 1 |
| **Section 2** | Confirmation | Sélection manuelle | - | `post_eval` | - |
| **Route** | Colonisation/Infection | Confirmation = colonisation/local/profonde | C2T01E02 | `post_eval` | 1 |

---

## 🔄 Flux d'évaluation

```
1. Utilisateur coche un élément dans C1T27
   ↓
2. Table de constats C2T04 s'affiche automatiquement
   ↓
3. Section 1 : Détection automatique
   ├─ Analyser tous les choix cochés dans C1T27
   ├─ Déterminer le stade le plus grave :
   │  ├─ Infection profonde (priorité 1)
   │  ├─ Infection fongique (priorité 1)
   │  └─ Infection locale (priorité 2)
   └─ Afficher uniquement le plus grave
   ↓
4. Section 2 : Confirmation manuelle
   ├─ Afficher les 5 options
   ├─ Utilisateur sélectionne UNE option
   └─ Validation : Champ obligatoire
   ↓
5. Génération route vers C2T01E02
   ├─ Si confirmation = colonisation → Route activée
   ├─ Si confirmation = infection locale → Route activée
   ├─ Si confirmation = infection profonde → Route activée
   └─ Si confirmation = contamination → Pas de route
   ↓
6. Constat "Charge microbienne élevée" (C2T01E02)
   └─ Généré en phase post_eval
```

---

## 🛠️ Points d'implémentation

### 1. Déclenchement automatique
- Détecter si au moins un élément de C1T27 est coché
- Afficher immédiatement la table C2T04

### 2. Détection automatique (Section 1)
- Fonction pour analyser tous les choix cochés
- Fonction pour déterminer le stade le plus grave
- Afficher uniquement le constat le plus grave

### 3. Confirmation manuelle (Section 2)
- Champ obligatoire
- Sélection unique (radio buttons)
- Validation avant de continuer

### 4. Route vers C2T01E02
- Évaluer la confirmation sélectionnée
- Activer la route si colonisation/infection locale/infection profonde
- Générer le constat en phase `post_eval`

---

## 📋 Mapping des choix C1T27

| Choix | ID C1T27 | Label | Infection locale | Infection fongique | Infection profonde |
|-------|----------|-------|------------------|-------------------|-------------------|
| 1 | C1T27E01 | Hypergranulation friable | ✅ | ❌ | ❌ |
| 2 | C1T27E02 | Granulation friable qui saigne | ✅ | ❌ | ❌ |
| 3 | C1T27E03 | Exsudat changé ou augmenté | ✅ | ❌ | ❌ |
| 4 | C1T27E04 | Retard de cicatrisation | ✅ | ❌ | ❌ |
| 5 | C1T27E05 | Érythème > 2 cm | ❌ | ❌ | ✅ |
| 6 | C1T27E06 | Chaleur locale | ✅ | ❌ | ❌ |
| 7 | C1T27E07 | Rougeur < 2 cm | ✅ | ❌ | ❌ |
| 8 | C1T27E08 | Œdème | ✅ | ❌ | ❌ |
| 9 | C1T27E09 | Cellulite | ❌ | ❌ | ✅ |
| 10 | C1T27E10 | Stagnation ou grandissement | ✅ | ❌ | ❌ |
| 11 | C1T27E11 | Douleur augmentée | ✅ | ❌ | ❌ |
| 12 | C1T27E12 | Mauvaise odeur | ✅ | ❌ | ❌ |
| 13 | C1T27E13 | Lymphangite | ❌ | ❌ | ❌ |
| 14 | C1T27E14 | Crépitants sous-cutanés | ❌ | ❌ | ❌ |
| 15 | C1T27E15 | Induration | ❌ | ❌ | ✅ |
| 16 | C1T27E16 | Nouvelles lésions satellites | ✅ | ❌ | ❌ |
| 17 | C1T27E17 | Lymphadénopathie | ❌ | ❌ | ✅ |
| 18 | C1T27E18 | Leucocytose | ❌ | ❌ | ✅ |
| 19 | C1T27E19 | Déhiscence ou réouverture | ❌ | ❌ | ✅ |
| 20 | C1T27E20 | Hyperglycémie | ❌ | ❌ | ✅ |
| 21 | C1T27E21 | Fièvre | ❌ | ❌ | ✅ |
| 22 | C1T27E22 | Signes de septicémie | ❌ | ❌ | ✅ |
| 23 | C1T27E23 | Signes de gangrène infectée | ❌ | ❌ | ❌ |
| 24 | C1T27E24 | Signes de fasciite nécrosante | ❌ | ❌ | ❌ |
| 25 | C1T27E25 | Nouveau sinus ou tunnel | ❌ | ❌ | ❌ |
| 26 | C1T27E26 | Placard érythémateux... | ✅ | ✅ | ❌ |
| 27 | C1T27E27 | Contact osseux | ❌ | ❌ | ✅ |

---

## ✅ Checklist d'implémentation

- [ ] Créer la nouvelle table de constats C2T04 (Statut infectieux)
- [ ] Implémenter le déclenchement automatique (si élément C1T27 coché)
- [ ] Implémenter la détection automatique "Infection locale" (choix 1-4, 6-8, 10-12, 16, 26)
- [ ] Implémenter la détection automatique "Infection fongique" (choix 26)
- [ ] Implémenter la détection automatique "Infection profonde" (choix 5, 9, 15, 17-22, 27)
- [ ] Implémenter la logique "prendre le plus grave" (priorité)
- [ ] Créer la section de confirmation (5 options)
- [ ] Implémenter la validation (champ obligatoire)
- [ ] Implémenter la route vers C2T01E02 (si colonisation/infection)
- [ ] Tester tous les scénarios
- [ ] Vérifier l'affichage des badges
- [ ] Vérifier la cohérence avec l'architecture unifiée

---

## 📝 Notes importantes

1. **Déclenchement** : La table C2T04 s'affiche dès qu'un élément de C1T27 est coché

2. **Priorité** : Infection profonde > Infection fongique > Infection locale

3. **Choix 26** : Peut déclencher à la fois "infection locale" ET "fongique", mais on affiche uniquement "fongique" (plus spécifique)

4. **Confirmation obligatoire** : L'utilisateur DOIT confirmer le statut infectieux avant de continuer

5. **Route vers C2T01E02** : Seulement si confirmation = colonisation, infection locale, ou infection profonde (PAS contamination)

6. **Phase** : Section 1 = `immediate`, Section 2 = `post_eval`, Route = `post_eval`

---

**Status** : 📝 Plan créé - Prêt pour implémentation

