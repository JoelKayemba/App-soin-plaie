// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext'; 
const SearchBar = ({ value, onChangeText, placeholder = 'Rechercher un soin, produit...', containerStyle }) => {
  const { isDark, colors } = useTheme();
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#2A2F3A' : colors.surfaceLight,
        shadowColor: isDark ? 'transparent' : '#000',
      }, 
      containerStyle
    ]}>
      <TIcon name="search" size={20} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
        style={[styles.input, { color: colors.text }]}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  icon: { 
    marginRight: 10 
  },
  input: { 
    flex: 1, 
    fontSize: 16,
    // Pour iOS
    paddingVertical: 8,
  },
});

export default SearchBar;