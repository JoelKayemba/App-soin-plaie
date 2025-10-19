// src/app/FavoritesScreen.jsx
import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import LexiqueCard from '@/components/cards/LexiqueCard';
import ReferenceCard from '@/components/cards/ReferenceCard';
import ProductCard from '@/components/products/ProductCard';
import { useSelector } from 'react-redux';
import { selectFavoriteProducts, selectFavoriteLexiques, selectFavoriteReferences } from '@/store/favoritesSlice';

// Import des données
import lexiquesData from '@/data/lexiques.json';
import referencesData from '@/data/references.json';
import productsData from '@/data/products.json';

const FavoritesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('lexiques'); // 'lexiques', 'references', 'products'
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();
  
  // Récupérer les favoris depuis le store
  const favoriteProducts = useSelector(selectFavoriteProducts);
  const favoriteLexiques = useSelector(selectFavoriteLexiques);
  const favoriteReferences = useSelector(selectFavoriteReferences);

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
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: c.surfaceLight,
      borderRadius: 12,
      padding: spacing.xs,
      marginBottom: spacing.lg,
      marginTop: spacing.sm,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: c.primary,
      ...elevation(1),
    },
    tabText: {
      fontSize: 14 * typeScale,
      fontWeight: '600',
      color: c.textSecondary,
    },
    activeTabText: {
      color: c.primaryText,
    },
    tabIcon: {
      marginRight: spacing.xs,
    },
    sectionContainer: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyIcon: {
      marginBottom: spacing.lg,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: spacing.lg,
    },
    countBadge: {
      backgroundColor: c.secondary,
      borderRadius: 10,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      marginLeft: spacing.xs,
      minWidth: 20,
      alignItems: 'center',
    },
    countText: {
      fontSize: 11 * typeScale,
      fontWeight: '700',
      color: c.primaryText,
    },
  }));

  const s = useStyles();

  // Filtrer les données selon les favoris
  const favoriteLexiquesData = useMemo(() => {
    return lexiquesData.filter(item => favoriteLexiques.includes(item.terme));
  }, [favoriteLexiques]);

  const favoriteReferencesData = useMemo(() => {
    const allReferences = [];
    
    // Parcourir toutes les catégories et ajouter les références avec leur catégorie
    Object.entries(referencesData).forEach(([category, references]) => {
      if (Array.isArray(references)) {
        references.forEach(ref => {
          allReferences.push({
            ...ref,
            category: category
          });
        });
      }
    });
    
    return allReferences.filter(ref => {
      const referenceId = `${ref.category}-${ref.titre}`;
      return favoriteReferences.includes(referenceId);
    });
  }, [favoriteReferences]);

  const favoriteProductsData = useMemo(() => {
    return productsData.filter(product => favoriteProducts.includes(product.id));
  }, [favoriteProducts]);

  // Obtenir le nombre d'éléments pour chaque section
  const getTabCount = (tab) => {
    switch (tab) {
      case 'lexiques': return favoriteLexiques.length;
      case 'references': return favoriteReferences.length;
      case 'products': return favoriteProducts.length;
      default: return 0;
    }
  };

  // Obtenir l'icône pour chaque onglet
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'lexiques': return 'book';
      case 'references': return 'document-text';
      case 'products': return 'bandage';
      default: return 'ellipse';
    }
  };

  // Obtenir le titre pour chaque onglet
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'lexiques': return 'Lexique';
      case 'references': return 'Références';
      case 'products': return 'Produits';
      default: return '';
    }
  };

  // Rendu d'un élément vide
  const renderEmptyState = (type) => {
    const emptyMessages = {
      lexiques: {
        icon: 'book-outline',
        title: 'Aucun terme favori',
        subtitle: 'Ajoutez des termes du lexique à vos favoris pour les retrouver facilement ici.'
      },
      references: {
        icon: 'document-text-outline',
        title: 'Aucune référence favorite',
        subtitle: 'Marquez des références comme favorites pour un accès rapide.'
      },
      products: {
        icon: 'bandage-outline',
        title: 'Aucun produit favori',
        subtitle: 'Ajoutez des produits à vos favoris pour les consulter rapidement.'
      }
    };

    const message = emptyMessages[type];

    return (
      <View style={s.emptyContainer}>
        <TIcon 
          name={message.icon} 
          size={64} 
          color={colors.textSecondary} 
          style={s.emptyIcon} 
        />
        <TText style={s.emptyTitle}>{message.title}</TText>
        <TText style={s.emptySubtitle}>{message.subtitle}</TText>
      </View>
    );
  };

  // Rendu du contenu selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'lexiques':
        if (favoriteLexiquesData.length === 0) {
          return renderEmptyState('lexiques');
        }
        return (
          <FlatList
            data={favoriteLexiquesData}
            keyExtractor={(item) => item.terme}
            renderItem={({ item }) => <LexiqueCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
          />
        );

      case 'references':
        if (favoriteReferencesData.length === 0) {
          return renderEmptyState('references');
        }
        return (
          <FlatList
            data={favoriteReferencesData}
            keyExtractor={(item, index) => `${item.category}-${item.titre}-${index}`}
            renderItem={({ item }) => (
              <ReferenceCard 
                reference={item} 
                onPress={(ref) => {
                  // Navigation vers la page de détail de la référence
                  navigation.navigate('ReferenceDetail', { reference: ref });
                }} 
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
          />
        );

      case 'products':
        if (favoriteProductsData.length === 0) {
          return renderEmptyState('products');
        }
        return (
          <FlatList
            data={favoriteProductsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
          />
        );

      default:
        return renderEmptyState('lexiques');
    }
  };

  const tabs = ['lexiques', 'references', 'products'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* Header */}
        <View style={s.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <TText style={s.title}>Mes Favoris</TText>
        </View>

        {/* Contenu */}
        <View style={s.content}>
          {/* Onglets */}
          <View style={s.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[s.tab, activeTab === tab && s.activeTab]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <TIcon 
                  name={getTabIcon(tab)} 
                  size={16} 
                  color={activeTab === tab ? colors.primaryText : colors.textSecondary}
                  style={s.tabIcon} 
                />
                <TText style={[s.tabText, activeTab === tab && s.activeTabText]}>
                  {getTabTitle(tab)}
                </TText>
                {getTabCount(tab) > 0 && (
                  <View style={s.countBadge}>
                    <TText style={s.countText}>{getTabCount(tab)}</TText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Contenu de la section active */}
          <View style={s.sectionContainer}>
            {renderContent()}
          </View>
        </View>
      </TView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;
