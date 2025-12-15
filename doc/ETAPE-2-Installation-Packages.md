# ✅ ÉTAPE 2 : Installation des Packages

**Statut** : ✅ Complétée  
**Packages installés** : expo-crypto, expo-linking, react-native-dotenv

---

## 📦 Packages Installés

### 1. expo-crypto
**Utilité** : Génération de codes PKCE pour la sécurité OAuth  
**Installé** : ✅ `expo-crypto`

### 2. expo-linking
**Utilité** : Gestion des Deep Links (callbacks OAuth depuis Epic)  
**Installé** : ✅ `expo-linking`

### 3. react-native-dotenv
**Utilité** : Lecture des variables d'environnement depuis `.env`  
**Installé** : ✅ `react-native-dotenv`  
**Configuré** : ✅ `babel.config.js` mis à jour

---

## ⚙️ Configuration Effectuée

### babel.config.js
Le fichier a été mis à jour pour inclure le plugin `react-native-dotenv` :

```javascript
['module:react-native-dotenv', {
  moduleName: '@env',
  path: '.env',
  // ...
}]
```

### src/config/env.js
Fichier créé pour exporter les variables d'environnement de manière typée.

### src/config/epic.js
Mis à jour pour utiliser les imports depuis `@env`.

---

## 🔄 Action Requise : Redémarrer le Serveur Expo

**⚠️ IMPORTANT** : Vous devez redémarrer le serveur Expo pour que les changements Babel soient pris en compte.

### Étapes :

1. **Arrêter le serveur Expo** (Ctrl+C dans le terminal)
2. **Redémarrer** :
   ```bash
   npm start
   # ou
   npx expo start
   ```
3. **Vider le cache si nécessaire** :
   ```bash
   npx expo start -c
   ```

---

## ✅ Vérification

Pour vérifier que tout fonctionne, testez dans votre code :

```javascript
import { getEpicConfig, logEpicConfig } from '@/config/epic';

// Afficher la configuration
logEpicConfig();

// Vérifier que le Client ID est chargé
const config = getEpicConfig();
console.log('Client ID:', config.clientId);
```

Si vous voyez votre Client ID dans la console, c'est que ça fonctionne ! ✅

---

## 🐛 Dépannage

### Les variables d'environnement ne sont pas chargées ?

1. **Vérifiez** que le fichier `.env` existe à la racine du projet
2. **Vérifiez** que les variables sont bien définies dans `.env`
3. **Redémarrez** le serveur Expo avec cache vide : `npx expo start -c`
4. **Vérifiez** que `babel.config.js` contient bien le plugin `react-native-dotenv`

### Erreur "Cannot find module '@env'" ?

- Assurez-vous d'avoir redémarré le serveur Expo
- Vérifiez que `babel.config.js` est bien configuré
- Essayez de vider le cache : `npx expo start -c`

---

## ✅ Prochaine Étape

**ÉTAPE 3** : Créer la structure des dossiers (`src/integration/epic/`)

---

*Étape complétée le : Janvier 2025*




