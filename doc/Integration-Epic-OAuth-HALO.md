# Guide d'Intégration Epic OAuth 2.0 / HALO

**Date** : Janvier 2025  
**Objectif** : Guide pratique pour intégrer l'App Soin Plaie avec Epic via OAuth 2.0 et HALO

---

## 📋 Vue d'Ensemble

Epic supporte OAuth 2.0 et SMART on FHIR, ce qui permet à notre application de :
1. S'authentifier via Epic (sans besoin d'OIIQ)
2. Récupérer le contexte patient automatiquement
3. Accéder aux données FHIR du patient
4. Envoyer des évaluations vers Epic

**Important** : Epic utilise les standards **SMART on FHIR** qui sont compatibles avec **HALO** et les normes pancanadiennes (RDP-CA, CA Core+).

---

## 🔑 Concepts Clés

### Types d'Applications Epic

1. **EHR Launch (SMART on FHIR)** : ✅ **RECOMMANDÉ pour notre app**
   - L'app se lance depuis Epic (MyChart ou Hyperspace)
   - Contexte patient automatique
   - Authentification via Epic

2. **Standalone Launch** : Pour lancer l'app indépendamment
   - Utile pour tests et développement
   - Nécessite authentification utilisateur

3. **Backend Services** : Pour intégrations serveur-à-serveur
   - Pas d'interface utilisateur
   - Authentification par JWT

### Types de Clients

- **Non-confidential Client** : App mobile native (notre cas) - utilise PKCE
- **Confidential Client** : App web backend avec secret client
- **Backend Services** : Service sans UI

---

## 🚀 Processus d'Intégration : Étapes Détaillées

### Phase 1 : Enregistrement de l'Application

#### 1.1 Créer le Compte Epic on FHIR

1. Aller sur : https://fhir.epic.com/
2. Créer un compte développeur
3. Enregistrer l'application

#### 1.2 Informations Requises pour l'Enregistrement

**Informations de base** :
- Nom de l'application : "App Soin Plaie"
- Description
- Type d'utilisateur : **Provider/User workflows** (professionnels de santé)

**Configuration OAuth 2.0** :
- ✅ Cocher "Uses OAuth 2.0"
- ✅ Sélectionner "EHR Launch" (SMART on FHIR)
- ✅ Sélectionner "Standalone Launch" (pour tests)

**Redirect URIs** :
```
https://app-soin-plaie.com/oauth/callback
```

**Important pour React Native** :
- Pour les apps natives : Utiliser **PKCE** (recommandé par Epic depuis août 2019)
- OU utiliser Universal Links (iOS) / App Links (Android)
- ❌ NE PAS utiliser localhost en production

**Scopes Demandés** :
```
launch
openid
fhirUser
patient/Patient.read
patient/Observation.read
patient/Observation.write
patient/Condition.read
patient/AllergyIntolerance.read
patient/MedicationStatement.read
offline_access
```

**SMART Scope Version** :
- Pour février 2026 : Sélectionner **SMART v2** (supporté depuis août 2024)
- Compatible avec les normes canadiennes

#### 1.3 Réception des Identifiants

Après enregistrement, Epic fournit :
- ✅ **client_id** : Identifiant unique de l'application
- ✅ **client_id (non-production)** : Pour le sandbox
- ✅ Base URL sandbox : `https://fhir.epic.com/interconnect-fhir-oauth/`

---

### Phase 2 : Implémentation Technique

#### 2.1 Structure du Module d'Intégration

```
src/integration/epic/
├── EpicSMARTClient.js      # Client SMART on FHIR pour Epic
├── EpicAuthService.js      # Service d'authentification OAuth
├── EpicPKCEService.js      # Gestion PKCE pour app native
├── EpicFHIRService.js      # Appels API FHIR
├── EpicRDPService.js       # Récupération RDP-CA depuis Epic
└── EpicContextHandler.js   # Gestion du contexte patient/practitioner
```

#### 2.2 Dépendances à Ajouter

```json
{
  "dependencies": {
    "fhirclient": "^2.5.0",
    "react-native-app-auth": "^6.4.0",
    "react-native-keychain": "^8.2.0",
    "crypto-js": "^4.2.0"
  }
}
```

