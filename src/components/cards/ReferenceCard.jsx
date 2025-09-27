// src/components/cards/ReferenceCard.jsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import { useSelector, useDispatch } from 'react-redux';
import { toggleReferenceFavorite, selectIsReferenceFavorite } from '@/store/favoritesSlice';

const ReferenceCard = ({ reference, onPress }) => {
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();
  const dispatch = useDispatch();
  const referenceId = `${reference.category}-${reference.titre}`;
  const isFavorite = useSelector(state => selectIsReferenceFavorite(state, referenceId));

  const useStyles = makeStyles((c) => ({
    card: {
      backgroundColor: c.surfaceLight,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...elevation(1),
      borderLeftWidth: 4,
      borderLeftColor: c.secondary,
      borderWidth: 1,
      borderColor: c.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    referenceInfo: {
      flex: 1,
    },
    title: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginBottom: spacing.xs,
      lineHeight: 22,
    },
    author: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      marginBottom: spacing.xs,
    },
    year: {
      fontSize: 12 * typeScale,
      color: c.textSecondary,
      fontWeight: '500',
    },
    category: {
      backgroundColor: c.secondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs / 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: spacing.xs,
    },
    categoryText: {
      fontSize: 11 * typeScale,
      color: '#FFFFFF',
      fontWeight: '600',
    },
    source: {
      fontSize: 12 * typeScale,
      color: c.textSecondary,
      fontStyle: 'italic',
      marginTop: spacing.xs,
    },
    favoriteButton: {
      padding: spacing.xs,
    },
  }));

  const s = useStyles();

  // Formater le titre pour éviter qu'il soit trop long
  const formatTitle = (title) => {
    if (title.length > 80) {
      return title.substring(0, 80) + '...';
    }
    return title;
  };

  // Formater le nom de l'auteur
  const formatAuthor = (author) => {
    if (author.length > 50) {
      return author.substring(0, 50) + '...';
    }
    return author;
  };

  // Obtenir le nom de la catégorie en français
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      'brulure': 'Brûlure',
      'dechirure_cutanee': 'Déchirure cutanée',
      'dermite_incontinence': 'Dermite incontinence',
      'generalites': 'Généralités',
      'lesion_pression': 'Lésion de pression',
      'plaie_chirurgicale': 'Plaie chirurgicale',
      'plaie_traumatique': 'Plaie traumatique',
      'ulcere_arteriel': 'Ulcère artériel',
      'ulcere_diabetique': 'Ulcère diabétique',
      'ulcere_veineux': 'Ulcère veineux',
    };
    return categoryLabels[category] || category;
  };

  const handleToggleFavorite = () => {
    dispatch(toggleReferenceFavorite(referenceId));
  };

  return (
    <TouchableOpacity 
      style={s.card}
      onPress={() => onPress && onPress(reference)}
      activeOpacity={0.7}
    >
      <View style={s.header}>
        <View style={s.referenceInfo}>
          <TText style={s.title} numberOfLines={2}>
            {formatTitle(reference.titre)}
          </TText>
          <TText style={s.author} numberOfLines={1}>
            {formatAuthor(reference.auteur)}
          </TText>
          {reference.annee && (
            <TText style={s.year}>
              {reference.annee}
            </TText>
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

      {/* Informations supplémentaires */}
      <View style={s.details}>
        {/* Catégorie */}
        <View style={[s.category, { backgroundColor: colors.secondary }]}>
          <TText style={s.categoryText}>
            {getCategoryLabel(reference.category)}
          </TText>
        </View>
        
        {/* Source */}
        {reference.source && (
          <TText style={s.source}>
            {reference.source}
          </TText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ReferenceCard;

