/**
 * Table09Renderer - Renderer spécifique pour la table C1T09 (Assurances)
 * 
 * Table très simple avec des éléments standard, pas de logique spéciale.
 * Utilise ElementRenderer pour le rendu générique.
 * 
 * Plan ÉTAPE 8 - Premier renderer spécifique
 */

import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';
import spacing from '@/styles/spacing';

const styles = {
  contentContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: spacing.md,
  },
  groupLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
};

const Table09Renderer = ({
  tableData,
  data,
  errors,
  handleDataChange,
  evaluationData,
  showHelper,
}) => {
  const { colors } = useTheme();

  // Props à passer à renderElement
  const renderProps = {
    tableData,
    data,
    errors,
    handleDataChange,
    evaluationData,
    colors,
    showHelper,
  };

  // Rendre tous les éléments de la table
  const renderElements = () => {
    if (!tableData.elements || !Array.isArray(tableData.elements)) {
      return null;
    }

    return tableData.elements
      .filter(element => shouldShowElement(element, data, tableData.id))
      .map((element, index) => {
        // Créer une copie de l'élément sans label et description pour éviter la duplication
        // car ils sont déjà affichés dans le header
        const elementWithoutLabel = {
          ...element,
          label: undefined,
          description: undefined,
        };
        
        const renderedElement = renderElement(elementWithoutLabel, renderProps);
        if (!renderedElement) return null;
        
        return (
          <TView key={element.id || index} style={{ marginBottom: spacing.md }}>
            {renderedElement}
          </TView>
        );
      });
  };

  return (
    <TView style={styles.contentContainer}>
      {/* Affichage du titre et des instructions si présents */}
      {tableData.ui_configuration?.group_label && (
        <TView style={styles.headerContainer}>
          <TText style={[styles.groupLabel, { color: colors.text }]}>
            {tableData.ui_configuration.group_label}
          </TText>
        </TView>
      )}
      
      {tableData.ui_configuration?.instructions && (
        <TView style={styles.instructionsContainer}>
          <TText style={[styles.instructions, { color: colors.textSecondary }]}>
            {tableData.ui_configuration.instructions}
          </TText>
        </TView>
      )}
      
      {/* Rendu des éléments (sans label/description pour éviter la duplication) */}
      {renderElements()}
    </TView>
  );
};

export default Table09Renderer;


