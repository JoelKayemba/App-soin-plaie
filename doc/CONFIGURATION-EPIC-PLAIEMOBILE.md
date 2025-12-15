# ✅ Configuration Epic - PlaieMobile

## 📋 Résumé de la Configuration

Votre application **PlaieMobile** est correctement configurée avec :

### ✅ Configuration Technique

| Paramètre | Valeur | Statut |
|-----------|--------|--------|
| **SMART on FHIR Version** | R4 | ✅ Correct |
| **SMART Scope Version** | SMART v2 | ✅ Correct |
| **FHIR ID Generation** | Unconstrained FHIR IDs | ✅ Correct |
| **Confidential Client** | Non (Public Client avec PKCE) | ✅ Correct pour mobile |
| **CDS Hooks** | Non | ✅ Correct |
| **Dynamic Clients** | Non | ✅ Correct |

### ✅ Intended Purposes

- ✅ **Clinical Team** - Application destinée à l'équipe clinique

### ✅ Intended Users

- ✅ **Clinical Team** - Utilisateurs : équipe clinique

---

## 🔧 Configuration des Scopes

### Format SMART v2 vs v1

Puisque vous avez **SMART v2** configuré dans Epic, vous avez deux options :

#### Option 1 : Format SMART v2 (format court)

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.r patient/AllergyIntolerance.r patient/MedicationStatement.r patient/Condition.r patient/Observation.r patient/Observation.w
```

- `.r` = read
- `.w` = write
- `.c` = create

#### Option 2 : Format SMART v1 (format long, recommandé)

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.read patient/AllergyIntolerance.read patient/MedicationStatement.read patient/Condition.read patient/Observation.read patient/Observation.write
```

**Recommandation** : Utilisez le format **SMART v1** (.read, .write) car :
- ✅ Plus lisible
- ✅ Fonctionne avec SMART v2 configuré
- ✅ Plus couramment utilisé
- ✅ Correspond mieux aux scopes affichés dans Epic

---

## ✅ Checklist Finale

### Dans Epic on FHIR

- [x] SMART on FHIR Version : **R4** ✅
- [x] SMART Scope Version : **SMART v2** ✅
- [x] FHIR ID Generation : **Unconstrained** ✅
- [x] Confidential Client : **Non** ✅
- [x] CDS Hooks : **Non** ✅
- [x] Dynamic Clients : **Non** ✅
- [x] Intended Purposes : **Clinical Team** ✅
- [x] Intended Users : **Clinical Team** ✅
- [ ] Redirect URIs configurés : `app-soin-plaie://oauth/callback`
- [ ] Launch Types : **EHR Launch** et **Standalone Launch** coché
- [ ] Scopes sélectionnés : Patient, AllergyIntolerance, MedicationStatement, Condition, Observation

### Dans votre `.env`

- [ ] `EPIC_CLIENT_ID_SANDBOX` = Votre Client ID Epic
- [ ] `EPIC_REDIRECT_URI_SANDBOX` = `app-soin-plaie://oauth/callback`
- [ ] `EPIC_SCOPES_SANDBOX` = Scopes au format SMART v1 ou v2
- [ ] `EPIC_MODE` = `sandbox`

---

## 🚀 Prochaines Étapes

1. **Vérifier les scopes sélectionnés** dans Epic on FHIR
2. **Mettre à jour le `.env`** avec les scopes correspondants
3. **Redémarrer Expo** : `npx expo start -c`
4. **Tester la connexion**

---

## 📝 Notes

- ✅ Votre configuration est correcte pour une application mobile clinique
- ✅ SMART v2 est compatible avec les scopes au format v1
- ✅ PKCE est automatiquement utilisé (pas besoin de confidential client)
- ✅ La configuration "Clinical Team" correspond parfaitement à PlaieMobile




