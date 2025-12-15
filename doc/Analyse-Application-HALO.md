# Analyse de l'Application et Intégration HALO

**Date** : Janvier 2025  
**Objectif** : Analyser l'état actuel de l'application et les possibilités d'intégration HALO pour le dossier patient

---

## 🔍 Compréhension de l'Application Actuelle

### Architecture Générale

L'application **App Soin Plaie** est une application mobile React Native/Expo conçue pour les professionnels de santé qui travaillent avec des soins de plaies. Elle suit une architecture **offline-first** avec stockage local sécurisé.

### 1. **Système d'Évaluation Clinique**

L'application contient un système d'évaluation clinique modulaire et structuré :

#### Structure des Données
- **34 tables d'évaluation** organisées en colonnes (C1T01 à C1T34)
- Chaque table correspond à une étape d'évaluation spécifique :
  - **C1T01** : Données de base (date de naissance, démographie)
  - **C1T02** : Allergies
  - **C1T03** : Conditions de santé actuelle
  - **C1T04** : Poids & IMC
  - **C1T05** : Nutrition
  - **C1T06** : Facteurs de risque
  - **C1T07** : Médication active
  - **C1T09** : Assurances
  - **C1T11** : Histoire de la plaie
  - **C1T12** : Symptômes
  - **C1T14** : Emplacement de la plaie
  - **C1T16-C1T26** : Évaluations BWAT (Bates-Jensen Wound Assessment Tool)
  - **C1T29-C1T30** : Échelles de Braden (adultes/pédiatriques)
  - Etc.

#### Stockage Actuel
- **Local Storage** : `expo-secure-store` pour stocker les évaluations
- **Format** : JSON structuré avec métadonnées
- **Progression** : Sauvegarde automatique de la progression par table
- **Identification** : Système d'IDs canoniques `C{col}T{table}E{elem}`

#### Données Patient Collectées
L'application collecte actuellement :
- ✅ **Démographie** : Date de naissance, âge calculé
- ✅ **Allergies**
- ✅ **Conditions de santé** : Diabète, cancer, etc.
- ✅ **Données anthropométriques** : Poids, IMC
- ✅ **Nutrition**
- ✅ **Médications actives**
- ✅ **Assurances** (RAMQ, privée)
- ✅ **Niveau de soins** (A, B, C, D)
- ✅ **Évaluation de la plaie** : Localisation, taille, profondeur, etc.
- ✅ **Scores cliniques** : Braden, Braden-Q, BWAT

### 2. **Authentification Actuelle**

