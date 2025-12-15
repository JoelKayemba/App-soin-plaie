# 🔧 Application Reste en "Draft" - Résolution

## 🔴 Problème

Malgré avoir cliqué sur **"Save & Ready for Sandbox"**, l'application reste en statut **"Draft"**.

## 🔍 Causes Possibles

### 1. ❌ Erreurs de Validation

**Problème** : Epic détecte des erreurs dans la configuration et empêche l'activation.

**Solution** :
1. **Vérifiez s'il y a des messages d'erreur** :
   - Cherchez des messages en rouge ou des alertes
   - Lisez tous les messages d'erreur attentivement
   
2. **Erreurs communes** :
   - Redirect URI invalide ou manquant
   - Scopes non sélectionnés
   - Champs requis non remplis
   - Format incorrect dans certains champs

3. **Corrigez toutes les erreurs** avant de cliquer à nouveau sur "Save & Ready for Sandbox"

---

### 2. ❌ Redirect URI Manquant ou Incorrect

**Problème** : Epic nécessite au moins un Redirect URI valide.

**Vérification** :
1. **Allez dans la section "Redirect URIs"**
2. **Vérifiez qu'au moins un URI est configuré** :
   ```
   app-soin-plaie://oauth/callback
   ```
   
3. **Vérifiez le format** :
   - ✅ Pas d'espace avant/après
   - ✅ Pas de slash final
   - ✅ Pas de `http://` ou `https://`
   - ✅ Format exact : `app-soin-plaie://oauth/callback`

4. **Si manquant** :
   - Ajoutez-le
   - Sauvegardez
   - Réessayez "Save & Ready for Sandbox"

---

### 3. ❌ Aucun Scope Sélectionné

**Problème** : Epic nécessite au moins quelques scopes.

**Vérification** :
1. **Allez dans la section "Scopes" ou "Selected Scopes"**
2. **Vérifiez qu'au moins ces scopes sont sélectionnés** :
   - `launch`
   - `openid`
   - `fhirUser`
   - `offline_access`
   - Au moins un scope patient (ex: `Patient.Read`)

3. **Si aucun scope n'est sélectionné** :
   - Sélectionnez les scopes de base
   - Sauvegardez
   - Réessayez

---

### 4. ❌ Champs Requis Manquants

**Problème** : Des champs obligatoires ne sont pas remplis.

**Vérifications** :
1. **Basic Info** :
   - [ ] Nom de l'application rempli
   - [ ] Description (peut être requise)

2. **Configuration Technique** :
   - [ ] SMART on FHIR Version sélectionné (R4)
   - [ ] SMART Scope Version sélectionné (SMART v2)

3. **Intended Purposes** :
   - [ ] Au moins un "Intended Purpose" coché (ex: "Clinical Team")

4. **Intended Users** :
   - [ ] Au moins un "Intended User" coché (ex: "Clinical Team")

5. **Launch Types** :
   - [ ] Au moins un Launch Type coché (EHR Launch ou Standalone Launch)

---

### 5. ⏳ Délai de Traitement

**Problème** : Epic peut prendre quelques minutes pour traiter la demande.

**Solution** :
1. **Attendez 2-5 minutes**
2. **Rafraîchissez la page** (F5 ou Ctrl+R)
3. **Vérifiez à nouveau le statut**

---

### 6. ❌ Message d'Erreur Non Visible

**Problème** : Epic a peut-être affiché un message d'erreur que vous n'avez pas vu.

**Solution** :
1. **Vérifiez tous les onglets** de configuration :
   - Basic Info
   - Configuration
   - Redirect URIs
   - Launch Types
   - Scopes
   - Intended Purposes/Users

2. **Cherchez** :
   - Messages en rouge
   - Icônes d'alerte (⚠️)
   - Textes en gras indiquant des problèmes
   - Champs surlignés en rouge

---

## 🔧 Étapes de Dépannage Systématique

### Étape 1 : Vérifier les Erreurs Visibles

1. **Parcourez tous les onglets** de votre application
2. **Notez toutes les erreurs** affichées
3. **Corrigez-les** une par une

### Étape 2 : Vérifier les Champs Requis

Assurez-vous que TOUS ces éléments sont configurés :

- [ ] **Nom de l'application** : PlaieMobile
- [ ] **SMART on FHIR Version** : R4 sélectionné
- [ ] **SMART Scope Version** : SMART v2 sélectionné
- [ ] **Au moins un Redirect URI** : `app-soin-plaie://oauth/callback`
- [ ] **Au moins un Launch Type** : EHR Launch ou Standalone Launch
- [ ] **Au moins 4 scopes** : launch, openid, fhirUser, offline_access
- [ ] **Au moins un Intended Purpose** : Clinical Team
- [ ] **Au moins un Intended User** : Clinical Team
- [ ] **Terms of use acceptés** : Case cochée ✅

### Étape 3 : Sauvegarder et Réessayer

1. **Corrigez toutes les erreurs** trouvées
2. **Cliquez sur "Save"** d'abord
3. **Attendez** que la sauvegarde se confirme
4. **Cliquez sur "Save & Ready for Sandbox"**
5. **Attendez 2-5 minutes**
6. **Rafraîchissez la page** (F5)
7. **Vérifiez le statut**

### Étape 4 : Vérifier dans les Logs Epic

1. **Cherchez une section "Activity" ou "Logs"** dans Epic
2. **Vérifiez s'il y a des messages** expliquant pourquoi l'activation a échoué

---

## 🆘 Si Rien Ne Fonctionne

### Option 1 : Créer une Nouvelle Application

Si le problème persiste, vous pouvez créer une nouvelle application :

1. **Créez une nouvelle application** dans Epic on FHIR
2. **Configurez-la** avec les mêmes paramètres
3. **Assurez-vous que tout est correct** avant de cliquer "Save & Ready for Sandbox"

### Option 2 : Contacter le Support Epic

Contactez le support Epic avec ces informations :

1. **Email** : fhir@epic.com
2. **Sujet** : Application reste en "Draft" après "Ready for Sandbox"
3. **Informations à fournir** :
   - Nom de l'application : PlaieMobile
   - Client ID (si visible) : `75a6f3e8-e77c-4a8f-8835-1fb1bc434884`
   - Problème : Application reste en "Draft" malgré "Save & Ready for Sandbox"
   - Captures d'écran : Des différents onglets de configuration

---

## 🔍 Checklist Complète

Avant de cliquer "Save & Ready for Sandbox", vérifiez :

- [ ] ✅ Tous les champs requis remplis
- [ ] ✅ Redirect URI configuré : `app-soin-plaie://oauth/callback`
- [ ] ✅ Au moins 4 scopes sélectionnés
- [ ] ✅ Launch Type sélectionné
- [ ] ✅ Intended Purpose sélectionné
- [ ] ✅ Intended User sélectionné
- [ ] ✅ Terms of use acceptés
- [ ] ✅ Aucune erreur visible dans les onglets
- [ ] ✅ Cliqué sur "Save" d'abord
- [ ] ✅ Attendu confirmation de sauvegarde
- [ ] ✅ Cliqué sur "Save & Ready for Sandbox"
- [ ] ✅ Attendu 2-5 minutes
- [ ] ✅ Rafraîchi la page

---

## 💡 Conseil

**Action immédiate** :

1. **Ouvrez chaque onglet** de configuration dans Epic
2. **Cherchez des messages d'erreur** (texte rouge, alertes, champs surlignés)
3. **Notez-les tous**
4. **Corrigez-les**
5. **Sauvegardez à nouveau**

Le problème vient probablement d'une **erreur de validation non visible** ou d'un **champ requis manquant**.

