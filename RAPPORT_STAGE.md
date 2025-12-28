# Rapport de Stage

**Application mobile d'aide à la décision clinique en soins de plaies**

---

## Page de présentation

**Auteur :** Kayemba Joel  
**Cours :** Stage en milieu professionnel (INF33515)  
**Projet :** App Soin Plaie  
**Date :** 28 décembre 2025  
**Institution :** Université du Québec à Rimouski (UQAR)  
**Superviseur :** Adda Mehdi  
**Superviseure clinique :** Mme Julie Gagnon

---

## Table des matières

1. [Résumé exécutif](#résumé-exécutif)
2. [Introduction](#introduction)
3. [Description du projet](#description-du-projet)
4. [Développement et contributions](#développement-et-contributions)
5. [Travail réalisé](#travail-réalisé)
6. [Risques technologiques](#risques-technologiques)
7. [État d'avancement](#état-davancement)
8. [Apprentissages](#apprentissages)
9. [Lien avec la formation](#lien-avec-la-formation)
10. [Prochaines étapes](#prochaines-étapes)
11. [Conclusion](#conclusion)
12. [Références](#références)
13. [Annexes](#annexes)

---

## Résumé exécutif

Ce rapport présente l'état d'avancement du projet « App Soin Plaie », une application mobile en cours de développement visant à soutenir les infirmières et professionnels de santé dans l'évaluation clinique et la prise en charge des plaies. Conçu et supervisé par Mme Julie Gagnon, spécialiste en soins de plaies, le projet a pour objectif de fournir un outil d'aide à la décision clinique intégré, permettant l'utilisation de calculatrices médicales (IPSCB, échelles de Braden et Braden Q), la consultation d'un lexique dermatologique complet, l'accès à un répertoire de références médicales validées, un catalogue structuré de produits et pansements, et une démarche clinique complète avec système d'évaluation automatisé.

Le développement technique repose sur React Native avec Expo, afin d'assurer la compatibilité multiplateforme (iOS, Android, tablette). Une attention particulière est portée à la navigation intuitive, au design responsive, ainsi qu'à la gestion du thème clair/sombre. Les données cliniques sont organisées sous forme de fichiers JSON pour garantir une modularité et une maintenabilité accrues. L'application intègre une architecture déclarative permettant de définir les formulaires d'évaluation dans des fichiers JSON plutôt que dans le code, facilitant ainsi les modifications et l'ajout de nouvelles fonctionnalités sans intervention sur le code source.

À ce stade, plusieurs maquettes ont été réalisées et validées, l'architecture logicielle de base est en place, et les premiers modules (navigation, thèmes, lexique, références, échelles) ont été complétés. Le système d'évaluation clinique avec 34 tables d'évaluation est fonctionnel, ainsi qu'un moteur de génération automatique de constats cliniques. Toutefois, le projet est encore en développement : aucun test utilisateur ni déploiement n'a encore été effectué, certaines fonctionnalités comme l'authentification sécurisée via l'OIIQ ou la synchronisation avec Epic/HALO restent en attente de validation externe, et plusieurs modules (objectifs de soins, équipe interdisciplinaire, plan de traitement, médication) sont en attente de spécifications détaillées.

En somme, App Soin Plaie illustre la mise en pratique de compétences techniques (React Native, architecture logicielle, structuration de données), organisationnelles (planification, documentation), et professionnelles (collaboration avec une experte clinique). Bien qu'inachevé, le projet démontre déjà un potentiel concret pour améliorer la qualité et la standardisation des soins de plaies.

---

## 1. Introduction

### 1.1 Contexte du projet

La prise en charge des plaies représente un enjeu majeur en santé, tant pour la qualité de vie des patients que pour la charge de travail des professionnels. Les infirmières doivent évaluer, calculer et appliquer des protocoles précis, souvent avec peu d'outils numériques adaptés au terrain.

C'est dans ce contexte que s'inscrit le projet « App Soin Plaie », une application mobile conçue et supervisée par Mme Julie Gagnon, spécialiste en soins de plaies. Le projet vise à combler un manque en offrant un support numérique clair, pratique et validé pour guider les décisions cliniques au quotidien.

### 1.2 Objectifs du projet

Les objectifs de App Soin Plaie sont les suivants :

- Développer une application mobile multiplateforme (Android, iOS, tablette)
- Intégrer des outils cliniques spécialisés :
  - Calcul de l'IPSCB (index cheville/bras)
  - Échelle de Braden (risque de lésion de pression)
  - Échelle de Braden Q (version pédiatrique)
- Créer un lexique dermatologique complet
- Fournir un accès rapide aux références médicales pertinentes
- Mettre en place un répertoire de produits et pansements
- Concevoir une interface intuitive et responsive, adaptée aussi bien aux téléphones qu'aux tablettes
- Implémenter un système d'évaluation clinique complet avec génération automatique de constats
- Intégrer l'application avec les systèmes d'information hospitaliers (Epic/HALO)

### 1.3 Technologies et outils utilisés

Le développement est réalisé avec :

- React Native 0.81.5 : framework principal
- Expo 54.0.22 : environnement de développement
- React 19.1.0 : base pour l'interface utilisateur
- React Navigation 7.x : gestion des écrans et onglets
- Redux Toolkit 2.9.0 : gestion d'état global
- Context API + Expo SecureStore 15.0.7 : gestion du thème clair/sombre et stockage sécurisé
- JSON : structuration des données (lexique, références, calculatrices, tables d'évaluation)

### 1.4 Méthodologie de développement

La démarche adoptée repose sur une approche itérative et progressive, articulée autour de :

1. Analyse des besoins cliniques (en collaboration avec Mme Julie Gagnon)
2. Conception des maquettes (UX/UI, flux utilisateurs, onglets principaux)
3. Mise en place de l'architecture logicielle (organisation en modules, navigation, thèmes)
4. Intégration progressive des données (lexique, références, échelles)
5. Développement du système d'évaluation clinique avec architecture déclarative
6. Implémentation du moteur de génération de constats
7. Améliorations futures prévues : ajout d'un système d'authentification via l'Ordre des infirmières et infirmiers du Québec (OIIQ), synchronisation cloud et intégration Epic/HALO

---

## 2. Description du projet

### 2.1 Vue d'ensemble

**App Soin Plaie** est une application mobile développée avec React Native et Expo, conçue pour fonctionner en mode hors ligne (offline-first). Elle permet aux professionnels de santé d'effectuer des évaluations cliniques complètes de patients présentant des plaies, de générer automatiquement des constats cliniques basés sur les données collectées, et de consulter des références médicales et un lexique spécialisé.

### 2.2 Fonctionnalités principales

L'application comprend plusieurs modules :

- **Système d'évaluation clinique** : 34 tables d'évaluation couvrant différents aspects (données de base, conditions de santé, évaluation de la plaie, échelles cliniques, etc.)
- **Génération automatique de constats** : Système permettant de générer des conclusions cliniques à partir des données d'évaluation selon des règles définies
- **Calculatrices médicales** : Outils de calcul pour l'IPSCB (Index de pression systolique cheville/bras), l'échelle de Braden, l'échelle de Braden Q
- **Lexique dermatologique** : Base de données de termes médicaux avec définitions
- **Catalogue de produits** : Référence des pansements et produits de soins
- **Références médicales** : Guides cliniques, protocoles de soins et articles de référence
- **Intégration Epic/HALO** : Connexion prévue avec les systèmes d'information hospitaliers (en attente de validation)

### 2.3 Architecture technique

L'application repose sur une architecture déclarative où les formulaires sont définis dans des fichiers JSON plutôt que dans le code. Cette approche permet :

- La modification des formulaires sans modification du code source
- L'ajout de nouvelles tables d'évaluation par simple création de fichiers JSON
- La séparation claire entre les données, la logique métier et l'interface utilisateur
- Le fonctionnement hors ligne avec stockage local sécurisé

---

## 3. Développement et contributions

### 3.1 De l'idée aux premières maquettes

Le projet a débuté par la réalisation de maquettes fonctionnelles représentant les futurs écrans de l'application. Ces maquettes ont permis d'imaginer la navigation, les onglets principaux (Accueil, Démarche clinique, Produits, Lexique), ainsi que la disposition des outils (calculatrices, lexique, références).

Chaque version de maquette a été soumise à Mme Julie Gagnon pour validation. À la suite de ses retours et recommandations, des ajustements ont été apportés, notamment sur :

- l'organisation des menus
- la terminologie clinique à utiliser
- la présentation des informations (textes, icônes, couleurs)

Cette phase de validation a été essentielle pour assurer la conformité clinique de l'application.

### 3.2 Architecture logicielle

Après la phase des maquettes, l'architecture logicielle a été mise en place sous React Native avec Expo, avec une organisation claire des dossiers :

```
app-soin-plaie/
├── src/
│   ├── app/                    # Écrans principaux
│   ├── components/             # Composants réutilisables
│   ├── context/                # Contextes React (Theme, Epic)
│   ├── data/                   # Données JSON
│   ├── features/               # Fonctionnalités (evaluation, epic)
│   ├── hooks/                  # Hooks personnalisés
│   ├── navigation/             # Configuration navigation
│   ├── services/               # Services (TableDataLoader, ConstatsGenerator)
│   ├── styles/                 # Styles et thèmes
│   └── utils/                  # Utilitaires
├── assets/                     # Images et ressources
├── App.js                      # Point d'entrée principal
└── package.json                # Dépendances
```

Cette structure modulaire permet d'évoluer facilement et de maintenir une séparation entre logique métier (calculs cliniques), interface (composants), et données médicales (JSON).

### 3.3 Intégration des données cliniques

Une partie importante du travail a consisté à transformer les schémas cliniques fournis par Mme Julie Gagnon (arbres décisionnels, échelles, lexique, références) en fichiers JSON structurés.

Cette étape a représenté un défi majeur, car il fallait :

- découper les informations complexes en nœuds logiques (questions, réponses, conditions)
- structurer les dépendances (ex. un choix amène à d'autres questions)
- conserver la précision médicale tout en respectant un format informatique

Ces JSON constituent la base de données interne de l'application. Par exemple :

- `lexiques.json` → définitions dermatologiques
- `products.json` → catalogue de produits et pansements
- `evaluations/columns/col1/` → 34 tables d'évaluation clinique
- `evaluations/columns/col2_constats/` → tables de constats automatiques

### 3.4 Fonctionnalités implémentées

À ce stade, plusieurs fonctionnalités principales sont déjà en place :

- Navigation par onglets : Accueil | Démarche clinique | Lexique | Produits
- Système de thèmes clair/sombre avec persistance via SecureStore
- Accueil : barre de recherche, section bienvenue, accès rapide aux outils
- Lexique : affichage alphabétique des termes médicaux avec recherche
- Références : regroupement des guides et recommandations validés
- Catalogue de produits : répertoire structuré des pansements et produits de soins
- Calculatrices médicales : IPSCB, Braden, Braden Q avec interprétation automatique
- Système d'évaluation clinique complet : 34 tables d'évaluation avec rendu dynamique
- Génération automatique de constats : moteur évaluant les conditions et générant des conclusions cliniques
- Stockage local sécurisé : sauvegarde automatique des données d'évaluation

---

## 4. Travail réalisé

### 4.1 Quantité de travail fournie

Le stage a nécessité l'investissement de 270 heures de travail, réparties sur la période du stage. Le travail a été effectué de manière autonome, avec des échanges réguliers avec Mme Julie Gagnon pour la validation des spécifications cliniques et la résolution de questions techniques.

### 4.2 Description des efforts et répartition des tâches

#### 4.2.1 Conception des maquettes et validation (environ 20 heures)

**Objectif** : Créer des maquettes fonctionnelles représentant l'interface de l'application pour validation par la superviseure clinique.

**Tâches réalisées** :
- Conception des écrans principaux (Accueil, Démarche clinique, Lexique, Produits)
- Définition de la navigation par onglets
- Création des maquettes pour les calculatrices médicales
- Présentation des maquettes à Mme Julie Gagnon
- Intégration des retours et ajustements

**Résultat** : Maquettes validées servant de référence pour le développement.

#### 4.2.2 Mise en place de l'architecture de base (environ 25 heures)

**Tâches réalisées** :
- Configuration du projet React Native avec Expo
- Mise en place de la structure modulaire des dossiers
- Implémentation de la navigation avec React Navigation
- Développement du système de thèmes clair/sombre avec persistance
- Création des composants UI de base (SectionHeader, ToolsSection, SearchBar)

#### 4.2.3 Intégration du lexique et des références (environ 15 heures)

**Tâches réalisées** :
- Transformation du lexique dermatologique en format JSON structuré
- Développement de l'écran Lexique avec recherche alphabétique
- Intégration des références médicales
- Création de l'écran de consultation des références
- Implémentation de la fonctionnalité de recherche

#### 4.2.4 Développement des calculatrices médicales (environ 20 heures)

**Tâches réalisées** :
- Implémentation de la calculatrice IPSCB avec interprétation automatique des résultats
- Développement de l'échelle de Braden (évaluation du risque de lésions de pression)
- Création de l'échelle de Braden Q (version pédiatrique)
- Implémentation des calculs automatiques (IMC, âge de la plaie, surface BWAT, etc.)
- Création des écrans dédiés pour chaque calculatrice

#### 4.2.5 Conception de l'architecture déclarative (environ 40 heures)

**Objectif** : Transformer les tableaux cliniques complexes fournis en un système algorithmique performant tout en conservant les capacités hors ligne.

**Tâches réalisées** :
- Analyse des tableaux cliniques existants et identification des patterns communs
- Conception d'un schéma JSON pour la définition des formulaires d'évaluation
- Développement d'un système de routes permettant la navigation conditionnelle entre tables
- Implémentation d'un système de conditions pour l'affichage conditionnel des éléments
- Création du système de mapping entre données d'évaluation et constats

**Défis rencontrés** : La complexité des tableaux cliniques, avec leurs nombreuses dépendances et conditions, a nécessité plusieurs itérations pour trouver un équilibre entre flexibilité et performance.

#### 4.2.6 Développement du système de rendu dynamique (environ 50 heures)

**Objectif** : Créer une logique générique permettant d'associer chaque type d'élément JSON à un composant UI spécifique, évitant ainsi la duplication de code.

**Tâches réalisées** :
- Développement du service `TableDataLoader` pour le chargement des fichiers JSON avec système de cache
- Création du composant `ContentDetector` pour la détection et le routage vers les renderers appropriés
- Implémentation du renderer générique `ElementRenderer` gérant tous les types d'éléments (radio, checkbox, date, nombre, texte, etc.)
- Développement de renderers spécifiques pour les tables complexes (Table 15 : apport vasculaire, Table 11 : histoire de la plaie, Table 27 : signes d'infection, etc.)
- Implémentation de la logique conditionnelle pour l'affichage dynamique des éléments
- Création de composants spéciaux (ContinuumMicrobien, DiabetesGlycemiaModal)

**Résultat** : Système permettant d'ajouter de nouvelles tables d'évaluation sans modifier le code source, uniquement en créant des fichiers JSON.

#### 4.2.7 Développement du moteur de génération de constats (environ 30 heures)

**Objectif** : Créer un système permettant de générer automatiquement des constats cliniques à partir des données d'évaluation.

**Tâches réalisées** :
- Conception du schéma JSON pour les tables de constats (`col2_constats`)
- Développement du service `ConstatsGenerator` pour l'évaluation des conditions
- Implémentation d'un système de `source_mapping` liant les données d'évaluation aux constats
- Création de composants React pour l'affichage des constats (badges, alertes cliniques)
- Développement de la logique d'évaluation de conditions complexes (opérateurs logiques, comparaisons, variables contextuelles)
- Implémentation de constats spécifiques (statut de la plaie, type de plaie, vascularisation, continuum microbien)

**Exemple de constat implémenté** : Le statut de la plaie (aiguë/chronique) est déterminé automatiquement à partir de la date d'apparition saisie par l'utilisateur.

#### 4.2.8 Implémentation du système de stockage local (environ 15 heures)

**Tâches réalisées** :
- Intégration d'Expo Secure Store pour le stockage sécurisé des données
- Développement du service `evaluationLocalStorage` pour la gestion de la persistance
- Implémentation de la sauvegarde automatique à chaque modification
- Création d'un système de progression permettant de reprendre une évaluation là où elle s'est arrêtée
- Gestion de la synchronisation des préférences utilisateur (thème, taille de police)

#### 4.2.9 Optimisation et nettoyage du code (environ 15 heures)

**Tâches réalisées** :
- Création d'un script de nettoyage des fichiers JSON pour supprimer les propriétés non utilisées
- Réduction de la taille des fichiers JSON de 34,2 % (350 798 → 230 682 octets)
- Optimisation des performances de chargement avec système de cache
- Documentation technique complète du système d'évaluation
- Refactoring du code pour améliorer la maintenabilité

#### 4.2.10 Intégration Epic/HALO (environ 10 heures — en attente)

**Tâches réalisées** :
- Étude de la documentation Epic FHIR
- Développement de la structure de base pour l'authentification OAuth
- Implémentation partielle du service d'authentification
- Création des composants UI pour la connexion Epic

**État** : En attente de validation de l'application par Epic pour accéder au sandbox de test.

### 4.3 Difficultés rencontrées

#### 4.3.1 Transformation des tableaux complexes

La principale difficulté a été de transformer les tableaux cliniques complexes fournis par Mme Julie Gagnon en un système algorithmique performant. Les tableaux contenaient de nombreuses dépendances, conditions et règles métier qui devaient être préservées tout en maintenant les performances de l'application.

**Solution adoptée** : Utilisation d'une architecture déclarative basée sur JSON avec un système de routes et de conditions, permettant de définir la logique métier dans les fichiers de configuration plutôt que dans le code.

#### 4.3.2 Création d'une logique générique de rendu

Pour éviter de recoder la logique UI associée à chaque table, il a fallu créer un système générique capable d'interpréter les définitions JSON et de générer automatiquement les interfaces utilisateur appropriées.

**Solution adoptée** : Développement d'un système de renderers hiérarchique avec un renderer générique (`ElementRenderer`) pour les cas standards et des renderers spécifiques pour les tables complexes nécessitant une logique particulière.

#### 4.3.3 Délais de réponse

Des retards ont été rencontrés en raison des délais de réponse de Mme Julie Gagnon pour la validation des spécifications et la résolution de questions techniques. Ces délais ont impacté la planification initiale et nécessité des ajustements dans l'ordre de priorité des fonctionnalités.

#### 4.3.4 Performance et optimisation

L'application devant fonctionner hors ligne, il était crucial d'optimiser le chargement et le traitement des données JSON pour éviter toute latence perceptible par l'utilisateur.

**Solution adoptée** : Implémentation d'un système de cache pour les tables chargées, optimisation des fichiers JSON (suppression des propriétés inutiles), et utilisation de chargement asynchrone.

#### 4.3.5 Conversion des schémas cliniques en JSON

Transformer les arbres décisionnels fournis par Mme Gagnon en fichiers JSON exploitables a exigé de réfléchir à une structuration hiérarchique claire (questions, réponses, conditions), tout en conservant la précision médicale.

#### 4.3.6 Gestion des dépendances React Native/Expo

Certaines erreurs de compatibilité (navigation, babel, plugins) ont nécessité des recherches et des correctifs pour assurer la stabilité de l'application.

---

## 5. Risques technologiques

### 5.1 Risques identifiés

#### 5.1.1 Transformation des tableaux cliniques en algorithmes performants

**Risque** : Si la transformation des tableaux cliniques complexes en algorithmes n'est pas réussie, l'application pourrait être trop lente ou ne pas respecter correctement les règles métier cliniques, compromettant ainsi sa fiabilité et son adoption par les professionnels de santé.

**Mitigation** : Architecture déclarative testée et validée, système de cache pour les performances, validation des règles métier avec Mme Julie Gagnon.

#### 5.1.2 Génération automatique de constats cliniques

**Risque** : Si le système de génération de constats produit des résultats incorrects ou incomplets, cela pourrait conduire à des erreurs cliniques, mettant en péril la sécurité des patients et la crédibilité de l'application.

**Mitigation** : Tests rigoureux des conditions d'évaluation, validation clinique des constats générés avec la superviseure, système de logs pour le débogage.

#### 5.1.3 Intégration avec Epic/HALO

**Risque** : Si l'intégration avec les systèmes d'information hospitaliers n'est pas réussie, l'application ne pourra pas s'intégrer dans le workflow clinique existant, limitant ainsi son utilité pratique.

**État actuel** : En attente de validation par Epic pour accéder au sandbox. Le risque est partiellement mitigé par le développement d'une architecture modulaire permettant de fonctionner indépendamment de l'intégration.

#### 5.1.4 Fonctionnement hors ligne

**Risque** : Si le système de stockage local ou la synchronisation des données échoue, les données pourraient être perdues ou corrompues, compromettant la fiabilité de l'application.

**Mitigation** : Utilisation d'Expo Secure Store pour un stockage sécurisé, implémentation de sauvegardes automatiques, gestion des erreurs et validation des données.

### 5.2 Risques non technologiques

- **Délais de réponse** : Impact sur la planification et l'avancement du projet en raison des délais de réponse de la superviseure pour les validations
- **Spécifications incomplètes** : Certaines fonctionnalités sont en attente de spécifications détaillées (objectifs de soins, équipe interdisciplinaire, plan de traitement, médication)

---

## 6. État d'avancement

### 6.1 Fonctionnalités complétées

- Architecture déclarative basée sur JSON
- Système de rendu dynamique des formulaires
- 34 tables d'évaluation implémentées et fonctionnelles
- Système de génération de constats (partiellement complété avec plusieurs constats opérationnels)
- Calculatrices médicales (IPSCB, Braden, Braden Q) avec interprétation automatique
- Stockage local sécurisé avec sauvegarde automatique
- Système de progression et reprise d'évaluation
- Lexique dermatologique complet avec recherche
- Catalogue de produits structuré
- Références médicales organisées par catégories
- Thèmes clair/sombre avec persistance
- Design responsive pour téléphones et tablettes
- Navigation par onglets intuitive
- Maquettes validées par la superviseure clinique

### 6.2 Fonctionnalités en cours de développement

- **Génération de constats** : Le système est fonctionnel mais nécessite l'ajout de nombreuses règles de mapping pour couvrir toutes les tables d'évaluation. Le travail se poursuit activement.

### 6.3 Fonctionnalités en attente

- **Intégration Epic/HALO** : En attente de validation de l'application par Epic pour accéder au sandbox de test. La structure de base est développée mais ne peut être testée sans accès au sandbox.

- **Authentification OIIQ** : En attente de spécifications détaillées et de validation par l'Ordre des infirmières et infirmiers du Québec.

- **Objectifs de soins** : En attente de spécifications détaillées de la part de Mme Julie Gagnon.

- **Équipe interdisciplinaire** : En attente de spécifications détaillées.

- **Plan de traitement** : En attente de spécifications détaillées.

- **Médication** : En attente de spécifications détaillées.

- **Prise de photo avec mesure des dimensions** : Fonctionnalité identifiée comme complexe pour une première version. L'implémentation n'est pas pressante et sera reportée à une version ultérieure.

- **Tests utilisateurs** : Aucun test utilisateur n'a encore été effectué.

- **Déploiement** : Aucun déploiement n'a encore été effectué.

### 6.4 Pourcentage d'avancement

Estimation globale : **environ 75 %** du projet initial est complété. Les fonctionnalités de base sont opérationnelles, incluant le système d'évaluation complet et la génération de constats, mais plusieurs modules avancés sont en attente de spécifications ou de validations externes.

---

## 7. Apprentissages

### 7.1 Compétences techniques acquises

Le développement de App Soin Plaie a permis de renforcer plusieurs compétences techniques :

- **React Native et Expo** : Maîtrise des fondements du développement mobile multiplateforme (iOS/Android/Tablette), gestion des dépendances, configuration des outils de développement
- **Structuration de projet** : Mise en place d'une architecture modulaire avec séparation claire des dossiers (app, components, context, data, features, services)
- **Gestion d'état** : Utilisation de Redux Toolkit pour l'état global et de la Context API pour le thème clair/sombre, avec persistance sécurisée via Expo SecureStore
- **Navigation complexe** : Intégration de React Navigation avec un système d'onglets (tabs) et de stacks, gestion des paramètres de navigation
- **Structuration des données médicales** : Transformation de contenus cliniques complexes en fichiers JSON bien structurés (lexique, références, échelles, tables d'évaluation)
- **Architecture déclarative** : Conception d'un système permettant de définir des formulaires complexes via JSON plutôt que dans le code
- **Système de rendu dynamique** : Développement d'un moteur de rendu générique interprétant des configurations JSON pour générer des interfaces utilisateur
- **Design responsive** : Adaptation de l'interface aux écrans mobiles et tablettes avec gestion des breakpoints
- **Optimisation de performance** : Implémentation de systèmes de cache, optimisation des fichiers JSON, chargement asynchrone

### 7.2 Défis techniques rencontrés

Le projet a mis en évidence certaines difficultés qui ont constitué des opportunités d'apprentissage :

- **Conversion des schémas cliniques en JSON** : Transformer les arbres décisionnels fournis par Mme Gagnon en fichiers JSON exploitables a exigé de réfléchir à une structuration hiérarchique claire (questions, réponses, conditions) tout en préservant la précision médicale
- **Gestion des dépendances React Native/Expo** : Certaines erreurs de compatibilité (navigation, babel, plugins) ont nécessité des recherches approfondies et des correctifs
- **Organisation de la navigation** : Structurer la logique entre les onglets principaux et les sous-écrans a demandé une bonne compréhension des mécanismes de navigation
- **Performance avec données complexes** : Optimiser le chargement et le traitement de 34 tables d'évaluation avec de nombreuses dépendances a nécessité l'implémentation de stratégies de cache et de chargement asynchrone
- **Évaluation de conditions complexes** : Développer un système capable d'évaluer des conditions logiques complexes pour la génération de constats a représenté un défi algorithmique significatif

### 7.3 Compétences organisationnelles

En parallèle des aspects techniques, ce projet a permis de développer :

- **Planification progressive** : Partir des maquettes, recueillir les retours de Mme Gagnon, puis intégrer ces ajustements avant de coder
- **Documentation** : Consigner les choix techniques et cliniques pour assurer la continuité du développement, création d'une documentation technique complète
- **Méthodologie itérative** : Avancer étape par étape (maquettes → architecture → données → écrans → évaluation → constats)
- **Gestion des priorités** : Ajuster l'ordre des fonctionnalités en fonction des retours et des délais de validation

### 7.4 Compétences professionnelles

Ce projet a également contribué à des apprentissages liés à la collaboration et au domaine de la santé :

- **Collaboration interdisciplinaire** : Travailler avec une experte clinique (Mme Julie Gagnon) a nécessité de traduire des besoins médicaux en solutions techniques concrètes
- **Validation continue** : Intégrer les retours de la superviseure après chaque version de maquette et ajuster le développement en conséquence
- **Responsabilité et rigueur** : Veiller à ce que la représentation des données médicales reste fidèle et conforme aux exigences cliniques
- **Communication technique** : Expliquer des concepts techniques à une personne non technique et comprendre les besoins cliniques exprimés en termes médicaux

---

## 8. Lien avec la formation

### 8.1 Parties de la formation utilisées

#### 8.1.1 Programmation et développement logiciel

Les notions acquises dans les cours de programmation orientée objet et de développement d'applications ont été essentielles. La logique d'encapsulation, de modularité et de réutilisation a guidé la création de composants React Native et l'organisation de l'architecture en modules.

#### 8.1.2 Structures de données et algorithmique

Les cours de structures de données et algorithmique ont permis de manipuler efficacement les informations médicales (lexique, références, échelles, tables d'évaluation) via des fichiers JSON. L'indexation et la recherche dans le lexique, ou encore la gestion des conditions dans les arbres décisionnels et l'évaluation de conditions complexes pour les constats, reposent sur ces acquis.

#### 8.1.3 Interfaces et expérience utilisateur

Les compétences en conception d'interface et en ergonomie logicielle se sont traduites par le développement d'écrans clairs, intuitifs et responsives. Les principes de design abordés en cours ont guidé la mise en place de la navigation, de la cohérence visuelle et du système de thèmes (clair/sombre).

#### 8.1.4 Développement mobile multiplateforme

Même si peu approfondi en cours, le projet a permis d'appliquer les bases vues en applications web et mobiles à un contexte concret. L'utilisation de React Native avec Expo a constitué une suite logique à ces apprentissages.

### 8.2 Compétences manquantes identifiées

#### 8.2.1 Développement mobile avancé

Certains aspects n'ont pas été couverts durant la formation :

- la gestion de la sécurité et de l'authentification (ex. via OIIQ, OAuth)
- la synchronisation cloud et l'intégration avec des bases de données médicales (FHIR, Epic)
- la mise en place de tests automatisés pour valider les calculs cliniques
- l'optimisation avancée des performances mobiles

#### 8.2.2 Gestion de projet agile

Bien que des notions de planification aient été abordées, une formation plus approfondie en méthodologies agiles (scrum, kanban) aurait facilité la gestion des itérations, la priorisation des tâches et la communication des retours de Mme Gagnon.

#### 8.2.3 UX/UI médical spécialisé

La formation n'a pas couvert les spécificités du design d'interfaces dans le domaine de la santé (ex. normes d'accessibilité, ergonomie clinique, conformité réglementaire). Cela a parfois rendu difficile la traduction des besoins de Mme Gagnon en solutions numériques optimales.

### 8.3 Impact sur la formation future

#### 8.3.1 Cours ou contenus à ajouter

Pour des projets similaires, il serait bénéfique d'intégrer davantage de :

- Développement mobile avancé (sécurité, performance, intégration de bases de données)
- Tests logiciels (tests unitaires, automatisation, CI/CD)
- Design UX/UI spécialisé (ergonomie clinique, accessibilité)
- Intégration de systèmes d'information de santé (FHIR, HL7)

#### 8.3.2 Ouverture vers d'autres projets

Les compétences acquises dans ce projet sont transférables à d'autres contextes (applications éducatives, plateformes e-santé, solutions SaaS). Elles offrent également une base solide pour des projets de recherche ou d'innovation technologique dans le domaine de la santé.

---

## 9. Prochaines étapes

### 9.1 Court terme (1-2 mois)

1. **Finalisation du système de constats** :
   - Compléter les règles de mapping pour toutes les tables d'évaluation
   - Tester et valider chaque constat généré avec Mme Julie Gagnon
   - Documenter les règles métier implémentées

2. **Intégration Epic/HALO** :
   - Obtenir la validation de l'application par Epic
   - Finaliser l'implémentation de l'authentification OAuth
   - Tester l'intégration avec le sandbox Epic
   - Implémenter la synchronisation des données

3. **Optimisations** :
   - Améliorer les performances de chargement
   - Optimiser l'utilisation de la mémoire
   - Réduire la taille de l'application

### 9.2 Moyen terme (3-4 mois)

1. **Implémentation des modules en attente** :
   - Développer le module des objectifs de soins (une fois les spécifications reçues de Mme Gagnon)
   - Développer le module de l'équipe interdisciplinaire
   - Développer le module du plan de traitement
   - Développer le module de médication

2. **Tests et validation** :
   - Tests d'intégration complets
   - Tests utilisateurs avec des professionnels de santé
   - Correction des bugs identifiés
   - Optimisation basée sur les retours utilisateurs

3. **Authentification OIIQ** :
   - Développer le système d'authentification sécurisé via l'OIIQ
   - Implémenter la gestion des sessions utilisateur

### 9.3 Long terme (5-6 mois)

1. **Fonctionnalités avancées** :
   - Implémentation de la prise de photo avec mesure des dimensions
   - Export des données en différents formats (PDF, CSV)
   - Génération de rapports cliniques complets
   - Synchronisation cloud optionnelle

2. **Améliorations continues** :
   - Enrichissement du lexique avec images
   - Ajout de nouvelles échelles d'évaluation
   - Amélioration de l'interface utilisateur basée sur les retours
   - Optimisation avec captures cliniques illustratives (schémas de localisation des plaies)

3. **Déploiement** :
   - Versions internes de test
   - Version pilote avec utilisateurs sélectionnés
   - Déploiement progressif

### 9.4 Prochains risques technologiques

1. **Complexité de l'intégration Epic/HALO** : Une fois l'accès au sandbox obtenu, l'intégration complète pourrait révéler des défis techniques imprévus liés à la structure des données FHIR ou aux limitations de l'API.

2. **Performance avec un grand nombre de constats** : À mesure que le nombre de règles de constats augmente, il faudra s'assurer que l'évaluation reste performante.

3. **Synchronisation des données** : La synchronisation bidirectionnelle entre l'application locale et les systèmes Epic pourrait présenter des défis de cohérence et de résolution de conflits.

4. **Authentification OIIQ** : L'intégration avec le système d'authentification de l'OIIQ pourrait présenter des défis techniques liés aux protocoles de sécurité et à la validation des identités.

---

## 10. Conclusion

### 10.1 Bilan du projet

Le développement de l'application « App Soin Plaie », sous la supervision de Mme Julie Gagnon, a permis de poser des bases solides pour un outil numérique destiné à soutenir les infirmières et professionnels de santé dans l'évaluation et la prise en charge des plaies.

Les premières étapes : maquettes validées, architecture logicielle en React Native/Expo, organisation des données en JSON, navigation par onglets et intégration du thème clair/sombre, sont déjà fonctionnelles. Le système d'évaluation clinique complet avec 34 tables d'évaluation et le moteur de génération automatique de constats représentent des réalisations significatives. L'application est donc engagée dans une trajectoire réaliste vers un produit complet et utilisable.

### 10.2 Apprentissages clés

Ce projet a permis de développer :

- **Des compétences techniques** : Structuration de données JSON complexes, navigation complexe, gestion de thèmes, responsive design, architecture déclarative, système de rendu dynamique, génération automatique de constats
- **Des compétences organisationnelles** : Travail itératif à partir des maquettes, intégration des retours de la superviseure, planification et gestion des priorités
- **Des compétences professionnelles** : Collaboration interdisciplinaire, rigueur dans l'adaptation des contenus cliniques, communication technique avec des experts cliniques

### 10.3 Défis surmontés

Parmi les principaux défis rencontrés, on note :

- La transformation des schémas cliniques complexes en JSON structurés exploitables par l'application
- La création d'une architecture déclarative permettant de définir des formulaires complexes sans modification du code
- Le développement d'un système de rendu générique évitant la duplication de code
- La résolution d'erreurs techniques React Native/Expo liées à la compatibilité des dépendances
- L'adaptation des contenus médicaux aux contraintes techniques tout en conservant leur valeur clinique
- L'optimisation des performances pour garantir un fonctionnement fluide hors ligne

### 10.4 Améliorations et étapes futures

Plusieurs points restent encore à réaliser pour amener le projet à maturité :

- Développer un système d'authentification sécurisé (par exemple via l'OIIQ)
- Finaliser l'intégration Epic/HALO une fois la validation obtenue
- Compléter le système de génération de constats pour toutes les tables d'évaluation
- Intégrer les modules en attente (objectifs de soins, équipe interdisciplinaire, plan de traitement, médication) une fois les spécifications reçues
- Effectuer des tests cliniques et techniques afin de valider l'efficacité et la fiabilité de l'outil
- Procéder à un déploiement progressif (versions internes, puis version pilote)
- Optimiser l'interface avec des captures cliniques illustratives (schémas de localisation des plaies)
- Implémenter la prise de photo avec mesure des dimensions dans une version ultérieure

### 10.5 Conclusion générale

En résumé, App Soin Plaie constitue une expérience formatrice et enrichissante, alliant informatique et clinique. Même si le projet est encore en cours et non déployé, il démontre déjà un potentiel concret pour améliorer la qualité et la standardisation des soins de plaies.

Le développement de l'application a représenté un défi technique significatif, nécessitant la conception d'une architecture innovante basée sur une approche déclarative pour gérer la complexité des formulaires cliniques. Les principales réalisations incluent la création d'un système de rendu dynamique permettant l'affichage automatique des interfaces à partir de configurations JSON, le développement d'un moteur de génération de constats cliniques, et l'implémentation d'un système de stockage local sécurisé.

Malgré les défis rencontrés, notamment la transformation des tableaux cliniques complexes en algorithmes performants et les délais liés aux validations externes, le projet a progressé de manière significative. L'application est actuellement fonctionnelle pour les évaluations de base et la génération de certains constats, avec plusieurs modules en cours de développement ou en attente de spécifications.

Ce travail a permis d'acquérir des compétences techniques, organisationnelles et professionnelles transférables à d'autres projets. Il servira également de fondation pour de futures évolutions de l'application, avec une vision tournée vers la sécurité, la fiabilité et l'intégration dans le milieu clinique.

---

## 11. Références

### 11.1 Documentation technique

Expo. (2024). *Expo Documentation*. https://docs.expo.dev/

Facebook. (2024). *React Native Documentation*. https://reactnative.dev/

React. (2024). *React Documentation*. https://react.dev/

React Navigation. (2024). *React Navigation Documentation*. https://reactnavigation.org/

Redux Toolkit. (2024). *Redux Toolkit Documentation*. https://redux-toolkit.js.org/

### 11.2 Standards médicaux et intégration

HL7 International. (2024). *FHIR Release 4*. https://www.hl7.org/fhir/

Epic Systems Corporation. (2024). *Epic on FHIR*. https://fhir.epic.com/

### 11.3 Outils de développement

Visual Studio Code. (2024). https://code.visualstudio.com

Git. (2024). *Git Documentation*. https://git-scm.com/doc

Node.js. (2024). *Node.js Documentation*. https://nodejs.org

### 11.4 Standards et bonnes pratiques

Material Design Guidelines. (2024). https://material.io/design

Apple Human Interface Guidelines. (2024). https://developer.apple.com/design/human-interface-guidelines/

Android Design Guidelines. (2024). https://developer.android.com/design

---

## 12. Annexes

### Annexe A : Structure des fichiers JSON

Voir le fichier `DOCUMENTATION_TECHNIQUE_EVALUATION.md` pour une documentation complète de la structure des fichiers JSON et du système de rendu.

### Annexe B : Procédures d'installation

Voir le fichier `README.md` pour les procédures détaillées d'installation et de configuration de l'environnement de développement.

### Annexe C : Liste des tables d'évaluation

- C1T01 : Données de base
- C1T02 : Allergies
- C1T03 : Conditions de santé actuelle
- C1T04 : Poids & IMC
- C1T05 : Nutrition
- C1T06 : Facteurs de risque
- C1T07 : Médication active
- C1T08 : Environnement psychosocial
- C1T09 : Assurances
- C1T10 : Niveau de soins
- C1T11 : Histoire de la plaie
- C1T12 : Symptômes
- C1T13 : Perceptions et objectifs
- C1T14 : Emplacement de la plaie
- C1T15 : Apport vasculaire
- C1T16 à C1T26 : Évaluations BWAT (Bates-Jensen Wound Assessment Tool)
- C1T27 : Signes et symptômes d'infection
- C1T28 : Tests de laboratoire
- C1T29 : Échelle de Braden
- C1T30 : Échelle de Braden Q
- C1T31 : Lésion de pression
- C1T32 : Ulcère veineux
- C1T33 : Ulcère artériel / Lymphœdème
- C1T34 : Pied diabétique

### Annexe D : Technologies et librairies utilisées

- React Native 0.81.5
- Expo 54.0.22
- React 19.1.0
- React Navigation 7.x
- Redux Toolkit 2.9.0
- Expo Secure Store 15.0.7
- Expo Font 14.0.9
- React Native Gesture Handler 2.28.0
- React Native Reanimated 4.1.1
- React Native SVG 15.12.1

### Annexe E : Structure de l'architecture déclarative

L'architecture déclarative permet de définir les formulaires d'évaluation dans des fichiers JSON. Chaque table d'évaluation suit une structure standardisée avec :

- Métadonnées (id, title, description, category)
- Éléments (champs du formulaire avec type, label, validation, UI)
- Routes (navigation conditionnelle et déclenchement de constats)
- Règles de validation

Les tables de constats (`col2_constats`) définissent les règles de génération automatique via `source_mapping` qui lie les données d'évaluation aux constats à afficher.

---

*Fin du rapport*
