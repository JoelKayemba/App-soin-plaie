# Liste des Étapes - Intégration Epic

**Date** : Janvier 2025  
**Statut** : ✅ Application Epic créée, fichier .env configuré

---

## 📋 Liste Séquentielle - On Y Va Petit à Petit !

---

### ✅ PHASE 1 : CONFIGURATION (FAIT)

- [x] Application Epic créée
- [x] Fichier .env créé et configuré
- [x] Client ID ajouté dans .env

---

### 🔵 ÉTAPE 1 : Créer le Fichier de Configuration Epic

**Objectif** : Créer `src/config/epic.js` qui lit les variables `.env`

**Actions** :
- [ ] Créer le dossier `src/config/`
- [ ] Créer `src/config/epic.js`
- [ ] Implémenter la lecture des variables `.env`
- [ ] Exporter la configuration Epic

**Temps estimé** : 10 minutes  
**Fichier à créer** : `src/config/epic.js`

---

### 🔵 ÉTAPE 2 : Installer les Packages Nécessaires

**Objectif** : Installer toutes les dépendances pour Epic OAuth

**Actions** :
- [ ] Installer `expo-crypto` (pour PKCE)
- [ ] Installer `expo-linking` (pour Deep Links)
- [ ] Installer `react-native-dotenv` (pour lire .env)
- [ ] Configurer `babel.config.js` pour dotenv
- [ ] Redémarrer le serveur Expo

**Temps estimé** : 10 minutes  
**Commandes** :
```bash
npx expo install expo-crypto expo-linking
npm install react-native-dotenv
```

---

### 🔵 ÉTAPE 3 : Créer la Structure des Dossiers

**Objectif** : Créer tous les dossiers pour le module Epic

**Actions** :
- [ ] Créer `src/integration/epic/`
- [ ] Créer `src/integration/epic/utils/`
- [ ] Créer `src/integration/epic/services/`
- [ ] Créer `src/integration/epic/mappers/`

**Temps estimé** : 2 minutes  
**Commandes** :
```bash
mkdir -p src/integration/epic/utils
mkdir -p src/integration/epic/services
mkdir -p src/integration/epic/mappers
```

---

### 🔵 ÉTAPE 4 : Créer le Service PKCE

**Objectif** : Générer les codes PKCE pour la sécurité OAuth

**Actions** :
- [ ] Créer `src/integration/epic/utils/PKCEService.js`
- [ ] Implémenter `generateCodeVerifier()` (chaîne aléatoire)
- [ ] Implémenter `generateCodeChallenge()` (SHA256 du verifier)
- [ ] Exporter les fonctions

**Temps estimé** : 20 minutes  
**Fichier à créer** : `src/integration/epic/utils/PKCEService.js`

**Résultat attendu** : Fonctions qui génèrent code_verifier et code_challenge

---

### 🔵 ÉTAPE 5 : Créer le Service d'Authentification Epic (Partie 1)

**Objectif** : Détecter si l'app est lancée depuis Epic

**Actions** :
- [ ] Créer `src/integration/epic/services/EpicAuthService.js`
- [ ] Implémenter `detectEpicLaunch()` (vérifier les paramètres URL)
- [ ] Implémenter `getLaunchParams()` (extraire launch token et iss)

**Temps estimé** : 20 minutes  
**Fichier à créer** : `src/integration/epic/services/EpicAuthService.js`

**Résultat attendu** : Pouvoir détecter si l'app est lancée depuis Epic

---

### 🔵 ÉTAPE 6 : Créer le Service d'Authentification Epic (Partie 2)

**Objectif** : Récupérer la configuration SMART depuis Epic

**Actions** :
- [ ] Ajouter `getSMARTConfiguration(iss)` dans EpicAuthService
- [ ] Faire un GET vers `/.well-known/smart-configuration`
- [ ] Parser la réponse JSON
- [ ] Extraire les endpoints (authorize, token)

**Temps estimé** : 30 minutes  
**Fichier à modifier** : `src/integration/epic/services/EpicAuthService.js`

**Résultat attendu** : Obtenir les URLs des endpoints OAuth Epic

---

### 🔵 ÉTAPE 7 : Créer le Service d'Authentification Epic (Partie 3)

**Objectif** : Lancer le flow OAuth 2.0 avec PKCE

