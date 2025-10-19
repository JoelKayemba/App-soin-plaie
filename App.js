// App.js
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import ThemeProvider, { useTheme } from './src/context/ThemeContext';
import { FontSizeProvider } from './src/hooks/useFontSize';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import { loadFavoritesFromStorage } from './src/store/favoritesPersistence';
import { initializeFavorites } from './src/store/favoritesSlice';

function ThemedNavigation() {
  const { theme, colors } = useTheme();
  const dispatch = useDispatch();

  // Charger les favoris au démarrage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await loadFavoritesFromStorage();
        dispatch(initializeFavorites(savedFavorites));
        console.log('Favoris initialisés:', savedFavorites);
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    };

    loadFavorites();
  }, [dispatch]);

  // On crée un thème pour la navigation basé sur nos couleurs
  const navTheme = theme === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
          notification: colors.secondary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
          notification: colors.secondary,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <ThemedNavigation />
          </FontSizeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
