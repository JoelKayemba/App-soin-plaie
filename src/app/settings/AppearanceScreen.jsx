// src/app/settings/AppearanceScreen.jsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import { useTheme } from '@/context/ThemeContext';
import { useFontSize } from '@/hooks/useFontSize';

const AppearanceScreen = ({ navigation }) => {
  const { makeStyles, colors, isDark, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();
  const { toggleTheme } = useTheme();
  const { fontSize, setFontSize, getAvailableSizes, isLoading } = useFontSize();

  const useStyles = makeStyles((c) => ({
    root: { 
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: c.background,
     
    },
    title: {
      fontSize: 24 * typeScale,
      fontWeight: '800',
      color: c.text,
      marginLeft: spacing.md,
      flex: 1,
      letterSpacing: -0.5,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginBottom: spacing.md,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      opacity: 0.7,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xs,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      
    },
    settingIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.xs,
    },
    settingSubtitle: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      lineHeight: 20,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggle: {
      width: 50,
      height: 30,
      borderRadius: 15,
      backgroundColor: isDark ? '#4F46E5' : '#4F46E5',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    toggleInactive: {
      backgroundColor: isDark ? '#374151' : '#D1D5DB',
    },
    toggleThumb: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      left: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 3,
    },
    toggleThumbActive: {
      left: 22,
    },
    fontSizeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xs,
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    fontSizeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.05)',
    },
    fontSizeLabel: {
      fontSize: 16 * typeScale,
      fontWeight: '500',
      color: c.text,
      flex: 1,
    },
    fontSizePreview: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      marginRight: spacing.sm,
    },
    fontSizePreviewSmall: {
      fontSize: 12 * typeScale,
    },
    fontSizePreviewMedium: {
      fontSize: 14 * typeScale,
    },
    fontSizePreviewLarge: {
      fontSize: 16 * typeScale,
    },
    checkIcon: {
      marginLeft: spacing.sm,
    },
  }));

  const s = useStyles();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleFontSizeChange = async (size) => {
    try {
      await setFontSize(size);
      Alert.alert(
        'Taille de police',
        `Taille de police changée pour ${getAvailableSizes().find(s => s.key === size)?.label || 'Moyenne'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de changer la taille de police');
    }
  };

  const getFontSizePreview = (size) => {
    const scale = getAvailableSizes().find(s => s.key === size)?.scale || 1.0;
    const baseSize = 14 * typeScale;
    return { fontSize: baseSize * scale };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* Header */}
        <View style={s.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <TText style={s.title}>Apparence</TText>
        </View>

        {/* Contenu */}
        <ScrollView 
          style={s.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        >
          {/* Section Thème */}
          <View style={s.section}>
            <TText style={s.sectionTitle}>Thème</TText>
            
            <View style={s.settingItem}>
              <View style={s.settingIconContainer}>
                <TIcon 
                  name={isDark ? 'moon' : 'sunny'} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              
              <View style={s.settingContent}>
                <TText style={s.settingTitle}>Mode sombre</TText>
                <TText style={s.settingSubtitle}>
                  {isDark ? 'Activé' : 'Désactivé'} - Basculez entre les thèmes clair et sombre
                </TText>
              </View>
              
              <View style={s.toggleContainer}>
                <TouchableOpacity
                  style={[s.toggle, !isDark && s.toggleInactive]}
                  onPress={handleThemeToggle}
                  activeOpacity={0.8}
                >
                  <View style={[s.toggleThumb, isDark && s.toggleThumbActive]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

           {/* Section Taille de police */}
           <View style={s.section}>
             <TText style={s.sectionTitle}>Taille de police</TText>
             
             {isLoading ? (
               <View style={s.fontSizeOption}>
                 <TText style={s.fontSizeLabel}>Chargement...</TText>
               </View>
             ) : (
               getAvailableSizes().map((sizeOption) => (
                 <TouchableOpacity
                   key={sizeOption.key}
                   style={[
                     s.fontSizeOption,
                     fontSize === sizeOption.key && s.fontSizeOptionActive
                   ]}
                   onPress={() => handleFontSizeChange(sizeOption.key)}
                   activeOpacity={0.7}
                 >
                   <TText style={s.fontSizeLabel}>
                     {sizeOption.label}
                   </TText>
                   
                   <TText style={[s.fontSizePreview, getFontSizePreview(sizeOption.key)]}>
                     Aa
                   </TText>
                   
                   {fontSize === sizeOption.key && (
                     <TIcon 
                       name="checkmark-circle" 
                       size={20} 
                       color={colors.primary} 
                       style={s.checkIcon}
                     />
                   )}
                 </TouchableOpacity>
               ))
             )}
           </View>
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

export default AppearanceScreen;
