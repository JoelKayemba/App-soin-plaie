import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import colors from '@/styles/colors';

const STORAGE_KEY = 'ui_theme';
const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme() || 'light';
  const [theme, setTheme] = useState(systemScheme);
  const [ready, setReady] = useState(false);

  // Récupérer thème sauvegardé
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          setTheme(saved);
        }
      } catch (err) {
        console.log(' Error loading theme:', err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Toggle et sauvegarde
  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, next);
    } catch (err) {
      console.log(' Error saving theme:', err);
    }
  };

  const palette = useMemo(() => colors[theme] || colors.light, [theme]);

  const value = useMemo(() => ({
    theme,
    colors: palette,
    isDark: theme === 'dark',
    toggleTheme,
    ready
  }), [theme, palette]);

  if (!ready) return null;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
