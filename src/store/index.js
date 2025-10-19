// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import { favoritesPersistenceMiddleware } from './favoritesPersistence';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(favoritesPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

