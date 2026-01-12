/**
 * Table02Renderer - Renderer spécifique pour la table C1T02 (Allergies)
 * 
 * Table avec logique SimpleCheckbox pour les éléments boolean.
 * Utilise ElementRenderer qui gère déjà le cas SimpleCheckbox pour C1T02.
 * 
 * Plan ÉTAPE 15 - Table avec SimpleCheckbox
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

const Table02Renderer = ({
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
    if (!tableData.elements || !Array.isArray(tableData.elements)) {
      return null;
    }

    return tableData.elements
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

export default Table02Renderer;





