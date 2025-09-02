// src/components/home/NewsSection.jsx
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';

const NewsSection = ({ onNewsPress, navigation }) => {
  const { makeStyles, colors } = useThemeMode();
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
      marginBottom: spacing.lg,
      marginTop: spacing.lg
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 20 * typeScale,
      fontWeight: '600',
    
    },
    voirToutButton: {
      fontSize: 14 * typeScale,
      color: c.primary,
      fontWeight: '500',
    },
    newsContainer: {
      paddingHorizontal: spacing.sm,
    },
    newsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    newsContent: {
      flex: 1,
    },
    newsTitle: {
      fontSize: 14 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.xs,
    },
    newsDescription: {
      fontSize: 12 * typeScale,
      color: c.textSecondary,
    },
    timeAgo: {
      fontSize: 12 * typeScale,
      color: c.textTertiary,
      marginLeft: spacing.sm,
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
        {newsData.map((newsItem) => (
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
                size={16}
                color={newsItem.color}
              />
            </TView>
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
