// src/app/LexiqueScreen.jsx
import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import SearchBar from '@/components/common/SearchBar';
import lexiqueData from '@/data/lexiques.json';

const LexiqueScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  // Filtrer et organiser les données
  const filteredLexique = useMemo(() => {
    if (!searchQuery.trim()) return lexiqueData;
    
    const query = searchQuery.toLowerCase();
    return lexiqueData.filter(item => 
      item.terme.toLowerCase().includes(query) ||
      item.definition.toLowerCase().includes(query) ||
      (item.synonyme && item.synonyme.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Grouper par première lettre
  const groupedLexique = useMemo(() => {
    const grouped = {};
    filteredLexique.forEach(item => {
      const firstLetter = item.terme.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(item);
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
    termCard: {
      backgroundColor: c.blanc,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...elevation(1),
      borderLeftWidth: 4,
      borderLeftColor: c.primary,
      borderWidth:1,
      borderColor:c.border
    },
    termHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    termTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: c.text,
      flex: 1,
    },
    termActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    favoriteButton: {
      padding: spacing.xs,
    },
    synonyme: {
      fontSize: 14 * typeScale,
      fontStyle: 'italic',
      color: c.secondary,
      marginBottom: spacing.xs,
    },
    definition: {
      fontSize: 14 * typeScale,
      color: c.text,
      lineHeight: 20,
      marginBottom: spacing.xs,
    },
    taille: {
      fontSize: 12 * typeScale,
      color: c.secondary,
      fontWeight: '500',
    },
    tag: {
      backgroundColor: c.blanc,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: spacing.xs,
      borderWidth:1,
      borderColor:c.border
    },
    tagText: {
      fontSize: 11 * typeScale,
      color: c.text,
      fontWeight: '600',
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

  // Déterminer le type de lésion pour les tags
  const getLesionType = (terme) => {
    const primary = ['Macule', 'Tache', 'Papule', 'Plaque', 'Nodule', 'Tumeur', 'Vésicule', 'Bulle', 'Pustule'];
    const secondary = ['Squame', 'Croûte', 'Érosion', 'Excoriation', 'Ulcère', 'Fissure'];
    const cicatrisation = ['Granulation saine', 'Granulation malsaine', 'Hypergranulation', 'Épithélium ou tissu épithélial'];
    
    if (primary.includes(terme)) return { label: 'Lésion primaire', color: colors.primary };
    if (secondary.includes(terme)) return { label: 'Lésion secondaire', color: colors.secondary };
    if (cicatrisation.includes(terme)) return { label: 'Cicatrisation', color: colors.tertiary };
    return { label: 'Inconnu', color: colors.gray };
  };

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
          {Object.keys(groupedLexique).length === 0 ? (
            <TText style={s.noResults}>
              Aucun terme trouvé pour "{searchQuery}"
            </TText>
          ) : (
            Object.entries(groupedLexique).map(([letter, terms]) => (
              <View key={letter}>
                {/* En-tête de lettre */}
                <View style={s.letterHeader}>
                  <TText style={s.letterTitle}>{letter}</TText>
                </View>

                {/* Termes de cette lettre */}
                {terms.map((term, termIndex) => (
                  <TouchableOpacity
                    key={termIndex}
                    style={s.termCard}
                    activeOpacity={0.8}
                  >
                    <View style={s.termHeader}>
                      <View style={{ flex: 1 }}>
                        <TText style={s.termTitle}>{term.terme}</TText>
                        {term.synonyme && (
                          <TText style={s.termSynonyme}>{term.synonyme}</TText>
                        )}
                      </View>
                      
                      {/* Bouton favori */}
                      <TouchableOpacity style={s.favoriteButton} activeOpacity={0.7}>
                        <TIcon 
                          name="star-outline" 
                          size={20} 
                          color={colors.secondary} 
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Définition */}
                    <TText style={s.termDefinition}>{term.definition}</TText>

                    {/* Informations supplémentaires */}
                    <View style={s.termDetails}>
                      {term.taille && (
                        <View style={s.detailItem}>
                          <TText style={s.detailLabel}>Taille :</TText>
                          <TText style={s.detailValue}>{term.taille}</TText>
                        </View>
                      )}
                      
                      {/* Tag dynamique */}
                      <View style={[s.tag, { backgroundColor: getLesionType(term.terme).color }]}>
                        <TText style={s.tagText}>{getLesionType(term.terme).label}</TText>
                      </View>
                    </View>
                  </TouchableOpacity>
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