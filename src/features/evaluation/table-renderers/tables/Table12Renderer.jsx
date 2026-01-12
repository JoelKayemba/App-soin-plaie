/**
 * Table12Renderer - Renderer spécifique pour la table C1T12 (Symptômes)
 * 
 * Table avec sous-questions conditionnelles complexes.
 * Utilise SubquestionRenderer pour le rendu des sous-questions.
 * 
 * Plan ÉTAPE 34 - Table avec sous-questions
 */

import React from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { renderSubquestion, renderAssociatedFields } from '../core/SubquestionRenderer';
import { shouldShowElement, shouldShowSubquestion } from '../core/ConditionalLogic';
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

const Table12Renderer = ({
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

  const subquestionProps = {
    data,
    errors,
    handleDataChange,
    colors,
  };

  // Rendre les éléments principaux et les sous-questions
  const renderElements = () => {
    if (!tableData.elements || !Array.isArray(tableData.elements)) {
      return null;
    }

    const mainElements = tableData.elements
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

    // Rendre les sous-questions si présentes
    const subquestionsElements = [];
    if (tableData.id === 'C1T12' && tableData.subquestions) {
      tableData.subquestions
        .filter(shouldShowSubquestion)
        .forEach(subquestion => {
          const subquestionElement = renderSubquestion(subquestion, subquestionProps);
          if (subquestionElement) {
            subquestionsElements.push(
              React.cloneElement(subquestionElement, { 
                key: subquestion.qid || subquestion.id 
              })
            );
          }
          
          // Pour les sous-questions de type single_choice, vérifier s'il y a des champs associés
          if (subquestion.type === 'single_choice') {
            const selectedOptionId = data[subquestion.qid];
            if (selectedOptionId && subquestion.options) {
              const associatedField = renderAssociatedFields(selectedOptionId, subquestion, subquestionProps);
              if (associatedField) {
                subquestionsElements.push(
                  React.cloneElement(associatedField, { 
                    key: `associated-${subquestion.qid}-${selectedOptionId}` 
                  })
                );
              }
            }
          }
        });
    }
    
    return [...mainElements, ...subquestionsElements];
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

export default Table12Renderer;





