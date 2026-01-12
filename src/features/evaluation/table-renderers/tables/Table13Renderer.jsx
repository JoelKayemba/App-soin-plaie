/**
 * Table13Renderer - Renderer spécifique pour la table C1T13 (Perceptions)
 * 
 * Table avec structure `questions` au lieu de `elements`.
 * Utilise convertQuestionsToElements pour convertir les questions en éléments.
 * 
 * Plan ÉTAPE 35 - Table avec questions
 */

import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';
import { convertQuestionsToElements } from '../utils/converters';
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

const Table13Renderer = ({
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
    // Convertir les questions en éléments si nécessaire
    let elementsToRender = tableData.elements;
    if (!elementsToRender && tableData.questions) {
      elementsToRender = convertQuestionsToElements(tableData);
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
          <TView key={element.id || index} style={{ marginBottom: spacing.md }}>
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

export default Table13Renderer;





