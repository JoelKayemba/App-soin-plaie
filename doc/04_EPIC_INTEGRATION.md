# Integration Epic / HALO

## Portee

Cette doc decrit l'etat actuel de l'integration Epic SMART on FHIR.

## Composants techniques

- `src/context/EpicContext.jsx`
- `src/hooks/useEpicAuth.js`
- `src/integration/epic/services/EpicAuthService.js`
- `src/integration/epic/services/EpicFHIRService.js`
- `src/integration/epic/mappers/EpicDataMapper.js`
- `src/config/epic.js`

## Capacites en place

- Initialisation config Epic depuis variables d'environnement
- Detection lancement Epic (`launch`, `iss`)
- Auth OAuth2/PKCE (SMART)
- Recuperation de ressources patient principales
- Mapping Epic -> champs evaluation (partiel selon ressources)

## Capacites non finalisees

- Envoi complet d'une evaluation vers Epic (placeholder dans `EpicContext.sendEvaluationToEpic`)
- Stabilisation environnement production
- Validation metier complete des mappings
- Couverture de tests de bout en bout

## Configuration

Les variables attendues sont dans `.env` et consommees par:

- `src/config/epic.js` (principal, via `@env`)
- `src/config/env.js` (exports annexes)

Points de vigilance:

- Le `.env` present contient des valeurs non neutralisees.
- Prevoir une hygiene de secret avant transfert externe (rotation, placeholders, `.env.example`).

## Reprise recommandee (Epic)

1. Nettoyer secret management (`.env.example`, rotation credentials).
2. Verifier flux auth sandbox complet.
3. Finaliser mapper inverse evaluation -> ressources FHIR.
4. Definir strategie de retry/error handling reseau.
5. Ajouter plan de tests integration sandbox.

