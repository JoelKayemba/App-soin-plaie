// src/store/favoritesPersistence.js
import * as SecureStore from 'expo-secure-store';

const FAVORITES_STORAGE_KEY = 'user_favorites';

// Charger les favoris depuis le stockage sécurisé
export const loadFavoritesFromStorage = async () => {
  try {
    const favoritesJson = await SecureStore.getItemAsync(FAVORITES_STORAGE_KEY);
    if (favoritesJson) {
      const favorites = JSON.parse(favoritesJson);
      console.log('Favoris chargés depuis le stockage:', favorites);
      return favorites;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error);
  }
  
  // Retourner l'état initial si aucune donnée n'est trouvée
  return {
    products: [],
    lexiques: [],
    references: [],
  };
};

// Sauvegarder les favoris dans le stockage sécurisé
export const saveFavoritesToStorage = async (favorites) => {
  try {
    const favoritesJson = JSON.stringify(favorites);
    await SecureStore.setItemAsync(FAVORITES_STORAGE_KEY, favoritesJson);
    console.log('Favoris sauvegardés:', favorites);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des favoris:', error);
  }
};

// Middleware Redux pour persister automatiquement les favoris
export const favoritesPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Vérifier si l'action concerne les favoris
  const favoritesActions = [
    'favorites/addProductToFavorites',
    'favorites/removeProductFromFavorites',
    'favorites/toggleProductFavorite',
    'favorites/addLexiqueToFavorites',
    'favorites/removeLexiqueFromFavorites',
    'favorites/toggleLexiqueFavorite',
    'favorites/addReferenceToFavorites',
    'favorites/removeReferenceFromFavorites',
    'favorites/toggleReferenceFavorite',
    'favorites/clearAllFavorites',
  ];
  
  if (favoritesActions.includes(action.type)) {
    // Sauvegarder les favoris après chaque modification
    const favorites = store.getState().favorites;
    saveFavoritesToStorage(favorites);
  }
  
  return result;
};
