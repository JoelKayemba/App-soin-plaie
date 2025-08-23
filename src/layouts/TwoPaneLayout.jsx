// (sidebar + contenu) pour tablette
//Affiche 1 colonne sur téléphone,
//panneaux dès expanded (≈≥900px),
// la bordure/ombre automatiquement.

import React from 'react';
import { View } from 'react-native';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';

const TwoPaneLayout = ({ sidebar, children, minSidebar = 280, maxSidebar = 360 }) => {
  const { colors, elevation } = useThemeMode();
  const { windowClass, spacing } = useResponsive();

  const showSplit = windowClass === 'expanded' || windowClass === 'wide';
  const sidebarWidth = Math.min(Math.max(minSidebar, 320), maxSidebar);

  if (!showSplit) {
    // Empilement mobile
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
      <View
        style={{
          width: sidebarWidth,
          backgroundColor: colors.surface,
          borderRightWidth: 1,
          borderRightColor: colors.border,
          ...elevation(2),
        }}
      >
        {sidebar}
      </View>

      <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
        {children}
      </View>
    </View>
  );
};

export default TwoPaneLayout;
