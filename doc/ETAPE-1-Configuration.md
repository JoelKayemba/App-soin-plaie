# ✅ ÉTAPE 1 : Fichier de Configuration Epic

**Statut** : ✅ Complétée  
**Fichier créé** : `src/config/epic.js`

---

## 📁 Fichier Créé

`src/config/epic.js` - Configuration Epic OAuth 2.0 / SMART on FHIR

---

## 🔧 Comment ça fonctionne

Le fichier de configuration :
1. ✅ Lit les variables depuis votre fichier `.env`
2. ✅ Fournit des fonctions utilitaires pour obtenir les URLs Epic
3. ✅ Valide la configuration
4. ✅ Supporte les modes `sandbox` et `production`

---

## 📝 Utilisation

### Import dans votre code

```javascript
import { getEpicConfig, getFhirBaseUrl, validateEpicConfig } from '@/config/epic';
```

### Obtenir la configuration active

```javascript
const config = getEpicConfig();

console.log(config.clientId);      // Votre Client ID
console.log(config.baseUrl);       // URL Epic
console.log(config.redirectUri);   // Redirect URI
console.log(config.scope);         // Scopes OAuth
```

### Obtenir l'URL FHIR

```javascript
// Avec issuer (lors d'un lancement Epic)
const fhirUrl = getFhirBaseUrl('https://fhir.epic.com/...');

// Sans issuer (utilise la config par défaut)
const fhirUrl = getFhirBaseUrl();
```

### Valider la configuration

```javascript
const { isValid, errors } = validateEpicConfig();

if (!isValid) {
  console.error('Configuration invalide:', errors);
}
```

---

## ⚙️ Variables d'Environnement

Le fichier lit automatiquement ces variables depuis `.env` :

- `EPIC_CLIENT_ID_SANDBOX`
- `EPIC_SANDBOX_BASE_URL`
- `EPIC_REDIRECT_URI_SANDBOX`
- `EPIC_SCOPES_SANDBOX`
- `EPIC_MODE`
- etc.

**Si les variables ne sont pas trouvées**, le fichier utilise des valeurs par défaut (sandbox).

---

## 🧪 Test Rapide

Pour vérifier que ça fonctionne, ajoutez ceci dans votre code :

```javascript
import { getEpicConfig, logEpicConfig } from '@/config/epic';

// Afficher la configuration (dans un console.log ou debug)
logEpicConfig();

// Obtenir la config
const config = getEpicConfig();
console.log('Client ID configuré:', !!config.clientId);
```

---

## ✅ Prochaine Étape

**ÉTAPE 2** : Installer les packages nécessaires (expo-crypto, expo-linking, etc.)

---

*Étape complétée le : Janvier 2025*




