/**
 * Table20Renderer - Renderer spécifique pour la table C1T20 (Sous-minage)
 * 
 * Table avec complementary_fields et additional_tracts.
 * Utilise convertTable20FieldsToElements pour convertir les champs.
 * 
 * Plan ÉTAPE 37 - Table avec champs complémentaires
 */

import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';
import { convertTable20FieldsToElements } from '../utils/converters';
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

const Table20Renderer = ({
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

    // Ajouter les champs complémentaires si présents
    if (tableData.id === 'C1T20' && (tableData.complementary_fields || tableData.additional_tracts)) {
      const table20Fields = convertTable20FieldsToElements(tableData);
      const renderedTable20Fields = table20Fields
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

      return [...mainElements, ...renderedTable20Fields];
    }

    return mainElements;
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

export default Table20Renderer;





