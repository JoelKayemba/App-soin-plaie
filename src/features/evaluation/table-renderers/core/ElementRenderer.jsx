/**
 * ElementRenderer - Renderer générique pour les éléments de table
 * 
 * Ce composant gère le rendu générique des éléments selon leur type.
 * Pour les tables avec logique spéciale, utiliser un renderer spécifique.
 * 
 * ÉTAPE 7 - Fonction renderElement extraite depuis ContentDetector.jsx
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { 
  RadioGroup, 
  CheckboxGroup, 
  NumericInput, 
  TextInput, 
  DateInput,
  DateTextInput,
  BooleanInput,
  SimpleCheckbox,
  CheckboxWithText,
  CalculatedField,
  ResultBadge,
  InfoField,
  MultipleChoiceWithText,
  PhotoUpload,
  ScaleInput,
  VisualScale,
  PACSLACScale,
  VisualSelector,
} from '@/components/ui/forms';
import { ClinicalAlert, BradenScale } from '@/components/ui/special';
import { createElement, createElementWithCommonProps } from './ElementFactory';
import { calculateWoundAge, classifyBWATSize, evaluateBMICondition } from '../utils/calculations';
import spacing from '@/styles/spacing';

const styles = StyleSheet.create({
  mixedContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    backgroundColor: '#F8F9FA',
  },
  mixedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  mixedDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  subElement: {
    marginBottom: spacing.md,
  },
  unknownType: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  unknownTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  unknownTypeId: {
    fontSize: 12,
  },
});

/**
 * Renderer générique pour un élément selon son type
 * @param {object} element - L'élément à rendre
 * @param {object} props - Props nécessaires (tableData, data, errors, handleDataChange, etc.)
 * @returns {React.Element|null} - L'élément rendu ou null
 */
