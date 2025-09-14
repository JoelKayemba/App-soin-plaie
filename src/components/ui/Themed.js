// src/components/ui/Themed.js
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext'; // Utiliser le contexte au lieu du hook

export const TView = ({ style, surface = false, ...props }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: surface ? colors.surface : colors.background },
        style,
      ]}
      {...props}
    />
  );
};

export const TText = ({ style, muted = false, onPrimary = false, ...props }) => {
  const { colors } = useTheme();

  const color = onPrimary
    ? colors.textLight
    : muted
      ? colors.black
      : colors.black;

  return <Text style={[{ color }, style]} {...props} />;
};

export const TIcon = ({ name, size = 24, onPrimary = false, color, style,onPress, ...props }) => {
  const { colors } = useTheme();
  return (
    <Ionicons
      name={name}
      size={size}
      color={color || (onPrimary ? colors.textLight : colors.black)}
      style={style}
      onPress={onPress}
      {...props}
    />
  );
};

export const TGradientHeader = ({ children, style }) => {
  const { colors, theme } = useTheme();
  
  // Définir les dégradés pour chaque thème
  const gradientColors = theme === 'dark' 
    ? [colors.background, colors.background] 
    : ['#FFFFFF', colors.background];
    
  return (
    <LinearGradient colors={gradientColors} style={style}>
      {children}
    </LinearGradient>
  );
};