**Actions** :
- [ ] Ajouter `launchOAuthFlow()` dans EpicAuthService
- [ ] Générer PKCE (code_verifier et code_challenge)
- [ ] Générer un state aléatoire
- [ ] Construire l'URL d'autorisation
- [ ] Ouvrir le navigateur/app pour authentification

**Temps estimé** : 30 minutes  
**Fichier à modifier** : `src/integration/epic/services/EpicAuthService.js`

**Résultat attendu** : L'utilisateur est redirigé vers Epic pour s'authentifier

---

### 🔵 ÉTAPE 8 : Créer le Service d'Authentification Epic (Partie 4)

**Objectif** : Échanger le code d'autorisation contre un access token

**Actions** :
- [ ] Ajouter `exchangeCodeForToken()` dans EpicAuthService
- [ ] Faire un POST vers l'endpoint token
- [ ] Envoyer authorization_code, code_verifier, redirect_uri
- [ ] Parser la réponse avec access_token, patient, etc.
- [ ] Stocker les tokens de manière sécurisée

**Temps estimé** : 30 minutes  
**Fichier à modifier** : `src/integration/epic/services/EpicAuthService.js`

**Résultat attendu** : Obtenir un access token pour faire des requêtes FHIR

---

### 🔵 ÉTAPE 9 : Créer le Service FHIR (Partie 1)

**Objectif** : Récupérer les données patient de base

**Actions** :
- [ ] Créer `src/integration/epic/services/EpicFHIRService.js`
- [ ] Implémenter `getPatient(patientId, accessToken)`
- [ ] Faire un GET vers `/Patient/{patientId}`
- [ ] Parser la ressource FHIR Patient
- [ ] Retourner les données formatées

**Temps estimé** : 20 minutes  
**Fichier à créer** : `src/integration/epic/services/EpicFHIRService.js`

**Résultat attendu** : Récupérer nom, date de naissance, etc. du patient

---

### 🔵 ÉTAPE 10 : Créer le Service FHIR (Partie 2)

**Objectif** : Récupérer les allergies, conditions, médicaments

**Actions** :
- [ ] Ajouter `getAllergies(patientId, accessToken)` dans EpicFHIRService
- [ ] Ajouter `getConditions(patientId, accessToken)` dans EpicFHIRService
- [ ] Ajouter `getMedications(patientId, accessToken)` dans EpicFHIRService
- [ ] Faire des GET vers les endpoints FHIR appropriés
- [ ] Parser les Bundles FHIR retournés

**Temps estimé** : 40 minutes  
**Fichier à modifier** : `src/integration/epic/services/EpicFHIRService.js`

**Résultat attendu** : Récupérer allergies, conditions, médicaments du patient

---

### 🔵 ÉTAPE 11 : Créer le Mapper de Données Epic

**Objectif** : Convertir les données FHIR Epic vers le format de l'app

**Actions** :
- [ ] Créer `src/integration/epic/mappers/EpicDataMapper.js`
- [ ] Implémenter `mapPatientToEvaluation()` (Patient → C1T01)
- [ ] Implémenter `mapAllergiesToEvaluation()` (Allergies → C1T02)
- [ ] Implémenter `mapConditionsToEvaluation()` (Conditions → C1T03)
- [ ] Implémenter `mapMedicationsToEvaluation()` (Médications → C1T07)

**Temps estimé** : 1 heure  
**Fichier à créer** : `src/integration/epic/mappers/EpicDataMapper.js`

**Résultat attendu** : Convertir les données Epic en format pour pré-remplir l'évaluation

---

### 🔵 ÉTAPE 12 : Créer le Hook useEpicAuth

**Objectif** : Hook React pour gérer l'authentification Epic

**Actions** :
- [ ] Créer `src/hooks/useEpicAuth.js`
- [ ] Gérer l'état de connexion (connected, loading, error)
- [ ] Gérer le stockage des tokens (expo-secure-store)
- [ ] Exposer les fonctions : `connect()`, `disconnect()`, `refreshToken()`

**Temps estimé** : 30 minutes  
**Fichier à créer** : `src/hooks/useEpicAuth.js`

**Résultat attendu** : Hook React réutilisable pour l'authentification Epic

---

### 🔵 ÉTAPE 13 : Créer le Context Epic

**Objectif** : Context React pour partager l'état Epic dans l'app

**Actions** :
- [ ] Créer `src/context/EpicContext.jsx`
- [ ] Créer le Provider EpicContext
- [ ] Gérer l'état global (tokens, patient, practitioner)
- [ ] Exposer les fonctions d'authentification

