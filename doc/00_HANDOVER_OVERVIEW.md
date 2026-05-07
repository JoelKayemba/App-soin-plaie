# Passation Projet - Vue d'ensemble

## Objectif

Ce document présente l'etat reel du projet pour une reprise rapide et fiable par une nouvelle equipe.

## Contexte fonctionnel

`App Soin Plaie` est une application mobile Expo/React Native d'aide a la decision clinique en soins de plaies.

Fonctionnalites principales:

- Evaluation clinique guidee (tables dynamiques JSON)
- Generation automatique de constats (colonne 2)
- Outils cliniques annexes (IPSCB, Braden, Braden Q)
- Lexique, references et catalogue produits
- Debut d'integration Epic/SMART on FHIR

## Etat de livraison (important)

- Le projet est **en cours**, pas termine.
- Le flux principal a ete mene jusqu'au module **Constats**.
- La partie constats est **partiellement complete**: moteur, ecrans et mapping sont en place, mais toutes les regles/metiers ne sont pas finalisees.
- L'integration Epic est en etat **partiel** (auth + chargement patient avances, envoi vers Epic non implemente).

## Perimetre technique actuel

- Stack: Expo 54, React Native 0.81, React 19, React Navigation 7, Redux Toolkit.
- Architecture orientee configuration: formulaires declares en JSON, rendus dynamiquement.
- Stockage local d'evaluation actuel dans `expo-secure-store`.
- Viewer 3D de localisation en cours d'integration via WebView/ecran dedie.

## Risques et points d'attention

1. **Dette documentaire historique**
   - Les anciens plans de travail ont ete supprimes et remplaces par la presente base doc.
2. **Etat non final des constats**
   - Le module fonctionne, mais necessite validation clinique et completion de regles.
3. **Stockage des evaluations**
   - Le stockage est operationnel mais la strategie long terme doit etre revalidee (taille, retention, suppression).
4. **Variables sensibles**
   - Le fichier `.env` contient des valeurs de test qui doivent etre nettoyees avant transfer externe.

## Ordre de lecture recommande

1. `doc/01_RUNBOOK_INSTALLATION.md`
2. `doc/02_ARCHITECTURE.md`
3. `doc/03_EVALUATION_ENGINE.md`
4. `doc/04_EPIC_INTEGRATION.md`
5. `doc/05_TAKEOVER_CHECKLIST.md`

