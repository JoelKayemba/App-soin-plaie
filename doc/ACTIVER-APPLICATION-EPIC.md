# 🚀 Activer votre Application Epic - PlaieMobile

## 📋 Étapes pour Finaliser et Activer

### Étape 1 : Sauvegarder la Configuration

1. **Vérifiez toutes les sections** :
   - ✅ Basic Info (nom de l'app, description)
   - ✅ Configuration Technique (SMART v2, R4, etc.)
   - ✅ Intended Purposes et Users
   - ✅ Redirect URIs
   - ✅ Launch Types
   - ✅ Scopes sélectionnés

2. **Cliquez sur "Save"** en bas de la page
   - Epic sauvegarde votre configuration
   - Si des erreurs sont détectées, Epic vous les signalera

---

### Étape 2 : Marquer comme "Ready for Sandbox"

**Pour le développement et les tests** :

1. **Trouvez le bouton "Ready for Sandbox"** (ou "Mark as Ready for Sandbox")
   - Il se trouve généralement en haut ou en bas de la page de configuration
   - Parfois dans un onglet "Status" ou "Deployment"

2. **Cliquez sur "Ready for Sandbox"**
   - Epic va valider votre configuration
   - Si tout est correct, l'application passera en statut "Ready for Sandbox"

3. **Attendez la validation** (généralement instantanée ou quelques minutes)

---

### Étape 3 : Activer l'Application

#### Option A : Activation Automatique (Sandbox)

Si vous avez cliqué "Ready for Sandbox" :
- ✅ L'application peut être **automatiquement activée** pour le sandbox
- ✅ Le statut devrait passer à **"Active"** ou **"Ready"**

#### Option B : Activation Manuelle

Si l'application n'est pas automatiquement activée :

1. **Allez dans la section "Status" ou "Deployment"**
   - Cherchez un statut comme "Pending", "Draft", ou "Ready"

2. **Cliquez sur "Activate" ou "Enable"**
   - Si disponible, un bouton "Activate" devrait apparaître

3. **Confirmez l'activation**
   - Epic peut demander une confirmation

---

### Étape 4 : Vérifier le Statut

Une fois activée, vérifiez que :

- ✅ **Status** = **"Active"** (ou "Ready" pour sandbox)
- ✅ **Client ID** est affiché (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- ✅ **Redirect URIs** sont visibles
- ✅ **Scopes** sont listés

---

## 🔍 Si l'Application n'est pas Activée

### Vérifications à Faire

1. **Erreurs de Validation** :
   - Epic affiche des erreurs si quelque chose manque
   - Vérifiez tous les messages d'erreur
   - Corrigez les problèmes signalés

2. **Configuration Incomplète** :
   - Tous les champs requis doivent être remplis
   - Redirect URIs doivent être configurés
   - Au moins un Launch Type doit être sélectionné
   - Au moins un scope doit être sélectionné

3. **Approbation Requise** :
   - Parfois Epic nécessite une approbation manuelle
   - Vous recevrez un email si c'est le cas
   - Attendez l'approbation (peut prendre quelques heures/jours pour production)

---

## 📝 Checklist Avant d'Activer

Avant de cliquer "Ready for Sandbox" ou "Activate", vérifiez :

### Configuration Technique
- [ ] SMART on FHIR Version : **R4** ✅
- [ ] SMART Scope Version : **SMART v2** ✅
- [ ] Confidential Client : **Non** ✅
- [ ] CDS Hooks : **Non** ✅

### Redirect URIs
- [ ] Au moins un Redirect URI configuré
- [ ] Format correct : `app-soin-plaie://oauth/callback`
- [ ] Pas d'erreurs de format

### Launch Types
- [ ] **EHR Launch** coché (pour lancement depuis Epic)
- [ ] **Standalone Launch** coché (pour tests indépendants)

### Scopes
- [ ] Scopes de base : `launch`, `openid`, `fhirUser`, `offline_access`
- [ ] Scopes patient : `patient/Patient.read`, etc.
- [ ] Tous les scopes nécessaires sont sélectionnés

### Intended Purposes / Users
- [ ] Au moins un "Intended Purpose" sélectionné
- [ ] Au moins un "Intended User" sélectionné

---

## 🎯 Pour le Sandbox (Non-Production)

**Processus recommandé** :

1. ✅ Cliquez **"Save"** pour sauvegarder
2. ✅ Cliquez **"Ready for Sandbox"** pour marquer comme prêt
3. ✅ L'application devrait être **automatiquement activée** pour le sandbox
4. ✅ Notez le **Client ID (Non-Production)** affiché

**Temps estimé** : Instantané à quelques minutes

---

## 🏥 Pour la Production

**Processus plus strict** :

1. ✅ Cliquez **"Save"** pour sauvegarder
2. ✅ Cliquez **"Ready for Production"** (si disponible)
3. ⏳ **Attendez l'approbation** Epic (peut prendre plusieurs jours)
4. ✅ Vous recevrez un email quand l'application sera approuvée
5. ✅ Une fois approuvée, l'application sera **activée pour la production**

**Temps estimé** : Plusieurs jours à plusieurs semaines (approbation manuelle)

---

## 📧 Emails de Notification

Epic peut vous envoyer des emails pour :
- ✅ Confirmation de l'activation
- ⚠️ Problèmes de configuration
- 📋 Demande d'informations supplémentaires
- ✅ Approbation pour production

**Vérifiez votre boîte email** associée à votre compte Epic on FHIR.

---

## 🧪 Tester après Activation

Une fois l'application activée :

1. **Copiez le Client ID (Non-Production)**
   - Format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Ajoutez-le dans votre `.env` :
     ```bash
     EPIC_CLIENT_ID_SANDBOX=votre-client-id-ici
     ```

2. **Vérifiez les Redirect URIs**
   - Doit correspondre exactement à celui dans `.env`

3. **Redémarrez Expo** :
   ```bash
   npx expo start -c
   ```

4. **Testez la connexion** depuis votre application

---

## 🆘 Problèmes Courants

### L'application reste en "Pending" ou "Draft"

- ✅ Vérifiez qu'il n'y a pas d'erreurs dans la configuration
- ✅ Assurez-vous que tous les champs requis sont remplis
- ✅ Contactez le support Epic si nécessaire

### Pas de bouton "Activate" visible

- ✅ L'application peut nécessiter d'être marquée "Ready for Sandbox" d'abord
- ✅ Cherchez dans d'autres sections de l'interface
- ✅ L'activation peut être automatique après "Ready for Sandbox"

### Client ID non visible

- ✅ L'application doit être activée pour que le Client ID soit généré
- ✅ Le Client ID apparaît généralement après l'activation
- ✅ Pour le sandbox, il peut apparaître immédiatement

---

## ✅ Résumé

1. **Sauvegarder** → Cliquez "Save"
2. **Marquer comme prêt** → Cliquez "Ready for Sandbox"
3. **Activer** → Statut devrait passer à "Active" (automatique pour sandbox)
4. **Récupérer Client ID** → Notez le Client ID (Non-Production)
5. **Configurer `.env`** → Ajoutez le Client ID dans votre fichier `.env`
6. **Tester** → Redémarrez Expo et testez la connexion

---

## 📞 Support

Si vous avez des problèmes :
- **Documentation Epic** : https://fhir.epic.com/
- **Support Email** : fhir@epic.com
- **Mentionnez** : Application "PlaieMobile", problème d'activation

