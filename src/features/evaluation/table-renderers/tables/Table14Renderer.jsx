/**
 * Table14Renderer - Renderer spécifique pour la table C1T14 (Emplacement)
 * 
 * Table avec additional_fields et VisualSelector.
 * Gère la synchronisation entre VisualSelector et le radio group principal.
 * 
 * Plan ÉTAPE 36 - Table avec additional_fields et VisualSelector
 */

import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';
import { convertAdditionalFieldsToElements } from '../utils/converters';
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

const Table14Renderer = ({
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
    const mainElements = (tableData.elements || [])
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

    // Ajouter les additional_fields si présents
    if (tableData.id === 'C1T14' && tableData.additional_fields) {
      const additionalElements = convertAdditionalFieldsToElements(tableData);
      const renderedAdditionalElements = additionalElements
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

      return [...mainElements, ...renderedAdditionalElements];
    }

    return mainElements;
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

export default Table14Renderer;





