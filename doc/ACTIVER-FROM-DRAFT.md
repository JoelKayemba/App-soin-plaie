# ✅ Activer l'Application Epic depuis "Draft"

## 🔴 Problème Identifié

Votre application **PlaieMobile** est actuellement en statut **"Draft"**, ce qui signifie qu'elle n'est **pas activée**. C'est pour cela que vous recevez l'erreur :
> "Something went wrong trying to authorize the client"

**L'application doit être activée pour fonctionner !**

---

## 🚀 Étapes pour Activer

### Étape 1 : Vérifier que Tout est Configuré

Avant d'activer, assurez-vous que tout est bien configuré :

#### ✅ Configuration Technique
- [ ] SMART on FHIR Version : **R4** ✅
- [ ] SMART Scope Version : **SMART v2** ✅
- [ ] Confidential Client : **Non** ✅

#### ✅ Redirect URIs
- [ ] Au moins un Redirect URI configuré : `app-soin-plaie://oauth/callback`
- [ ] Format correct (pas d'espace, pas de slash final)

#### ✅ Launch Types
- [ ] **EHR Launch** coché
- [ ] **Standalone Launch** coché

#### ✅ Scopes
- [ ] Scopes de base sélectionnés : `launch`, `openid`, `fhirUser`, `offline_access`
- [ ] Scopes patient sélectionnés : Patient, AllergyIntolerance, etc.

#### ✅ Intended Purposes / Users
- [ ] Au moins un "Intended Purpose" sélectionné
- [ ] Au moins un "Intended User" sélectionné

---

### Étape 2 : Sauvegarder la Configuration

1. **Vérifiez toutes les sections** de votre application dans Epic on FHIR
2. **Cliquez sur "Save"** en bas de la page
   - Si des erreurs apparaissent, corrigez-les
   - Tous les champs requis doivent être remplis

---

### Étape 3 : Marquer comme "Ready for Sandbox"

1. **Cherchez le bouton "Ready for Sandbox"** (ou similaire)
   - Il peut être :
     - En haut de la page (barre d'actions)
     - En bas de la page
     - Dans un onglet "Status" ou "Deployment"
     - À côté du statut "Draft"

2. **Cliquez sur "Ready for Sandbox"**
   - Epic va valider votre configuration
   - Si tout est correct, l'application sera marquée comme prête

3. **Attendez la validation**
   - Généralement instantanée
   - Peut prendre quelques minutes

---

### Étape 4 : Activer l'Application

Après avoir cliqué "Ready for Sandbox", il y a deux possibilités :

#### Option A : Activation Automatique ✅

- L'application passe automatiquement de "Draft" → "Ready" → "Active"
- Le **Client ID** apparaît immédiatement
- Vous pouvez utiliser l'application tout de suite

#### Option B : Activation Manuelle

Si l'activation n'est pas automatique :

1. **Cherchez un bouton "Activate" ou "Enable"**
   - Il peut apparaître après "Ready for Sandbox"
   - Cherchez dans les actions disponibles

2. **Cliquez sur "Activate"**
   - Confirmez si Epic demande une confirmation

3. **Le statut devrait passer à "Active"**

---

### Étape 5 : Vérifier l'Activation

Une fois activée, vérifiez que :

- ✅ **Statut** = **"Active"** (ou "Ready" pour sandbox)
- ✅ **Client ID (Non-Production)** est visible
  - Format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Exemple : `75a6f3e8-e77c-4a8f-8835-1fb1bc434884`
- ✅ **Redirect URIs** sont affichés
- ✅ **Scopes** sont listés

---

## 📝 Processus Complet

```
Draft → (Save) → Ready for Sandbox → (Activate) → Active
  ↓              ↓                      ↓           ↓
Non actif    Validation            Activation   ✅ Utilisable
```

---

## ⚠️ Si "Ready for Sandbox" N'est Pas Disponible

### Vérifications

1. **Tous les champs requis sont-ils remplis ?**
   - Epic peut bloquer l'activation si des informations manquent
   - Vérifiez tous les onglets de configuration

2. **Y a-t-il des erreurs de validation ?**
   - Epic affiche des erreurs si quelque chose ne va pas
   - Corrigez toutes les erreurs avant d'essayer d'activer

3. **Redirect URIs sont-ils configurés ?**
   - Au moins un Redirect URI doit être configuré
   - Format correct : `app-soin-plaie://oauth/callback`

4. **Scopes sont-ils sélectionnés ?**
   - Au moins quelques scopes doivent être sélectionnés
   - Commencez avec les scopes de base : `launch`, `openid`, `fhirUser`, `offline_access`

---

## 🔍 Emplacement des Boutons dans Epic on FHIR

Les boutons peuvent être dans différents endroits selon la version de l'interface :

### Option 1 : Barre d'Actions en Haut
```
[Save] [Ready for Sandbox] [Delete]
```

### Option 2 : Section Status
```
Status: Draft
Actions: [Ready for Sandbox] [Activate]
```

### Option 3 : Onglet "Deployment" ou "Status"
- Allez dans l'onglet "Deployment" ou "Status"
- Cherchez les boutons d'activation

### Option 4 : Menu Dropdown
- Un menu "Actions" ou "..." avec les options

---

## ✅ Après Activation

Une fois l'application activée :

1. **Copiez le Client ID (Non-Production)**
   - Il devrait apparaître dans l'interface
   - Format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

2. **Ajoutez-le dans votre `.env`** :
   ```bash
   EPIC_CLIENT_ID_SANDBOX=votre-client-id-ici
   ```

3. **Redémarrez Expo** :
   ```bash
   npx expo start -c
   ```

4. **Testez la connexion** :
   - L'erreur "Something went wrong" devrait disparaître
   - Vous devriez pouvoir vous connecter à Epic

---

## 🆘 Support

Si après avoir fait tout cela, vous ne trouvez pas le bouton "Ready for Sandbox" ou "Activate" :

1. **Contactez le support Epic** : fhir@epic.com
2. **Mentionnez** :
   - Application : "PlaieMobile"
   - Statut actuel : "Draft"
   - Problème : Impossible d'activer l'application

---

## 📋 Checklist Rapide

- [ ] Toutes les sections configurées
- [ ] **"Save" cliqué** ← Important !
- [ ] **"Ready for Sandbox" cliqué** ← Action principale
- [ ] Statut passe à "Active" ou "Ready"
- [ ] Client ID visible
- [ ] Client ID copié dans `.env`
- [ ] Expo redémarré
- [ ] Connexion testée

**L'étape la plus importante : Cliquer sur "Ready for Sandbox" !**

