/**
 * ContinuumMicrobien - Composant pour afficher le constat "Stade du continuum microbien"
 * 
 * Affiche deux sections :
 * 1. Détection automatique du stade le plus grave
 * 2. Confirmation manuelle du statut infectieux
 */

import React, { useState, useEffect } from 'react';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { RadioGroup, ResultBadge } from '@/components/ui/forms';
import { constatsGenerator } from '@/services';
import { renderElement } from '../core/ElementRenderer';
import spacing from '@/styles/spacing';

const styles = {
  container: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  badgeContainer: {
    marginBottom: spacing.md,
  },
  separator: {
    height: 1,
    marginVertical: spacing.lg,
    opacity: 0.3,
  },
};

const ContinuumMicrobien = ({ element, data, evaluationData, handleDataChange, colors }) => {
  const [constatTable, setConstatTable] = useState(null);
  const [detectedConstats, setDetectedConstats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostSevereConstat, setMostSevereConstat] = useState(null);

  // Vérifier si au moins un élément de la table 27 est coché
  const hasAnyElementChecked = () => {
    if (!data && !evaluationData) return false;
    
    // Vérifier dans data directement
    if (data) {
      const table27Keys = Object.keys(data).filter(key => key.startsWith('C1T27E'));
      if (table27Keys.some(key => data[key] === true)) {
        return true;
      }
    }
    
    // Vérifier dans evaluationData
    if (evaluationData) {
      const table27Data = evaluationData['C1T27'];
      if (table27Data) {
        const table27Keys = Object.keys(table27Data).filter(key => key.startsWith('C1T27E'));
        if (table27Keys.some(key => table27Data[key] === true)) {
          return true;
        }
      }
    }
    
    return false;
  };

  useEffect(() => {
    const loadConstat = async () => {
      if (!element.constat_table) {
        setIsLoading(false);
        return;
      }

      const hasChecked = hasAnyElementChecked();
      if (!hasChecked) {
        setIsLoading(false);
        return;
      }

      try {
        // Construire les données complètes pour l'évaluation
        const fullEvaluationData = {
          ...evaluationData,
          C1T27: data || evaluationData?.['C1T27'] || {}
        };

        const result = await constatsGenerator.generateConstatsForTable(
          element.constat_table,
          fullEvaluationData
        );

        const { detectedConstats: detected, constatTable: table } = result;
        setConstatTable(table);
        setDetectedConstats(detected || []);

        // Trouver le constat le plus grave selon la logique de priorité
        if (table?.sections && table.sections.length > 0) {
          const section1 = table.sections.find(s => s.id === 'section_1_auto_detection');
          if (section1?.display_logic?.priority_order) {
            const priorityOrder = section1.display_logic.priority_order;
            const detectedElements = table.elements?.filter(el => 
              detected.includes(el.id) && el.section === 'section_1_auto_detection'
            ) || [];
            
            // Trier par priorité (premier dans la liste = plus grave)
            detectedElements.sort((a, b) => {
              const priorityA = priorityOrder.indexOf(a.id);
              const priorityB = priorityOrder.indexOf(b.id);
              return priorityA - priorityB;
            });
            
            setMostSevereConstat(detectedElements[0] || null);
          }
        }
      } catch (error) {
        console.warn(`[ContinuumMicrobien] Erreur chargement constat ${element.constat_table}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConstat();
  }, [element.constat_table, data, evaluationData]);

  // Ne pas retourner null si isLoading, mais afficher un état de chargement ou attendre
  if (isLoading) {
    return null; // Ou un indicateur de chargement
  }

  if (!hasAnyElementChecked()) {
    return null;
  }

  if (!constatTable) {
    return null;
  }

  // Trouver l'élément de confirmation (peut être dans n'importe quelle section)
  const confirmationElement = constatTable.elements?.find(el => el.id === 'C2T04_CONFIRMATION');
  // Chercher la valeur dans data ou evaluationData
  const confirmationValue = data?.['C2T04_CONFIRMATION'] || evaluationData?.['C2T04']?.['C2T04_CONFIRMATION'] || null;
  
  // Debug
  console.log('[ContinuumMicrobien] État:', {
    hasChecked: hasAnyElementChecked(),
    isLoading,
    constatTable: !!constatTable,
    mostSevereConstat: !!mostSevereConstat,
    confirmationElement: !!confirmationElement,
    confirmationValue
  });

  // Trouver la section 1 pour le texte descriptif
  const section1 = constatTable.sections?.find(s => s.id === 'section_1_auto_detection');

  return (
    <TView style={styles.container}>
      <TView style={styles.section}>
        {/* Texte descriptif de la section 1 */}
        {section1 && (
          <TText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {section1.description}
          </TText>
        )}
        
        {/* Badge du stade détecté */}
        {mostSevereConstat && (
          <TView style={styles.badgeContainer}>
            <ResultBadge
              value={mostSevereConstat.label}
              label={mostSevereConstat.label}
              description={mostSevereConstat.description}
              displayFormat={mostSevereConstat.ui?.display_format || mostSevereConstat.label}
              color={mostSevereConstat.ui?.color}
            />
          </TView>
        )}
        
        {/* Confirmation manuelle directement en dessous du badge */}
        {confirmationElement && (
          <TView style={{ marginTop: spacing.md }}>
            <TText style={[styles.sectionTitle, { color: colors.text }]}>
              {confirmationElement.label}
            </TText>
            {confirmationElement.description && (
              <TText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                {confirmationElement.description}
              </TText>
            )}
            <RadioGroup
              value={confirmationValue}
              onValueChange={(value) => {
                if (handleDataChange) {
                  handleDataChange('C2T04_CONFIRMATION', value);
                }
              }}
              options={confirmationElement.options?.map(opt => ({
                id: opt.id,
                label: opt.label,
                description: opt.description,
                value: opt.value,
                help: opt.help
              })) || []}
              required={confirmationElement.required}
              layout={confirmationElement.ui?.layout || 'vertical'}
              spacing={confirmationElement.ui?.spacing || 'medium'}
              help={confirmationElement.ui?.help}
            />
          </TView>
        )}
      </TView>
    </TView>
  );
};

export default ContinuumMicrobien;

