// src/app/LexiqueScreen.jsx
import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import SearchBar from '@/components/common/SearchBar';
import LexiqueCard from '@/components/cards/LexiqueCard';
import lexiqueData from '@/data/lexiques.json';

const LexiqueScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  // S'assurer que les données sont disponibles
  const safeLexiqueData = lexiqueData || [];

  // Filtrer et organiser les données
  const filteredLexique = useMemo(() => {
    // Utiliser les données sécurisées
    if (!searchQuery.trim()) {
      return safeLexiqueData;
    }
    
    const query = searchQuery.toLowerCase();
    return safeLexiqueData.filter(item => 
      item && item.terme && item.definition &&
      (item.terme.toLowerCase().includes(query) ||
       item.definition.toLowerCase().includes(query) ||
       (item.synonyme && item.synonyme.toLowerCase().includes(query)))
    );
  }, [searchQuery, safeLexiqueData]);

  // Grouper par première lettre
  const groupedLexique = useMemo(() => {
    const grouped = {};
    
    // Utiliser filteredLexique directement (déjà sécurisé)
    filteredLexique.forEach(item => {
      if (item && item.terme) {
        const firstLetter = item.terme.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(item);
      }
    });
    
    // Trier les lettres et les items dans chaque groupe
    return Object.keys(grouped)
      .sort()
      .reduce((acc, letter) => {
        acc[letter] = grouped[letter].sort((a, b) => a.terme.localeCompare(b.terme));
        return acc;
      }, {});
  }, [filteredLexique]);

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
    letterHeader: {
      fontSize: 20 * typeScale,
      fontWeight: '800',
      color: c.primary,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      paddingLeft: spacing.sm,
    },
    noResults: {
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
          <TText style={s.title}>Lexique Dermatologique</TText>
        </View>

        {/* Contenu principal */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          {/* Barre de recherche */}
          <View style={s.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un terme dermatologique..."
            />
          </View>

          {/* Affichage du lexique */}
          {!groupedLexique || Object.keys(groupedLexique).length === 0 ? (
            <TText style={s.noResults}>
              {searchQuery ? `Aucun terme trouvé pour "${searchQuery}"` : 'Aucun terme disponible'}
            </TText>
          ) : (
            Object.entries(groupedLexique).map(([letter, terms]) => (
              <View key={letter}>
                {/* En-tête de lettre */}
                <View style={s.letterHeader}>
                  <TText style={s.letterTitle}>{letter}</TText>
                </View>

                {/* Termes de cette lettre */}
                {terms && Array.isArray(terms) && terms.length > 0 && terms.map((term, termIndex) => (
                  <LexiqueCard key={termIndex} item={term} />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

export default LexiqueScreen;