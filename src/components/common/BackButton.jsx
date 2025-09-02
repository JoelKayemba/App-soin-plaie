// src/components/common/BackButton.jsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';

const BackButton = ({ 
  onPress, 
  style, 
  iconStyle, 
  size = 24,
  color,
  hitSlop = { top: 10, bottom: 10, left: 10, right: 10 }
}) => {
  const navigation = useNavigation();
  const { colors, elevation } = useThemeMode();
  const { spacing } = useResponsive();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  const buttonColor = color || colors.text;
  const iconColor = color || colors.text;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: colors.surfaceLight,
          padding: spacing.sm,
          ...elevation(1)
        },
        style
      ]}
      onPress={handlePress}
      hitSlop={hitSlop}
      accessibilityLabel="Retour"
      accessibilityRole="button"
    >
      <TIcon
        name="arrow-back"
        size={size}
        color={iconColor}
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  icon: {
    // Styles supplémentaires pour l'icône si nécessaire
  },
});

export default BackButton;







