// src/app/ReferenceScreen.jsx
import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import SearchBar from '@/components/common/SearchBar';
import referencesData from '@/data/references.json';

const ReferenceScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState(['generalites']); // Généralités ouvert par défaut
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  // Icônes pour chaque catégorie
  const categoryIcons = {
    brulure: 'flame',
    dechirure_cutanee: 'cut',
    dermite_incontinence: 'water',
    generalites: 'book',
    lesion_pression: 'bed',
    plaie_chirurgicale: 'medical',
    plaie_traumatique: 'bandage',
    ulcere_arteriel: 'water',
    ulcere_diabetique: 'footsteps',
    ulcere_veineux: 'footsteps'
  };

  // Noms d'affichage pour chaque catégorie
  const categoryNames = {
    brulure: 'Brûlures',
    dechirure_cutanee: 'Déchirures cutanées',
    dermite_incontinence: 'Dermite d\'incontinence',
    generalites: 'Généralités',
    lesion_pression: 'Lésions de pression',
    plaie_chirurgicale: 'Plaies chirurgicales',
    plaie_traumatique: 'Plaies traumatiques',
    ulcere_arteriel: 'Ulcères artériels',
    ulcere_diabetique: 'Ulcères diabétiques',
    ulcere_veineux: 'Ulcères veineux'
  };

  // Filtrer les références selon la recherche
  const filteredReferences = useMemo(() => {
    if (!searchQuery.trim()) return referencesData;
    
    const query = searchQuery.toLowerCase();
    const filtered = {};
    
    Object.entries(referencesData).forEach(([category, references]) => {
      const filteredRefs = references.filter(ref => {
        const titre = ref.titre || '';
        const auteur = ref.auteur || '';
        const source = ref.source || '';
        
        return titre.toLowerCase().includes(query) ||
               auteur.toLowerCase().includes(query) ||
               source.toLowerCase().includes(query);
      });
      
      if (filteredRefs.length > 0) {
        filtered[category] = filteredRefs;
      }
    });
    
    return filtered;
  }, [searchQuery]);

  // Basculer l'expansion d'une section
  const toggleSection = (categorie) => {
    setExpandedSections(prev => 
      prev.includes(categorie) 
        ? prev.filter(cat => cat !== categorie)
        : [...prev, categorie]
    );
  };

  // Ouvrir un lien
  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Impossible d'ouvrir le lien:", url);
      }
    } catch (error) {
      console.log("Erreur lors de l'ouverture du lien:", error);
    }
  };

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
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
      padding: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.sm,
      ...elevation(1),
    },
    sectionTitle: {
      fontSize: 18 * typeScale,
      fontWeight: '700',
      color: c.text,
      flex: 1,
    },
    sectionIcon: {
      marginRight: spacing.sm,
    },
    expandIcon: {
      marginLeft: spacing.sm,
    },
    referenceCard: {
      backgroundColor: c.background,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
      ...elevation(1),
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    cardYear: {
      fontSize: 12 * typeScale,
      color: c.secondary,
      fontWeight: '600',
    },
    cardTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: c.text,
      lineHeight: 22,
      marginBottom: spacing.xs,
    },
    cardAuthor: {
      fontSize: 14 * typeScale,
      color: c.text,
      marginBottom: spacing.xs,
    },
    cardSource: {
      fontSize: 14 * typeScale,
      color: c.secondary,
      fontStyle: 'italic',
      marginBottom: spacing.sm,
    },
    cardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    linkTag: {
      backgroundColor: c.tertiary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    linkText: {
      fontSize: 11 * typeScale,
      color: c.primary,
      fontWeight: '600',
    },
    favoriteButton: {
      padding: spacing.xs,
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
          <TText style={s.title}>Références Médicales</TText>
        </View>

        {/* Contenu principal */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          {/* Barre de recherche */}
          <View style={s.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un titre, un auteur, mot clé..."
            />
          </View>

          {/* Affichage des références */}
          {Object.keys(filteredReferences).length === 0 ? (
            <TText style={s.noResults}>
              Aucune référence trouvée pour "{searchQuery}"
            </TText>
          ) : (
            Object.entries(filteredReferences).map(([category, references]) => (
              <View key={category}>
                {/* En-tête de section */}
                <TouchableOpacity 
                  style={s.sectionHeader}
                  onPress={() => toggleSection(category)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <TIcon 
                      name={categoryIcons[category] || 'document'} 
                      size={20} 
                      color={colors.primary}
                      style={s.sectionIcon}
                    />
                    <TText style={s.sectionTitle}>{categoryNames[category]}</TText>
                  </View>
                  
                  <TIcon 
                    name={expandedSections.includes(category) ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={colors.text}
                    style={s.expandIcon}
                  />
                </TouchableOpacity>

                {/* Contenu de la section */}
                {expandedSections.includes(category) && (
                  references.map((ref, refIndex) => (
                    <View key={refIndex} style={s.referenceCard}>
                      {/* En-tête de la carte */}
                      <View style={s.cardHeader}>
                        <View style={{ flex: 1 }}>
                          {ref.annee && (
                            <TText style={s.cardYear}>{ref.annee}</TText>
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

                      {/* Titre */}
                      <TText style={s.cardTitle}>{ref.titre}</TText>

                      {/* Auteur */}
                      {ref.auteur && (
                        <TText style={s.cardAuthor}>{ref.auteur}</TText>
                      )}

                      {/* Source */}
                      {ref.source && (
                        <TText style={s.cardSource}>{ref.source}</TText>
                      )}

                      {/* Actions */}
                      <View style={s.cardActions}>
                        {/* Tag lien */}
                        {ref.lien && (
                          <TouchableOpacity 
                            style={s.linkTag}
                            onPress={() => openLink(ref.lien)}
                            activeOpacity={0.8}
                          >
                            <TText style={s.linkText}>Lien</TText>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            ))
          )}
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

export default ReferenceScreen;