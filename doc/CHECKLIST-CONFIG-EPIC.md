# ✅ Checklist : Configuration Epic pour "PlaieMobile"

**Nom de l'application Epic** : PlaieMobile

## 🔍 Vérifications dans Epic on FHIR

Allez sur https://fhir.epic.com/ et vérifiez votre application "PlaieMobile" :

### 1. ✅ Statut de l'Application

- [ ] Status = **Active** (pas "Pending" ou "Inactive")
- [ ] Application approuvée par Epic

### 2. ✅ Client ID

- [ ] Copiez le **Client ID (Non-Production)**
- [ ] Format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- [ ] Vérifiez qu'il correspond à celui dans votre `.env` :
  ```bash
  EPIC_CLIENT_ID_SANDBOX=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  ```

### 3. ✅ Redirect URIs (Non-Production)

- [ ] Vérifiez que cette URI est configurée **exactement** :
  ```
  app-soin-plaie://oauth/callback
  ```
  
  ⚠️ **Important** :
  - Pas d'espace avant/après
  - Pas de slash final
  - Correspondance exacte (majuscules/minuscules)
  
- [ ] Si vous testez avec Expo en développement, vous pouvez aussi ajouter :
  ```
  exp://127.0.0.1:8081/--/oauth/callback
  ```

### 4. ✅ Launch Types

Vérifiez que ces types sont **cochés** :
- [ ] ✅ **EHR Launch (Embedded)** - Lancement depuis Epic
- [ ] ✅ **Standalone Launch** - Lancement indépendant (pour tests)

### 5. ✅ Scopes (Autorisations)

Vérifiez que ces scopes sont **autorisés** dans Epic :

**Scopes de base** :
- [ ] `launch`
- [ ] `openid`
- [ ] `fhirUser`
- [ ] `offline_access`

**Scopes patient** :
- [ ] `patient/Patient.read`
- [ ] `patient/Observation.read`
- [ ] `patient/Observation.write`
- [ ] `patient/Condition.read`
- [ ] `patient/AllergyIntolerance.read`
- [ ] `patient/MedicationStatement.read`

**Note** : Ces scopes doivent correspondre **exactement** à ceux dans votre `.env` :
```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access
```

### 6. ✅ SMART on FHIR Version

- [ ] **FHIR Version** : R4
- [ ] **SMART Scope Version** : v2 (ou v1 si vous utilisez v1)

---

## 📝 Configuration dans `.env`

Vérifiez que votre fichier `.env` contient :

```bash
# Mode
EPIC_MODE=sandbox

# Client ID (remplacez par celui de votre application "PlaieMobile")
EPIC_CLIENT_ID_SANDBOX=votre-client-id-ici

# Base URL (fixe pour Epic Sandbox)
EPIC_SANDBOX_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth

# Redirect URI (doit correspondre exactement à celui dans Epic)
EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback

# Scopes (doivent correspondre à ceux autorisés dans Epic)
EPIC_SCOPES_SANDBOX=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access
```

---

## 🔄 Après Modifications

1. **Modifier `.env`** si nécessaire
2. **Redémarrer Expo** avec cache vidé :
   ```bash
   npx expo start -c
   ```
3. **Vérifier dans la console** que la configuration est chargée :
   - L'URL d'autorisation devrait être loggée
   - Le Client ID devrait apparaître (pas `undefined`)

---

## 🐛 Si l'Erreur Persiste

1. **Testez avec des scopes minimaux** :
   ```bash
   EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access
   ```

2. **Vérifiez les logs dans la console** :
   - L'URL d'autorisation complète
   - Les valeurs de configuration

3. **Vérifiez dans Epic on FHIR** :
   - Y a-t-il des erreurs ou logs dans l'interface Epic ?
   - L'application est-elle bien activée ?

4. **Contactez le support Epic** si nécessaire :
   - Email : fhir@epic.com
   - Mentionnez que c'est pour l'application "PlaieMobile"

---

## 📞 Informations à Fournir au Support Epic

Si vous devez contacter le support, fournissez :
- Nom de l'application : **PlaieMobile**
- Client ID (Non-Production)
- Erreur exacte reçue
- Redirect URI utilisé : `app-soin-plaie://oauth/callback`
- URL d'autorisation générée (visible dans la console)

