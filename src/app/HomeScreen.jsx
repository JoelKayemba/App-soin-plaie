// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { Image, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeader from '@/components/common/SectionHeader';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import ToolsSection from '@/components/home/ToolsSection';
import NewsSection from '@/components/home/NewsSection';
import ClinicalWarning from '@/components/common/ClinicalWarning';


const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { makeStyles, colors, isDark, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const useStyles = makeStyles((c) => ({
    root: { flex: 1 },
    content: { flex: 1, padding: spacing.lg },
    heroCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: isDark ? c.surface : c.background,
      ...elevation(2),
      padding: spacing.lg,
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.lg,
    },
    heroText: {
      flex: 1,
      paddingRight: spacing.lg,
    },
    title: {
      fontSize: 26 * typeScale,
      fontWeight: '800',
      marginBottom: spacing.xs,
      color: c.text,
    },
    subtitle: {
      fontSize: 16 * typeScale,
      lineHeight: 22 * typeScale,
      color: c.text,
    },
    heroImageWrap: {
      width: 140,
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImage: { width: '100%', height: '100%' },
  }));
  const s = useStyles();

  const handleSettingsPress = () => navigation.navigate('Settings');
  const handleSearchPress = () => navigation.navigate('Search');

  const tools = [
    {
        icon: 'heart',
        title: 'Démarche clinique',
        subtitle: 'Parcours guidé étape par étape',
        color: '#E3E9F5',
        colorDark: '#1F2A44',
        screen: 'EvaluationClinique',
    },
    {
        icon: 'calculator',
        title: 'Calcul IPSCB',
        subtitle: 'Mesurer l\’Indice Pression Systolique Cheville/Bras et interpréter les résultats',
        color: '#E8F2E6',
        colorDark: '#1E2A22',
        screen: 'IPSCB',
    },
    {
        icon: 'checkmark-circle',
        title: 'Échelle de Braden',
        subtitle: 'Évaluer le risque de lésion de pression',
        color: '#FFF6F6',
        colorDark: '#2A1E1E',
        screen: 'Braden',
    },
    {
        icon: 'paw',
        title: 'Échelle de Braden Q',
        subtitle: 'Évaluer le risque de lésion de pression chez l\’enfant ',
        color: '#FFDBBD',
        colorDark: '#3A281E',
        screen: 'BradenQ',
    },
    {
        icon: 'book',
        title: 'Lexique',
        subtitle: 'Définitions et illustrations',
        color: '#FFF1C7',
        colorDark: '#3A2E12',
        screen: 'Lexique',
    },
    {
        icon: 'journal',
        title: 'Références',
        subtitle: 'Accéder aux guides et articles de référence',
        color: '#CFFBD9',
        colorDark: '#123427',
        screen: 'References',
    },
    {
        icon: 'bandage',
        title: 'Produits & Pansements',
        subtitle: 'Répertoire illustré',
        color: '#F0F3FA',
        colorDark: '#1F2430',
        screen: 'Produits',
    },
    ];


    const handleOpenTool = (it) => navigation.navigate(it.screen);
    const handleVoirTout = () => navigation.navigate('AllTools');
    
    const handleNewsPress = (newsItem) => {
      // Navigation vers la section appropriée selon le type de nouveauté
      switch (newsItem.route) {
        case 'Products':
          navigation.navigate('Produits');
          break;
        case 'Lexique':
          navigation.navigate('Lexique');
          break;
        case 'References':
          navigation.navigate('References');
          break;
        default:
          // Par défaut, aller vers la page d'accueil
          break;
      }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        <SectionHeader
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          onPressSettings={handleSettingsPress}
          onPressSearch={handleSearchPress}
        />

                <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.heroCard}>
          {/* Texte à gauche */}
          <View style={s.heroText}>
            <TText style={s.title}>Bienvenue!</TText>
            <TText style={s.subtitle}>
              Votre outil d’aide à la décision clinique en soins de plaies
            </TText>
          </View>

          {/* Image à droite */}
          <View style={s.heroImageWrap}>
            <Image
              source={require('@/assets/hero-welcome.png')}
              style={s.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>
        
    
        
        <ToolsSection items={tools} onPressItem={handleOpenTool} onPressVoirTout={handleVoirTout} />
        
        {/* Section Nouveautés */}
        <NewsSection onNewsPress={handleNewsPress} navigation={navigation} />
        
        {/* Test des icônes */}
    
        
        </ScrollView>
      </TView>

      {/* Modal d'avertissement clinique */}
      <ClinicalWarning />
    </SafeAreaView>
  );
};

export default HomeScreen;
