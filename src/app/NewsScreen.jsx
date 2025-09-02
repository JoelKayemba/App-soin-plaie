// src/app/NewsScreen.jsx
import React from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const NewsScreen = ({ navigation }) => {
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const allNewsData = [
    {
      id: '1',
      type: 'product',
      title: 'Nouveaux pansements antimicrobiens',
      description: 'Ajout de 15 nouveaux produits dans la catégorie Pansements antimicrobiens',
      timeAgo: '3 jours',
      icon: 'megaphone',
      color: '#8B5CF6',
      route: 'Products'
    },
    {
      id: '2',
      type: 'lexicon',
      title: 'Nouveaux termes en biofilm',
      description: 'Ajout de 8 nouvelles définitions dans la section Lexique',
      timeAgo: '5 jours',
      icon: 'settings',
      color: '#8B5CF6',
      route: 'Lexique'
    },
    {
      id: '3',
      type: 'reference',
      title: 'Dernière mise à jour',
      description: 'Guide brûlure mis à jour avec les nouvelles recommandations',
      timeAgo: '6 jours',
      icon: 'megaphone',
      color: '#8B5CF6',
      route: 'References'
    },
    {
      id: '4',
      type: 'product',
      title: 'Nouveaux produits de nettoyage',
      description: 'Ajout de 12 nouveaux produits de nettoyage et désinfection',
      timeAgo: '1 semaine',
      icon: 'water',
      color: '#8B5CF6',
      route: 'Products'
    },
    {
      id: '5',
      type: 'lexicon',
      title: 'Mise à jour terminologie',
      description: 'Mise à jour de 25 termes médicaux dans le lexique',
      timeAgo: '1 semaine',
      icon: 'book',
      color: '#8B5CF6',
      route: 'Lexique'
    },
    {
      id: '6',
      type: 'feature',
      title: 'Nouvelle fonctionnalité de recherche',
      description: 'Amélioration du système de filtrage et de recherche',
      timeAgo: '2 semaines',
      icon: 'search',
      color: '#8B5CF6',
      route: 'Products'
    },
    {
      id: '7',
      type: 'reference',
      title: 'Nouvelles références cliniques',
      description: 'Ajout de 10 nouvelles références dans la section Références',
      timeAgo: '2 semaines',
      icon: 'document-text',
      color: '#8B5CF6',
      route: 'References'
    },
    {
      id: '8',
      type: 'product',
      title: 'Suppression produits obsolètes',
      description: 'Retrait de 5 produits qui ne sont plus disponibles',
      timeAgo: '3 semaines',
      icon: 'trash',
      color: '#8B5CF6',
      route: 'Products'
    }
  ];

  const useStyles = makeStyles((c) => ({
    root: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
  
    },
    title: {
      fontSize: 20 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginLeft: spacing.md,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    newsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.card,
      borderRadius: 12,
      marginBottom: spacing.md,
      elevation: 1,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    newsContent: {
      flex: 1,
    },
    newsTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.xs,
    },
    newsDescription: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      lineHeight: 20,
    },
    timeAgo: {
      fontSize: 12 * typeScale,
      color: c.textTertiary,
      marginLeft: spacing.sm,
      alignSelf: 'flex-start',
    },
    typeBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
    },
    typeText: {
      fontSize: 12 * typeScale,
      fontWeight: '500',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      fontSize: 16 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  }));

  const s = useStyles();

  const getTypeColor = (type) => {
    switch (type) {
      case 'product':
        return { backgroundColor: colors.success + '20', color: colors.success };
      case 'lexicon':
        return { backgroundColor: colors.primary + '20', color: colors.primary };
      case 'reference':
        return { backgroundColor: colors.warning + '20', color: colors.warning };
      case 'feature':
        return { backgroundColor: colors.secondary + '20', color: colors.secondary };
      default:
        return { backgroundColor: colors.textTertiary + '20', color: colors.textTertiary };
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'product':
        return 'Produit';
      case 'lexicon':
        return 'Lexique';
      case 'reference':
        return 'Référence';
      case 'feature':
        return 'Fonctionnalité';
      default:
        return 'Autre';
    }
  };

  const handleNewsPress = (newsItem) => {
    // Navigation vers la section appropriée selon le type de nouveauté
    switch (newsItem.route) {
      case 'Products':
        navigation.navigate('Main', { screen: 'Produits' });
        break;
      case 'Lexique':
        navigation.navigate('Main', { screen: 'Lexique' });
        break;
      case 'References':
        navigation.navigate('References');
        break;
      default:
        // Par défaut, rester sur la page
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* En-tête avec bouton retour et titre */}
        <View style={s.header}>
          <BackButton />
          <TText style={s.title}>Nouveautés</TText>
        </View>

        {/* Contenu scrollable */}
        <ScrollView 
          style={s.content} 
          showsVerticalScrollIndicator={false}
        >
          {allNewsData.map((newsItem) => {
            const typeStyle = getTypeColor(newsItem.type);
            
            return (
              <TouchableOpacity
                key={newsItem.id}
                style={s.newsItem}
                onPress={() => handleNewsPress(newsItem)}
              >
                <TView 
                  style={[
                    s.iconContainer,
                    { backgroundColor: newsItem.color + '20' }
                  ]}
                >
                  <Ionicons
                    name={newsItem.icon}
                    size={20}
                    color={newsItem.color}
                  />
                </TView>
                
                <View style={s.newsContent}>
                  <TText style={s.newsTitle}>{newsItem.title}</TText>
                  <TText style={s.newsDescription}>{newsItem.description}</TText>
                  
                  <TView style={[s.typeBadge, typeStyle]}>
                    <TText style={[s.typeText, { color: typeStyle.color }]}>
                      {getTypeLabel(newsItem.type)}
                    </TText>
                  </TView>
                </View>
                
                <TText style={s.timeAgo}>{newsItem.timeAgo}</TText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

export default NewsScreen;
