# Plan d'Action : Intégration Epic dans App Soin Plaie

**Date** : Janvier 2025  
**Statut** : ✅ Application Epic créée et prête pour sandbox

---

## 🎯 Objectif

Intégrer Epic OAuth 2.0 / SMART on FHIR dans l'application pour :
1. Authentifier les utilisateurs via Epic
2. Récupérer les données patient automatiquement
3. Pré-remplir les évaluations avec les données Epic
4. Envoyer les évaluations vers Epic

---

## 📋 Liste des Étapes à Suivre

### Phase 1 : Configuration et Setup (30 min)

#### ✅ Étape 1.1 : Récupérer les Identifiants Epic
- [ ] Noter le **Client ID (Non-Production)** depuis Epic on FHIR
- [ ] Noter le **Client ID (Production)** si disponible
- [ ] Copier l'URL du sandbox : `https://fhir.epic.com/interconnect-fhir-oauth/`

#### ✅ Étape 1.2 : Créer le Fichier de Configuration
- [ ] Créer `src/config/epic.js`
- [ ] Y ajouter votre Client ID
- [ ] Configurer les Redirect URIs
- [ ] Configurer les Scopes

#### ✅ Étape 1.3 : Installer les Dépendances
- [ ] Installer `fhirclient` ou `react-native-app-auth`
- [ ] Installer `react-native-keychain` ou `expo-secure-store`
- [ ] Installer `expo-crypto` (pour PKCE)
- [ ] Installer `expo-linking` (pour Deep Links)

---

### Phase 2 : Création du Module d'Intégration (2-3 heures)

#### ✅ Étape 2.1 : Structure des Dossiers
- [ ] Créer `src/integration/epic/`
- [ ] Créer `src/integration/epic/services/`
- [ ] Créer `src/integration/epic/mappers/`
- [ ] Créer `src/integration/epic/utils/`

#### ✅ Étape 2.2 : Service PKCE (Sécurité)
- [ ] Créer `src/integration/epic/utils/PKCEService.js`
- [ ] Implémenter génération de `code_verifier`
- [ ] Implémenter génération de `code_challenge` (SHA256)
- [ ] Tester la génération PKCE

#### ✅ Étape 2.3 : Service d'Authentification
- [ ] Créer `src/integration/epic/services/EpicAuthService.js`
- [ ] Implémenter détection de lancement Epic (EHR Launch)
- [ ] Implémenter récupération SMART configuration
- [ ] Implémenter flow OAuth 2.0 avec PKCE
- [ ] Implémenter échange authorization code → access token
- [ ] Implémenter gestion des refresh tokens

#### ✅ Étape 2.4 : Service FHIR
- [ ] Créer `src/integration/epic/services/EpicFHIRService.js`
- [ ] Implémenter récupération données patient
- [ ] Implémenter récupération allergies
- [ ] Implémenter récupération conditions de santé
- [ ] Implémenter récupération médicaments
- [ ] Implémenter récupération Patient Summary (RDP-CA)

#### ✅ Étape 2.5 : Mapper les Données
- [ ] Créer `src/integration/epic/mappers/EpicDataMapper.js`
- [ ] Implémenter mapping Patient → C1T01 (Données de base)
- [ ] Implémenter mapping Allergies → C1T02
- [ ] Implémenter mapping Conditions → C1T03
- [ ] Implémenter mapping Médications → C1T07

#### ✅ Étape 2.6 : Service RDP-CA
- [ ] Créer `src/integration/epic/services/EpicRDPService.js`
- [ ] Implémenter récupération Patient Summary depuis Epic
- [ ] Implémenter parsing du Bundle FHIR RDP-CA
- [ ] Implémenter extraction des ressources

#### ✅ Étape 2.7 : Service d'Envoi
- [ ] Créer `src/integration/epic/services/EpicSendService.js`
- [ ] Implémenter conversion évaluation → FHIR Observation
- [ ] Implémenter création Bundle RDP-CA
- [ ] Implémenter envoi vers Epic via FHIR API

---

### Phase 3 : Intégration dans l'Application (1-2 heures)

#### ✅ Étape 3.1 : Hook d'Authentification
- [ ] Créer `src/hooks/useEpicAuth.js`
- [ ] Gérer l'état de connexion Epic
- [ ] Gérer le stockage des tokens
- [ ] Gérer le rafraîchissement des tokens

#### ✅ Étape 3.2 : Context Epic
- [ ] Créer `src/context/EpicContext.jsx`
- [ ] Fournir l'état Epic à toute l'app
- [ ] Gérer le contexte patient
- [ ] Gérer le contexte practitioner

#### ✅ Étape 3.3 : Composants UI
- [ ] Créer `src/components/epic/EpicConnectionButton.jsx`
  - Bouton pour se connecter à Epic
  - Gérer le lancement OAuth
- [ ] Créer `src/components/epic/EpicConnectionStatus.jsx`
  - Afficher le statut de connexion
  - Afficher le patient connecté
- [ ] Créer `src/components/epic/EpicDataPreview.jsx`
  - Prévisualiser les données récupérées
  - Option pour pré-remplir l'évaluation

