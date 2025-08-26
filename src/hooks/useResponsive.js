// src/hooks/useResponsive.js
import { useMemo } from 'react';
import { useWindowDimensions, Platform } from 'react-native';

export const BREAKPOINTS = {
  compact: 0,      // téléphone
  medium: 600,     // grand téléphone / pliable
  expanded: 900,   // tablette portrait+
  wide: 1200,      // tablette landscape / desktop-like
};

export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const windowClass =
    width >= BREAKPOINTS.wide ? 'wide' :
    width >= BREAKPOINTS.expanded ? 'expanded' :
    width >= BREAKPOINTS.medium ? 'medium' : 'compact';

  const isTablet = width >= BREAKPOINTS.expanded || (Platform.OS === 'ios' && width >= 768);

  // Colonnes par défaut pour les grilles de cartes
  const gridColumns =
    windowClass === 'wide' ? 4 :
    windowClass === 'expanded' ? 3 :
    windowClass === 'medium' ? 2 : 1;

  // Échelle typographique & spacing
  const typeScale =
    windowClass === 'wide' ? 1.2 :
    windowClass === 'expanded' ? 1.12 :
    windowClass === 'medium' ? 1.06 : 1.0;

  const spacing = useMemo(() => {
    const base = 8;
    const factor =
      windowClass === 'wide' ? 1.5 :
      windowClass === 'expanded' ? 1.3 :
      windowClass === 'medium' ? 1.15 : 1.0;
    return {
      xs: Math.round(base * 0.5 * factor),
      sm: Math.round(base * 1.0 * factor),
      md: Math.round(base * 1.5 * factor),
      lg: Math.round(base * 2.0 * factor),
      xl: Math.round(base * 3.0 * factor),
    };
  }, [windowClass]);

  return {
    width,
    height,
    isLandscape,
    isTablet,
    windowClass,   // 'compact' | 'medium' | 'expanded' | 'wide'
    gridColumns,
    typeScale,
    spacing,
  };
}
