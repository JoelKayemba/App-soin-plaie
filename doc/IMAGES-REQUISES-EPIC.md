# 🖼️ Images Requises pour Epic on FHIR

## ✅ Problème Identifié

Epic on FHIR peut nécessiter des **images** (logo, icône) pour activer l'application. Si ces champs sont requis et vides, l'application restera en "Draft".

## 📋 Images Potentiellement Requises

Dans Epic on FHIR, cherchez des sections comme :

- **Application Logo** ou **App Logo**
- **Icon** ou **Application Icon**
- **Splash Screen** (généralement optionnel)
- **Screenshots** (généralement optionnel)

## 🎯 Solution : Créer/Utiliser des Images

### Option 1 : Utiliser les Assets Existants de l'App

Votre application React Native/Expo a déjà des assets :

1. **Cherchez dans le dossier `assets/`** :
   - `icon.png` - Icône de l'application
   - `adaptive-icon.png` - Icône adaptative (Android)
   - `splash-icon.png` - Image de splash screen

2. **Où trouver ces fichiers** :
   - Racine du projet : `assets/icon.png`
   - Ou : `app-soin-plaie/assets/icon.png`

### Option 2 : Télécharger des Images dans Epic

1. **Dans Epic on FHIR** :
   - Allez dans la section "Basic Info" ou "Appearance"
   - Cherchez les champs d'upload d'images
   - Téléchargez vos images

2. **Spécifications recommandées** :
   - **Logo** : 512x512 pixels (PNG avec fond transparent)
   - **Icône** : 512x512 pixels (PNG avec fond transparent)
   - **Format** : PNG (avec transparence si possible)

### Option 3 : Créer une Image Simple

Si vous n'avez pas d'image, vous pouvez créer une image simple :

1. **Utilisez un outil en ligne** :
   - Canva : https://www.canva.com/
   - Figma : https://www.figma.com/
   - GIMP (gratuit) : https://www.gimp.org/

2. **Spécifications** :
   - Taille : 512x512 pixels
   - Format : PNG
   - Contenu : Logo "PlaieMobile" ou texte simple
   - Fond : Transparent ou couleur unie

3. **Enregistrez** l'image

## 🔍 Où Trouver les Champs d'Images dans Epic

Dans Epic on FHIR, les champs d'images peuvent être dans :

1. **Onglet "Basic Info"** :
   - Application Logo
   - Application Icon

2. **Onglet "Appearance"** :
   - Logo
   - Icon
   - Screenshots

3. **Section "Marketing"** (si disponible) :
   - App Store Images
   - Screenshots

## ✅ Vérification

1. **Parcourez tous les onglets** dans Epic on FHIR
2. **Cherchez les champs d'upload d'images**
3. **Vérifiez s'ils sont marqués comme requis** :
   - Astérisque rouge (*)
   - Texte "Required" ou "Requis"
   - Champ surligné en rouge

4. **Si requis** :
   - Téléchargez une image
   - Sauvegardez
   - Réessayez "Save & Ready for Sandbox"

## 📝 Checklist Images

- [ ] Application Logo téléchargé (si requis)
- [ ] Application Icon téléchargé (si requis)
- [ ] Format correct (PNG, 512x512 recommandé)
- [ ] Images sauvegardées dans Epic
- [ ] Aucune erreur liée aux images

## 🎨 Images Minimales Acceptables

Si vous devez créer rapidement des images :

1. **Logo simple** :
   - Texte "PlaieMobile" sur fond coloré
   - 512x512 pixels
   - PNG

2. **Icône simple** :
   - Symbole médical (croix, coeur, etc.)
   - 512x512 pixels
   - PNG avec transparence

3. **Outil rapide** :
   - Canva (gratuit, templates disponibles)
   - Créez en 2-3 minutes

## 💡 Astuce

**Pour tester rapidement** :
- Créez une image simple 512x512 pixels avec juste le texte "PlaieMobile"
- Téléchargez-la dans Epic comme logo et icône
- Sauvegardez et réessayez l'activation
- Vous pourrez la remplacer plus tard par une meilleure image

## 🔄 Après Ajout des Images

1. **Téléchargez les images** dans Epic
2. **Sauvegardez** (cliquez "Save")
3. **Cliquez "Save & Ready for Sandbox"**
4. **Vérifiez** que le statut passe à "Active"

---

**Action immédiate** : Vérifiez dans Epic on FHIR s'il y a des champs d'images marqués comme requis (avec un astérisque rouge ou "Required"). Si oui, téléchargez des images et réessayez.

