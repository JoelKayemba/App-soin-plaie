// src/components/SectionHeader.js
import React from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { TGradientHeader, TIcon, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';


const SectionHeader = ({ 
  appName = 'SoinsExpert', 
  searchValue, 
  onChangeText, 
  onPressSettings = () => console.log('Settings pressed'),
  onPressSearch = () => console.log('Search pressed')
}) => {
  const { isDark, toggleTheme , colors} = useTheme();

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

      {/* Barre de recherche cliquable */}
      <TouchableOpacity 
        style={[styles.searchBar, { 
          backgroundColor: isDark ? colors.surface : colors.surfaceLight,
          shadowColor: isDark ? 'transparent' : '#000',
        }]}
        onPress={onPressSearch}
        activeOpacity={0.7}
      >
        <TIcon name="search" size={20} style={styles.searchIcon} />
        <TText style={[styles.searchPlaceholder, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          Rechercher un soin, produit...
        </TText>
      </TouchableOpacity>
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
    height: 50,
    borderRadius: 50,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { 
    marginRight: 10 
  },
  searchPlaceholder: { 
    fontSize: 16,
    flex: 1,
  }
});

export default SectionHeader;