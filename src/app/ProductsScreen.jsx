// src/app/ProductsScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import SearchBar from '@/components/common/SearchBar';
import ProductFilters from '@/components/products/ProductFilters';
import ProductCategories from '@/components/products/ProductCategories';
import ProductCard from '@/components/products/ProductCard';

// Import des données de produits
import productsData from '@/data/products.json';

const ProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const useStyles = makeStyles((c) => ({
    root: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      backgroundColor: c.background,
    },
    title: {
      fontSize: 24 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginLeft: spacing.md,
      flex: 1,
    },
    fixedSection: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: c.background,
      
    },
    scrollableContent: {
      flex: 1,
    },
    scrollableContentContainer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl,
    },
    searchContainer: {
      marginBottom: 0,
    },
    categoriesContainer: {
      marginBottom: spacing.lg,
    },
    filtersContainer: {
      marginBottom: spacing.lg,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyText: {
      fontSize: 16 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    resultsCount: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      marginBottom: spacing.md,
      fontStyle: 'italic',
    },
  }));

  const s = useStyles();

  // Fonction de filtrage des produits
  useEffect(() => {
    let filtered = productsData;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrage par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.class.toLowerCase().includes(query) ||
        (product.antimicrobial && product.antimicrobial.toLowerCase().includes(query))
      );
    }

    // Filtrage par filtres avancés
    Object.keys(filters).forEach(filterType => {
      const selectedOptions = filters[filterType];
      if (selectedOptions && selectedOptions.length > 0) {
        filtered = filtered.filter(product => {
          switch (filterType) {
            case 'classe':
              return selectedOptions.includes(product.class);
            case 'application':
              // Logique pour application primaire/secondaire
              return true; // À implémenter selon vos données
            case 'absorption':
              const absorptionLevel = product.absorption === 1 ? 'Faible' : 
                                    product.absorption === 2 ? 'Modérée' : 'Élevée';
              return selectedOptions.includes(absorptionLevel);
            case 'antimicrobien':
              if (selectedOptions.includes('Non')) {
                return !product.antimicrobial;
              }
              return selectedOptions.includes(product.antimicrobial);
            case 'autoadhesive':
              const isAutoadhesive = product.autoadhesive ? 'Oui' : 'Non';
              return selectedOptions.includes(isAutoadhesive);
            case 'waterproof':
              const isWaterproof = product.waterproof ? 'Oui' : 'Non';
              return selectedOptions.includes(isWaterproof);
            case 'cuttable':
              const isCuttable = product.cuttable ? 'Oui' : 'Non';
              return selectedOptions.includes(isCuttable);
            case 'pediatric':
              const isPediatric = product.pediatric ? 'Oui' : 'Non';
              return selectedOptions.includes(isPediatric);
            default:
              return true;
          }
        });
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, filters]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const renderEmptyState = () => (
    <View style={s.emptyState}>
      <TText style={s.emptyText}>
        Aucun produit trouvé{'\n'}
        {searchQuery ? 'Essayez de modifier votre recherche' : 'Sélectionnez une autre catégorie'}
      </TText>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* En-tête avec bouton retour et titre */}
        <View style={s.header}>
          <BackButton />
          <TText style={s.title}>Produits & Pansements</TText>
        </View>

        {/* Zone fixe avec barre de recherche */}
        <View style={s.fixedSection}>
          {/* Barre de recherche */}
          <View style={s.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un produit ou pansement..."
            />
          </View>
        </View>

        {/* Zone scrollable avec filtres et produits */}
        <ScrollView 
          style={s.scrollableContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollableContentContainer}
        >
          {/* Catégories */}
          <View style={s.categoriesContainer}>
            <ProductCategories
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </View>

          {/* Filtres avancés */}
          <View style={s.filtersContainer}>
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </View>

          {/* Compteur de résultats */}
          <TText style={s.resultsCount}>
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
          </TText>

          {/* Liste des produits */}
          {filteredProducts.map((product, index) => (
            <View key={product.id}>
              <ProductCard product={product} />
              {index < filteredProducts.length - 1 && (
                <View style={{ height: spacing.md }} />
              )}
            </View>
          ))}

          {/* État vide */}
          {filteredProducts.length === 0 && renderEmptyState()}
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

export default ProductsScreen;