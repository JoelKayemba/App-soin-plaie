// src/components/cards/LexiqueCard.jsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLexiqueFavorite, selectIsLexiqueFavorite } from '@/store/favoritesSlice';

const LexiqueCard = ({ item }) => {
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsLexiqueFavorite(state, item.terme));

  const useStyles = makeStyles((c) => ({
    card: {
      backgroundColor: c.surfaceLight,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...elevation(1),
      borderLeftWidth: 4,
      borderLeftColor: c.primary,
      borderWidth: 1,
      borderColor: c.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    termInfo: {
      flex: 1,
    },
    termTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginBottom: spacing.xs,
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
    details: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
    },
    taille: {
      fontSize: 12 * typeScale,
      color: c.textSecondary,
      fontWeight: '500',
    },
    tag: {
      backgroundColor: c.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    tagText: {
      fontSize: 11 * typeScale,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    favoriteButton: {
      padding: spacing.xs,
    },
  }));

  const s = useStyles();

  // Déterminer le type de lésion pour les tags
  const getLesionType = (terme) => {
    const primary = ['Macule', 'Tache', 'Papule', 'Plaque', 'Nodule', 'Tumeur', 'Vésicule', 'Bulle', 'Pustule'];
    const secondary = ['Squame', 'Croûte', 'Érosion', 'Excoriation', 'Ulcère', 'Fissure'];
    const cicatrisation = ['Granulation saine', 'Granulation malsaine', 'Hypergranulation', 'Épithélium ou tissu épithélial'];
    
    if (primary.includes(terme)) return { label: 'Primaire', color: colors.primary };
    if (secondary.includes(terme)) return { label: 'Secondaire', color: colors.secondary };
    if (cicatrisation.includes(terme)) return { label: 'Cicatrisation', color: colors.tertiary };
    return { label: 'Général', color: colors.gray };
  };

  const lesionType = getLesionType(item.terme);

  const handleToggleFavorite = () => {
    dispatch(toggleLexiqueFavorite(item.terme));
  };

  return (
    <TView style={s.card}>
      <View style={s.header}>
        <View style={s.termInfo}>
          <TText style={s.termTitle}>{item.terme}</TText>
          {item.synonyme && (
            <TText style={s.synonyme}>Synonyme: {item.synonyme}</TText>
          )}
        </View>
        
        {/* Bouton favori */}
        <TouchableOpacity style={s.favoriteButton} onPress={handleToggleFavorite} activeOpacity={0.7}>
          <TIcon 
            name={isFavorite ? "star" : "star-outline"} 
            size={20} 
            color={isFavorite ? colors.warning : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Définition */}
      <TText style={s.definition} numberOfLines={3}>
        {item.definition}
      </TText>

      {/* Informations supplémentaires */}
      <View style={s.details}>
        {item.taille && (
          <TText style={s.taille}>Taille: {item.taille}</TText>
        )}
        
        {/* Tag dynamique */}
        <View style={[s.tag, { backgroundColor: lesionType.color }]}>
          <TText style={s.tagText}>{lesionType.label}</TText>
        </View>
      </View>
    </TView>
  );
};

export default LexiqueCard;
