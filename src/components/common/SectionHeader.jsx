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
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TGradientHeader style={[styles.header, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.headerContent}>
        <View style={styles.logoRow}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <TIcon name="medkit" size={24} color={colors.primaryText} />
          </View>
          <TText style={[styles.appName, { color: colors.text }]}>{appName}</TText>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={[styles.iconBtn, { 
              backgroundColor: colors.surface,
              shadowColor: isDark ? colors.shadow : colors.shadow,
            }]} 
            accessibilityLabel="Basculer le thème"
          >
            <TIcon 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color={colors.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onPressSettings} 
            style={[styles.iconBtn, { 
              backgroundColor: colors.surface,
              shadowColor: isDark ? colors.shadow : colors.shadow,
            }]} 
            accessibilityLabel="Paramètres"
          >
            <TIcon name="settings" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de recherche cliquable */}
      <TouchableOpacity 
        style={[styles.searchBar, { 
          backgroundColor: isDark ? colors.surface : colors.surfaceLight,
          borderColor: colors.border,
          shadowColor: isDark ? 'transparent' : colors.shadow,
        }]}
        onPress={onPressSearch}
        activeOpacity={0.7}
      >
        <TIcon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TText style={[styles.searchPlaceholder, { color: colors.textTertiary }]}>
          Rechercher un soin, produit...
        </TText>
      </TouchableOpacity>
    </TGradientHeader>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    minHeight: 44,
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  actions: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: { 
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBar: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: { 
    marginRight: 12,
  },
  searchPlaceholder: { 
    fontSize: 16,
    flex: 1,
    fontWeight: '400',
  }
});

export default SectionHeader;