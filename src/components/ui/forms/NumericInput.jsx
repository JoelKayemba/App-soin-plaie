import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const NumericInput = ({ 
  value,
  onValueChange,
  label,
  description,
  placeholder,
  unit,
  unit_options,
  required = false,
  min,
  max,
  step = 1,
  precision = 0,
  error,
  disabled = false,
  help,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState(value?.toString() || '');
  const [selectedUnit, setSelectedUnit] = useState(unit || (unit_options?.[0]?.unit));

  // Récupérer les min/max selon l'unité sélectionnée
  const getCurrentUnitConfig = () => {
    if (unit_options && unit_options.length > 0) {
      return unit_options.find(option => option.unit === selectedUnit) || unit_options[0];
    }
    return { unit: selectedUnit, min, max, step };
  };

  const currentUnitConfig = getCurrentUnitConfig();
  const currentMin = currentUnitConfig.min ?? min;
  const currentMax = currentUnitConfig.max ?? max;
  const currentStep = currentUnitConfig.step ?? step;

  const handleUnitChange = (newUnit) => {
    setSelectedUnit(newUnit);
    // Optionnel: convertir la valeur actuelle selon la nouvelle unité
    // Pour l'instant, on garde la valeur comme elle est
  };

  const handleTextChange = (text) => {
    // Permettre seulement les chiffres, points et virgules
    const cleanText = text.replace(/[^0-9.,]/g, '');
    setInputValue(cleanText);
    
    // Convertir en nombre si possible
    const numericValue = parseFloat(cleanText.replace(',', '.'));
    if (!isNaN(numericValue)) {
      onValueChange?.(numericValue);
    } else if (cleanText === '') {
      onValueChange?.(null);
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    
    const currentValue = parseFloat(inputValue) || 0;
    const newValue = currentValue + currentStep;
    
    if (currentMax !== undefined && newValue > currentMax) {
      Alert.alert('Valeur maximale', `La valeur ne peut pas dépasser ${currentMax}`);
      return;
    }
    
    const formattedValue = precision > 0 ? newValue.toFixed(precision) : newValue.toString();
    setInputValue(formattedValue);
    onValueChange?.(newValue);
  };

  const handleDecrement = () => {
    if (disabled) return;
    
    const currentValue = parseFloat(inputValue) || 0;
    const newValue = currentValue - currentStep;
    
    if (currentMin !== undefined && newValue < currentMin) {
      Alert.alert('Valeur minimale', `La valeur ne peut pas être inférieure à ${currentMin}`);
      return;
    }
    
    const formattedValue = precision > 0 ? newValue.toFixed(precision) : newValue.toString();
    setInputValue(formattedValue);
    onValueChange?.(newValue);
  };

  const showHelp = () => {
    if (help) {
      Alert.alert(
        label || 'Aide',
        help,
        [{ text: 'OK' }]
      );
    }
  };

  const getValidationError = () => {
    if (!inputValue) return null;
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return 'Valeur numérique invalide';
    if (currentMin !== undefined && numValue < currentMin) return `Valeur minimale: ${currentMin}`;
    if (currentMax !== undefined && numValue > currentMax) return `Valeur maximale: ${currentMax}`;
    
    return null;
  };

  const validationError = getValidationError();

  return (
    <TView style={[styles.container, { backgroundColor: 'transparent' }, style]} {...props}>
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
      
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          ]}
          onPress={handleDecrement}
          disabled={disabled}
        >
          <TIcon name="remove" size={20} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[
          styles.inputWrapper,
          {
            borderColor: validationError ? colors.error : colors.border,
            backgroundColor: disabled ? colors.surfaceLight : colors.surface,
          }
        ]}>
          <TextInput
            style={[
              styles.input,
              {
                color: disabled ? colors.textTertiary : colors.text,
              }
            ]}
            value={inputValue}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            editable={!disabled}
            {...props}
          />
          {/* Affichage de l'unité ou sélecteur d'unités */}
          {unit_options && unit_options.length > 1 ? (
            <View style={styles.unitSelector}>
              {unit_options.map((unitOption, index) => (
                <TouchableOpacity
                  key={unitOption.unit}
                  style={[
                    styles.unitOption,
                    {
                      backgroundColor: selectedUnit === unitOption.unit ? colors.primary : 'transparent',
                      borderColor: selectedUnit === unitOption.unit ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleUnitChange(unitOption.unit)}
                  disabled={disabled}
                >
                  <TText style={[
                    styles.unitOptionText,
                    {
                      color: selectedUnit === unitOption.unit ? colors.primaryText : colors.textSecondary
                    }
                  ]}>
                    {unitOption.label}
                  </TText>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            (selectedUnit || unit) && (
              <TText style={[styles.unit, { color: colors.textSecondary }]}>
                {selectedUnit || unit}
              </TText>
            )
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          ]}
          onPress={handleIncrement}
          disabled={disabled}
        >
          <TIcon name="add" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {(error || validationError) && (
        <TText style={[styles.error, { color: colors.error }]}>
          {error || validationError}
        </TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: spacing.form.elementSpacing,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.form.labelSpacing,
    backgroundColor: 'transparent',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.md,
    height: spacing.height.input,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  unit: {
    fontSize: 14,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  unitSelector: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  unitOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
  },
  unitOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default NumericInput;
