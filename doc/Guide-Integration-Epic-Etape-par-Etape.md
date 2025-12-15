# Guide d'Intégration Epic - Étape par Étape

**Date** : Janvier 2025  
**Pour** : App Soin Plaie  
**Objectif** : Créer l'application Epic et l'intégrer dans le code

---

## 📋 Table des Matières

1. [Création de l'Application Epic](#1-création-de-lapplication-epic)
2. [Configuration de l'Application](#2-configuration-de-lapplication)
3. [Récupération des Identifiants](#3-récupération-des-identifiants)
4. [Configuration du Projet Local](#4-configuration-du-projet-local)
5. [Installation des Dépendances](#5-installation-des-dépendances)
6. [Création du Module d'Intégration](#6-création-du-module-dintégration)
7. [Intégration dans l'Application](#7-intégration-dans-lapplication)
8. [Tests et Validation](#8-tests-et-validation)

---

## 1. Création de l'Application Epic

### Étape 1.1 : Accéder au Formulaire de Création

1. Connectez-vous à https://fhir.epic.com/
2. Cliquez sur **"Create My First App"** ou **"Apps"** → **"Create New App"**

### Étape 1.2 : Informations de Base

**Remplissez le formulaire avec ces informations** :

```
App Name (Nom de l'application) :
└─ App Soin Plaie

App ID (ID de l'application) :
└─ app-soin-plaie (ou laissez Epic le générer automatiquement)

Description :
└─ Application mobile d'aide à la décision clinique pour les soins de plaies.
   Permet l'évaluation complète des plaies et l'intégration avec le DME via HALO/SMART on FHIR.

Category :
└─ Clinical (Clinique)
```

**✅ Cochez ces cases** :
- ✅ Uses OAuth 2.0
- ✅ Backend Systems (si nécessaire pour backend OAuth)

**❌ NE PAS cocher** (pour l'instant) :
- ❌ Backend Systems (si vous ne faites que de l'EHR Launch)
- ❌ Uses Subspace

### Étape 1.3 : User Type (Type d'Utilisateur)

**Sélectionnez** :
- ✅ **Provider/User workflows** (Recommandé pour professionnels de santé)

**Alternative** (si patient-facing) :
- Patient workflows (pour applications patient)

### Étape 1.4 : SMART on FHIR Version

**Sélectionnez** :
- ✅ **R4** (Recommandé - compatible avec HALO et normes pancanadiennes)

### Étape 1.5 : SMART Scope Version

**Sélectionnez** :
- ✅ **SMART v2** (Disponible depuis août 2024)
  - Compatible avec les dernières spécifications
  - Plus flexible que SMART v1

### Étape 1.6 : Launch Type (Type de Lancement)

**Cochez** :
- ✅ **EHR Launch (Embedded)** (Recommandé - lancement depuis Epic)
- ✅ **Standalone Launch** (Utile pour tests et développement)

### Étape 1.7 : Redirect URIs

**Pour React Native / Expo** :

```
Non-Production Redirect URIs :
└─ app-soin-plaie://oauth/callback
└─ exp://127.0.0.1:8081/--/oauth/callback  (pour développement local Expo)
└─ https://app-soin-plaie.dev/oauth/callback  (si vous avez un serveur de test)

Production Redirect URIs :
└─ app-soin-plaie://oauth/callback
└─ https://app-soin-plaie.com/oauth/callback
```

**Important** :
- ❌ **NE PAS utiliser localhost** en production
- ✅ Utiliser un schéma d'URL personnalisé (`app-soin-plaie://`)
- ✅ OU utiliser Universal Links (iOS) / App Links (Android)
- ✅ Pour Expo : `exp://` fonctionne en développement

### Étape 1.8 : Scopes (Autorisations)

**Scopes à demander** :

```
Base scopes :
✅ launch
✅ openid
✅ fhirUser
✅ offline_access

Patient data scopes :
✅ patient/Patient.read
✅ patient/Patient.search
✅ patient/Observation.read
✅ patient/Observation.write
✅ patient/Condition.read
✅ patient/Condition.search
✅ patient/AllergyIntolerance.read
✅ patient/AllergyIntolerance.search
✅ patient/MedicationStatement.read
✅ patient/MedicationStatement.search

Practitioner scopes (si nécessaire) :
✅ user/Practitioner.read
✅ user/PractitionerRole.read
```

**Format SMART v2** :
- Si vous avez sélectionné SMART v2, les scopes seront au format : `patient/Observation.c` (create), `patient/Observation.r` (read), etc.
- Epic supporte les deux formats (v1 et v2)

### Étape 1.9 : Incoming APIs (APIs Entrantes)

**Sélectionnez les APIs FHIR que votre app utilisera** :

```
FHIR Resources :
✅ Patient
✅ Observation
✅ Condition
✅ AllergyIntolerance
✅ MedicationStatement
✅ Encounter (si nécessaire)
✅ Location (si nécessaire)
```

### Étape 1.10 : Soumettre l'Application

1. Cliquez sur **"Save"** ou **"Create App"**
2. **Notez** : Epic peut prendre quelques minutes pour créer l'application
3. Vous serez redirigé vers la page de l'application

---

## 2. Configuration de l'Application

### Étape 2.1 : Notez les Identifiants

Après la création, Epic vous fournit :

```
✅ Client ID (Production) : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
✅ Client ID (Non-Production) : yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

**⚠️ IMPORTANT** : Sauvegardez ces identifiants dans un endroit sécurisé !

### Étape 2.2 : Vérifier les Paramètres

Retournez sur la page de votre application et vérifiez :

1. **OAuth 2.0** : ✅ Activé
2. **Launch Types** : ✅ EHR Launch + Standalone Launch
3. **Redirect URIs** : ✅ Tous présents
4. **Scopes** : ✅ Tous présents

### Étape 2.3 : Tester dans le Sandbox

1. Cliquez sur **"Test in Sandbox"** ou accédez à :
   - https://fhir.epic.com/interconnect-fhir-oauth/
2. Utilisez votre **Client ID (Non-Production)**

---

## 3. Récupération des Identifiants

### Étape 3.1 : Collecter les Informations

Vous aurez besoin de ces informations pour le code :

```javascript
// À noter depuis Epic on FHIR
const EPIC_CONFIG = {
  // Sandbox (Non-Production)
  sandbox: {
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Client ID (Non-Production)
    baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth',
    redirectUri: 'app-soin-plaie://oauth/callback',
    scope: 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access'
  },
  
  // Production (à remplir quand disponible)
  production: {
    clientId: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', // Client ID (Production)
    baseUrl: 'https://[ORG].epic.com/interconnect-fhir-oauth', // Sera fourni par l'organisation
    redirectUri: 'app-soin-plaie://oauth/callback',
    scope: 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access'
  }
};
```

---

## 4. Configuration du Projet Local

### Étape 4.1 : Créer le Fichier de Configuration

Créez un fichier pour stocker les configurations Epic :

```bash
# Dans le terminal, depuis la racine du projet
mkdir -p app-soin-plaie/src/config
touch app-soin-plaie/src/config/epic.js
```

### Étape 4.2 : Créer le Fichier de Configuration Epic

```javascript
// src/config/epic.js

/**
 * Configuration Epic OAuth 2.0 / SMART on FHIR
 * 
 * ⚠️ ATTENTION : Ne pas commiter les Client IDs en production !
 * Utiliser des variables d'environnement pour la production.
 */

const EPIC_CONFIG = {
  // Mode : 'sandbox' ou 'production'
  mode: __DEV__ ? 'sandbox' : 'production',
  
  sandbox: {
    clientId: 'VOTRE_CLIENT_ID_NON_PRODUCTION', // À remplacer
    baseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth',
    redirectUri: 'app-soin-plaie://oauth/callback',
    scope: 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access',
    issuer: 'https://fhir.epic.com/interconnect-fhir-oauth',
  },
  
  production: {
    // Ces valeurs seront fournies par chaque organisation Epic
    clientId: null, // À configurer par organisation
    baseUrl: null, // À configurer par organisation
    redirectUri: 'app-soin-plaie://oauth/callback',
    scope: 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access',
    issuer: null, // À configurer par organisation
  },
  
  // Configuration PKCE (toujours utilisé pour apps natives)
  pkce: {
    codeChallengeMethod: 'S256',
    codeVerifierLength: 128,
  },
};

export default EPIC_CONFIG;

/**
 * Obtenir la configuration active
 */
export const getEpicConfig = () => {
  return EPIC_CONFIG[EPIC_CONFIG.mode];
};

/**
 * Obtenir l'URL de base FHIR
 */
export const getFhirBaseUrl = (iss) => {
  // Epic fournit l'iss (issuer) dans le paramètre de lancement
  // Format : https://[org].epic.com/interconnect-fhir-oauth/api/FHIR/R4
  if (iss) {
    return iss;
  }
  const config = getEpicConfig();
  return `${config.baseUrl}/api/FHIR/R4`;
};

/**
 * Obtenir l'URL du serveur d'autorisation
 */
export const getAuthServerUrl = (iss) => {
  if (iss) {
    // Extraire le serveur d'autorisation depuis iss
    return iss.replace('/api/FHIR/R4', '').replace('/api/FHIR/R4', '');
  }
  const config = getEpicConfig();
  return config.baseUrl;
};
```

### Étape 4.3 : Créer un Fichier .env (Optionnel mais Recommandé)

```bash
# Créer .env
touch app-soin-plaie/.env
```

```env
# .env (NE PAS COMMITER)

# Epic Configuration
EPIC_CLIENT_ID_SANDBOX=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
EPIC_CLIENT_ID_PRODUCTION=

# Epic Base URLs
EPIC_SANDBOX_URL=https://fhir.epic.com/interconnect-fhir-oauth
EPIC_REDIRECT_URI=app-soin-plaie://oauth/callback
```

**Ajoutez `.env` au `.gitignore`** :

```bash
echo ".env" >> .gitignore
```

---

## 5. Installation des Dépendances

### Étape 5.1 : Installer les Packages NPM

```bash
cd app-soin-plaie
npm install fhirclient react-native-app-auth react-native-keychain
npm install --save-dev @types/crypto-js
```

**Ou avec yarn** :
```bash
yarn add fhirclient react-native-app-auth react-native-keychain
yarn add -D @types/crypto-js
```

### Étape 5.2 : Packages pour React Native / Expo

**Pour Expo** :
```bash
npx expo install expo-crypto expo-linking expo-secure-store
```

**Pour React Native pur** :
```bash
npm install react-native-crypto react-native-randombytes
# Configuration native nécessaire
```

### Étape 5.3 : Configuration Expo (si applicable)

Ajoutez dans `app.json` :

```json
{
  "expo": {
    "scheme": "app-soin-plaie",
    "ios": {
      "associatedDomains": ["applinks:app-soin-plaie.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "app-soin-plaie"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## 6. Création du Module d'Intégration

### Étape 6.1 : Structure des Dossiers

Créez la structure suivante :

```bash
mkdir -p src/integration/epic
mkdir -p src/integration/epic/utils
mkdir -p src/integration/epic/services
mkdir -p src/integration/epic/mappers
```

### Étape 6.2 : Créer le Client SMART Principal

```bash
touch src/integration/epic/EpicSMARTClient.js
```

### Étape 6.3 : Créer les Services

```bash
touch src/integration/epic/services/EpicAuthService.js
touch src/integration/epic/services/EpicPKCEService.js
touch src/integration/epic/services/EpicFHIRService.js
touch src/integration/epic/services/EpicRDPService.js
touch src/integration/epic/mappers/EpicDataMapper.js
touch src/integration/epic/utils/epicHelpers.js
```

---

## 7. Intégration dans l'Application

### Étape 7.1 : Créer le Hook d'Authentification

```bash
touch src/hooks/useEpicAuth.js
```

### Étape 7.2 : Créer le Composant de Connexion

```bash
touch src/components/epic/EpicConnectionButton.jsx
touch src/components/epic/EpicConnectionStatus.jsx
```

### Étape 7.3 : Modifier le Storage pour Support Multi-Patient

Mettez à jour `src/storage/evaluationLocalStorage.js` pour ajouter le support patient Epic.

---

## 8. Checklist Complète

### Phase 1 : Configuration Epic ✅

- [ ] Compte Epic on FHIR créé
- [ ] Application créée sur Epic on FHIR
- [ ] Client ID (Non-Production) noté
- [ ] Redirect URIs configurés
- [ ] Scopes configurés
- [ ] Launch Types configurés (EHR + Standalone)
- [ ] Application testée dans le sandbox

### Phase 2 : Configuration Locale ✅

- [ ] Fichier `src/config/epic.js` créé
- [ ] Client ID ajouté dans la configuration
- [ ] Fichier `.env` créé (optionnel)
- [ ] `.env` ajouté au `.gitignore`

### Phase 3 : Dépendances ✅

- [ ] `fhirclient` installé
- [ ] `react-native-app-auth` installé (ou alternative)
- [ ] `react-native-keychain` installé
- [ ] Packages Expo installés (si applicable)
- [ ] `app.json` configuré avec scheme

### Phase 4 : Développement ✅

- [ ] Structure de dossiers créée
- [ ] Module d'intégration créé
- [ ] Services créés
- [ ] Hooks créés
- [ ] Composants UI créés

### Phase 5 : Tests ✅

- [ ] Test EHR Launch dans sandbox
- [ ] Test Standalone Launch
- [ ] Test récupération contexte patient
- [ ] Test récupération RDP-CA
- [ ] Test pré-remplissage évaluation
- [ ] Test envoi évaluation vers Epic

---

## 📝 Notes Importantes

### Sécurité

1. **Ne jamais commiter les Client IDs** en production
2. Utiliser des variables d'environnement
3. Stocker les tokens de manière sécurisée (expo-secure-store)
4. Utiliser PKCE pour toutes les authentifications natives

### Développement

1. Commencer avec le **sandbox** Epic
2. Tester tous les scénarios avant la production
3. Documenter les mappings FHIR
4. Préparer les tests pour le Projetathon 2026

### Production

1. Chaque organisation Epic aura ses propres URLs
2. Demander les informations de connexion à chaque organisation
3. Tester avec chaque organisation avant déploiement

---

## 🔗 Ressources Utiles

### Documentation Epic

- **Epic on FHIR** : https://fhir.epic.com/
- **OAuth 2.0 Guide** : Disponible sur votre compte Epic
- **SMART App Launchpad** : Pour tester dans le sandbox

### Documentation Standards

- **SMART on FHIR** : http://hl7.org/fhir/smart-app-launch/
- **HALO** : https://simplifier.net/guide/halo/

---

## ✅ Prochaines Étapes

Une fois que vous avez créé l'application Epic et noté les identifiants :

1. **Dites-moi** :
   - ✅ Votre Client ID (Non-Production)
   - ✅ Les Redirect URIs que vous avez configurés
   - ✅ Les Scopes que vous avez sélectionnés

2. **Je créerai** :
   - Les fichiers de code complets pour l'intégration
   - Les services Epic
   - Les composants UI
   - Les hooks d'authentification

3. **Ensuite** :
   - Tests dans le sandbox
   - Préparation pour le Projetathon 2026

---

*Guide créé le : Janvier 2025*  
*Dernière mise à jour : Janvier 2025*

