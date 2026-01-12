/**
 * Table34Renderer - Renderer spécifique pour la table C1T34 (Pied diabétique)
 * 
 * Table avec blocks multiples.
 * Utilise getAllElementsFromBlocks pour extraire tous les éléments des blocs.
 * 
 * Plan ÉTAPE 41 - Table avec blocks
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

const Table34Renderer = ({
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

  // Extraire tous les éléments des blocs
  const getAllElementsFromBlocks = () => {
    if (!tableData.blocks) {
      return [];
    }
    
    const allElements = [];
    Object.values(tableData.blocks).forEach((block) => {
      if (block.elements && Array.isArray(block.elements)) {
        allElements.push(...block.elements);
      }
    });
    
    return allElements;
  };

  const renderElements = () => {
    // Convertir les blocks en éléments si nécessaire
    let elementsToRender = tableData.elements;
    if (!elementsToRender && tableData.blocks && tableData.id === 'C1T34') {
      elementsToRender = getAllElementsFromBlocks();
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
      {/* Instructions si présentes (le titre est déjà affiché dans le header de l'écran) */}
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

export default Table34Renderer;