**Temps estimé** : 30 minutes  
**Fichier à créer** : `src/context/EpicContext.jsx`

**Résultat attendu** : Context React pour accéder à l'état Epic partout

---

### 🔵 ÉTAPE 14 : Créer le Composant de Connexion Epic

**Objectif** : Bouton UI pour se connecter à Epic

**Actions** :
- [ ] Créer `src/components/epic/EpicConnectionButton.jsx`
- [ ] Utiliser le hook useEpicAuth
- [ ] Afficher un bouton "Se connecter à Epic"
- [ ] Gérer le clic et lancer l'authentification
- [ ] Afficher un état de chargement

**Temps estimé** : 30 minutes  
**Fichier à créer** : `src/components/epic/EpicConnectionButton.jsx`

**Résultat attendu** : Bouton cliquable qui lance l'authentification Epic

---

### 🔵 ÉTAPE 15 : Créer le Composant de Statut Epic

**Objectif** : Afficher le statut de connexion Epic

**Actions** :
- [ ] Créer `src/components/epic/EpicConnectionStatus.jsx`
- [ ] Afficher si connecté ou non connecté
- [ ] Afficher le nom du patient si connecté
- [ ] Afficher un bouton de déconnexion

**Temps estimé** : 20 minutes  
**Fichier à créer** : `src/components/epic/EpicConnectionStatus.jsx`

**Résultat attendu** : Composant qui affiche le statut de connexion Epic

---

### 🔵 ÉTAPE 16 : Configurer les Deep Links

**Objectif** : Gérer les callbacks OAuth depuis Epic

**Actions** :
- [ ] Modifier `app.json` pour ajouter le scheme `app-soin-plaie://`
- [ ] Créer `src/utils/deepLinkHandler.js`
- [ ] Gérer les URLs de callback OAuth
- [ ] Extraire le code d'autorisation
- [ ] Router vers le service d'authentification

**Temps estimé** : 30 minutes  
**Fichiers à modifier** : `app.json`, créer `src/utils/deepLinkHandler.js`

**Résultat attendu** : L'app peut recevoir les callbacks OAuth d'Epic

---

### 🔵 ÉTAPE 17 : Intégrer dans EvaluationScreen (Partie 1)

**Objectif** : Ajouter le bouton de connexion Epic dans l'écran d'évaluation

**Actions** :
- [ ] Modifier `src/app/EvaluationScreen.jsx`
- [ ] Importer EpicConnectionButton et EpicConnectionStatus
- [ ] Ajouter les composants dans l'UI (en haut de l'écran)
- [ ] Vérifier que ça s'affiche correctement

**Temps estimé** : 20 minutes  
**Fichier à modifier** : `src/app/EvaluationScreen.jsx`

**Résultat attendu** : Le bouton de connexion Epic est visible dans l'écran d'évaluation

---

### 🔵 ÉTAPE 18 : Intégrer dans EvaluationScreen (Partie 2)

**Objectif** : Pré-remplir l'évaluation avec les données Epic

**Actions** :
- [ ] Ajouter une fonction `loadFromEpic()` dans EvaluationScreen
- [ ] Récupérer les données patient depuis Epic
- [ ] Mapper les données Epic → format évaluation
- [ ] Pré-remplir les champs de l'évaluation
- [ ] Afficher un message de confirmation

**Temps estimé** : 1 heure  
**Fichier à modifier** : `src/app/EvaluationScreen.jsx`

**Résultat attendu** : Pouvoir pré-remplir l'évaluation avec les données Epic

---

### 🔵 ÉTAPE 19 : Modifier le Storage pour Support Epic

**Objectif** : Sauvegarder le lien entre évaluation et patient Epic

**Actions** :
- [ ] Modifier `src/storage/evaluationLocalStorage.js`
- [ ] Ajouter support pour `patientId` Epic
- [ ] Ajouter support pour `dmeContext` (fhirServer, encounterId, etc.)
- [ ] Sauvegarder ces infos avec chaque évaluation

**Temps estimé** : 30 minutes  
**Fichier à modifier** : `src/storage/evaluationLocalStorage.js`

**Résultat attendu** : Les évaluations sont liées au patient Epic

---

### 🔵 ÉTAPE 20 : Tests dans Epic Sandbox (Partie 1)

**Objectif** : Tester la connexion Epic

