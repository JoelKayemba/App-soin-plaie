// src/app/SettingsScreen.jsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';

const SettingsScreen = ({ navigation }) => {
  const { makeStyles, colors, isDark, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

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
    chevronIcon: {
      marginLeft: spacing.sm,
      opacity: 0.5,
    },
    versionContainer: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      marginTop: 'auto',
    },
    versionText: {
      fontSize: 13 * typeScale,
      color: c.textSecondary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    appName: {
      fontSize: 15 * typeScale,
      fontWeight: '700',
      color: c.text,
      opacity: 0.8,
    },
    divider: {
      height: 1,
      backgroundColor: c.borderLight,
      marginVertical: spacing.lg,
      opacity: 0.5,
    },
    premiumBadge: {
      backgroundColor: '#FFD700',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 12,
      marginLeft: spacing.sm,
    },
    premiumText: {
      fontSize: 12 * typeScale,
      fontWeight: '800',
      color: '#000',
    },
  }));

  const s = useStyles();

  const handleOpenUrl = async (url, title) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erreur', `Impossible d'ouvrir ${title}`);
      }
    } catch (error) {
      Alert.alert('Erreur', `Impossible d'ouvrir ${title}`);
    }
  };

  const handleFavorites = () => {
    navigation.navigate('Favoris');
  };

  const handleAppearance = () => {
    navigation.navigate('AppearanceSettings');
  };


  const handlePrivacyPolicy = () => {
    handleOpenUrl('https://example.com/privacy', 'Politique de confidentialité');
  };

  const handleTermsOfService = () => {
    handleOpenUrl('https://example.com/terms', 'Conditions d\'utilisation');
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Support',
      'Pour toute question ou problème, contactez-nous à :\n\nsupport@soinsexpert.com',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Envoyer un email', 
          onPress: () => handleOpenUrl('mailto:support@soinsexpert.com', 'Email de support')
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'À propos',
      'SoinsExpert v1.0.0\n\nApplication d\'aide à la décision clinique en soins de plaies.\n\nDéveloppée pour les professionnels de la santé.',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    const storeUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/id123456789' 
      : 'market://details?id=com.soinsexpert.app';
    
    handleOpenUrl(storeUrl, 'Noter l\'application');
  };

  const handleFeedback = () => {
    Alert.alert(
      'Feedback',
      'Votre avis nous aide à améliorer l\'application. Comment souhaitez-vous nous faire part de vos commentaires ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => handleOpenUrl('mailto:feedback@soinsexpert.com?subject=Feedback SoinsExpert', 'Email de feedback')
        },
        { 
          text: 'App Store', 
          onPress: () => handleOpenUrl('https://apps.apple.com/app/id123456789', 'App Store')
        }
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Préférences',
      items: [
        {
          id: 'appearance',
          icon: 'color-palette',
          title: 'Apparence',
          subtitle: 'Thème sombre, taille du texte',
          onPress: handleAppearance,
        },
        {
          id: 'favorites',
          icon: 'star',
          title: 'Mes favoris',
          subtitle: 'Produits et termes sauvegardés',
          onPress: handleFavorites,
        },
      ]
    },
     {
       title: 'Feedback',
       items: [
         {
           id: 'feedback',
           icon: 'chatbubble-ellipses',
           title: 'Feedback',
           subtitle: 'Partagez vos commentaires',
           onPress: handleFeedback,
         },
         {
           id: 'rate',
           icon: 'heart',
           title: 'Noter l\'application',
           subtitle: 'Donnez-nous votre avis',
           onPress: handleRateApp,
         },
         {
           id: 'support',
           icon: 'help-buoy',
           title: 'Support',
           subtitle: 'Aide et contact',
           onPress: handleContactSupport,
         },
       ]
     },
    {
      title: 'Légal',
      items: [
        {
          id: 'privacy',
          icon: 'shield-checkmark',
          title: 'Confidentialité',
          subtitle: 'Protection de vos données',
          onPress: handlePrivacyPolicy,
        },
        {
          id: 'terms',
          icon: 'document-text',
          title: 'Conditions d\'utilisation',
          subtitle: 'Termes et conditions du service',
          onPress: handleTermsOfService,
        },
        {
          id: 'about',
          icon: 'information-circle',
          title: 'À propos',
          subtitle: 'Informations sur l\'application',
          onPress: handleAbout,
        },
      ]
    }
  ];

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* Header avec titre élégant */}
        <View style={s.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <TText style={s.title}>Paramètres</TText>
        </View>

        {/* Contenu avec défilement */}
        <ScrollView 
          style={s.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        >
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={s.section}>
              <TText style={s.sectionTitle}>{section.title}</TText>
              
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    s.settingItem,
                    itemIndex === 0 && { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
                    itemIndex === section.items.length - 1 && { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={s.settingIconContainer}>
                    <TIcon 
                      name={item.icon} 
                      size={20} 
                      color={colors.primary} 
                    />
                  </View>
                  
                  <View style={s.settingContent}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TText style={s.settingTitle}>{item.title}</TText>
                      {item.id === 'premium' && (
                        <View style={s.premiumBadge}>
                          <TText style={s.premiumText}>PRO</TText>
                        </View>
                      )}
                    </View>
                    <TText style={s.settingSubtitle}>{item.subtitle}</TText>
                  </View>
                  
                  <TIcon 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.textSecondary} 
                    style={s.chevronIcon}
                  />
                </TouchableOpacity>
              ))}
              
              {sectionIndex < settingsSections.length - 1 && (
                <View style={s.divider} />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Version tout en bas de l'écran */}
        <View style={s.versionContainer}>
          <TText style={s.versionText}>Version 1.0.0 </TText>
          <TText style={s.appName}>SoinsExpert © 2025</TText>
        </View>
      </TView>
    </SafeAreaView>
  );
};

export default SettingsScreen;