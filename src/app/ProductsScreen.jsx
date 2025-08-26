// src/app/ProductsScreen.jsx
import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import SearchBar from '@/components/common/SearchBar';

const ProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    searchContainer: {
      marginBottom: spacing.lg,
    },
    placeholder: {
      fontSize: 16 * typeScale,
      color: c.text,
      textAlign: 'center',
      marginTop: spacing.xl * 2,
      fontStyle: 'italic',
    },
  }));

  const s = useStyles();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* En-tête avec bouton retour et titre */}
        <View style={s.header}>
          <BackButton />
          <TText style={s.title}>Produits & Pansements</TText>
        </View>

        {/* Contenu principal */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          {/* Barre de recherche */}
          <View style={s.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un produit ou pansement..."
            />
          </View>

          <TText style={s.placeholder}>
            Interface de gestion des produits et pansements
          </TText>
          {/* TODO: Implémenter la liste des produits et pansements */}
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

export default ProductsScreen;