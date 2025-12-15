# 📋 Format des Scopes Epic

## ⚠️ Problème Identifié

Dans Epic on FHIR, les scopes sont affichés avec des versions et contextes :
- `AllergyIntolerance.Read (Patient Chart) (R4)`
- `Patient.Read (Demographics) (R4)`
- `MedicationStatement.Read (STU3)`

**Mais** dans les requêtes OAuth, vous devez utiliser le **format SMART standard** (sans parenthèses).

## ✅ Format Correct pour les Requêtes OAuth

### Format SMART v1 (Standard)

Pour la plupart des cas, utilisez ce format :

```
patient/Patient.read
patient/AllergyIntolerance.read
patient/MedicationStatement.read
patient/Condition.read
```

### Format SMART v2 (Si configuré)

Si vous avez configuré SMART v2 dans Epic, le format peut être :

```
patient/Patient.r    (r = read)
patient/Observation.r
patient/Observation.c    (c = create)
patient/Observation.w    (w = write)
```

## 🔍 Comment Mapper les Scopes Epic → Format OAuth

### Exemple de Mapping

| Scope dans Epic (affiché) | Format OAuth (à utiliser) |
|---------------------------|---------------------------|
| `Patient.Read (Demographics) (R4)` | `patient/Patient.read` |
| `AllergyIntolerance.Read (Patient Chart) (R4)` | `patient/AllergyIntolerance.read` |
| `MedicationStatement.Read (STU3)` | `patient/MedicationStatement.read` |
| `Condition.Read (R4)` | `patient/Condition.read` |
| `Observation.Read (R4)` | `patient/Observation.read` |
| `Observation.Create (R4)` | `patient/Observation.write` ou `patient/Observation.c` (SMART v2) |

## 📝 Configuration dans `.env`

### Pour SMART v1 (Recommandé)

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.read patient/AllergyIntolerance.read patient/MedicationStatement.read patient/Condition.read patient/Observation.read patient/Observation.write
```

### Pour SMART v2 (Si configuré)

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.r patient/AllergyIntolerance.r patient/MedicationStatement.r patient/Condition.r patient/Observation.r patient/Observation.c patient/Observation.w
```

## 🔧 Scopes de Base Requis

Ces scopes sont **toujours nécessaires** :

1. **`launch`** - Nécessaire pour EHR Launch
2. **`openid`** - Pour OpenID Connect
3. **`fhirUser`** - Pour identifier l'utilisateur FHIR
4. **`offline_access`** - Pour obtenir un refresh token

## ✅ Scopes Recommandés pour PlaieMobile

Basé sur les scopes visibles dans vos captures d'écran, voici une configuration recommandée :

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.read patient/AllergyIntolerance.read patient/MedicationStatement.read patient/Condition.read patient/Observation.read patient/Observation.write
```

## 🧪 Test avec Scopes Minimaux

Si vous avez des problèmes, testez d'abord avec ces scopes minimaux :

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.read
```

Si ça fonctionne, ajoutez progressivement les autres scopes.

## ⚠️ Notes Importantes

1. **Correspondance exacte** : Les scopes demandés doivent être **autorisés** dans Epic on FHIR
2. **Format sans espaces** : Un seul espace entre chaque scope
3. **Pas de parenthèses** : N'utilisez jamais le format avec parenthèses dans la requête OAuth
4. **Version FHIR** : Même si Epic affiche (R4), utilisez le format standard dans OAuth
5. **SMART Version** : Vérifiez dans Epic quelle version SMART vous avez configurée (v1 ou v2)

## 🔍 Vérification

Pour vérifier que vos scopes sont corrects :

1. **Dans Epic on FHIR** :
   - Vérifiez que tous les scopes demandés sont dans la liste "Selected"
   - Notez si vous utilisez SMART v1 ou v2

2. **Dans votre `.env`** :
   - Utilisez le format SMART approprié (sans parenthèses)
   - Vérifiez qu'il n'y a pas d'erreurs de typage

3. **Dans les logs** :
   - L'URL d'autorisation devrait contenir les scopes
   - Vérifiez qu'ils sont bien formatés