#### 2.3 Implémentation EHR Launch (SMART on FHIR)

**Workflow** :

```
1. Epic lance l'app avec launch token
   ↓
2. App échange launch token → authorization code
   ↓
3. App échange authorization code → access token
   ↓
4. App reçoit contexte patient + access token
   ↓
5. App fait des requêtes FHIR avec access token
```

**Code d'exemple** :

```javascript
// src/integration/epic/EpicSMARTClient.js

import * as fhirClient from 'fhirclient';

class EpicSMARTClient {
  constructor() {
    this.clientId = process.env.EPIC_CLIENT_ID;
    this.clientIdNonProd = process.env.EPIC_CLIENT_ID_NON_PROD;
    this.redirectUri = 'app-soin-plaie://oauth/callback';
    this.scope = 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write offline_access';
  }

  /**
   * Détecte si l'app est lancée depuis Epic (EHR Launch)
   */
  async detectEpicLaunch() {
    // Epic ajoute ?launch=xxx&iss=https://... dans l'URL
    const launchParams = await this.getLaunchParams();
    return !!launchParams.launch && !!launchParams.iss;
  }

  /**
   * Récupère les paramètres de lancement depuis Epic
   */
  async getLaunchParams() {
    // Dans React Native, cela peut venir d'un Deep Link
    // ou d'une URL de callback
    const deepLink = await this.getDeepLink();
    
    if (deepLink) {
      const params = new URLSearchParams(deepLink.split('?')[1]);
      return {
        launch: params.get('launch'),
        iss: params.get('iss')
      };
    }
    return null;
  }

  /**
   * Étape 1 : Récupère la configuration SMART depuis Epic
   */
  async getSMARTConfiguration(iss) {
    try {
      // Option 1 : SMART Configuration (recommandé pour R4)
      const response = await fetch(`${iss}/.well-known/smart-configuration`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // Option 2 : Metadata endpoint (fallback)
      const metadataResponse = await fetch(`${iss}/metadata`, {
        headers: {
          'Accept': 'application/fhir+json'
        }
      });
      
      const metadata = await metadataResponse.json();
      return this.extractSMARTConfigFromMetadata(metadata);
      
    } catch (error) {
      console.error('Erreur récupération config SMART:', error);
      throw error;
    }
  }

  /**
   * Étape 2 : Lance le flow OAuth 2.0 avec PKCE
   */
  async launchOAuthFlow(launchToken, iss, smartConfig) {
    // Générer PKCE pour sécurité (requis pour apps natives)
    const pkce = await this.generatePKCE();
    
    // Générer state pour sécurité
    const state = this.generateState();
    
    // Construire URL d'autorisation
    const authUrl = this.buildAuthorizationUrl({
      authorizeEndpoint: smartConfig.authorization_endpoint,
      launchToken,
      iss,
      pkce,
      state
    });
    
    // Ouvrir le navigateur pour authentification
    // Dans React Native, utiliser Linking ou react-native-app-auth
    return { authUrl, pkce, state };
  }

  /**
   * Étape 3 : Échange authorization code → access token
   */
  async exchangeCodeForToken(authorizationCode, codeVerifier, redirectUri, state, tokenEndpoint) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier // PKCE
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`Erreur échange token: ${response.status}`);
    }

    const tokenData = await response.json();
    
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      patientId: tokenData.patient,
      encounterId: tokenData.encounter,
      practitionerId: this.extractPractitionerFromIdToken(tokenData.id_token),
      scope: tokenData.scope
    };
  }

  /**
   * Génère PKCE (Proof Key for Code Exchange)
   */
  async generatePKCE() {
    // Code verifier : chaîne aléatoire de 43-128 caractères
    const codeVerifier = this.generateRandomString(128);
    
    // Code challenge : SHA256 hash du verifier, encodé en base64url
    const codeChallenge = await this.sha256Base64Url(codeVerifier);
    
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256'
    };
  }

  /**
   * Construit l'URL d'autorisation
   */
  buildAuthorizationUrl({ authorizeEndpoint, launchToken, iss, pkce, state }) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      launch: launchToken, // Requis pour EHR Launch
      state: state,
      aud: iss, // Requis depuis mai 2023
      code_challenge: pkce.codeChallenge,
      code_challenge_method: pkce.codeChallengeMethod
    });

    return `${authorizeEndpoint}?${params.toString()}`;
  }
}

export default EpicSMARTClient;
```

