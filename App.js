// App.js
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import ThemeProvider, { useTheme } from './src/context/ThemeContext';

function ThemedNavigation() {
  const { theme, colors } = useTheme();

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
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