export const renderElement = (element, props) => {
  const {
    tableData,
    data,
    errors,
    handleDataChange,
    evaluationData,
    colors,
    showHelper,
  } = props;

  if (!element || !element.id) {
    console.warn('ElementRenderer - Élément invalide:', element);
    return null;
  }

  // Debug pour la table 22
  if (tableData?.id === 'C1T22') {
    console.log('Table 22 - renderElement appelé pour:', element.id, 'type:', element.type, 'options:', element.options?.length);
  }

  const commonProps = {
    error: errors[element.id],
    disabled: element.disabled || false,
    help: element.help,
    style: element.style,
  };

  // Fonction locale pour créer l'élément avec les props communes
  const createElementWithCommonPropsLocal = (Component, additionalProps = {}) => 
    createElementWithCommonProps(Component, commonProps, additionalProps, element.id);

  switch (element.type) {
    case 'single_choice':
      // Pour la table 04 (Poids & IMC), utiliser SimpleCheckbox pour les choix binaires sans options
      if (tableData?.id === 'C1T04' && (!element.options || element.options.length === 0)) {
        return createElementWithCommonPropsLocal(SimpleCheckbox, {
          value: data[element.id] || false,
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          help: element.help
        });
      }
      
      // Pour la table 11, ajouter la gestion des helpers pour les stades
      const enhancedOptions = tableData?.id === 'C1T11' && element.options ? 
        element.options.map(option => ({
          ...option,
          onHelpPress: option.help_id ? () => showHelper(option.help_id, option.label) : undefined
        })) : 
        element.options || [];

      // Pour la table 24, vérifier si le biofilm est suspecté et afficher une alerte stylisée
      if (tableData?.id === 'C1T24' && element.id === 'C1T24E01') {
        const selectedValue = data[element.id];
        const isBiofilmSuspect = selectedValue && selectedValue !== 'C1T24E01_01';
        
        const radioGroupElement = createElementWithCommonPropsLocal(RadioGroup, {
          options: enhancedOptions,
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          error: undefined // Ne pas afficher l'erreur dans le RadioGroup, utiliser ClinicalAlert à la place
        });
        
        if (isBiofilmSuspect) {
          const alertElement = createElement(ClinicalAlert, {
            alert: {
              type: 'warning',
              title: 'Biofilm suspecté',
              message: tableData.validation_rules?.error_messages?.biofilm_suspect || 
                "Biofilm suspecté : évaluation approfondie recommandée (épithélium ≠ 100%)",
              note: "Lorsque l'épithéliatisation n'est pas complète (≠ 100%), un biofilm peut être présent et nécessite une évaluation approfondie."
            },
            style: { marginTop: spacing.md }
          }, `${element.id}-biofilm-alert`);
          
          return (
            <React.Fragment key={element.id}>
              {radioGroupElement}
              {alertElement}
            </React.Fragment>
          );
        }
        
        return radioGroupElement;
      }

      return createElementWithCommonPropsLocal(RadioGroup, {
        options: enhancedOptions,
        value: data[element.id],
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        required: element.required
      });

    case 'multiple_choice':
    case 'multiple_selection':
      return createElementWithCommonPropsLocal(CheckboxGroup, {
        options: element.options || [],
        value: data[element.id] || [],
        onValueChange: (values) => handleDataChange(element.id, values),
        label: element.label,
        description: element.description,
        required: element.required,
        minSelections: element.minSelections,
        maxSelections: element.maxSelections
      });

    case 'multiple_choice_with_text':
      // Pour les tables avec champs de texte (allergies, conditions de santé, facteurs de risque), utiliser CheckboxWithText
      if (tableData?.id === 'C1T02' || tableData?.id === 'C1T03' || tableData?.id === 'C1T06') {
        return createElementWithCommonPropsLocal(CheckboxWithText, {
          value: data[element.id] || { checked: false, text: '' },
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          placeholder: element.conditional?.text_field_placeholder || "Précisez...",
          textFieldLabel: element.conditional?.text_field_label || "Détails",
          maxLength: element.conditional?.text_field_max_length || 200,
          help: element.help
        });
      }
      
      // Pour les autres tables, utiliser MultipleChoiceWithText
      return createElementWithCommonPropsLocal(MultipleChoiceWithText, {
        options: element.options || [],
        value: data[element.id] || {},
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        required: element.required,
        minSelections: element.minSelections,
        maxSelections: element.maxSelections,
        placeholder: element.placeholder
      });

    case 'boolean':
      if (tableData?.id === 'C1T27') {
        const currentValue = !!data[element.id];
        const checkboxElement = createElement(SimpleCheckbox, {
          ...commonProps,
          value: currentValue,
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          help: element.help
        }, element.id);

        if (element.alert && currentValue) {
          const alertElement = createElement(ClinicalAlert, {
            alert: {
              type: element.alert?.type === 'emergency' ? 'alert' : 'important',
              title: element.alert?.title || 'Urgence clinique détectée',
              message: element.alert?.message || 'Ce signe requiert une prise en charge immédiate.',
              note: "Orienter immédiatement le patient vers l'urgence ou contacter un médecin."
            },
            style: { marginTop: spacing.md }
          }, `${element.id}-alert`);

          return (
            <React.Fragment key={`${element.id}-wrapper`}>
              {checkboxElement}
              {alertElement}
            </React.Fragment>
          );
        }

        return checkboxElement;
      }

      // Pour les tables avec sélections multiples (allergies, conditions de santé, nutrition, médication, psychosocial), utiliser SimpleCheckbox
      if (tableData?.id === 'C1T02' || tableData?.id === 'C1T03' || tableData?.id === 'C1T05' || tableData?.id === 'C1T07' || tableData?.id === 'C1T08') {
        return createElementWithCommonPropsLocal(SimpleCheckbox, {
          value: data[element.id] || false,
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          help: element.help
        });
      }
      
      // Pour les autres tables, utiliser BooleanInput (Oui/Non)
      return createElementWithCommonPropsLocal(BooleanInput, {
        value: data[element.id],
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        required: element.required
      });

    case 'number':
      return createElementWithCommonPropsLocal(NumericInput, {
        value: data[element.id],
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        placeholder: element.placeholder,
        unit: element.unit,
        unit_options: element.unit_options,
        required: element.required,
        min: element.validation?.min,
        max: element.validation?.max,
        step: element.validation?.step,
        precision: element.validation?.precision,
        help: element.help
      });

    case 'text':
      // Vérifier si c'est un TextArea (Table 13) ou TextInput standard
      const isTextArea = element.ui?.component === 'TextArea' || element.rows > 1 || element.multiline;
      
      if (isTextArea) {
        return createElementWithCommonPropsLocal(TextInput, {
          value: data[element.id] || '',
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder || element.ui?.placeholder,
          required: element.required,
          multiline: true,
          minLength: element.validation?.min_length || element.min_length,
          maxLength: element.validation?.max_length || element.max_length || 1000
        });
      }
      
      return createElementWithCommonPropsLocal(TextInput, {
        value: data[element.id] || '',
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        placeholder: element.placeholder || element.ui?.placeholder,
        required: element.required,
        multiline: element.multiline || false,
        minLength: element.validation?.min_length || element.min_length,
        maxLength: element.validation?.max_length || element.max_length
      });

    case 'date':
      // Utiliser DateTextInput pour les champs de date de naissance (format AAAA-MM-JJ)
      if (element.id?.includes('birth') || element.id?.includes('naissance') || 
          element.label?.toLowerCase().includes('naissance') || 
          element.label?.toLowerCase().includes('birth') ||
          element.validation?.format === 'YYYY-MM-DD') {
        return createElementWithCommonPropsLocal(DateTextInput, {
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder || "AAAA-MM-JJ",
          required: element.required,
          help: element.help
        });
      }
      
      // Utiliser DateInput standard pour les autres dates
      return createElementWithCommonPropsLocal(DateInput, {
        value: data[element.id],
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        placeholder: element.placeholder,
        required: element.required,
        minDate: element.validation?.min_date,
        maxDate: element.validation?.max_date
      });

    case 'calculated':
      // Logique spéciale pour les badges d'âge de plaie (table 11)
      if (tableData?.id === 'C1T11' && (element.id === 'C1T11E02' || element.id === 'C1T11E03')) {
        const appearanceDate = data['C1T11E01'];
        if (!appearanceDate) {
          return null; // Ne pas afficher si aucune date d'apparition
        }
        
        const woundAge = calculateWoundAge(appearanceDate);
        if (!woundAge) {
          return null;
        }
        
        // Afficher seulement le bon badge selon l'âge
        if (element.id === 'C1T11E02' && woundAge.isRecent) {
          return createElementWithCommonPropsLocal(ResultBadge, {
            value: '< 4 semaines',
            label: element.label,
            description: element.description,
            displayFormat: element.ui?.display_format,
            color: element.ui?.color,
            icon: element.icon,
            help: element.help
          });
        } else if (element.id === 'C1T11E03' && woundAge.isChronic) {
          return createElementWithCommonPropsLocal(ResultBadge, {
            value: '≥ 4 semaines',
            label: element.label,
            description: element.description,
            displayFormat: element.ui?.display_format,
            color: element.ui?.color,
            icon: element.icon,
            help: element.help
          });
        } else {
          return null; // Ne pas afficher le badge si la condition n'est pas remplie
        }
      }

      // Logique spéciale pour la quantité de tissu nécrotique (table 22)
      if (tableData?.id === 'C1T22' && element.id && element.id.startsWith('C1T22E0') && parseInt(element.id.slice(-1)) >= 6 && parseInt(element.id.slice(-1)) <= 10) {
        // Récupérer la valeur de C1T21E01 depuis les données d'évaluation
        const necroticTissueValue = parseFloat(evaluationData?.['C1T21']?.['C1T21E01']) || 0;
        
        // Vérifier la condition pour chaque élément de quantité
        let shouldDisplay = false;
        const elementNum = parseInt(element.id.slice(-1));
        
        if (elementNum === 6 && necroticTissueValue === 0) {
          shouldDisplay = true;
        } else if (elementNum === 7 && necroticTissueValue > 0 && necroticTissueValue < 25) {
          shouldDisplay = true;
        } else if (elementNum === 8 && necroticTissueValue >= 25 && necroticTissueValue <= 50) {
          shouldDisplay = true;
        } else if (elementNum === 9 && necroticTissueValue > 50 && necroticTissueValue < 75) {
          shouldDisplay = true;
        } else if (elementNum === 10 && necroticTissueValue >= 75 && necroticTissueValue <= 100) {
          shouldDisplay = true;
        }
        
        if (!shouldDisplay) {
          return null; // Ne pas afficher si la condition n'est pas remplie
        }
        
        // Extraire le score du label (ex: "1 = Aucun visible" -> "1")
        const scoreMatch = element.label.match(/^(\d+)\s*=/);
        const scoreValue = scoreMatch ? scoreMatch[1] : element.label.split('=')[0].trim();
        
        return createElementWithCommonPropsLocal(ResultBadge, {
          value: scoreValue,
          label: element.label,
          description: element.description,
          displayFormat: element.ui?.display_format,
          color: element.ui?.color || element.clinical_notes?.color,
          icon: element.icon,
          help: element.help || element.ui?.help
        });
      }
      
      // Pour les classifications IMC de la table 04, évaluer la condition automatiquement
      if (tableData?.id === 'C1T04' && element.bmi_category && element.condition) {
        const bmiValue = data['C1T04E03']; // L'IMC calculé
        const shouldShow = evaluateBMICondition(bmiValue, element.condition);
        
        if (!shouldShow) {
          return null; // Ne pas afficher cette classification si la condition n'est pas remplie
        }
      }

      // Logique spéciale pour la classification BWAT (table 16)
      if (tableData?.id === 'C1T16' && element.id === 'C1T16E04') {
        const surfaceValue = data['C1T16E03'];
        if (!surfaceValue || surfaceValue === '0' || surfaceValue === '0.0') {
          return null; // Ne pas afficher si pas de surface calculée
        }
        
        const classification = classifyBWATSize(surfaceValue);
        if (classification) {
          return createElementWithCommonPropsLocal(ResultBadge, {
            value: classification.label,
            label: element.label || 'Classification BWAT',
            description: classification.description,
            displayFormat: element.ui?.display_format,
            color: classification.color,
            icon: element.icon,
            help: element.help || `Score BWAT: ${classification.score}`
          });
        }
      }

      // Logique spéciale pour la surface calculée BWAT (table 16)
      if (tableData?.id === 'C1T16' && element.id === 'C1T16E03') {
        const surfaceValue = data[element.id];
        if (surfaceValue && surfaceValue !== '0' && surfaceValue !== '0.0') {
          return createElementWithCommonPropsLocal(ResultBadge, {
            value: surfaceValue,
            label: element.label,
            description: element.description,
            displayFormat: element.ui?.display_format || `${surfaceValue} cm²`,
            color: element.ui?.color || colors.primary,
            icon: element.icon,
            help: element.help,
            unit: element.unit || 'cm²'
          });
        }
        return null; // Ne pas afficher si pas de surface calculée
      }
      
      // Utiliser ResultBadge si spécifié dans ui.component, sinon CalculatedField
      if (element.ui?.component === 'ResultBadge') {
        return createElementWithCommonPropsLocal(ResultBadge, {
          value: data[element.id] || data['C1T04E03'], // Utiliser l'IMC pour les classifications
          label: element.label,
          description: element.description,
          displayFormat: element.ui?.display_format,
          color: element.ui?.color,
          icon: element.icon,
          help: element.help
        });
      }
      
      return createElementWithCommonPropsLocal(CalculatedField, {
        value: data[element.id],
        label: element.label,
        description: element.description,
        unit: element.unit,
        icon: element.icon
      });

    case 'informational':
      return createElementWithCommonPropsLocal(InfoField, {
        content: element.content || element.description,
        type: element.info_type || 'info',
        icon: element.icon
      });

    case 'photo':
      return createElementWithCommonPropsLocal(PhotoUpload, {
        value: data[element.id] || [],
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        required: element.required,
        maxPhotos: element.maxPhotos || 3
      });

    case 'scale':
      return createElementWithCommonPropsLocal(ScaleInput, {
        value: data[element.id],
        onValueChange: (value) => handleDataChange(element.id, value),
        label: element.label,
        description: element.description,
        required: element.required,
        scale: element.scale || []
      });

    case 'mixed_input':
    case 'mixed_questions':
      // Pour les questions mixtes, on rend chaque sous-élément
      return (
        <TView key={element.id} style={styles.mixedContainer}>
          <TText style={[styles.mixedTitle, { color: colors.text }]}>
            {element.label}
          </TText>
          {element.description && (
            <TText style={[styles.mixedDescription, { color: colors.textSecondary }]}>
              {element.description}
            </TText>
          )}
          {element.elements?.map((subElement, index) => (
            <View key={subElement.id || index} style={styles.subElement}>
              {renderElement(subElement, props)}
            </View>
          ))}
        </TView>
      );

    case 'coordinates':
      // Callback pour synchroniser avec le radio group principal (Table 14)
      const onLocationSelect = (selectedZoneId) => {
        if (tableData?.id === 'C1T14' && selectedZoneId) {
          // Mettre à jour le champ principal de sélection
          handleDataChange('C1T14E01', selectedZoneId);
        }
      };
      
      return createElementWithCommonPropsLocal(VisualSelector, {
        value: data[element.id] || null,
        onValueChange: (value) => handleDataChange(element.id, value),
        onLocationSelect: onLocationSelect,
        selectedOptionId: tableData?.id === 'C1T14' ? data['C1T14E01'] : null, // Synchroniser avec le radio group principal
        label: element.label,
        description: element.description,
        help: element.help,
        required: element.required,
        width: element.ui?.width || 300,
        height: element.ui?.height || 400
      });

    case 'braden_scale':
      return createElementWithCommonPropsLocal(BradenScale, {
        scaleType: element.scale_type || element.scaleType || 'braden',
        value: data[element.id] || {},
        onValueChange: (value) => handleDataChange(element.id, value)
      });

    default:
      return (
        <TView key={element.id} style={[styles.unknownType, { backgroundColor: colors.surfaceLight }]}>
          <TText style={[styles.unknownTypeText, { color: colors.error }]}>
            Type non supporté: {element.type}
          </TText>
          <TText style={[styles.unknownTypeId, { color: colors.textSecondary }]}>
            ID: {element.id}
          </TText>
        </TView>
      );
  }
};

/**
 * Composant ElementRenderer - Wrapper pour utiliser renderElement
 */
const ElementRenderer = ({ 
  tableData, 
  data, 
  errors, 
  onDataChange,
  evaluationData,
  showHelper,
  // ... autres props nécessaires
}) => {
  const { colors } = useTheme();

  // Props à passer à renderElement
  const renderProps = {
    tableData,
    data,
    errors,
    handleDataChange: onDataChange,
    evaluationData,
    colors,
    showHelper,
  };

  // Pour l'instant, ce composant n'est pas encore utilisé directement
  // Il sera utilisé dans les renderers spécifiques de tables
  return null;
};

export default ElementRenderer;
