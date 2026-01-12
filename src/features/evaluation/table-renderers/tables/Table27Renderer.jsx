/**
 * Table27Renderer - Renderer spécifique pour la table C1T27 (Infection)
 * 
 * Table avec boolean (SimpleCheckbox) et alerts d'urgence conditionnelles.
 * Gère les champs conditionnels (intensité odeur, température).
 * 
 * Plan ÉTAPE 32 - Table avec boolean + alerts
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

const Table27Renderer = ({
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

  // Vérifier si au moins un élément de la table 27 est coché
  const hasAnyElementChecked = () => {
    if (!data) return false;
    const table27Keys = Object.keys(data).filter(key => key.startsWith('C1T27E'));
    return table27Keys.some(key => data[key] === true);
  };

  const renderElements = () => {
    if (!tableData.elements || !Array.isArray(tableData.elements)) {
      return null;
    }

    const elements = [];
    const continuumElement = tableData.elements.find(el => el.id === 'C1T27_CONTINUUM_MICROBIEN');

    // Rendre tous les éléments sauf le continuum microbien
    tableData.elements
      .filter(element => element.id !== 'C1T27_CONTINUUM_MICROBIEN' && shouldShowElement(element, data, tableData.id))
      .forEach((element, index) => {
        const renderedElement = renderElement(element, renderProps);
        if (renderedElement) {
          elements.push(
            <TView key={element.id || index} style={{ marginBottom: spacing.md }}>
              {renderedElement}
            </TView>
          );
        }
      });

    // Rendre le constat continuum microbien à la fin si au moins un élément est coché
    // Il s'affiche directement dans la page, juste après tous les éléments
    if (continuumElement && hasAnyElementChecked()) {
      // Toujours essayer de rendre le continuum, même s'il retourne null initialement
      // Il se mettra à jour quand les données seront chargées
      const renderedContinuum = renderElement(continuumElement, renderProps);
      if (renderedContinuum) {
        elements.push(
          <TView key={continuumElement.id} style={{ marginTop: spacing.lg, marginBottom: spacing.md }}>
            {renderedContinuum}
          </TView>
        );
      } else {
        // Debug: vérifier pourquoi le composant ne se rend pas
        console.log('[Table27Renderer] ContinuumMicrobien non rendu:', {
          hasChecked: hasAnyElementChecked(),
          element: continuumElement,
          data: data ? Object.keys(data).filter(k => k.startsWith('C1T27E') && data[k] === true) : []
        });
      }
    }

    return elements;
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

export default Table27Renderer;





