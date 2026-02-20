/**
 * Table14Renderer - Renderer spécifique pour la table C1T14 (Emplacement)
 *
 * Table avec additional_fields et VisualSelector.
 * Option pour ouvrir l'écran WebView 3D (BodyModel3D) en plein écran.
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  openButtonContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  openButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.md,
    minWidth: 200,
    alignItems: 'center',
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  const navigation = useNavigation();

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
      {/* Instructions si présentes */}
      {tableData.ui_configuration?.instructions && (
        <TView style={styles.instructionsContainer}>
          <TText style={[styles.instructions, { color: colors.textSecondary }]}>
            {tableData.ui_configuration.instructions}
          </TText>
        </TView>
      )}

      {/* Option pour ouvrir l'écran WebView 3D (plein écran) */}
      <View style={styles.openButtonContainer}>
        <TouchableOpacity
          style={[styles.openButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('BodyModel3D')}
          activeOpacity={0.8}
        >
          <TText style={[styles.openButtonText, { color: '#fff' }]}>
            Voir le modèle 3D
          </TText>
        </TouchableOpacity>
      </View>

      {renderElements()}
    </TView>
  );
};

export default Table14Renderer;





