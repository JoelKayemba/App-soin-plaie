# 🔧 Résolution : Erreur OAuth2 Epic "Something went wrong"

## ⚠️ Erreur Persistante

Malgré une URL d'autorisation correctement formatée, Epic retourne :
> "Something went wrong trying to authorize the client. Please try logging in again."

## 🔍 Causes Probables et Solutions

### 1. ✅ Application Non Activée dans Epic

**Problème** : L'application "PlaieMobile" n'est peut-être pas encore activée.

**Solution** :
1. Allez sur https://fhir.epic.com/
2. Ouvrez votre application "PlaieMobile"
3. Vérifiez le **statut** :
   - ❌ "Draft" ou "Pending" → L'application n'est pas activée
   - ✅ "Active" ou "Ready" → L'application est activée
   
4. **Si non activée** :
   - Cliquez sur "Save" si vous avez fait des modifications
   - Cliquez sur "Ready for Sandbox"
   - Attendez que le statut passe à "Active"
   - Le Client ID devrait apparaître

---

### 2. ✅ Redirect URI Ne Correspond Pas Exactement

**Problème** : Le Redirect URI dans votre requête ne correspond pas exactement à celui configuré dans Epic.

**Vérification** :
1. **Dans Epic on FHIR** (application PlaieMobile) :
   - Allez dans la section "Redirect URIs"
   - Notez exactement ce qui est configuré
   - Doit être : `app-soin-plaie://oauth/callback`
   
2. **Dans votre `.env`** :
   ```bash
   EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback
   ```
   
3. **Vérifiez** :
   - ✅ Pas d'espace avant/après
   - ✅ Pas de slash final
   - ✅ Correspondance exacte (majuscules/minuscules)
   - ✅ Pas de `http://` ou `https://`

4. **Dans `app.json`** :
   ```json
   {
     "expo": {
       "scheme": "app-soin-plaie"
     }
   }
   ```

---

### 3. ✅ Scopes Non Autorisés ou Incorrects

**Problème** : Les scopes demandés ne sont pas tous autorisés dans Epic.

**Vérification** :
1. **Dans Epic on FHIR** (application PlaieMobile) :
   - Allez dans la section "Scopes" ou "Selected Scopes"
   - Vérifiez que TOUS les scopes suivants sont **sélectionnés** :
     - `launch`
     - `openid`
     - `fhirUser`
     - `offline_access`
     - `patient/Patient.read` (ou `Patient.Read (Demographics) (R4)`)
     - `patient/AllergyIntolerance.read`
     - `patient/MedicationStatement.read`
     - `patient/Condition.read`
     - `patient/Observation.read`

2. **Dans votre `.env`** :
   ```bash
   EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access patient/Patient.read patient/AllergyIntolerance.read patient/MedicationStatement.read patient/Condition.read patient/Observation.read
   ```

3. **Testez avec des scopes minimaux** :
   Si le problème persiste, testez avec seulement les scopes de base :
   ```bash
   EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access
   ```
   Redémarrez Expo et testez. Si ça fonctionne, ajoutez progressivement les autres scopes.

---

### 4. ✅ Standalone Launch Sans Scope "launch"

**Problème** : Si vous testez en Standalone Launch (sans lancer depuis Epic), le scope `launch` peut causer des problèmes.

