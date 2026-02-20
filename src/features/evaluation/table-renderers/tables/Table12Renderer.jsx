/**
 * Table12Renderer - Renderer spécifique pour la table C1T12 (Symptômes)
 * Détails de la douleur : modale unique au clic, résumé affiché en dessous.
 */

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement, shouldShowSubquestion } from '../core/ConditionalLogic';
import { getPACSLACScore } from '@/components/ui/forms/PACSLACScale';
import PainDetailsModal from '../components/PainDetailsModal';
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
};

/** Construit le résumé des réponses douleur pour l'affichage sous la case Douleur */
const buildPainSummary = (data, subquestions) => {
  if (!subquestions || !Array.isArray(subquestions)) return null;
  const parts = [];

  const q1 = subquestions.find(s => s.qid === 'C1T12Q1');
  if (q1 && data.C1T12Q1 && q1.options) {
    const opt = q1.options.find(o => o.id === data.C1T12Q1);
    if (opt) parts.push(`Type : ${opt.label}`);
  }

  if (data.C1T12Q2 != null && data.C1T12Q2 !== '') {
    parts.push(`Intensité : ${data.C1T12Q2}/10`);
  }
  if (data.C1T12Q3 != null && data.C1T12Q3 !== '') {
    parts.push(`EVA : ${data.C1T12Q3}`);
  }

  const pacslacScore = data.C1T12Q4 && typeof data.C1T12Q4 === 'object' ? getPACSLACScore(data.C1T12Q4) : 0;
  if (pacslacScore > 0) {
    parts.push(`PACSLAC : ${pacslacScore}`);
  }

  const q5 = subquestions.find(s => s.qid === 'C1T12Q5');
  if (q5 && data.C1T12Q5 && q5.options) {
    const opt = q5.options.find(o => o.id === data.C1T12Q5);
    if (opt) parts.push(`Contrôle : ${opt.label}`);
  }

  return parts.length > 0 ? parts.join(' · ') : null;
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
  const [painModalVisible, setPainModalVisible] = useState(false);

  const renderProps = {
    tableData,
    data,
    errors,
    handleDataChange,
    evaluationData,
    colors,
    showHelper,
  };

  const painSubquestions = tableData.id === 'C1T12' && tableData.subquestions
    ? tableData.subquestions.filter(sq => shouldShowSubquestion(sq, data))
    : [];
  const painSummary = data.C1T12E02 ? buildPainSummary(data, tableData.subquestions) : null;

  // Rendre les éléments principaux ; pour Douleur : case + résumé + bouton modale
  const renderElements = () => {
    if (!tableData.elements || !Array.isArray(tableData.elements)) {
      return null;
    }

    const result = [];
    tableData.elements
      .filter(element => shouldShowElement(element, data, tableData.id))
      .forEach((element, index) => {
        const renderedElement = renderElement(element, renderProps);
        if (renderedElement) {
          result.push(
            <TView key={element.id || index} style={{ marginBottom: spacing.md }}>
              {renderedElement}
            </TView>
          );
        }
        // Sous la case Douleur : résumé des détails + bouton "Remplir les détails" ouvrant la modale
        if (element.id === 'C1T12E02' && data.C1T12E02) {
          result.push(
            <TView key="pain-details-block" style={{ marginLeft: spacing.sm, marginBottom: spacing.md }}>
              {painSummary ? (
                <TText style={{ fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xs }} numberOfLines={3}>
                  {painSummary}
                </TText>
              ) : null}
              <TouchableOpacity
                style={[detailButtonStyle.detailButton, { borderColor: colors.primary, backgroundColor: colors.primary + '12' }]}
                onPress={() => setPainModalVisible(true)}
                activeOpacity={0.8}
              >
                <TIcon name="create-outline" size={20} color={colors.primary} style={{ marginRight: spacing.xs }} />
                <TText style={[detailButtonStyle.detailButtonText, { color: colors.primary }]}>
                  {painSummary ? 'Modifier les détails de la douleur' : 'Remplir les détails de la douleur'}
                </TText>
              </TouchableOpacity>
            </TView>
          );
        }
      });

    return result;
  };

  const detailButtonStyle = StyleSheet.create({
    detailButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 10,
      borderWidth: 1.5,
    },
    detailButtonText: {
      fontSize: 15,
      fontWeight: '600',
    },
  });

  return (
    <TView style={styles.contentContainer}>
      {tableData.ui_configuration?.instructions && (
        <TView style={styles.instructionsContainer}>
          <TText style={[styles.instructions, { color: colors.textSecondary }]}>
            {tableData.ui_configuration.instructions}
          </TText>
        </TView>
      )}
      {renderElements()}
      <PainDetailsModal
        visible={painModalVisible}
        onClose={() => setPainModalVisible(false)}
        subquestions={painSubquestions}
        data={data}
        handleDataChange={handleDataChange}
        errors={errors}
        colors={colors}
      />
    </TView>
  );
};

export default Table12Renderer;