#### 2.4 Gestion du Contexte Patient

```javascript
// src/integration/epic/EpicContextHandler.js

class EpicContextHandler {
  constructor(accessToken, fhirServerBase) {
    this.accessToken = accessToken;
    this.fhirServerBase = fhirServerBase;
  }

  /**
   * Récupère les données patient depuis Epic
   */
  async getPatientData(patientId) {
    const response = await fetch(
      `${this.fhirServerBase}/Patient/${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur récupération patient: ${response.status}`);
    }

    const patient = await response.json();
    
    return {
      id: patient.id,
      name: this.extractName(patient.name),
      birthDate: patient.birthDate,
      gender: patient.gender,
      identifier: patient.identifier
    };
  }

  /**
   * Récupère le RDP-CA (Patient Summary) depuis Epic
   */
  async getPatientSummary(patientId) {
    // Epic peut fournir un Patient Summary conforme IPS/RDP-CA
    const response = await fetch(
      `${this.fhirServerBase}/Patient/${patientId}/$summary`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    if (!response.ok) {
      // Fallback : construire le résumé manuellement
      return await this.buildPatientSummary(patientId);
    }

    const bundle = await response.json();
    return this.parseRDPSummary(bundle);
  }

  /**
   * Construit un résumé patient depuis les ressources FHIR
   */
  async buildPatientSummary(patientId) {
    const [patient, allergies, conditions, medications] = await Promise.all([
      this.getPatientData(patientId),
      this.getAllergies(patientId),
      this.getConditions(patientId),
      this.getMedications(patientId)
    ]);

    return {
      patient,
      allergies,
      conditions,
      medications
    };
  }

  /**
   * Récupère les allergies
   */
  async getAllergies(patientId) {
    const response = await fetch(
      `${this.fhirServerBase}/AllergyIntolerance?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    const bundle = await response.json();
    return bundle.entry?.map(e => e.resource) || [];
  }

  /**
   * Récupère les conditions de santé
   */
  async getConditions(patientId) {
    const response = await fetch(
      `${this.fhirServerBase}/Condition?patient=${patientId}&clinical-status=active`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    const bundle = await response.json();
    return bundle.entry?.map(e => e.resource) || [];
  }

  /**
   * Récupère les médicaments actifs
   */
  async getMedications(patientId) {
    const response = await fetch(
      `${this.fhirServerBase}/MedicationStatement?patient=${patientId}&status=active`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/fhir+json'
        }
      }
    );

    const bundle = await response.json();
    return bundle.entry?.map(e => e.resource) || [];
  }
}
```

#### 2.5 Pré-remplissage de l'Évaluation

```javascript
// src/integration/epic/EpicDataMapper.js

class EpicDataMapper {
  /**
   * Mappe les données Epic → Format de l'app
   */
  mapPatientDataToEvaluation(epicPatientSummary) {
    const mapping = {
      // C1T01 - Données de base
      'C1T01E01': epicPatientSummary.patient.birthDate,
      
      // C1T02 - Allergies
      'C1T02': this.mapAllergies(epicPatientSummary.allergies),
      
      // C1T03 - Conditions de santé
      'C1T03': this.mapConditions(epicPatientSummary.conditions),
      
      // C1T07 - Médications actives
      'C1T07': this.mapMedications(epicPatientSummary.medications)
    };

    return mapping;
  }

  mapAllergies(allergies) {
    return allergies.map(allergy => ({
      id: allergy.id,
      substance: this.getDisplay(allergy.code),
      severity: allergy.severity,
      type: allergy.type
    }));
  }

