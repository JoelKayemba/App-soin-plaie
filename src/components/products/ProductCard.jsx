// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';
import ImageModal from '@/components/common/ImageModal';
import { useSelector, useDispatch } from 'react-redux';
import { toggleProductFavorite, selectIsProductFavorite } from '@/store/favoritesSlice';

const ProductCard = ({ product }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsProductFavorite(state, product.id));

  const useStyles = makeStyles((c) => ({
    card: {
      backgroundColor: c.surfaceLight,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.md,
      elevation: 2,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: c.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    productImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    placeholderImage: {
      width: 40,
      height: 40,
      opacity: 0.5,
    },
    headerInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 18 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginBottom: spacing.xs,
    },
    brand: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      marginBottom: spacing.xs,
    },
    classTag: {
      backgroundColor: c.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 50,
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: c.primary,
    },
    classText: {
      fontSize: 12 * typeScale,
      color: c.primaryText,
      fontWeight: '600',
    },
    favoriteButton: {
      padding: spacing.xs,
    },
    propertiesSection: {
      marginBottom: spacing.md,
      backgroundColor:c.card,
      padding: spacing.sm,
      borderRadius:spacing.sm
    },
    propertyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      justifyContent:'space-between'
    },
    propertyLabel: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      width: 100,
      marginRight: spacing.sm,
    },
    absorptionIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    absorptionIcon: {
      marginRight: spacing.xs,
    },
    absorptionText: {
      fontSize: 14 * typeScale,
      color: c.text,
      marginLeft: spacing.xs,
    },
    antimicrobialRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    antimicrobialIcon: {
      marginRight: spacing.xs,
    },
    antimicrobialText: {
      fontSize: 14 * typeScale,
      color: c.text,
    },
    iconsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'center',
      marginTop: spacing.sm,
      paddingTop:spacing.sm,
      paddingBottom:spacing.sm,
      borderTopWidth:1,
      borderBottomWidth:1,
      borderColor:c.border
    },
    iconItem: {
      alignItems: 'center',
      marginRight: spacing.lg,
    },
    icon: {
      marginBottom: spacing.xs,
    },
    iconLabel: {
      fontSize: 10 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
    },
    detailsSection: {
      paddingTop: spacing.md,
    },
    detailsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: detailsExpanded ? spacing.md : 0,
    },
    detailsTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.text,
    },
    expandIcon: {
      transform: [{ rotate: detailsExpanded ? '180deg' : '0deg' }],
    },
    detailItem: {
      marginBottom: spacing.sm,
    },
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    detailTitle: {
      fontSize: 14 * typeScale,
      fontWeight: '500',
      color: c.text,
    },
    detailContent: {
      paddingTop: spacing.sm,
    },
    detailText: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      lineHeight: 20,
    },
    bulletPoint: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
    },
    bullet: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      marginRight: spacing.xs,
      marginTop: 2,
    },
    disclaimer: {
      fontSize: 12 * typeScale,
      color: c.textTertiary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
  }));

  const s = useStyles();

  const getAbsorptionIcons = (level) => {
    const icons = [];
    for (let i = 0; i < 3; i++) {
      icons.push(
        <Ionicons
          key={i}
          name="water"
          size={16}
          color={i < level ? colors.primary : (colors.isDark ? colors.textSecondary : colors.textTertiary)}
          style={s.absorptionIcon}
        />
      );
    }
    return icons;
  };

  const getAbsorptionText = (level) => {
    switch (level) {
      case 1: return 'Faible';
      case 2: return 'Moyen';
      case 3: return 'Élevé';
      default: return 'Non spécifié';
    }
  };

  const toggleDetails = () => {
    setDetailsExpanded(!detailsExpanded);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleFavorite = () => {
    dispatch(toggleProductFavorite(product.id));
  };

  const renderDetailSection = (title, content, sectionKey) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <View style={s.detailItem}>
        <TouchableOpacity
          style={s.detailHeader}
          onPress={() => toggleSection(sectionKey)}
        >
          <TText style={s.detailTitle}>{title}</TText>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={s.detailContent}>
            {Array.isArray(content) ? (
              content.map((item, index) => (
                <View key={index} style={s.bulletPoint}>
                  <TText style={s.bullet}>•</TText>
                  <TText style={s.detailText}>{item}</TText>
                </View>
              ))
            ) : (
              <TText style={s.detailText}>{content}</TText>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <TView style={s.card}>
      {/* En-tête avec image et informations */}
      <View style={s.header}>
        <TouchableOpacity 
          style={s.imageContainer} 
          onPress={() => product.image && setImageModalVisible(true)}
          disabled={!product.image}
        >
          {product.image ? (
            <Image source={{ uri: product.image }} style={s.productImage} />
          ) : (
            <Ionicons name="image-outline" size={40} color={colors.textTertiary} style={s.placeholderImage} />
          )}
        </TouchableOpacity>
        
        <View style={s.headerInfo}>
          <TText style={s.productName}>{product.name}</TText>
          <TText style={s.brand}>{product.brand}</TText>
          <View style={s.classTag}>
            <TText style={s.classText}>{product.class}</TText>
          </View>
        </View>
        
        <TouchableOpacity style={s.favoriteButton} onPress={handleToggleFavorite}>
          <Ionicons 
            name={isFavorite ? "star" : "star-outline"} 
            size={24} 
            color={isFavorite ? colors.warning : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Propriétés du produit */}
      <View style={s.propertiesSection}>
        {/* Absorption */}
        <View style={s.propertyRow}>
          <TText style={s.propertyLabel}>Absorption</TText>
          <View style={s.absorptionIcons}>
            {getAbsorptionIcons(product.absorption)}
            <TText style={s.absorptionText}>{getAbsorptionText(product.absorption)}</TText>
          </View>
        </View>

        {/* Antimicrobien */}
        {product.antimicrobial && (
          <View style={s.propertyRow}>
            <TText style={s.propertyLabel}>Antimicrobien</TText>
            <View style={s.antimicrobialRow}>
              <Ionicons
                name="bug"
                size={16}
                color={colors.success}
                style={s.antimicrobialIcon}
              />
              <TText style={s.antimicrobialText}>{product.antimicrobial}</TText>
            </View>
          </View>
        )}

        {/* Icônes des propriétés */}
        <View style={s.iconsRow}>
          {product.autoadhesive && (
            <View style={s.iconItem}>
              <Ionicons name="bandage" size={20} color={colors.primary} style={s.icon} />
              <TText style={s.iconLabel}>Autoadhésif</TText>
            </View>
          )}
          {product.waterproof && (
            <View style={s.iconItem}>
              <Ionicons name="water" size={20} color={colors.primary} style={s.icon} />
              <TText style={s.iconLabel}>Étanche</TText>
            </View>
          )}
          {product.cuttable && (
            <View style={s.iconItem}>
              <Ionicons name="cut" size={20} color={colors.primary} style={s.icon} />
              <TText style={s.iconLabel}>Découpable</TText>
            </View>
          )}
          {product.stackable && (
            <View style={s.iconItem}>
              <Ionicons name="layers" size={20} color={colors.primary} style={s.icon} />
              <TText style={s.iconLabel}>Superposable</TText>
            </View>
          )}
          {product.pediatric && (
            <View style={s.iconItem}>
              <Ionicons name="happy" size={20} color={colors.primary} style={s.icon} />
              <TText style={s.iconLabel}>Pédiatrie</TText>
            </View>
          )}
        </View>
      </View>

      {/* Section détails */}
      <View style={s.detailsSection}>
        <TouchableOpacity style={s.detailsHeader} onPress={toggleDetails}>
          <TText style={s.detailsTitle}>Détails</TText>
          <Ionicons
            name="chevron-up"
            size={20}
            color={colors.textSecondary}
            style={s.expandIcon}
          />
        </TouchableOpacity>

        {detailsExpanded && (
          <View>
            {renderDetailSection('Indications', product.indications, 'indications')}
            {renderDetailSection('Contre-Indications', product.contraindications, 'contraindications')}
            {renderDetailSection('Avantages', product.advantages, 'advantages')}
            {renderDetailSection('Inconvénients', product.disadvantages, 'disadvantages')}
            {renderDetailSection('Précautions', product.precautions, 'precautions')}
            {renderDetailSection('Intervalle de changement', product.changeInterval, 'changeInterval')}
            {renderDetailSection('Grandeurs & Codes RAMQ', product.sizes, 'sizes')}
          </View>
        )}
      </View>

      {/* Disclaimer */}
      <TText style={s.disclaimer}>Informations fournies par le fabricant</TText>

      {/* Modal pour l'image du produit */}
      <ImageModal
        visible={imageModalVisible}
        imageUrl={product.image}
        title={product.name}
        onClose={() => setImageModalVisible(false)}
      />
    </TView>
  );
};

export default ProductCard;