#### ✅ Étape 3.4 : Intégration dans EvaluationScreen
- [ ] Modifier `src/app/EvaluationScreen.jsx`
- [ ] Ajouter bouton de connexion Epic
- [ ] Ajouter logique de pré-remplissage
- [ ] Ajouter option "Charger depuis Epic"
- [ ] Ajouter option "Envoyer vers Epic" (après évaluation)

#### ✅ Étape 3.5 : Modification du Storage
- [ ] Modifier `src/storage/evaluationLocalStorage.js`
- [ ] Ajouter support patientId Epic
- [ ] Ajouter support dmeContext
- [ ] Sauvegarder le lien avec Epic

---

### Phase 4 : Gestion des Deep Links (30 min)

#### ✅ Étape 4.1 : Configuration Deep Links
- [ ] Configurer `app.json` avec scheme `app-soin-plaie://`
- [ ] Configurer Universal Links (iOS) si nécessaire
- [ ] Configurer App Links (Android) si nécessaire

#### ✅ Étape 4.2 : Handler Deep Links
- [ ] Créer `src/utils/deepLinkHandler.js`
- [ ] Gérer les callbacks OAuth
- [ ] Extraire les paramètres de lancement Epic
- [ ] Router vers le service d'authentification

---

### Phase 5 : Tests et Validation (2-3 heures)

#### ✅ Étape 5.1 : Tests Unitaires
- [ ] Tester génération PKCE
- [ ] Tester parsing SMART configuration
- [ ] Tester mapping des données Epic
- [ ] Tester conversion évaluation → FHIR

#### ✅ Étape 5.2 : Tests d'Intégration Sandbox
- [ ] Tester EHR Launch depuis Epic Sandbox
- [ ] Tester récupération contexte patient
- [ ] Tester récupération Patient Summary
- [ ] Tester pré-remplissage évaluation
- [ ] Tester envoi évaluation vers Epic
- [ ] Vérifier les données dans Epic Sandbox

#### ✅ Étape 5.3 : Tests Scénarios HALO
- [ ] Scénario 1 : Lancement depuis DME avec contexte patient
- [ ] Scénario 2 : Récupération RDP-CA
- [ ] Scénario 3 : Envoi d'évaluation (flux SoFA)
- [ ] Scénario 4 : Demande de données (flux SoFA)
- [ ] Scénario 5 : Mise à jour de données (flux SoFA)

---

### Phase 6 : Documentation et Préparation Projetathon (1 heure)

#### ✅ Étape 6.1 : Documentation
- [ ] Documenter les mappings FHIR
- [ ] Documenter les scénarios de test
- [ ] Créer un guide utilisateur
- [ ] Créer des exemples de données

#### ✅ Étape 6.2 : Préparation Projetathon
- [ ] Préparer démonstration
- [ ] Préparer slides/presentation
- [ ] Préparer exemples de test
- [ ] Lister les questions à poser

---

## 🚀 Ordre d'Exécution Recommandé

### Priorité 1 (Essentiel pour Projetathon)
1. ✅ Configuration (Étape 1.1 - 1.3)
2. ✅ Service d'Authentification (Étape 2.3)
3. ✅ Service FHIR de base (Étape 2.4 - récupération patient)
4. ✅ Hook d'Authentification (Étape 3.1)
5. ✅ Composant UI de connexion (Étape 3.3)
6. ✅ Tests Sandbox de base (Étape 5.2)

### Priorité 2 (Important)
7. ✅ Service RDP-CA (Étape 2.6)
8. ✅ Mapper les données (Étape 2.5)
9. ✅ Pré-remplissage (Étape 3.4)
10. ✅ Tests scénarios HALO (Étape 5.3)

### Priorité 3 (Améliorations)
11. ✅ Service d'Envoi (Étape 2.7)
12. ✅ Envoi vers Epic (Étape 3.4)
13. ✅ Documentation complète (Étape 6.1)

---

## 📝 Checklist Globale

### Setup Initial
- [ ] Client ID Epic noté
- [ ] Fichier de configuration créé
- [ ] Dépendances installées
- [ ] Structure de dossiers créée

### Code Core
- [ ] Service PKCE implémenté
- [ ] Service d'authentification implémenté
- [ ] Service FHIR implémenté
- [ ] Mapper des données implémenté

### Intégration UI
- [ ] Hook d'authentification créé
- [ ] Composants UI créés
- [ ] Intégration dans EvaluationScreen
- [ ] Deep Links configurés

### Tests
- [ ] Tests unitaires passent
- [ ] Tests sandbox réussis
- [ ] Scénarios HALO validés

### Production Ready
- [ ] Documentation complète
- [ ] Guide utilisateur créé
- [ ] Prêt pour Projetathon

---

## ⏱️ Estimation Temps Total

- **Phase 1** : 30 min
- **Phase 2** : 2-3 heures
- **Phase 3** : 1-2 heures
- **Phase 4** : 30 min
- **Phase 5** : 2-3 heures
- **Phase 6** : 1 heure

**Total** : ~7-10 heures de développement

---

## 🎯 Prochaines Actions Immédiates

1. **Maintenant** : Partager votre Client ID (Non-Production) Epic
2. **Ensuite** : Je crée les fichiers de configuration avec vos identifiants
3. **Puis** : Je crée le code complet du module d'intégration
4. **Enfin** : Tests ensemble dans le sandbox Epic

---

*Plan créé le : Janvier 2025*  
*Dernière mise à jour : Janvier 2025*