**Situation actuelle** (selon le mail de l'OIIQ) :
- ❌ **Pas d'authentification OIIQ** : L'application sera en libre accès
- 🔄 **Authentification future** : Via connexion DME (Dossier Médical Électronique)
- 📱 **Accès libre** : Aucune restriction d'accès pour l'instant

**Implications** :
- L'application fonctionne actuellement en mode "standalone"
- Pas de lien avec un système centralisé
- Pas de gestion d'utilisateurs
- Pas de synchronisation avec un dossier patient externe

### 3. **Points d'Intégration Potentiels**

#### A. **Données Patient** (C1T01 - Données de base)
Actuellement, les données patient sont saisies manuellement :
- Date de naissance
- (Probablement d'autres champs démographiques dans la table complète)

**Ce qui pourrait venir de HALO/RDP-CA** :
- Nom, prénom
- Date de naissance
- Sexe/genre
- Identifiant patient
- Numéro d'assurance maladie (RAMQ)

#### B. **Allergies** (C1T02)
**Ce qui pourrait venir de HALO/RDP-CA** :
- Liste des allergies/intolérances
- Types d'allergies (médicamenteuses, alimentaires, etc.)
- Gravité

#### C. **Conditions de santé** (C1T03)
**Ce qui pourrait venir de HALO/RDP-CA** :
- Problèmes de santé actifs
- Historique médical
- Comorbidités

#### D. **Médications actives** (C1T07)
**Ce qui pourrait venir de HALO/RDP-CA** :
- Liste des médicaments actuels
- Posologie
- Dates de début/fin

#### E. **Résultats d'évaluations**
**Ce qui pourrait être envoyé au DME via HALO** :
- Évaluation complète de la plaie
- Scores cliniques (Braden, BWAT)
- Plan de soins
- Photos de la plaie (si intégrées)

---

## 🎯 Intégration HALO : Ce Qu'On Peut Faire

### Vue d'Ensemble HALO

HALO (Health Application Launch Protocol) permet à une application tierce (comme la nôtre) de :
1. **Se connecter** à un DME depuis l'application
2. **Récupérer** des données patient (contexte SMART)
3. **Envoyer** des données d'évaluation vers le DME
4. **Lancer** l'application depuis le DME

### Cas d'Utilisation HALO pour Votre Application

#### **Cas d'Utilisation 1 : Lancement depuis le DME**

```
🏥 DME (Dossier Médical Électronique)
    ↓
📱 Lance l'App Soin Plaie via HALO
    ↓
🔐 Authentification SMART
    ↓
📊 Contexte patient chargé automatiquement
```

**Bénéfices** :
- Authentification automatique (via le DME)
- Contexte patient pré-rempli
- Traçabilité (qui a fait l'évaluation, pour quel patient)

#### **Cas d'Utilisation 2 : Récupération de Données Patient**

**Via RDP-CA (Résumé du Dossier du Patient - Canada)** :

1. **Données démographiques** → Pré-remplir C1T01
2. **Allergies** → Pré-remplir C1T02
3. **Conditions de santé** → Pré-remplir C1T03
4. **Médications** → Pré-remplir C1T07

**Format attendu** : FHIR R4 (CA Core+)

#### **Cas d'Utilisation 3 : Envoi d'Évaluations au DME**

**Après une évaluation complète** :

```
📱 App Soin Plaie termine l'évaluation
    ↓
📋 Génère un document FHIR (Observation, DocumentReference)
    ↓
🔄 Envoie au DME via CA:FeX (flux SoFA)
    ↓
✅ Document ajouté au dossier patient
```

**Format d'envoi** :
- **RDP-CA** : Pour les données structurées (allergies, conditions, médications)
- **CA:FeX** : Pour l'échange de documents complets
- **FHIR Resources** : Observation, Condition, MedicationStatement, etc.

---

## 📋 Plan d'Intégration HALO : Étapes Concrètes

### Phase 1 : Préparation (Avant février 2026)

#### 1.1 Adapter le Stockage pour Support Multi-Patient
- ✅ Actuellement : Stockage local par évaluation (OK pour standalone)
- 🔄 À faire : Ajouter gestion patient (ID patient, lien DME)

**Modifications suggérées** :
```javascript
// Structure actuelle
evaluationId: "C1_20250115_001"

// Structure proposée avec HALO
evaluationId: "C1_20250115_001"
patientId: "FHIR_PATIENT_ID_12345"  // ID du patient dans le DME
dmeContext: {
  fhirServer: "https://dme.example.com/fhir",
  patientId: "12345",
  encounterId: "67890",  // Si lancé depuis une consultation
  practitionerId: "PRAC_001"  // ID du professionnel connecté
}
```

#### 1.2 Créer un Module d'Intégration HALO/SMART

**Nouveau module** : `src/integration/halo/`

```
src/integration/halo/
├── SMARTClient.js          # Client SMART on FHIR
├── RDPService.js           # Service RDP-CA
├── CAFeXService.js         # Service CA:FeX pour envoi
├── PatientMapper.js        # Mapping données FHIR → format app
└── HaloLauncher.js         # Gestion du lancement depuis DME
```

**Dépendances à ajouter** :
```json
{
  "fhirclient": "^2.5.0",
  "fhir-kit-client": "^3.0.0"  // Client FHIR pour React Native
}
```

#### 1.3 Mapper les Données Patient

**Table de correspondance** :

| Élément App | FHIR Resource | Mapping |
|------------|---------------|---------|
| C1T01E01 (Date naissance) | `Patient.birthDate` | Direct |
| C1T02 (Allergies) | `AllergyIntolerance` | Array → Liste |
| C1T03 (Conditions) | `Condition` | Array → Liste |
| C1T07 (Médications) | `MedicationStatement` | Array → Liste |
| C1T04 (Poids/IMC) | `Observation` (type: body-weight) | Direct |
| Évaluation complète | `DocumentReference` (RDP-CA) | Bundle FHIR |

### Phase 2 : Implémentation (Février 2026 - Tests Projetathon)

#### 2.1 Intégration SMART on FHIR

**Fonctionnalités à implémenter** :

1. **Lancement depuis DME**
   ```javascript
   // Détecter si lancé via HALO
   const context = await SMARTClient.getContext();
   if (context.patient) {
     // Charger données patient depuis DME
     await loadPatientData(context.patient);
   }
   ```

2. **Récupération RDP-CA**
   ```javascript
   // Récupérer le résumé patient
   const rdp = await RDPService.getPatientSummary(patientId);
   
   // Pré-remplir les tables d'évaluation
   prefillEvaluation({
     allergies: rdp.allergies,
     conditions: rdp.conditions,
     medications: rdp.medications,
     demographics: rdp.demographics
   });
   ```

3. **Envoi d'évaluations**
   ```javascript
   // Après complétion de l'évaluation
   const evaluationFHIR = await convertToFHIR(evaluationData);
   await CAFeXService.sendDocument(evaluationFHIR, patientId);
   ```

#### 2.2 Interface Utilisateur

**Modifications UI** :

1. **Bannière de connexion DME**
   - Si non connecté : "Mode standalone"
   - Si connecté : "Connecté à [Nom DME] - Patient: [Nom]"

2. **Bouton de connexion manuelle**
   - Pour tester avec différents DME
   - URL du serveur FHIR configurable

3. **Indicateurs de données pré-remplies**
   - Badge sur les champs pré-remplis depuis DME
   - Option "Recharger depuis DME"

### Phase 3 : Conformité RDP-CA

#### 3.1 Génération de Documents RDP-CA

**Format de sortie** : Bundle FHIR R4 conforme RDP-CA v2.1.1

```javascript
// Structure d'un document RDP-CA généré
{
  resourceType: "Bundle",
  type: "document",
  entry: [
    { resource: patientResource },      // Données patient
    { resource: allergyResources },     // Allergies
    { resource: conditionResources },   // Conditions
    { resource: medicationResources },  // Médications
    { resource: observationResources }, // Observations (scores, évaluations)
    { resource: documentReference }     // Référence au document d'évaluation
  ]
}
```

#### 3.2 Profils CA Core+

Utiliser les profils CA Core+ pour :
- `ca-core-patient` : Données patient
- `ca-core-observation` : Observations cliniques
- `ca-core-condition` : Conditions de santé
- `ca-core-allergyintolerance` : Allergies

---

## 🚀 Scénarios de Test pour le Projetathon 2026

### Scénario 1 : Lancement depuis DME avec Contexte Patient

**Objectif** : Tester le lancement SMART avec contexte patient

**Étapes** :
1. DME lance l'app via HALO (launch URL)
2. App se connecte au serveur FHIR
3. App récupère le contexte patient
4. App pré-remplit les données patient (C1T01, C1T02, etc.)
5. Professionnel complète l'évaluation
6. App envoie l'évaluation au DME

### Scénario 2 : Récupération RDP-CA

**Objectif** : Tester la récupération du résumé patient

**Étapes** :
1. App demande le RDP-CA du patient
2. DME retourne un Bundle FHIR RDP-CA
3. App parse et mappe les données
4. App affiche les données dans l'interface
5. Professionnel peut modifier/compléter

### Scénario 3 : Envoi d'Évaluation (Flux SoFA)

**Objectif** : Tester l'envoi d'une évaluation complète

**Étapes** :
1. Professionnel complète une évaluation
2. App génère un document FHIR (RDP-CA ou Observation)
3. App envoie via CA:FeX au DME
4. DME confirme la réception
5. Document visible dans le dossier patient

### Scénario 4 : Demande de Données (Flux SoFA)

**Objectif** : Tester la demande de données spécifiques depuis le DME

**Étapes** :
1. App demande des données spécifiques (ex: dernières évaluations de plaies)
2. DME retourne les ressources FHIR demandées
3. App affiche l'historique

### Scénario 5 : Mise à Jour de Données (Flux SoFA)

**Objectif** : Tester la mise à jour de données dans le DME

**Étapes** :
1. App modifie une évaluation existante
2. App envoie la mise à jour au DME
3. DME met à jour la ressource
4. App confirme la mise à jour

---

## ⚠️ Défis et Considérations

### 1. **Données Manquantes ou Incomplètes**

**Problème** : Le DME peut ne pas avoir toutes les données nécessaires

**Solution** :
- Mode hybride : Données DME + saisie manuelle
- Indicateurs visuels pour données manquantes
- Possibilité de compléter/valider les données DME

### 2. **Conflits de Données**

**Problème** : Données dans l'app vs données dans le DME

**Solution** :
- Timestamp toutes les données
- Stratégie de résolution de conflits (dernière modification gagne, ou prompt utilisateur)
- Versioning des évaluations

### 3. **Mode Offline**

**Problème** : L'app doit fonctionner offline

**Solution** :
- Cache des données patient récupérées
- Queue de synchronisation pour envois
- Indicateur de statut de sync

### 4. **Performance**

**Problème** : Chargement de données volumineuses

**Solution** :
- Pagination des ressources FHIR
- Lazy loading des sections d'évaluation
- Cache intelligent

---

## 📝 Recommandations Immédiates

### Pour Février 2026 (Projetathon)

1. **Préparer un prototype fonctionnel** :
   - ✅ Intégration SMART de base
   - ✅ Récupération de données patient simples
   - ✅ Envoi d'une évaluation basique

2. **Tester avec un serveur FHIR de test** :
   - Utiliser un serveur de test conforme RDP-CA
   - Valider les formats de données
   - Tester les scénarios du Projetathon

3. **Documentation** :
   - Documenter les mappings FHIR
   - Créer des guides de test
   - Préparer des exemples de données

### Pour Après le Projetathon

1. **Compléter l'intégration** :
   - Support complet RDP-CA v2.1.1
   - Tous les champs d'évaluation mappés
   - Photos/intégrations médias

2. **Gestion avancée** :
   - Synchronisation bidirectionnelle
   - Historique des évaluations
   - Recherche dans le DME

---

## 🔗 Ressources HALO/RDP-CA

### Documentation
- **HALO** : https://simplifier.net/guide/halo/Home?version=1.1.1-DFT-preBallot
- **RDP-CA** : Version 2.1.1 (préliminaire)
- **CA Core+** : v1.1
- **CA:FeX** : Pour l'échange de documents

### Bibliothèques
- `fhirclient` : Client SMART on FHIR pour React/React Native
- `fhir-kit-client` : Client FHIR alternatif
- `fhir-works-on-aws` : Si besoin de serveur de test

---

## 🏥 Intégration avec Epic : Conformité aux Normes

### Epic et les Normes Pancanadiennes

**Question** : Si on utilise Epic comme DME, est-ce qu'on répondra quand même aux normes ?

**Réponse courte** : **Oui, avec certaines vérifications nécessaires.**

### Support FHIR par Epic

Epic est **l'un des leaders** en matière de support FHIR :
- ✅ **Support FHIR R4** : Epic supporte la version R4 de FHIR (standard pour HALO/RDP-CA)
- ✅ **Plus de 500 API FHIR** : Couvre 57 ressources FHIR différentes
- ✅ **SMART on FHIR** : Epic supporte nativement SMART on FHIR (requis pour HALO)
- ✅ **App Orchard** : Programme Epic pour certifier les applications tierces

### Points à Vérifier pour la Conformité Pancanadienne

#### 1. **Profils CA Core+**

**Situation** :
- Epic supporte FHIR R4 ✅
- **MAIS** : Les profils CA Core+ sont des extensions spécifiques canadiennes
- **À vérifier** : Si Epic supporte directement les profils CA Core+ ou si des configurations sont nécessaires

**Solution recommandée** :
```javascript
// Adapter les ressources FHIR générées pour être compatibles avec Epic
// tout en respectant les profils CA Core+ quand possible

const createEpicCompatibleResource = (canadianProfile) => {
  // Utiliser les profils CA Core+ comme base
  // Mais s'assurer de la compatibilité avec les extensions Epic
  return {
    ...canadianProfile,
    // Ajouter les extensions Epic si nécessaires
    // S'assurer que les champs obligatoires Epic sont présents
  };
};
```

#### 2. **RDP-CA (Résumé du Dossier Patient - Canada)**

**Situation** :
- Epic supporte les **Patient Summary** (résumés de patients)
- **RDP-CA** est une spécification canadienne basée sur IPS (International Patient Summary)
- Epic supporte IPS, donc **compatible en principe** ✅

**Ce qu'il faut vérifier** :
- Si Epic peut **générer** un Bundle RDP-CA conforme
- Si Epic peut **recevoir et interpréter** un Bundle RDP-CA
- Les champs spécifiques au Canada (ex: RAMQ, système de santé provincial)

#### 3. **CA:FeX (Patrons d'Échange FHIR Pancanadiens)**

**Situation** :
- CA:FeX définit comment échanger des documents FHIR
- Epic supporte l'échange de documents via FHIR (DocumentReference)
- **Probablement compatible**, mais à valider avec Epic directement

#### 4. **HALO (Protocole Léger pour Applications de Santé)**

**Situation** :
- HALO est basé sur **SMART on FHIR**
- Epic supporte **SMART on FHIR nativement** ✅
- **MyChart App Gallery** : Epic a un programme pour intégrer des applications tierces

**Ce qui devrait fonctionner** :
- ✅ Lancement de l'app depuis Epic via HALO
- ✅ Authentification SMART
- ✅ Récupération du contexte patient
- ✅ Envoi de données vers Epic

### Scénarios de Test avec Epic

#### Scénario A : Epic comme DME au Projetathon

Si vous testez avec Epic au Projetathon 2026 :

1. **Lancement depuis Epic** :
   ```
   Epic MyChart/Clinique
       ↓
   Lance App Soin Plaie via SMART App Launch
       ↓
   Authentification SMART réussie
       ↓
   Contexte patient chargé
   ```

2. **Récupération RDP-CA** :
   - Demander le Patient Summary via FHIR
   - Parser selon le format RDP-CA
   - Pré-remplir l'évaluation

3. **Envoi vers Epic** :
   - Générer Bundle FHIR conforme RDP-CA
   - Envoyer via DocumentReference
   - Valider que Epic peut interpréter les données

#### Scénario B : Certification App Orchard

Pour une intégration officielle avec Epic :

1. **Inscription à App Orchard** :
   - Programme Epic pour applications tierces
   - Certification et validation
   - Support technique Epic

2. **Tests de conformité** :
   - Tests avec serveur Epic sandbox
   - Validation des formats de données
   - Vérification des profils FHIR

3. **Déploiement** :
   - Publication dans MyChart App Gallery (si souhaité)
   - Documentation pour les établissements
   - Support utilisateurs

### Recommandations Spécifiques pour Epic

#### 1. **Utiliser les API FHIR Standard Epic**

**Prioriser** :
- API FHIR standard (non propriétaires Epic)
- Ressources FHIR de base : Patient, Observation, Condition, AllergyIntolerance, etc.
- SMART on FHIR standard (pas d'extensions Epic uniquement)

**Éviter** :
- Extensions Epic propriétaires qui ne sont pas dans les standards
- APIs non-FHIR si possible

#### 2. **Mapping Flexible**

```javascript
// Exemple : Mapping flexible pour compatibilité Epic + normes canadiennes
const mapToEpicCompatible = (rdpcaData) => {
  return {
    // Utiliser les champs FHIR standard
    resourceType: "Bundle",
    type: "document",
    
    // S'assurer que les extensions canadiennes sont présentes
    // mais également compatibles avec ce qu'Epic attend
    entry: rdpcaData.entry.map(entry => ({
      ...entry,
      // Ajouter les extensions nécessaires pour Epic si requis
      // tout en gardant la conformité RDP-CA
    }))
  };
};
```

#### 3. **Tests avec Epic Sandbox**

**Avant le Projetathon** :
1. Demander accès à **Epic FHIR Sandbox**
2. Tester les scénarios HALO
3. Valider les formats de données
4. Identifier les incompatibilités potentielles

**Ressources Epic** :
- Documentation FHIR : https://fhir.epic.com/
- Support technique Epic pour questions spécifiques
- App Orchard pour intégrations officielles

#### 4. **Documentation de Conformité**

**À préparer** :
- Documentation des mappings FHIR utilisés
- Liste des ressources FHIR supportées
- Conformité avec les profils CA Core+ (si applicable)
- Format des données envoyées/reçues

### Compatibilité Multi-DME

**Importante considération** : Votre app devrait fonctionner avec **plusieurs DME**, pas seulement Epic.

**Architecture recommandée** :
```
┌─────────────────┐
│  App Soin Plaie │
│   (Notre App)   │
└────────┬────────┘
         │
         │ HALO/SMART on FHIR (Standard)
         │
    ┌────┴────┬─────────────┬─────────────┐
    │         │             │             │
    ▼         ▼             ▼             ▼
  Epic    Cerner      Telus Health    Autres DME
  DME      DME           DME
```

**Avantage** :
- Utiliser les **standards FHIR** garantit la compatibilité
- Ne pas se limiter à Epic
- Fonctionner avec n'importe quel DME compatible FHIR/SMART

### Conclusion sur Epic

**Réponse** : **Oui, Epic devrait répondre aux normes**, car :

1. ✅ Epic supporte FHIR R4 (base de HALO/RDP-CA)
2. ✅ Epic supporte SMART on FHIR (requis pour HALO)
3. ✅ Epic supporte les Patient Summary (base de RDP-CA)
4. ✅ Epic est utilisé au Canada et doit respecter les normes provinciales

**MAIS** il faut :
- 🔍 **Vérifier** les profils CA Core+ spécifiques
- 🧪 **Tester** avec Epic sandbox avant le Projetathon
- 📋 **Adapter** si nécessaire les formats pour compatibilité maximale
- 📚 **Documenter** les mappings et conformités

**Recommandation** : 
- Utiliser les **standards FHIR** (pas d'extensions propriétaires)
- Tester avec **plusieurs DME** au Projetathon (Epic, Cerner, etc.)
- S'assurer que l'app est **portable** entre différents systèmes

---

## ✅ Conclusion

L'application **App Soin Plaie** est bien positionnée pour une intégration HALO car :

1. ✅ **Architecture modulaire** : Facile d'ajouter une couche d'intégration
2. ✅ **Données structurées** : Format JSON facilement mappable vers FHIR
3. ✅ **Stockage local** : Permet le mode offline + sync
4. ✅ **Système d'évaluation complet** : Contient déjà les données nécessaires

**Prochaines étapes** :
1. Créer le module d'intégration HALO/SMART
2. Implémenter le mapping FHIR pour les données patient
3. Tester avec un serveur FHIR de test
4. Participer au Projetathon 2026 pour valider

**Timeline suggérée** :
- **Janvier 2026** : Développement module d'intégration
- **Février 2026** : Tests et ajustements
- **24-26 Février 2026** : Projetathon 2026
- **Mars-Avril 2026** : Améliorations post-Projetathon

---

*Document créé le : Janvier 2025*  
*Dernière mise à jour : Janvier 2025*