  mapConditions(conditions) {
    // Mapper vers les codes de notre app
    const conditionMap = {
      'diabetes-type-1': 'diabetes_type1',
      'diabetes-type-2': 'diabetes_type2',
      'cancer': 'active_cancer',
      // ... autres mappings
    };

    return conditions
      .map(cond => this.getDisplay(cond.code))
      .filter(code => conditionMap[code])
      .map(code => conditionMap[code]);
  }

  mapMedications(medications) {
    return medications.map(med => ({
      id: med.id,
      name: this.getDisplay(med.medicationCodeableConcept),
      dosage: med.dosage?.[0]?.text,
      status: med.status
    }));
  }

  getDisplay(codeableConcept) {
    return codeableConcept?.coding?.[0]?.display || 
           codeableConcept?.text || 
           codeableConcept;
  }
}
```

#### 2.6 Envoi d'Évaluation vers Epic

```javascript
// src/integration/epic/EpicFHIRService.js

class EpicFHIRService {
  constructor(accessToken, fhirServerBase) {
    this.accessToken = accessToken;
    this.fhirServerBase = fhirServerBase;
  }

  /**
   * Envoie une évaluation complète vers Epic
   */
  async sendEvaluation(evaluationData, patientId) {
    // Convertir l'évaluation en ressources FHIR
    const observations = this.createObservationResources(evaluationData, patientId);
    
    // Créer un DocumentReference pour le document complet
    const documentReference = this.createDocumentReference(evaluationData, patientId);
    
    // Option 1 : Envoyer comme Bundle RDP-CA
    const bundle = this.createRDPSummaryBundle({
      patientId,
      observations,
      documentReference
    });

    return await this.sendBundle(bundle);
  }

  /**
   * Crée des ressources Observation FHIR
   */
  createObservationResources(evaluationData, patientId) {
    const observations = [];

    // Exemple : Score Braden
    if (evaluationData.bradenScore) {
      observations.push({
        resourceType: 'Observation',
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'assessment',
            display: 'Assessment'
          }]
        }],
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '...', // Code LOINC pour Braden
            display: 'Braden Scale Score'
          }]
        },
        subject: {
          reference: `Patient/${patientId}`
        },
        effectiveDateTime: new Date().toISOString(),
        valueInteger: evaluationData.bradenScore.totalScore
      });
    }

    // Ajouter d'autres observations (BWAT, etc.)
    
    return observations;
  }

  /**
   * Envoie un Bundle FHIR vers Epic
   */
  async sendBundle(bundle) {
    const response = await fetch(
      `${this.fhirServerBase}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        },
        body: JSON.stringify(bundle)
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur envoi bundle: ${response.status}`);
    }

    return await response.json();
  }
}
```

---

## 🔒 Sécurité et Authentification

### PKCE (Proof Key for Code Exchange)

**OBLIGATOIRE** pour les apps natives mobiles selon Epic (depuis août 2019).

**Avantages** :
- Protection contre interception du code d'autorisation
- Pas besoin de client secret (sécurisé pour apps mobiles)
- Standard OAuth 2.0

**Implémentation** :

```javascript
// Génération PKCE
async generatePKCE() {
  // 1. Code Verifier : 43-128 caractères aléatoires
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  
  // 2. Code Challenge : SHA256 du verifier, encodé base64url
  const codeChallenge = base64URLEncode(
    await crypto.subtle.digest('SHA-256', codeVerifier)
  );
  
  return { codeVerifier, codeChallenge, method: 'S256' };
}
```

### Gestion des Tokens

```javascript
// Stockage sécurisé des tokens
import * as SecureStore from 'expo-secure-store';

async storeTokens(tokens) {
  await SecureStore.setItemAsync('epic_access_token', tokens.accessToken);
  await SecureStore.setItemAsync('epic_refresh_token', tokens.refreshToken);
  await SecureStore.setItemAsync('epic_expires_at', 
    (Date.now() + tokens.expiresIn * 1000).toString()
  );
}

async refreshAccessToken(refreshToken) {
  // Utiliser le refresh token pour obtenir un nouvel access token
  // Epic supporte les refresh tokens pour accès offline
}
```

---

## 🧪 Tests avec Epic Sandbox

### Configuration Sandbox

**URL Sandbox** : `https://fhir.epic.com/interconnect-fhir-oauth/`

