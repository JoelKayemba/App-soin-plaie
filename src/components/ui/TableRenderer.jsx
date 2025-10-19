import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { TView, TText } from './Themed';
import { 
  FormGroup, 
  RadioGroup, 
  CheckboxGroup, 
  NumericInput, 
  TextInput, 
  DateInput,
  BooleanInput,
  CalculatedField,
  InfoField,
  MultipleChoiceWithText,
  PhotoUpload,
  ScaleInput
} from './forms';
import { BWATAttribution, ClinicalAlert } from './special';
import SectionRenderer from './SectionRenderer';
import { useTheme } from '@/context/ThemeContext';
import useTableData from '@/hooks/useTableData';
import spacing from '@/styles/spacing';

const TableRenderer = ({ tableData, onDataChange, onValidationChange }) => {
  const { colors } = useTheme();
  const { data, errors, isValid, updateWithValidation } = useTableData(tableData.id);

  // Notifier les changements de données
  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data]);

  // Notifier les changements de validation
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid, errors);
    }
  }, [isValid, errors]);

  // Rendu d'un élément selon son type
  const renderElement = (element) => {
    const commonProps = {
      error: errors[element.id],
      disabled: element.disabled || false,
      help: element.help,
      style: element.style,
    };

    const createElement = (Component, additionalProps = {}) => (
      <Component
        key={element.id}
        {...commonProps}
        {...additionalProps}
      />
    );

    switch (element.type) {
      case 'single_choice':
        return createElement(RadioGroup, {
          options: element.options || [],
          value: data[element.id],
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'single_choice'
          }),
          label: element.label,
          description: element.description,
          required: element.required
        });

      case 'multiple_choice':
      case 'multiple_selection':
        return createElement(CheckboxGroup, {
          options: element.options || [],
          value: data[element.id] || [],
          onValueChange: (values) => updateWithValidation(element.id, values, {
            required: element.required,
            type: 'multiple_choice',
            minSelections: element.minSelections,
            maxSelections: element.maxSelections
          }),
          label: element.label,
          description: element.description,
          required: element.required,
          minSelections: element.minSelections,
          maxSelections: element.maxSelections
        });

      case 'multiple_choice_with_text':
        return createElement(MultipleChoiceWithText, {
          options: element.options || [],
          value: data[element.id] || {},
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'multiple_choice_with_text',
            minSelections: element.minSelections,
            maxSelections: element.maxSelections
          }),
          label: element.label,
          description: element.description,
          required: element.required,
          minSelections: element.minSelections,
          maxSelections: element.maxSelections,
          placeholder: element.placeholder
        });

      case 'number':
        return createElement(NumericInput, {
          value: data[element.id],
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'number',
            min: element.validation?.min,
            max: element.validation?.max
          }),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder,
          unit: element.unit,
          required: element.required,
          min: element.validation?.min,
          max: element.validation?.max,
          step: element.validation?.step,
          precision: element.validation?.precision
        });

      case 'text':
        return createElement(TextInput, {
          value: data[element.id] || '',
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            minLength: element.min_length,
            maxLength: element.max_length
          }),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder,
          required: element.required,
          multiline: element.multiline,
          minLength: element.min_length,
          maxLength: element.max_length
        });

      case 'date':
        return createElement(DateInput, {
          value: data[element.id],
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'date'
          }),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder,
          required: element.required,
          minDate: element.validation?.min_date,
          maxDate: element.validation?.max_date
        });

      case 'boolean':
        return createElement(BooleanInput, {
          value: data[element.id],
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'boolean'
          }),
          label: element.label,
          description: element.description,
          required: element.required
        });

      case 'calculated':
        return createElement(CalculatedField, {
          value: data[element.id],
          label: element.label,
          description: element.description,
          unit: element.unit,
          icon: element.icon
        });

      case 'informational':
        return createElement(InfoField, {
          content: element.content || element.description,
          type: element.info_type || 'info',
          icon: element.icon
        });

      case 'photo':
        return createElement(PhotoUpload, {
          value: data[element.id] || [],
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'photo'
          }),
          label: element.label,
          description: element.description,
          required: element.required,
          maxPhotos: element.maxPhotos || 3
        });

      case 'scale':
        return createElement(ScaleInput, {
          value: data[element.id],
          onValueChange: (value) => updateWithValidation(element.id, value, {
            required: element.required,
            type: 'scale'
          }),
          label: element.label,
          description: element.description,
          required: element.required,
          scale: element.scale || []
        });

      case 'mixed_input':
      case 'mixed_questions':
        // Pour les questions mixtes, on rend chaque sous-élément
        return (
          <FormGroup key={element.id} title={element.label} description={element.description}>
            {element.elements?.map((subElement, index) => (
              <View key={subElement.id || index}>
                {renderElement(subElement)}
              </View>
            ))}
          </FormGroup>
        );

      default:
        return (
          <FormGroup key={element.id} title={element.label || element.id}>
            <TText style={{ color: colors.error }}>
              Type non supporté: {element.type}
            </TText>
          </FormGroup>
        );
    }
  };

  // Rendu des sections si elles existent
  const renderSections = () => {
    if (!tableData.ui_configuration?.sections) {
      // Rendu simple sans sections
      return tableData.elements?.map(renderElement) || [];
    }

    return tableData.ui_configuration.sections.map((section, index) => (
      <SectionRenderer
        key={section.id || index}
        section={section}
        data={data}
        onDataChange={onDataChange}
        errors={errors}
        renderElement={renderElement}
        elements={tableData.elements}
      />
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TView style={styles.content}>
        {/* Attribution BWAT si présente */}
        {tableData.bwat_attribution && (
          <BWATAttribution attribution={tableData.bwat_attribution} />
        )}

        {/* Alerte clinique si présente */}
        {tableData.clinical_alert && (
          <ClinicalAlert alert={tableData.clinical_alert} />
        )}

        {/* En-tête de la table */}
        <TView style={[styles.header, { backgroundColor: colors.surface }]}>
          <TText style={[styles.title, { color: colors.text }]}>
            {tableData.title}
          </TText>
          {tableData.description && (
            <TText style={[styles.description, { color: colors.textSecondary }]}>
              {tableData.description}
            </TText>
          )}
        </TView>

        {/* Instructions */}
        {tableData.ui_configuration?.instructions && (
          <TView style={[styles.instructions, { backgroundColor: colors.surfaceLight }]}>
            <TText style={[styles.instructionsText, { color: colors.textSecondary }]}>
              {tableData.ui_configuration.instructions}
            </TText>
          </TView>
        )}

        {/* Contenu de la table */}
        <TView style={styles.tableContent}>
          {renderSections()}
        </TView>

        {/* Statut de validation */}
        <TView style={[styles.validationStatus, { backgroundColor: isValid ? colors.success + '20' : colors.error + '20' }]}>
          <TText style={[styles.validationText, { color: isValid ? colors.success : colors.error }]}>
            {isValid ? '✓ Formulaire valide' : '⚠️ Erreurs détectées'}
          </TText>
        </TView>
      </TView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  instructions: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.md,
  },
  instructionsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  tableContent: {
    marginBottom: spacing.lg,
  },
  calculatedResult: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calculatedText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  validationStatus: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
  },
  validationText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TableRenderer;
