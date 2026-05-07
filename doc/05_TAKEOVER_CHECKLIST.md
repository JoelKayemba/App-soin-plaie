# Checklist de Reprise Projet

## J+0 - Prise en main immediate

- [ ] Installer et lancer le projet (voir `01_RUNBOOK_INSTALLATION.md`)
- [ ] Verifier navigation principale (tabs + stack)
- [ ] Verifier flux evaluation de bout en bout jusqu'a `EvaluationSummary`
- [ ] Ouvrir `ConstatsScreen` et confirmer generation
- [ ] Verifier ecran `BodyModel3D` (viewer 3D)

## J+1 - Stabilisation technique

- [ ] Nettoyer secrets et preparer `.env.example`
- [ ] Qualifier stockage des evaluations (volume, retention, purge)
- [ ] Capturer bugs bloquants (evaluation/constats/3D)
- [ ] Definir baseline de qualite (lint, tests, smoke tests)

## J+2/J+5 - Priorites metier

- [ ] Finaliser les regles constats prioritaires
- [ ] Valider avec referent clinique
- [ ] Documenter regles confirmees table par table
- [ ] Corriger divergences schema JSON vs rendu

## Sprint suivant - Industrialisation

- [ ] Finaliser integration Epic (incluant envoi evaluation)
- [ ] Ajouter tests automatises sur:
  - [ ] `TableDataLoader`
  - [ ] `ConstatsGenerator`
  - [ ] Flux `EvaluationScreen -> Summary -> Constats`
- [ ] Mettre en place convention de versioning doc/code

## Definition of Done recommandee pour reprise

- [ ] Documentation README/doc coherente et a jour
- [ ] Flux principal evalue sur Android/iOS
- [ ] Constats verifies sur cas de test metier
- [ ] Gestion erreur et persistance robuste
- [ ] Secrets et configuration externalises proprement