**Solution** :
1. **Option A** : Gardez `launch` dans les scopes (recommandé si vous prévoyez d'utiliser EHR Launch)

2. **Option B** : Testez sans `launch` (temporairement) :
   ```bash
   EPIC_SCOPES_SANDBOX=openid fhirUser offline_access patient/Patient.read
   ```
   ⚠️ **Attention** : Cela empêchera EHR Launch, seulement pour tests

---

### 5. ✅ Client ID Incorrect ou Non Configuré

**Problème** : Le Client ID dans votre `.env` ne correspond pas à celui dans Epic.

**Vérification** :
1. **Dans Epic on FHIR** :
   - Le Client ID (Non-Production) devrait être affiché
   - Format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Exemple : `75a6f3e8-e77c-4a8f-8835-1fb1bc434884`

2. **Dans votre `.env`** :
   ```bash
   EPIC_CLIENT_ID_SANDBOX=75a6f3e8-e77c-4a8f-8835-1fb1bc434884
   ```
   - ✅ Vérifiez qu'il n'y a pas d'espace
   - ✅ Vérifiez que c'est bien le Client ID **Non-Production**

3. **Dans les logs** :
   - L'URL d'autorisation devrait contenir ce Client ID
   - Vérifiez qu'il correspond exactement

---

### 6. ✅ Application Non Approuvée

**Problème** : L'application nécessite une approbation Epic.

**Vérification** :
1. **Dans Epic on FHIR** :
   - Vérifiez s'il y a un message d'approbation en attente
   - Vérifiez vos emails (notifications Epic)

2. **Pour Sandbox** :
   - L'approbation est généralement automatique
   - Si ce n'est pas le cas, contactez le support

---

### 7. ✅ Paramètre `aud` Incorrect

**Problème** : Le paramètre `aud` (audience) dans la requête est incorrect.

**Vérification** :
Dans les logs, vous devriez voir :
```
aud=https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4
```

**Solution** :
- Pour Standalone Launch (sans `iss`), le paramètre `aud` est construit automatiquement
- Pour EHR Launch (avec `iss`), `aud` devrait être égal à `iss`
- Le code actuel devrait gérer cela correctement

---

## 🧪 Test Progressif

### Étape 1 : Scopes Minimaux

Testez d'abord avec des scopes minimaux :

```bash
EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access
```

Redémarrez Expo et testez. Si ça fonctionne → ajoutez les scopes un par un.

### Étape 2 : Sans Scope "launch"

Si l'étape 1 échoue, testez sans `launch` :

```bash
EPIC_SCOPES_SANDBOX=openid fhirUser offline_access patient/Patient.read
```

### Étape 3 : Vérifier les Logs Epic

Dans Epic on FHIR, il peut y avoir des logs d'erreurs détaillées :
- Cherchez une section "Logs" ou "Activity"
- Les erreurs détaillées peuvent indiquer le problème exact

---

## ✅ Checklist Complète

- [ ] Application **activée** dans Epic (statut = "Active")
- [ ] Client ID **correspond** exactement entre Epic et `.env`
- [ ] Redirect URI **correspond** exactement (pas d'espace, pas de slash final)
- [ ] **Tous les scopes** demandés sont **sélectionnés** dans Epic
- [ ] Scopes au **bon format** dans `.env` (format SMART standard)
- [ ] `app.json` contient `"scheme": "app-soin-plaie"`
- [ ] Expo **redémarré** après modification du `.env` (`npx expo start -c`)
- [ ] Pas d'erreurs dans la console Expo

---

## 📞 Informations à Fournir au Support Epic

Si le problème persiste après toutes ces vérifications, contactez le support Epic (fhir@epic.com) avec :

1. **Nom de l'application** : PlaieMobile
2. **Client ID (Non-Production)** : `75a6f3e8-e77c-4a8f-8835-1fb1bc434884`
3. **Redirect URI utilisé** : `app-soin-plaie://oauth/callback`
4. **Scopes demandés** : La liste complète
5. **URL d'autorisation complète** : (visible dans les logs)
6. **Erreur exacte** : "Something went wrong trying to authorize the client"
7. **Capture d'écran** : De l'erreur Epic

---

## 🔍 Vérification Finale

Dans les logs, vous avez vu :

```
Client ID: 75a6f3e8-e77c-4a8f-8835-1fb1bc434884 ✅
Redirect URI: app-soin-plaie://oauth/callback ✅
Scopes: launch openid fhirUser offline_access patient/Patient.read... ✅
```

**Tout semble correct !** Le problème vient probablement de :
1. Application non activée dans Epic
2. Scopes non tous sélectionnés dans Epic
3. Redirect URI ne correspond pas exactement dans Epic

**Action immédiate** : Vérifiez dans Epic on FHIR que l'application est **activée** et que tous les scopes sont **sélectionnés**.

