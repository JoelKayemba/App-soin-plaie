/**
 * Table25Renderer - Renderer spécifique pour la table C1T25 (Exsudat)
 * 
 * Table avec sub_blocks (qualité + quantité).
 * Utilise convertTable25SubBlocksToElements pour convertir les sub_blocks.
 * 
 * Plan ÉTAPE 39 - Table avec sub_blocks
 */

import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';
import { convertTable25SubBlocksToElements } from '../utils/converters';
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

const Table25Renderer = ({
  tableData,
  data,
  errors,
  handleDataChange,
  evaluationData,
  showHelper,
}) => {
  const { colors } = useTheme();

  const renderProps = {
    tableData,
    data,
    errors,
    handleDataChange,
    evaluationData,
    colors,
    showHelper,
  };

  const renderElements = () => {
    // Convertir les sub_blocks en éléments si nécessaire
    let elementsToRender = tableData.elements;
    if (!elementsToRender && tableData.sub_blocks && tableData.id === 'C1T25') {
      elementsToRender = convertTable25SubBlocksToElements(tableData);
    }

    if (!elementsToRender || !Array.isArray(elementsToRender)) {
      return null;
    }

    return elementsToRender
      .filter(element => shouldShowElement(element, data, tableData.id))
      .map((element, index) => {
        const renderedElement = renderElement(element, renderProps);
        if (!renderedElement) return null;
        
        return (
          <TView key={element.id || index} style={{ marginBottom: spacing.md, backgroundColor: 'transparent' }}>
            {renderedElement}
          </TView>
        );
      });
  };

  return (
    <TView style={styles.contentContainer}>
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
      
      {renderElements()}
    </TView>
  );
};

export default Table25Renderer;





