/**
 * Table15Renderer - Renderer spécifique pour la table C1T15 (Vasculaire)
 * 
 * Table la plus complexe avec blocs multiples :
 * - Blocs avec éléments, measurements, results
 * - Calculs IPSCB avec interprétation colorée
 * - Questionnaire d'Édimbourg avec questions conditionnelles
 * - Affichage conditionnel selon localisation (membres inférieurs)
 * 
 * Plan ÉTAPE 40 - Table la plus complexe
 */

import React, { useState } from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from '../core/ElementRenderer';
import { shouldShowElement } from '../core/ConditionalLogic';
import { interpretIPSCB } from '../utils/calculations';
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
  table15Container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  blockContainer: {
    marginBottom: spacing.xl,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    backgroundColor: 'transparent',
  },
  blockHeader: {
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: 'transparent',
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  blockDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  blockContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  blockElement: {
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  infoBox: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ipscbResultContainer: {
    marginBottom: spacing.sm,
    backgroundColor: 'transparent',
  },
  ipscbResultLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  ipscbResultBadge: {
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
    borderWidth: 2,
    alignItems: 'center',
  },
  ipscbResultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  ipscbResultLevel: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
};

const Table15Renderer = ({
  tableData,
  data,
  errors,
  handleDataChange,
  evaluationData,
  showHelper,
  questionnaireKey = 0,
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

  // Obtenir tous les blocs de la table 15 dans l'ordre spécifique
  const getAllBlocksForTable15 = () => {
    if (tableData?.id !== 'C1T15' || !tableData.blocks) {
      return [];
    }
    
    // Retourner tous les blocs disponibles dans l'ordre
    // Note: vascular_constats n'est plus un bloc séparé, les constats sont affichés dans le bloc IPSCB
    const allBlocks = [
      tableData.blocks.inspection,
      tableData.blocks.palpation,
      tableData.blocks.edinburgh_questionnaire,
      tableData.blocks.ipscb,
      // tableData.blocks.vascular_constats, // Les constats sont maintenant dans le bloc IPSCB
      tableData.blocks.vascular_confirmation
    ].filter(Boolean); // Filtrer les blocs qui n'existent pas
    
    return allBlocks;
  };

  // Rendre les blocs de la table 15
  const renderTable15Blocks = () => {
    if (tableData?.id !== 'C1T15') return null;
    
    // Récupérer la sélection de localisation
    let locationSelection = data['C1T14E01'];
    if (!locationSelection) {
      const possibleKeys = ['C1T14E01_05', 'C1T14E01_06'];
      for (const key of possibleKeys) {
        if (data[key] === true || data[key] === key) {
          locationSelection = key;
          break;
        }
      }
    }
    
    const allBlocks = getAllBlocksForTable15();
    
    if (allBlocks.length === 0) {
      return (
        <TView style={styles.emptyContainer}>
          <TText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aucun bloc disponible
          </TText>
        </TView>
      );
    }

    const isLowerLimbSpecific = (block) => {
      if (!block || !block.id) return false;
      return block.id === 'C1T15E' || block.id === 'C1T15D';
    };

    const isLowerLimb = locationSelection === 'C1T14E01_05' || locationSelection === 'C1T14E01_06';

    return (
      <TView style={styles.table15Container}>
        {allBlocks.map((block, blockIndex) => {
          // Ne pas afficher le bloc vascular_constats car les constats sont maintenant dans le bloc IPSCB
          if (block.id === 'C1T15_CONSTATS') {
            return null;
          }
          
          const isLowerLimbBlock = isLowerLimbSpecific(block);
          const showLowerLimbMessage = isLowerLimbBlock && !isLowerLimb;
          const blockElements = [];
          
          // Éléments standard
          if (block.elements && Array.isArray(block.elements)) {
            block.elements.forEach((element, elementIndex) => {
              // Pour le bloc vascular_constats, on affiche tous les éléments de type constat
              // sans vérifier shouldShowElement car ils sont gérés par ConstatElement
              if (block.id === 'C1T15_CONSTATS') {
                const rendered = renderElement(element, renderProps);
                if (rendered) {
                  blockElements.push(
                    <TView key={`${block.id}-element-${elementIndex}`} style={styles.blockElement}>
                      {rendered}
                    </TView>
                  );
                }
              } else {
                // Pour les autres blocs, utiliser shouldShowElement normalement
                if (shouldShowElement(element, data, tableData.id)) {
                  blockElements.push(
                    <TView key={`${block.id}-element-${elementIndex}`} style={styles.blockElement}>
                      {renderElement(element, renderProps)}
                    </TView>
                  );
                }
              }
            });
          }
          
          // Mesures pour IPSCB
          if (block.measurements && Array.isArray(block.measurements)) {
            block.measurements.forEach((measurement, measurementIndex) => {
              if (shouldShowElement(measurement, data, tableData.id)) {
                blockElements.push(
                  <TView key={`${block.id}-measurement-${measurementIndex}`} style={styles.blockElement}>
                    {renderElement(measurement, renderProps)}
                  </TView>
                );
              }
            });
          }
          
          // Résultats calculés pour IPSCB avec interprétation colorée
          if (block.results && Array.isArray(block.results) && block.id === 'C1T15D') {
            let hasDisplayedResults = false;
            
            block.results.forEach((result, resultIndex) => {
              if (shouldShowElement(result, data, tableData.id)) {
                const resultValue = data[result.id];
                const shouldDisplayResult = resultValue && resultValue !== 'N/A' && resultValue !== null && resultValue !== undefined;
                
                if (shouldDisplayResult) {
                  hasDisplayedResults = true;
                  const interpretation = interpretIPSCB(resultValue);
                  
                  if (interpretation) {
                    blockElements.push(
                      <TView key={`${block.id}-result-${resultIndex}`} style={styles.blockElement}>
                        <TView style={styles.ipscbResultContainer}>
                          <TText style={[styles.ipscbResultLabel, { color: colors.text }]}>
                            {result.label}
                          </TText>
                          <TView style={[
                            styles.ipscbResultBadge, 
                            { 
                              backgroundColor: interpretation.color + '15',
                              borderColor: interpretation.color,
                            }
                          ]}>
                            <TText style={[
                              styles.ipscbResultValue, 
                              { color: interpretation.color }
                            ]}>
                              {resultValue}
                            </TText>
                            <TText style={[
                              styles.ipscbResultLevel, 
                              { color: interpretation.color }
                            ]}>
                              {interpretation.niveau}
                            </TText>
                          </TView>
                        </TView>
                      </TView>
                    );
                  }
                }
              }
            });
            
            // Après tous les résultats IPSCB, afficher tous les constats d'apport vasculaire
            if (hasDisplayedResults && tableData.blocks?.vascular_constats?.elements) {
              const constatsElements = tableData.blocks.vascular_constats.elements;
              
              // 1. Avertissement IPSCB (âge >= 65)
              const warningElement = constatsElements.find(el => el.id === 'C1T15_WARNING_AGE');
              if (warningElement) {
                const warningRendered = renderElement(warningElement, renderProps);
                if (warningRendered) {
                  blockElements.push(
                    <TView key="ipscb-warning-age" style={styles.blockElement}>
                      {warningRendered}
                    </TView>
                  );
                }
              }
              
              // 2. Sans autre S/S (si aucun signe d'inspection)
              const noArterialElement = constatsElements.find(el => el.id === 'C1T15_CONSTAT_NO_ARTERIAL');
              if (noArterialElement) {
                const noArterialRendered = renderElement(noArterialElement, renderProps);
                if (noArterialRendered) {
                  blockElements.push(
                    <TView key="constat-no-arterial" style={styles.blockElement}>
                      {noArterialRendered}
                    </TView>
                  );
                }
              }
              
              // 3. Avec S/S (claudication faible ou forte)
              const withArterialElement = constatsElements.find(el => el.id === 'C1T15_CONSTAT_WITH_ARTERIAL');
              if (withArterialElement) {
                const withArterialRendered = renderElement(withArterialElement, renderProps);
                if (withArterialRendered) {
                  blockElements.push(
                    <TView key="constat-with-arterial" style={styles.blockElement}>
                      {withArterialRendered}
                    </TView>
                  );
                }
              }
            }
          } else if (block.results && Array.isArray(block.results)) {
            block.results.forEach((result, resultIndex) => {
              if (shouldShowElement(result, data, tableData.id)) {
                const resultValue = data[result.id];
                const shouldDisplayResult = resultValue && resultValue !== 'N/A' && resultValue !== null && resultValue !== undefined;
                
                if (shouldDisplayResult) {
                  blockElements.push(
                    <TView key={`${block.id}-result-${resultIndex}`} style={styles.blockElement}>
                      {renderElement(result, renderProps)}
                    </TView>
                  );
                }
              }
            });
          }

          // Gestion spéciale pour le questionnaire d'Édimbourg
          if (block.id === 'C1T15E' && block.questions) {
            block.questions.forEach((question, questionIndex) => {
              const questionElement = {
                id: question.id,
                type: question.type,
                label: question.label,
                required: question.required,
                options: question.options,
                conditional_questions: question.conditional_questions,
                ui: question.ui || {}
              };
              
              if (shouldShowElement(questionElement, data, tableData.id)) {
                blockElements.push(
                  <TView key={`${block.id}-question-${questionIndex}-${questionnaireKey}`} style={styles.blockElement}>
                    {renderElement(questionElement, renderProps)}
                  </TView>
                );
                
                // Questions conditionnelles
                if (question.conditional_questions && question.conditional_questions.questions) {
                  const firstQuestionValue = data[question.id];
                  const shouldShowConditional = firstQuestionValue === question.conditional_questions.condition;
                  
                  if (shouldShowConditional) {
                    question.conditional_questions.questions.forEach((conditionalQuestion, conditionalIndex) => {
                      const conditionalElement = {
                        id: conditionalQuestion.id,
                        type: conditionalQuestion.type,
                        label: conditionalQuestion.label,
                        required: conditionalQuestion.required,
                        options: conditionalQuestion.options,
                        ui: conditionalQuestion.ui || {}
                      };
                      
                      blockElements.push(
                        <TView key={`${block.id}-conditional-${conditionalIndex}-${questionnaireKey}`} style={styles.blockElement}>
                          {renderElement(conditionalElement, renderProps)}
                        </TView>
                      );
                    });
                  }
                }
              }
            });
          }

          const videoLink = block.video_link;
          
          return (
            <TView key={`block-${blockIndex}`} style={styles.blockContainer}>
              {block.title && (
                <TView style={styles.blockHeader}>
                  <TText style={[styles.blockTitle, { color: colors.text }]}>
                    {block.title}
                  </TText>
                  {/* Ne pas afficher la description pour le bloc vascular_constats */}
                  {block.description && block.id !== 'C1T15_CONSTATS' && (
                    <TText style={[styles.blockDescription, { color: colors.textSecondary }]}>
                      {block.description}
                    </TText>
                  )}
                </TView>
              )}
              
              {showLowerLimbMessage && (
                <TView style={[styles.infoBox, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }]}>
                  <TText style={[styles.infoText, { color: colors.primary }]}>
                    ⚠️ Ce bloc ne doit être rempli que si la plaie est localisée au membre inférieur (jambe, pied).
                  </TText>
                </TView>
              )}
              
              {videoLink && (
                <TView style={{ padding: spacing.md }}>
                  <TText style={[{ color: colors.primary }]}>
                    Lien vers vidéo
                  </TText>
                </TView>
              )}
              
              <TView style={styles.blockContent}>
                {blockElements}
              </TView>
            </TView>
          );
        })}
      </TView>
    );
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
      
      {renderTable15Blocks()}
    </TView>
  );
};

export default Table15Renderer;

