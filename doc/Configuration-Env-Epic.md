# Configuration du Fichier .env pour Epic

**Date** : Janvier 2025  
**Objectif** : Configurer les variables d'environnement Epic

---

## 📝 Instructions

### Étape 1 : Créer le Fichier .env

Dans la racine de votre projet `app-soin-plaie`, créez un fichier nommé `.env`

```bash
# Dans le terminal, depuis la racine du projet
touch .env
```

### Étape 2 : Ajouter .env au .gitignore

**Important** : Assurez-vous que `.env` est dans `.gitignore` pour ne pas commiter vos identifiants !

Votre `.gitignore` devrait contenir :
```
.env
.env*.local
```

### Étape 3 : Remplir le Fichier .env

Copiez ce template et remplissez avec **VOS valeurs Epic** :

```env
# ============================================
# EPIC SANDBOX (Non-Production)
# ============================================

# Client ID fourni par Epic on FHIR (Non-Production)
# Format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# ⚠️ À remplir avec VOTRE Client ID depuis Epic on FHIR
EPIC_CLIENT_ID_SANDBOX=VOICI_VOTRE_CLIENT_ID_NON_PRODUCTION

# URL de base Epic Sandbox (fixe, ne pas modifier)
EPIC_SANDBOX_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth

# Redirect URI pour OAuth (doit correspondre à celui configuré dans Epic)
# Pour Expo : app-soin-plaie://oauth/callback
EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback

# Scopes OAuth (doit correspondre à ceux configurés dans Epic)
EPIC_SCOPES_SANDBOX=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access

# ============================================
# EPIC PRODUCTION
# ============================================

# Client ID Production (laisser vide pour l'instant)
EPIC_CLIENT_ID_PRODUCTION=

# URL de base Epic Production (sera fournie par l'organisation)
EPIC_PRODUCTION_BASE_URL=

# Redirect URI Production
EPIC_REDIRECT_URI_PRODUCTION=app-soin-plaie://oauth/callback

# Scopes Production (généralement identiques)
EPIC_SCOPES_PRODUCTION=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access

# ============================================
# CONFIGURATION GÉNÉRALE
# ============================================

# Mode : 'sandbox' en développement, 'production' en production
EPIC_MODE=sandbox

# Version FHIR : 'R4' (recommandé)
EPIC_FHIR_VERSION=R4

# Version SMART : 'v2' (si supporté) ou 'v1'
EPIC_SMART_VERSION=v2

# ============================================
# CONFIGURATION PKCE (Sécurité)
# ============================================

# Méthode PKCE : 'S256' (recommandé)
EPIC_PKCE_METHOD=S256

# Longueur du code verifier (128 recommandé)
EPIC_PKCE_VERIFIER_LENGTH=128

# ============================================
# INFORMATIONS APPLICATION
# ============================================

APP_NAME=App Soin Plaie
APP_VERSION=1.0.0
```

---

## 🔍 Où Trouver Vos Valeurs Epic

### Client ID (Non-Production)

1. Connectez-vous à https://fhir.epic.com/
2. Allez dans **"Apps"** → Votre application
3. Cherchez **"Client ID (Non-Production)"**
4. Copiez la valeur (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Redirect URI

- Celui que vous avez configuré dans Epic lors de la création de l'app
- Exemple : `app-soin-plaie://oauth/callback`
- Doit **exactement correspondre** à celui dans Epic

### Scopes

- Ceux que vous avez sélectionnés lors de la création de l'app Epic
- Format : espaces entre chaque scope
- Exemple : `launch openid fhirUser patient/Patient.read`

---

## ✅ Exemple de Fichier .env Rempli

```env
# EPIC SANDBOX
EPIC_CLIENT_ID_SANDBOX=a1b2c3d4-e5f6-7890-abcd-ef1234567890
EPIC_SANDBOX_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth
EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback
EPIC_SCOPES_SANDBOX=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access

# EPIC PRODUCTION (vide pour l'instant)
EPIC_CLIENT_ID_PRODUCTION=
EPIC_PRODUCTION_BASE_URL=
EPIC_REDIRECT_URI_PRODUCTION=app-soin-plaie://oauth/callback
EPIC_SCOPES_PRODUCTION=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access

# CONFIGURATION
EPIC_MODE=sandbox
EPIC_FHIR_VERSION=R4
EPIC_SMART_VERSION=v2

# PKCE
EPIC_PKCE_METHOD=S256
EPIC_PKCE_VERIFIER_LENGTH=128

# APP
APP_NAME=App Soin Plaie
APP_VERSION=1.0.0
```

---

## 🔒 Sécurité

### ⚠️ IMPORTANT

1. **NE JAMAIS** commiter le fichier `.env` sur Git
2. **NE JAMAIS** partager votre Client ID publiquement
3. **VÉRIFIER** que `.env` est dans `.gitignore`
4. Utiliser des valeurs différentes pour sandbox et production

### Vérification .gitignore

Votre `.gitignore` doit contenir :
```
.env
.env*.local
```

---

## 📦 Installation Package pour Expo

Pour utiliser les variables d'environnement dans Expo, installez :

```bash
npm install react-native-dotenv
# ou
yarn add react-native-dotenv
```

Puis configurez `babel.config.js` :

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ],
  };
};
```

---

## ✅ Checklist

- [ ] Fichier `.env` créé à la racine du projet
- [ ] `.env` ajouté au `.gitignore`
- [ ] `EPIC_CLIENT_ID_SANDBOX` rempli avec votre Client ID
- [ ] `EPIC_REDIRECT_URI_SANDBOX` correspond à celui dans Epic
- [ ] `EPIC_SCOPES_SANDBOX` correspond à ceux dans Epic
- [ ] Package `react-native-dotenv` installé (optionnel)
- [ ] `babel.config.js` configuré (si utilisation dotenv)

---

*Guide créé le : Janvier 2025*




