/**
 * SubquestionRenderer - Renderer pour les sous-questions et champs associés
 * 
 * Gère le rendu des sous-questions et des champs associés aux options
 * 
 * ÉTAPE 9 - Extraction de renderSubquestion et renderAssociatedFields depuis ContentDetector.jsx
 */

import React from 'react';
import { TView } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import {
  RadioGroup,
  NumericInput,
  TextInput,
  VisualScale,
  PACSLACModalButton,
} from '@/components/ui/forms';
import { createElement } from './ElementFactory';
import spacing from '@/styles/spacing';

const styles = {
  associatedFieldContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
  },
};

/**
 * Rend une sous-question selon son type
 * @param {object} subquestion - La sous-question à rendre
 * @param {object} props - Props nécessaires (data, errors, handleDataChange, createElement)
 * @returns {React.Element|null} - L'élément rendu ou null
 */
export const renderSubquestion = (subquestion, props) => {
  const {
    data,
    errors,
    handleDataChange,
  } = props;

  const currentValue = data[subquestion.qid] || data[subquestion.id];
  
  // Fonction pour gérer le changement de valeur
  const handleSubquestionChange = (value) => {
    handleDataChange(subquestion.qid || subquestion.id, value);
  };

  const commonProps = {
    label: subquestion.label,
    description: subquestion.description,
    required: subquestion.required,
    value: currentValue,
    onValueChange: handleSubquestionChange,
    error: errors[subquestion.qid || subquestion.id]
  };

  const componentByType = {
    single_choice: RadioGroup,
    number: NumericInput,
    text: TextInput,
    visual_scale: VisualScale,
    pacslac_scale: PACSLACModalButton,
  };
  const Component = componentByType[subquestion.type];
  if (!Component) {
    if (__DEV__) {
      console.warn(`[SubquestionRenderer] Type non géré ou composant manquant: ${subquestion.type}`);
    }
    return null;
  }

  switch (subquestion.type) {
    case 'single_choice':
      return createElement(RadioGroup, {
        ...commonProps,
        options: subquestion.options?.map(option => ({
          ...option,
          onHelpPress: option.help ? () => {} : undefined
        })) || []
      }, subquestion.qid);

    case 'number':
      return createElement(NumericInput, {
        ...commonProps,
        min: subquestion.validation?.min,
        max: subquestion.validation?.max,
        step: subquestion.validation?.step,
        unit: subquestion.validation?.unit
      }, subquestion.qid);

    case 'visual_scale':
      return createElement(VisualScale, {
        ...commonProps,
        min: subquestion.validation?.min || 0,
        max: subquestion.validation?.max || 100,
        unit: subquestion.ui?.unit || '',
        scaleType: subquestion.ui?.scale_type || 'pain_analog'
      }, subquestion.qid);

    case 'pacslac_scale':
      return createElement(PACSLACModalButton, {
        ...commonProps,
        help: subquestion.ui?.help,
        min_score: subquestion.validation?.min_score || 0,
        max_score: subquestion.validation?.max_score || 60,
        scaleType: subquestion.ui?.scale_type || 'pacslac_assessment',
        embeddedInModal: props.embeddedInModal === true
      }, subquestion.qid);

    default:
      console.warn(`Type de sous-question non géré: ${subquestion.type}`);
      return null;
  }
};

/**
 * Rend les champs associés aux options d'une sous-question
 * @param {string} selectedOptionId - ID de l'option sélectionnée
 * @param {object} subquestion - La sous-question contenant les options
 * @param {object} props - Props nécessaires (data, errors, handleDataChange, createElement, colors)
 * @returns {React.Element|null} - L'élément rendu ou null
 */
export const renderAssociatedFields = (selectedOptionId, subquestion, props) => {
  const {
    data,
    errors,
    handleDataChange,
    colors,
  } = props;

  if (!selectedOptionId || !subquestion.options) return null;

  const selectedOption = subquestion.options.find(opt => opt.id === selectedOptionId);
  if (!selectedOption || !selectedOption.associated_field) return null;

  const field = selectedOption.associated_field;
  const fieldValue = data[field.id];

  const fieldProps = {
    label: field.label,
    value: fieldValue,
    onValueChange: (value) => handleDataChange(field.id, value),
    error: errors[field.id],
    required: true
  };

  let fieldComponent;
  switch (field.type) {
    case 'number':
      fieldComponent = createElement(NumericInput, {
        ...fieldProps,
        min: field.validation?.min,
        max: field.validation?.max,
        step: field.validation?.step,
        unit: field.validation?.unit
      }, field.id);
      break;

    case 'text':
      fieldComponent = createElement(TextInput, {
        ...fieldProps,
        multiline: false,
        maxLength: field.validation?.max_length,
        placeholder: field.ui?.placeholder
      }, field.id);
      break;

    case 'visual_scale':
      fieldComponent = createElement(VisualScale, {
        ...fieldProps,
        min: field.validation?.min || 0,
        max: field.validation?.max || 100,
        unit: field.ui?.unit || '',
        scaleType: field.ui?.scale_type || 'pain_analog'
      }, field.id);
      break;

    case 'pacslac_scale':
      fieldComponent = createElement(PACSLACModalButton, {
        ...fieldProps,
        min_score: field.validation?.min_score || 0,
        max_score: field.validation?.max_score || 60,
        scaleType: field.ui?.scale_type || 'pacslac_assessment'
      }, field.id);
      break;

    default:
      console.warn(`Type de champ associé non géré: ${field.type}`);
      return null;
  }

  // Wrapper avec style pour indiquer que c'est un champ associé
  return (
    <TView 
      style={[styles.associatedFieldContainer, { backgroundColor: colors.surfaceLight }]}
    >
      {fieldComponent}
    </TView>
  );
};

export default {
  renderSubquestion,
  renderAssociatedFields,
};


