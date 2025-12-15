# 🚀 Instructions Rapides : Fichier .env

## ✅ Ce que vous devez faire MAINTENANT

### 1. Créer le fichier .env

```bash
# Depuis la racine du projet app-soin-plaie
cp env.template .env
```

**OU** créez simplement un fichier `.env` à la racine du projet.

### 2. Remplir avec VOS valeurs Epic

Ouvrez le fichier `.env` et remplissez **UNIQUEMENT** ces lignes :

```env
# ⚠️ REMPLACEZ cette ligne avec VOTRE Client ID depuis Epic
EPIC_CLIENT_ID_SANDBOX=VOICI_VOTRE_CLIENT_ID_ICI

# Vérifiez que ces valeurs correspondent à votre configuration Epic
EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback
```

### 3. Vérifier les autres valeurs

Les autres valeurs peuvent rester telles quelles, SAUF si vous avez configuré différemment dans Epic :

```env
EPIC_SCOPES_SANDBOX=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access
```

**Si vous avez sélectionné d'autres scopes dans Epic**, remplacez cette ligne.

---

## 🔍 Où trouver votre Client ID

1. Allez sur https://fhir.epic.com/
2. Connectez-vous
3. Cliquez sur votre application
4. Cherchez **"Client ID (Non-Production)"**
5. Copiez la valeur (ex: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

## 📝 Exemple de .env complet

```env
EPIC_CLIENT_ID_SANDBOX=a1b2c3d4-e5f6-7890-abcd-ef1234567890
EPIC_SANDBOX_BASE_URL=https://fhir.epic.com/interconnect-fhir-oauth
EPIC_REDIRECT_URI_SANDBOX=app-soin-plaie://oauth/callback
EPIC_SCOPES_SANDBOX=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access

EPIC_CLIENT_ID_PRODUCTION=
EPIC_PRODUCTION_BASE_URL=
EPIC_REDIRECT_URI_PRODUCTION=app-soin-plaie://oauth/callback
EPIC_SCOPES_PRODUCTION=launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access

EPIC_MODE=sandbox
EPIC_FHIR_VERSION=R4
EPIC_SMART_VERSION=v2
EPIC_PKCE_METHOD=S256
EPIC_PKCE_VERIFIER_LENGTH=128

APP_NAME=App Soin Plaie
APP_VERSION=1.0.0
```

---

## ✅ Vérification

- [ ] Fichier `.env` créé
- [ ] `EPIC_CLIENT_ID_SANDBOX` rempli avec votre Client ID
- [ ] `EPIC_REDIRECT_URI_SANDBOX` correspond à celui dans Epic
- [ ] Les scopes correspondent à ceux dans Epic

**Une fois fait, dites-moi et je créerai le code pour utiliser ces variables !**




