# 🔍 Débogage : Erreur "Something went wrong trying to authorize the client"

## ⚠️ Erreur Rencontrée

Lors de la connexion à Epic, vous recevez l'erreur :
> "Something went wrong trying to authorize the client please try logging in again"

## 🔎 Causes Possibles

Cette erreur indique qu'Epic rejette votre requête d'autorisation. Voici les causes les plus fréquentes :

### 1. ❌ Client ID Vide ou Incorrect

**Problème** : Le Client ID n'est pas configuré ou est incorrect.

**Solution** :
1. Vérifiez votre fichier `.env` :
   ```bash
   # Vérifiez que cette ligne existe et contient un Client ID valide
   EPIC_CLIENT_ID_SANDBOX=votre-client-id-ici
   ```

2. Vérifiez dans la console (ajoutez ce code temporairement) :
   ```javascript
   import { getEpicConfig } from '@/config/epic';
   const config = getEpicConfig();
   console.log('Client ID:', config.clientId);
   ```
   
   Si le Client ID est vide ou `undefined`, Epic refusera la requête.

3. **Redémarrer Expo** après modification du `.env` :
   ```bash
   npx expo start -c
   ```

---

### 2. ❌ Redirect URI Ne Correspond Pas

**Problème** : Le Redirect URI dans votre requête ne correspond pas exactement à celui configuré dans Epic.

**Solution** :

1. **Vérifiez dans Epic on FHIR** :
   - Allez dans votre application Epic on FHIR
   - Vérifiez les "Non-Production Redirect URIs"
   - Doit contenir exactement : `app-soin-plaie://oauth/callback`

2. **Vérifiez dans votre `.env`** :
   ```bash
   EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback
   ```
   
   ⚠️ **Important** :
   - Pas d'espace avant/après
   - Pas de slash final
   - Correspondance exacte (majuscules/minuscules)

3. **Vérifiez dans `app.json`** :
   ```json
   {
     "expo": {
       "scheme": "app-soin-plaie"
     }
   }
   ```

---

### 3. ❌ Scopes Incorrects

**Problème** : Les scopes demandés ne sont pas autorisés pour votre application Epic.

**Solution** :

1. **Vérifiez dans Epic on FHIR** :
   - Allez dans "Scopes" de votre application
   - Comparez avec ceux demandés dans votre `.env`

2. **Scopes recommandés pour débuter** :
   ```
   launch openid fhirUser offline_access patient/Patient.read
   ```
   
   Commencez avec ces scopes minimaux, puis ajoutez d'autres si nécessaire.

3. **Vérifiez le format SMART** :
   - Si vous utilisez **SMART v2**, certains scopes peuvent avoir un format différent
   - Exemple : `patient/Observation.c` (create) au lieu de `patient/Observation.write`

---

### 4. ❌ Endpoint d'Autorisation Incorrect

**Problème** : L'URL de l'endpoint d'autorisation est incorrecte.

**Solution** :

1. **Pour Epic Sandbox**, l'endpoint devrait être :
   ```
   https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize
   ```

2. **Vérifiez votre `.env`** :
   ```bash
   EPIC_SANDBOX_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth
   ```

3. **Si vous avez configuré SMART on FHIR**, l'endpoint peut être récupéré automatiquement depuis :
   ```
   https://fhir.epic.com/interconnect-fhir-oauth/.well-known/smart-configuration
   ```

---

### 5. ❌ Application Non Activée dans Epic

**Problème** : Votre application Epic n'est pas activée ou approuvée.

**Solution** :

1. Vérifiez dans Epic on FHIR :
   - L'application doit être **activée** (status = Active)
   - Si elle est en "Pending Approval", attendez l'approbation

2. Vérifiez les notifications Epic :
   - Epic peut vous envoyer un email si l'application nécessite une approbation

---

### 6. ❌ Mode de Développement (Standalone vs EHR Launch)

**Problème** : Vous tentez un Standalone Launch mais l'application est configurée pour EHR Launch uniquement.

**Solution** :

1. **Dans Epic on FHIR**, vérifiez les "Launch Types" autorisés :
   - ✅ **EHR Launch (Embedded)** : Lancement depuis Epic
   - ✅ **Standalone Launch** : Lancement indépendant (pour tests)

2. **Pour tester en Standalone** :
   - Assurez-vous que "Standalone Launch" est coché dans Epic
   - Ne passez pas de paramètre `launch` dans votre requête

---

## 🔧 Vérifications à Faire

### Checklist Rapide

- [ ] Client ID configuré dans `.env` et non vide
- [ ] Redirect URI correspond exactement à celui dans Epic
- [ ] Scopes demandés sont autorisés dans Epic
- [ ] Application activée dans Epic on FHIR
- [ ] Expo redémarré après modification du `.env` (`npx expo start -c`)
- [ ] `app.json` contient le `scheme: "app-soin-plaie"`

### Vérification dans la Console

Ajoutez temporairement ce code pour déboguer :

```javascript
import { getEpicConfig, logEpicConfig } from '@/config/epic';

// Afficher la configuration
logEpicConfig();

// Vérifier les valeurs
const config = getEpicConfig();
console.log('=== Configuration Epic ===');
console.log('Mode:', config.mode);
console.log('Client ID:', config.clientId || '❌ MANQUANT');
console.log('Redirect URI:', config.redirectUri);
console.log('Base URL:', config.baseUrl);
console.log('Scopes:', config.scope);
```

### Vérification de l'URL d'Autorisation

Dans `EpicAuthService.js`, l'URL d'autorisation est maintenant loggée en mode développement.

Vérifiez dans la console :
- L'URL complète envoyée à Epic
- Que le Client ID est présent et correct
- Que le Redirect URI est correct
- Que les scopes sont corrects

---

## 🚀 Étapes de Résolution

1. **Vérifier le Client ID** :
   ```bash
   # Ouvrez votre .env
   cat .env | grep EPIC_CLIENT_ID_SANDBOX
   
   # Doit afficher quelque chose comme :
   # EPIC_CLIENT_ID_SANDBOX=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

2. **Redémarrer Expo** :
   ```bash
   npx expo start -c
   ```

3. **Vérifier dans Epic on FHIR** :
   - Connectez-vous à https://fhir.epic.com/
   - Allez dans votre application
   - Vérifiez :
     - Status = Active
     - Client ID correspond
     - Redirect URIs contient `app-soin-plaie://oauth/callback`
     - Scopes sont configurés

4. **Tester avec des scopes minimaux** :
   
   Modifiez temporairement votre `.env` :
   ```bash
   EPIC_SCOPES_SANDBOX=launch openid fhirUser offline_access
   ```
   
   Redémarrez et testez. Si ça fonctionne, ajoutez progressivement les autres scopes.

---

## 📞 Support Epic

Si après toutes ces vérifications le problème persiste :

1. **Vérifiez les logs Epic** :
   - Dans Epic on FHIR, il peut y avoir des logs d'erreurs détaillées

2. **Contactez le support Epic on FHIR** :
   - Email : fhir@epic.com
   - Documentation : https://fhir.epic.com/

3. **Informations à fournir** :
   - Client ID
   - Erreur exacte
   - URL d'autorisation (loggée dans la console)
   - Redirect URI utilisé

---

## 📝 Notes Additionnelles

- ⚠️ **NE JAMAIS** commiter le fichier `.env` (vérifiez qu'il est dans `.gitignore`)
- 🔄 Toujours redémarrer Expo après modification du `.env`
- 🧪 Testez d'abord avec des scopes minimaux
- 📋 Gardez une copie de votre configuration Epic dans un endroit sûr




