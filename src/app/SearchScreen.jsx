// src/app/SearchScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Keyboard,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import ProductCard from '@/components/products/ProductCard';
import LexiqueCard from '@/components/cards/LexiqueCard';
import productsData from '@/data/products.json';
import lexiquesData from '@/data/lexiques.json';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('products');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { makeStyles, colors, isDark, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const categories = [
    { id: 'products', label: 'Produits', icon: 'bandage' },
    { id: 'lexiques', label: 'Lexique', icon: 'book' },
  ];

  const useStyles = makeStyles((c) => ({
    root: { 
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: c.background,
      ...elevation(2),
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2A2F3A' : '#F5F5F7',
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      marginLeft: spacing.md,
      height: 50,
      borderWidth: 1,
      borderColor: searchQuery.length > 0 ? c.primary : 'transparent',
    },
    searchInput: {
      flex: 1,
      fontSize: 16 * typeScale,
      color: c.text,
      paddingVertical: 8,
      fontFamily: 'System',
      fontWeight: '400',
    },
    clearButton: {
      padding: spacing.xs,
    },
    categoriesContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: c.background,
      justifyContent: 'center',
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      marginHorizontal: spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borderLight,
      backgroundColor: isDark ? '#2A2A2A' : '#FAFAFA',
      flex: 1,
      justifyContent: 'center',
    },
    categoryButtonActive: {
      backgroundColor: c.primary,
      borderColor: c.primary,
      ...elevation(1),
    },
    categoryText: {
      fontSize: 14 * typeScale,
      marginLeft: spacing.xs,
      fontWeight: '500',
    },
    categoryTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    resultsContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.borderLight,
      ...elevation(1),
    },
    resultImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: spacing.md,
      backgroundColor: isDark ? '#3A3A3A' : '#F5F5F7',
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.xs,
    },
    resultSubtitle: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      lineHeight: 20,
    },
    resultType: {
      fontSize: 12 * typeScale,
      color: c.primary,
      fontWeight: '600',
      marginTop: spacing.xs,
      textTransform: 'uppercase',
    },
    noResults: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    noResultsText: {
      fontSize: 16 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
      lineHeight: 24,
    },
    searchIndicator: {
      marginTop: spacing.xl,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginBottom: spacing.md,
      marginTop: spacing.lg,
    },
    resultCount: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      marginBottom: spacing.md,
    },
  }));

  const s = useStyles();

  // Animation pour l'apparition des résultats
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  }, [searchResults]);

  // Fonction de debounce personnalisée
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fonction de recherche
  const performSearch = useCallback((query, category) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    let results = [];

    // Recherche dans les produits
    if (category === 'products') {
      const productResults = productsData
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.class.toLowerCase().includes(searchTerm) ||
          (product.indications && product.indications.some(ind => ind.toLowerCase().includes(searchTerm)))
        )
        .map(product => ({
          id: `product-${product.id}`,
          type: 'product',
          data: product,
        }));
      results = [...results, ...productResults];
    }

    // Recherche dans le lexique
    if (category === 'lexiques') {
      const lexiqueResults = lexiquesData
        .filter(item => 
          item.terme.toLowerCase().includes(searchTerm) ||
          item.definition.toLowerCase().includes(searchTerm)
        )
        .map(item => ({
          id: `lexique-${item.terme}`,
          type: 'lexique',
          data: item,
        }));
      results = [...results, ...lexiqueResults];
    }

    setSearchResults(results);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setIsSearching(true);
      performSearch(debouncedSearchQuery, selectedCategory);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, selectedCategory, performSearch]);


  const renderResultItem = ({ item }) => (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }] 
      }}
    >
      {item.type === 'product' ? (
        <ProductCard 
          product={item.data} 
        />
      ) : (
        <LexiqueCard 
          item={item.data} 
        />
      )}
    </Animated.View>
  );

  const renderResults = () => {
    if (isSearching) {
      return (
        <View style={s.searchIndicator}>
          <TIcon name="search" size={32} color={colors.textSecondary} />
          <TText style={s.noResultsText}>Recherche en cours...</TText>
        </View>
      );
    }
    
    if (searchResults.length > 0) {
      return (
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }}
        >
          <TText style={s.resultCount}>
            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
          </TText>
          <FlatList
            data={searchResults}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            keyboardShouldPersistTaps="handled"
          />
        </Animated.View>
      );
    }
    
    if (searchQuery.length > 0) {
      return (
        <View style={s.noResults}>
          <TIcon name="search-off" size={48} color={colors.textSecondary} />
          <TText style={s.noResultsText}>
            Aucun résultat trouvé pour "{searchQuery}"
          </TText>
          <TText style={[s.noResultsText, { marginTop: spacing.sm }]}>
            Essayez avec d'autres termes ou vérifiez l'orthographe.
          </TText>
        </View>
      );
    }
    
    return (
      <View style={s.noResults}>
        <TIcon name="search" size={48} color={colors.textSecondary} />
           <TText style={s.noResultsText}>
             Tapez votre recherche pour commencer
           </TText>
           <TText style={[s.noResultsText, { marginTop: spacing.sm }]}>
             Recherchez parmi les produits ou le lexique
           </TText>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* Header avec barre de recherche */}
        <View style={s.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={s.searchContainer}>
            <TIcon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={s.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un produit ou terme..."
              placeholderTextColor={colors.textSecondary}
              autoFocus
              returnKeyType="search"
              enablesReturnKeyAutomatically
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={s.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <TIcon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Catégories de filtrage */}
        <View style={s.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                s.categoryButton,
                selectedCategory === category.id && s.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <TIcon 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary} 
              />
              <TText style={[
                s.categoryText,
                selectedCategory === category.id && s.categoryTextActive
              ]}>
                {category.label}
              </TText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Résultats de recherche */}
        <View style={s.resultsContainer}>
          {renderResults()}
        </View>
      </TView>
    </SafeAreaView>
  );
};

export default SearchScreen;