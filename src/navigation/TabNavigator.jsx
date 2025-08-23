// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet, Platform } from 'react-native';

import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';

// Écrans
import HomeScreen from '@/app/HomeScreen';
import EvaluationScreen from '@/app/EvaluationScreen';
import ProductsScreen from '@/app/ProductsScreen';
import LexiqueScreen from '@/app/LexiqueScreen';

const Tab = createBottomTabNavigator();

// Icône custom pour "Soins"
const CareIcon = ({ focused, color, size }) => {
  const { colors } = useThemeMode();

  const heartColor = focused ? colors.secondary : color;

  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={focused ? 'hand-left' : 'hand-left-outline'}
        size={size - 2}
        color={color}
      />
      <Ionicons
        name="heart"
        size={Math.max(14, Math.round(size / 2.5))}
        color={heartColor}
        style={styles.heartIcon}
      />
    </View>
  );
};

export default function TabNavigator() {
  const { colors, theme } = useThemeMode();
  const { windowClass, spacing, typeScale, isTablet } = useResponsive();

  // Hauteur/tailles adaptatives
  const tabHeight =
    windowClass === 'wide' ? 84 :
    windowClass === 'expanded' ? 78 :
    70;

  const labelFontSize =
    windowClass === 'wide' ? 13 :
    windowClass === 'expanded' ? 12 :
    11;

  const iconSize =
    windowClass === 'wide' ? 28 :
    windowClass === 'expanded' ? 26 :
    24;

  const ICONS = {
    Accueil: { active: 'home', inactive: 'home-outline' },
    Soins:   { component: CareIcon },
    Produits:{ active: 'bandage', inactive: 'bandage-outline' },
    Lexique: { active: 'book', inactive: 'book-outline' },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const icon = ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: theme === 'dark' ? '#94A3B8' : '#64748B',
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: Platform.OS === 'android' ? StyleSheet.hairlineWidth : 1,
            height: tabHeight,
            paddingTop: spacing.sm,
            paddingBottom: Platform.select({
              ios: spacing.sm + 4,
              android: spacing.sm,
              default: spacing.sm,
            }),
          },
          tabBarLabelStyle: {
            fontSize: labelFontSize * typeScale,
            fontWeight: '500',
            marginTop: -2,
          },
          tabBarIcon: ({ focused, color }) => {
            // Icône custom pour Soins
            if (route.name === 'Soins') {
              return <CareIcon focused={focused} color={color} size={iconSize} />;
            }
            // Icônes standard
            const name = focused ? icon.active : icon.inactive;
            return <Ionicons name={name} size={iconSize} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Soins" component={EvaluationScreen} />
      <Tab.Screen name="Produits" component={ProductsScreen} />
      <Tab.Screen name="Lexique" component={LexiqueScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    position: 'absolute',
    top: -4,
    right: -6,
  },
});