**Actions** :
- [ ] Lancer l'app
- [ ] Cliquer sur "Se connecter à Epic"
- [ ] Vérifier que la page d'authentification Epic s'ouvre
- [ ] Se connecter avec les identifiants sandbox
- [ ] Vérifier que le callback fonctionne
- [ ] Vérifier que les tokens sont stockés

**Temps estimé** : 30 minutes  
**Résultat attendu** : L'authentification Epic fonctionne end-to-end

---

### 🔵 ÉTAPE 21 : Tests dans Epic Sandbox (Partie 2)

**Objectif** : Tester la récupération des données patient

**Actions** :
- [ ] Une fois connecté, cliquer sur "Charger depuis Epic"
- [ ] Vérifier que les données patient s'affichent
- [ ] Vérifier que l'évaluation est pré-remplie
- [ ] Vérifier que les données sont correctes

**Temps estimé** : 30 minutes  
**Résultat attendu** : Les données Epic sont récupérées et pré-remplies

---

### 🔵 ÉTAPE 22 : Créer le Service d'Envoi vers Epic

**Objectif** : Envoyer une évaluation complétée vers Epic

**Actions** :
- [ ] Créer `src/integration/epic/services/EpicSendService.js`
- [ ] Implémenter conversion évaluation → FHIR Observation
- [ ] Créer un Bundle FHIR avec l'évaluation
- [ ] Envoyer vers Epic via POST `/Bundle`
- [ ] Gérer les erreurs

**Temps estimé** : 1 heure  
**Fichier à créer** : `src/integration/epic/services/EpicSendService.js`

**Résultat attendu** : Pouvoir envoyer une évaluation vers Epic

---

### 🔵 ÉTAPE 23 : Intégrer l'Envoi dans EvaluationScreen

**Objectif** : Ajouter un bouton "Envoyer vers Epic" après évaluation

**Actions** :
- [ ] Ajouter un bouton "Envoyer vers Epic" dans EvaluationScreen
- [ ] Implémenter la fonction d'envoi
- [ ] Afficher un message de succès/erreur
- [ ] Gérer les cas d'erreur

**Temps estimé** : 30 minutes  
**Fichier à modifier** : `src/app/EvaluationScreen.jsx`

**Résultat attendu** : Pouvoir envoyer l'évaluation vers Epic après complétion

---

### 🔵 ÉTAPE 24 : Tests Finaux Sandbox

**Objectif** : Tester tous les scénarios

**Actions** :
- [ ] Test complet : Connexion → Chargement → Pré-remplissage → Envoi
- [ ] Vérifier dans Epic Sandbox que les données sont bien reçues
- [ ] Tester les cas d'erreur (pas de connexion, etc.)
- [ ] Tester avec différents patients

**Temps estimé** : 1 heure  
**Résultat attendu** : Tout fonctionne end-to-end

---

## 📊 Progression

**Total d'étapes** : 24  
**Étapes complétées** : 0/24

---

## 🎯 Ordre Recommandé (On va faire dans cet ordre)

1. ✅ **ÉTAPE 1** : Fichier de configuration Epic
2. ✅ **ÉTAPE 2** : Installer les packages
3. ✅ **ÉTAPE 3** : Structure des dossiers
4. ✅ **ÉTAPE 4** : Service PKCE
5. ✅ **ÉTAPE 5-8** : Service d'authentification (en 4 parties)
6. ✅ **ÉTAPE 9-10** : Service FHIR (en 2 parties)
7. ✅ **ÉTAPE 11** : Mapper les données
8. ✅ **ÉTAPE 12-13** : Hook et Context
9. ✅ **ÉTAPE 14-15** : Composants UI
10. ✅ **ÉTAPE 16** : Deep Links
11. ✅ **ÉTAPE 17-18** : Intégration EvaluationScreen
12. ✅ **ÉTAPE 19** : Modification Storage
13. ✅ **ÉTAPE 20-21** : Tests Sandbox (connexion et récupération)
14. ✅ **ÉTAPE 22-23** : Service d'envoi et intégration
15. ✅ **ÉTAPE 24** : Tests finaux

---

## 🚀 On Commence ?

**Prochaine étape** : ÉTAPE 1 - Créer le fichier de configuration Epic

Dites-moi quand vous êtes prêt et je créerai le code pour cette première étape !

---

*Liste créée le : Janvier 2025*  
*Dernière mise à jour : Janvier 2025*

