
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import baseColors from '@/styles/colors';

const withAlpha = (hex, alpha = 'FF') => {
  if (!hex) return hex;
  const clean = hex.replace('#', '');
  if (clean.length === 8) return `#${clean.slice(0, 6)}${alpha}`;
  return `#${clean}${alpha}`;
};

export const useThemeMode = () => {
  const { theme, toggleTheme } = useTheme(); // 'light' ou 'dark'
  const isDark = theme === 'dark';

  const colors = useMemo(() => {
    const palette = isDark ? baseColors.dark : baseColors.light;
    return {
      ...palette,
      headerGradient: isDark
        ? [palette.surface, palette.background]
        : ['#FFFFFF', palette.background],
    };
  }, [isDark]);

  const t = (keyOrHex, alpha = 'FF') => {
    const val = colors[keyOrHex] || keyOrHex;
    return withAlpha(val, alpha);
  };

  const elevation = (level = 1) => {
    const map = {
      1: { shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
      2: { shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
      3: { shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
    };
    return map[level] || map[2];
  };

  const makeStyles = (factory) => () => StyleSheet.create(factory(colors, isDark, t, elevation));

  return { theme, isDark, colors, toggleTheme, makeStyles, t, elevation };
};
