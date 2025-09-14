// src/components/SectionHeader.js
import React from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { TGradientHeader, TIcon, TText } from '@/components/ui/Themed';
import SearchBar from '@/components/common/SearchBar';
import { useTheme } from '@/context/ThemeContext';

const SectionHeader = ({ 
  appName = 'SoinsExpert', 
  searchValue, 
  onChangeText, 
  onPressSettings = () => console.log('Settings pressed') 
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <TGradientHeader style={styles.header}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.headerContent}>
        <View style={styles.logoRow}>
          <TIcon name="medkit" size={28} />
          <TText style={styles.appName}>{appName}</TText>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.iconBtn} 
            accessibilityLabel="Basculer le thème"
          >
            <TIcon name={isDark ? 'sunny' : 'moon'} size={24} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onPressSettings} 
            style={styles.iconBtn} 
            accessibilityLabel="Paramètres"
          >
            <TIcon name="settings" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de recherche */}
      <SearchBar 
        value={searchValue} 
        onChangeText={onChangeText} 
        containerStyle={styles.searchBar}
      />
    </TGradientHeader>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  appName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  actions: { 
    flexDirection: 'row' 
  },
  iconBtn: { 
    marginLeft: 15, 
    padding: 5 
  },
  searchBar: {
    // Styles supplémentaires si nécessaires
  }
});

export default SectionHeader;