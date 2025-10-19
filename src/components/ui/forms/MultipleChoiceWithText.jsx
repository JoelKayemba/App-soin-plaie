import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const MultipleChoiceWithText = ({ 
  options = [],
  value = {},
  onValueChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  help,
  minSelections = 0,
  maxSelections = null,
  placeholder = "Ajouter des détails...",
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [selectedOptions, setSelectedOptions] = useState(value || {});
  const isInternalUpdate = useRef(false);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setSelectedOptions(value || {});
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleOptionToggle = (optionId) => {
    if (disabled) return;

    const newSelectedOptions = { ...selectedOptions };
    
    if (newSelectedOptions[optionId]) {
      // Désélectionner l'option
      delete newSelectedOptions[optionId];
    } else {
      // Vérifier les limites de sélection
      const currentCount = Object.keys(newSelectedOptions).length;
      if (maxSelections && currentCount >= maxSelections) {
        return; // Limite atteinte
      }
      
      // Sélectionner l'option avec texte vide
      newSelectedOptions[optionId] = {
        selected: true,
        text: ''
      };
    }
    
    isInternalUpdate.current = true;
    setSelectedOptions(newSelectedOptions);
    onValueChange?.(newSelectedOptions);
  };

  const handleTextChange = (optionId, text) => {
    if (disabled) return;

    const newSelectedOptions = {
      ...selectedOptions,
      [optionId]: {
        ...selectedOptions[optionId],
        text: text
      }
    };
    
    isInternalUpdate.current = true;
    setSelectedOptions(newSelectedOptions);
    onValueChange?.(newSelectedOptions);
  };

  const isSelected = (optionId) => {
    return selectedOptions[optionId]?.selected || false;
  };

  const getTextValue = (optionId) => {
    return selectedOptions[optionId]?.text || '';
  };

  const getSelectedCount = () => {
    return Object.keys(selectedOptions).length;
  };

  const showHelp = () => {
    if (help) {
      // TODO: Implémenter l'aide
    }
  };

  return (
    <TView style={[styles.container, style]} {...props}>
      {label && (
        <View style={styles.header}>
          <TText style={[styles.label, { color: colors.text }]}>
            {label}
            {required && <TText style={{ color: colors.error }}> *</TText>}
          </TText>
          {help && (
            <TouchableOpacity onPress={showHelp} style={styles.helpButton}>
              <TIcon name="help-circle-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {description && (
        <TText style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </TText>
      )}

      {/* Compteur de sélections */}
      {(minSelections > 0 || maxSelections) && (
        <TView style={[styles.counter, { backgroundColor: colors.surfaceLight }]}>
          <TText style={[styles.counterText, { color: colors.textSecondary }]}>
            {getSelectedCount()} sélectionné{getSelectedCount() > 1 ? 's' : ''}
            {minSelections > 0 && ` (minimum: ${minSelections})`}
            {maxSelections && ` (maximum: ${maxSelections})`}
          </TText>
        </TView>
      )}
      
      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const selected = isSelected(option.id);
          
          return (
            <TView 
              key={option.id} 
              style={[
                styles.optionContainer,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primary + '10' : colors.surface,
                }
              ]}
            >
              {/* Checkbox et label */}
              <TouchableOpacity
                style={styles.optionHeader}
                onPress={() => handleOptionToggle(option.id)}
                disabled={disabled}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primary : 'transparent',
                  }
                ]}>
                  {selected && (
                    <TIcon name="checkmark" size={14} color={colors.primaryText} />
                  )}
                </View>
                
                <TText style={[
                  styles.optionLabel,
                  { 
                    color: disabled ? colors.textTertiary : colors.text,
                    fontWeight: selected ? '600' : '400'
                  }
                ]}>
                  {option.label}
                </TText>
              </TouchableOpacity>

              {/* Champ texte conditionnel */}
              {selected && (
                <View style={styles.textInputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                        color: colors.text,
                      }
                    ]}
                    value={getTextValue(option.id)}
                    onChangeText={(text) => handleTextChange(option.id, text)}
                    placeholder={option.placeholder || placeholder}
                    placeholderTextColor={colors.textTertiary}
                    multiline={option.multiline || false}
                    numberOfLines={option.multiline ? 3 : 1}
                    editable={!disabled}
                  />
                  
                  {option.help && (
                    <TText style={[styles.optionHelp, { color: colors.textSecondary }]}>
                      {option.help}
                    </TText>
                  )}
                </View>
              )}
            </TView>
          );
        })}
      </View>
      
      {error && (
        <TText style={[styles.error, { color: colors.error }]}>
          {error}
        </TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.form.elementSpacing,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.form.labelSpacing,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  helpButton: {
    padding: spacing.xs,
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.form.elementSpacing,
    lineHeight: 20,
  },
  counter: {
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
  },
  counterText: {
    fontSize: 12,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionContainer: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: spacing.radius.sm,
    borderWidth: 2,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
  },
  textInputContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: spacing.radius.sm,
    padding: spacing.md,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  optionHelp: {
    fontSize: 12,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default MultipleChoiceWithText;
