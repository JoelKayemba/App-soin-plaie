// src/store/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],      // IDs des produits favoris
  lexiques: [],     // Termes du lexique favoris
  references: [],   // IDs des références favorites
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Actions pour les produits
    addProductToFavorites: (state, action) => {
      const productId = action.payload;
      if (!state.products.includes(productId)) {
        state.products.push(productId);
      }
    },
    removeProductFromFavorites: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter(id => id !== productId);
    },
    toggleProductFavorite: (state, action) => {
      const productId = action.payload;
      const index = state.products.indexOf(productId);
      if (index > -1) {
        state.products.splice(index, 1);
      } else {
        state.products.push(productId);
      }
    },

    // Actions pour le lexique
    addLexiqueToFavorites: (state, action) => {
      const terme = action.payload;
      if (!state.lexiques.includes(terme)) {
        state.lexiques.push(terme);
      }
    },
    removeLexiqueFromFavorites: (state, action) => {
      const terme = action.payload;
      state.lexiques = state.lexiques.filter(t => t !== terme);
    },
    toggleLexiqueFavorite: (state, action) => {
      const terme = action.payload;
      const index = state.lexiques.indexOf(terme);
      if (index > -1) {
        state.lexiques.splice(index, 1);
      } else {
        state.lexiques.push(terme);
      }
    },

    // Actions pour les références
    addReferenceToFavorites: (state, action) => {
      const referenceId = action.payload;
      if (!state.references.includes(referenceId)) {
        state.references.push(referenceId);
      }
    },
    removeReferenceFromFavorites: (state, action) => {
      const referenceId = action.payload;
      state.references = state.references.filter(id => id !== referenceId);
    },
    toggleReferenceFavorite: (state, action) => {
      const referenceId = action.payload;
      const index = state.references.indexOf(referenceId);
      if (index > -1) {
        state.references.splice(index, 1);
      } else {
        state.references.push(referenceId);
      }
    },

    // Action pour vider tous les favoris
    clearAllFavorites: (state) => {
      state.products = [];
      state.lexiques = [];
      state.references = [];
    },

    // Action pour initialiser les favoris avec les données sauvegardées
    initializeFavorites: (state, action) => {
      const { products, lexiques, references } = action.payload;
      state.products = products || [];
      state.lexiques = lexiques || [];
      state.references = references || [];
    },
  },
});

export const {
  addProductToFavorites,
  removeProductFromFavorites,
  toggleProductFavorite,
  addLexiqueToFavorites,
  removeLexiqueFromFavorites,
  toggleLexiqueFavorite,
  addReferenceToFavorites,
  removeReferenceFromFavorites,
  toggleReferenceFavorite,
  clearAllFavorites,
  initializeFavorites,
} = favoritesSlice.actions;

// Sélecteurs
export const selectAllFavorites = (state) => state.favorites;
export const selectFavoriteProducts = (state) => state.favorites.products;
export const selectFavoriteLexiques = (state) => state.favorites.lexiques;
export const selectFavoriteReferences = (state) => state.favorites.references;

export const selectIsProductFavorite = (state, productId) => 
  state.favorites.products.includes(productId);

export const selectIsLexiqueFavorite = (state, terme) => 
  state.favorites.lexiques.includes(terme);

export const selectIsReferenceFavorite = (state, referenceId) => 
  state.favorites.references.includes(referenceId);

export const selectFavoritesCount = (state) => 
  state.favorites.products.length + 
  state.favorites.lexiques.length + 
  state.favorites.references.length;

export default favoritesSlice.reducer;

