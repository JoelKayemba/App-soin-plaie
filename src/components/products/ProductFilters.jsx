// src/components/products/ProductFilters.jsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProductFilters = ({ filters, onFiltersChange }) => {
  const [filtersExpanded, setFiltersExpanded] = useState(true); // État global pour l'en-tête Filtres
  const [expandedSections, setExpandedSections] = useState({
    classe: true, // Classe ouvert par défaut comme dans l'image
    application: false,
    absorption: false,
    antimicrobien: false,
    autoadhesive: false,
    waterproof: false,
    cuttable: false,
    pediatric: false,
  });
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();



  const filterOptions = {
    classe: [
      'Solution neutre', 'Antiseptique', 'Pellicule transparente', 'Interface',
      'Pansement sec non adhérent', 'Hydrogel', 'Pâte hydrophile', 'Mousse',
      'Hydrocolloïde', 'Acrylique', 'Multicouche', 'Alginate', 'Hydrofibre',
      'Superabsorbant', 'Charbon', 'Hypertonique', 'Bioactif', 'Débridement enzymatique', 'Barrière cutanée'
    ],
    application: ['Primaire', 'Secondaire'],
    absorption: ['Faible', 'Modérée', 'Élevée'],
    antimicrobien: ['Non', 'Argent', 'Miel', 'PHMB', 'Iode', 'Chlorhexidine', 'Bleu de méthylène et violet de gentiane', 'DACC'],
    autoadhesive: ['Oui', 'Non'],
    waterproof: ['Oui', 'Non'],
    cuttable: ['Oui', 'Non'],
    pediatric: ['Oui', 'Non'],
  };

  const useStyles = makeStyles((c) => ({
    container: {
      marginBottom: spacing.lg,
    },
    filtersSection: {
      paddingTop: spacing.sm,
    },
    filtersHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
      borderWidth:1,
      borderColor:c.border
    },
    filtersTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.black,
    },
    clearAllButton: {
      fontSize: 14 * typeScale,
      color: c.secondary,
      
    },
    filtersContainer: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      padding: spacing.md,
    },
    filterGroup: {
      marginBottom: spacing.sm,
      borderWidth:1,
      borderColor:c.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    filterGroupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: c.surfaceLight,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    filterGroupTitle: {
      fontSize: 14 * typeScale,
      fontWeight: '600',
      color: c.text,
    },
    filterGroupExpandIcon: {
      transform: [{ rotate: '0deg' }],
    },
    filterGroupContent: {
      padding: spacing.md,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 16,
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: spacing.xs,
    },
    activeFilterChip: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    filterText: {
      fontSize: 12 * typeScale,
      color: c.textSecondary,
      marginRight: spacing.xs,
    },
    activeFilterText: {
      color: c.primaryText,
    },
    filterIcon: {
      fontSize: 14,
    },
    absorptionIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.xs,
    },
    absorptionIcon: {
      marginRight: 2,
    },
  }));

  const s = useStyles();



  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  const toggleFilterSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFilterOption = (filterType, option) => {
    const currentFilters = filters[filterType] || [];
    let newFilters;
    
    if (currentFilters.includes(option)) {
      newFilters = currentFilters.filter(item => item !== option);
    } else {
      newFilters = [...currentFilters, option];
    }
    
    onFiltersChange({
      ...filters,
      [filterType]: newFilters
    });
  };

  const isFilterSelected = (filterType, option) => {
    return filters[filterType]?.includes(option) || false;
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const renderFilterChip = (filterType, option) => {
    const isSelected = isFilterSelected(filterType, option);
    
    return (
      <TouchableOpacity
        key={option}
        style={[s.filterChip, isSelected && s.activeFilterChip]}
        onPress={() => toggleFilterOption(filterType, option)}
      >
        <TText style={[s.filterText, isSelected && s.activeFilterText]}>
          {option}
        </TText>
        {isSelected && (
          <Ionicons 
            name="checkmark" 
            size={12} 
            color={colors.primaryText} 
            style={s.filterIcon} 
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterGroup = (filterType, title, options, renderOption = null) => {
    const isExpanded = expandedSections[filterType];
    
    return (
      <View style={s.filterGroup}>
        <TouchableOpacity 
          style={s.filterGroupHeader}
          onPress={() => toggleFilterSection(filterType)}
        >
          <TText style={s.filterGroupTitle}>{title}</TText>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
            style={[s.filterGroupExpandIcon, { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }]}
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={s.filterGroupContent}>
            <View style={s.filterOptions}>
              {options.map(option => 
                renderOption ? renderOption(filterType, option) : renderFilterChip(filterType, option)
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderAbsorptionOption = (filterType, option) => {
    const isSelected = isFilterSelected(filterType, option);
    const level = option === 'Faible' ? 1 : option === 'Modérée' ? 2 : 3;
    
    return (
      <TouchableOpacity
        key={option}
        style={[s.filterChip, isSelected && s.activeFilterChip]}
        onPress={() => toggleFilterOption(filterType, option)}
      >
        <TText style={[s.filterText, isSelected && s.activeFilterText]}>
          {option}
        </TText>
        <View style={s.absorptionIcons}>
          {[1, 2, 3].map((i) => (
            <Ionicons
              key={i}
              name="water"
              size={10}
              color={i <= level ? (isSelected ? colors.primaryText : colors.primary) : colors.textTertiary}
              style={s.absorptionIcon}
            />
          ))}
        </View>
        {isSelected && (
          <Ionicons 
            name="checkmark" 
            size={12} 
            color={colors.primaryText} 
            style={s.filterIcon} 
          />
        )}
      </TouchableOpacity>
    );
  };

    return (
    <TView style={s.container}>
      {/* Section Filtres */}
      <View style={s.filtersSection}>
        <TouchableOpacity style={s.filtersHeader} onPress={toggleFilters}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="filter" size={20} color={colors.black} style={{ marginRight: spacing.xs }} />
            <TText style={s.filtersTitle}>Filtres</TText>
            <Ionicons 
              name={filtersExpanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color={colors.black} 
              style={{ marginLeft: spacing.xs }} 
            />
          </View>
          <TouchableOpacity onPress={clearAllFilters}>
            <TText style={s.clearAllButton}>Effacer tout</TText>
          </TouchableOpacity>
        </TouchableOpacity>

        {filtersExpanded && (
          <View style={s.filtersContainer}>
            {/* Classe */}
            {renderFilterGroup('classe', 'Classe', filterOptions.classe)}

            {/* Application */}
            {renderFilterGroup('application', 'Application', filterOptions.application)}

            {/* Absorption */}
            {renderFilterGroup('absorption', 'Absorption', filterOptions.absorption, renderAbsorptionOption)}

            {/* Antimicrobien */}
            {renderFilterGroup('antimicrobien', 'Antimicrobien', filterOptions.antimicrobien)}

            {/* Autoadhésif */}
            {renderFilterGroup('autoadhesive', 'Autoadhésif', filterOptions.autoadhesive)}

            {/* Peut être mouillé */}
            {renderFilterGroup('waterproof', 'Peut être mouillé', filterOptions.waterproof)}

            {/* Découpage */}
            {renderFilterGroup('cuttable', 'Découpage', filterOptions.cuttable)}

            {/* Pédiatrie */}
            {renderFilterGroup('pediatric', 'Pédiatrie', filterOptions.pediatric)}
          </View>
        )}
      </View>
    </TView>
  );
};

export default ProductFilters;
