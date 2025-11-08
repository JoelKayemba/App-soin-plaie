// src/components/home/NewsSection.jsx
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';

const NewsSection = ({ onNewsPress, navigation }) => {
  const { makeStyles, colors, isDark } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const newsData = [
    {
      id: '1',
      type: 'product',
      title: 'Nouveaux pansements antimi...',
      description: '15 nouveaux produits',
      timeAgo: '3 jours',
      icon: 'megaphone',
      color: '#8B5CF6',
      route: 'Products'
    },
    {
      id: '2',
      type: 'lexicon',
      title: 'Nouveaux termes en biofilm',
      description: '8 nouvelles definitions',
      timeAgo: '5 jours',
      icon: 'settings',
      color: '#8B5CF6',
      route: 'Lexique'
    },
    {
      id: '3',
      type: 'reference',
      title: 'Derniere mis a jour',
      description: '-guide brulure a jour',
      timeAgo: '6 jours',
      icon: 'megaphone',
      color: '#8B5CF6',
      route: 'References'
    }
  ];

  const useStyles = makeStyles((c) => ({
    container: {
      marginBottom: spacing.xl,
      marginTop: spacing.lg,
      paddingHorizontal: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.xs,
    },
    title: {
      fontSize: 22 * typeScale,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -0.3,
    },
    voirToutButton: {
      fontSize: 14 * typeScale,
      color: c.primary,
      fontWeight: '600',
    },
    newsContainer: {
      borderRadius: 16,
      backgroundColor: isDark ? c.surface : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? c.border : 'rgba(226, 232, 240, 0.6)',
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    newsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    lastNewsItem: {
      borderBottomWidth: 0,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    newsContent: {
      flex: 1,
    },
    newsTitle: {
      fontSize: 15 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.xs,
      lineHeight: 20,
    },
    newsDescription: {
      fontSize: 13 * typeScale,
      color: c.textSecondary,
      lineHeight: 18,
    },
    timeAgo: {
      fontSize: 12 * typeScale,
      color: c.textTertiary,
      marginLeft: spacing.md,
      fontWeight: '500',
    },
  }));

  const s = useStyles();



  const handleNewsPress = (newsItem) => {
    if (onNewsPress) {
      onNewsPress(newsItem);
    } else if (navigation) {
      // Navigation directe depuis la section nouveautés
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
    }
  };

  const handleVoirTout = () => {
    if (navigation) {
      navigation.navigate('News');
    }
  };

  return (
    <TView style={s.container}>
      <View style={s.header}>
        <TText style={s.title}>Nouveautés</TText>
        <TouchableOpacity onPress={handleVoirTout}>
          <TText style={s.voirToutButton}>Voir tout</TText>
        </TouchableOpacity>
      </View>
      
      <View style={s.newsContainer}>
        {newsData.map((newsItem, index) => (
          <TouchableOpacity
            key={newsItem.id}
            style={[
              s.newsItem,
              index === newsData.length - 1 && s.lastNewsItem
            ]}
            onPress={() => handleNewsPress(newsItem)}
            activeOpacity={0.7}
          >
            <View 
              style={[
                s.iconContainer,
                { backgroundColor: isDark ? `${newsItem.color}20` : `${newsItem.color}15` }
              ]}
            >
              <Ionicons
                name={newsItem.icon}
                size={20}
                color={newsItem.color}
              />
            </View>
            <View style={s.newsContent}>
              <TText style={s.newsTitle}>{newsItem.title}</TText>
              <TText style={s.newsDescription}>{newsItem.description}</TText>
            </View>
            <TText style={s.timeAgo}>{newsItem.timeAgo}</TText>
          </TouchableOpacity>
        ))}
      </View>
    </TView>
  );
};

export default NewsSection;