**Identifiants de Test** :
- Disponibles sur le site Epic on FHIR
- Permettent de tester sans organisation réelle

### Scénarios de Test

1. **Test EHR Launch** :
   - Utiliser le SMART App Launchpad d'Epic
   - Tester le lancement depuis Epic
   - Valider la récupération du contexte patient

2. **Test Récupération RDP-CA** :
   - Récupérer Patient Summary
   - Valider le format des données
   - Tester le pré-remplissage

3. **Test Envoi d'Évaluation** :
   - Créer une évaluation complète
   - Envoyer vers Epic
   - Valider la réception dans Epic

---

## 📅 Timeline et Dates Importantes Epic

### Changements de Sécurité OAuth 2.0

| Date | Changement |
|------|------------|
| **Février 2025** | JKU (JWK Set URL) optionnel pour backend OAuth |
| **Août 2025** | Sandbox : Plus de clés statiques pour nouvelles apps backend |
| **Novembre 2025** | Sandbox : Clés statiques non supportées pour backend OAuth |
| **Février 2026** | Production : Clés statiques non supportées pour backend OAuth |

**Impact** : Notre app mobile n'est pas affectée (pas de backend OAuth), mais à noter pour futures évolutions.

### Versions SMART

- **SMART v2** : Supporté depuis août 2024 ✅
- **Recommandé** : Utiliser SMART v2 pour nouvelles apps
- **Compatible** : Rétrocompatible avec SMART v1

---

## ✅ Checklist d'Implémentation

### Avant le Projetathon 2026

- [ ] Enregistrer l'app sur Epic on FHIR
- [ ] Obtenir client_id (production et non-production)
- [ ] Implémenter PKCE pour app native
- [ ] Implémenter EHR Launch flow
- [ ] Implémenter récupération contexte patient
- [ ] Implémenter récupération RDP-CA
- [ ] Implémenter pré-remplissage évaluation
- [ ] Implémenter envoi évaluation vers Epic
- [ ] Tester avec Epic Sandbox
- [ ] Valider conformité RDP-CA v2.1.1
- [ ] Documenter les mappings FHIR

### Pour le Projetathon

- [ ] Tester avec serveur Epic de test
- [ ] Valider les 5 scénarios HALO
- [ ] Documenter les cas de test
- [ ] Préparer démonstration

---

## 🔗 Ressources

### Documentation Epic

- **Epic on FHIR** : https://fhir.epic.com/
- **OAuth 2.0 Guide** : https://fhir.epic.com/Documentation?docId=oauth2
- **SMART on FHIR** : Documentation Epic
- **Sandbox** : https://fhir.epic.com/interconnect-fhir-oauth/

### Standards

- **SMART App Launch** : http://hl7.org/fhir/smart-app-launch/
- **OAuth 2.0** : RFC 6749
- **PKCE** : RFC 7636
- **HALO** : https://simplifier.net/guide/halo/

---

## 🎯 Conclusion

**L'intégration avec Epic via OAuth 2.0 est compatible avec HALO et les normes pancanadiennes** car :

1. ✅ Epic supporte SMART on FHIR (base de HALO)
2. ✅ Epic supporte FHIR R4 (base de RDP-CA)
3. ✅ Epic supporte les Patient Summary (base de RDP-CA)
4. ✅ Epic recommande PKCE pour apps natives (sécurité)
5. ✅ Epic supporte les scopes SMART v2

**Notre approche** :
- Utiliser **EHR Launch** pour l'intégration principale
- Utiliser **PKCE** pour la sécurité
- Utiliser **standards FHIR** (pas d'extensions propriétaires)
- Mapper les données Epic vers notre format interne
- Générer des ressources FHIR conformes RDP-CA pour l'envoi

**Prochaines étapes** :
1. Enregistrer l'app sur Epic on FHIR
2. Implémenter le module d'intégration
3. Tester avec Epic Sandbox
4. Valider au Projetathon 2026

---

*Document créé le : Janvier 2025*  
*Dernière mise à jour : Janvier 2025*

