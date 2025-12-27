import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const CheckboxGroup = ({ 
  options = [],
  value = [],
  onValueChange,
  label,
  description,
  required = false,
  minSelections = 0,
  maxSelections = null,
  error,
  disabled = false,
  help,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [selectedValues, setSelectedValues] = useState(Array.isArray(value) ? value : []);

  const handleSelection = (optionValue) => {
    if (disabled) return;
    
    let newSelection;
    const isSelected = selectedValues.includes(optionValue);
    
    if (isSelected) {
      // Désélectionner
      newSelection = selectedValues.filter(v => v !== optionValue);
    } else {
      // Sélectionner (vérifier les limites)
      if (maxSelections && selectedValues.length >= maxSelections) {
        Alert.alert(
          'Limite atteinte',
          `Vous ne pouvez sélectionner que ${maxSelections} option(s) maximum.`
        );
        return;
      }
      newSelection = [...selectedValues, optionValue];
    }
    
    setSelectedValues(newSelection);
    onValueChange?.(newSelection);
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

  const getSelectionInfo = () => {
    if (minSelections > 0 || maxSelections) {
      const current = selectedValues.length;
      const min = minSelections;
      const max = maxSelections;
      
      if (min > 0 && max) {
        return `${current}/${max} sélectionné(s) (minimum: ${min})`;
      } else if (min > 0) {
        return `${current} sélectionné(s) (minimum: ${min})`;
      } else if (max) {
        return `${current}/${max} sélectionné(s)`;
      }
    }
    return null;
  };

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
      
      {getSelectionInfo() && (
        <TText style={[styles.selectionInfo, { color: colors.textSecondary }]}>
          {getSelectionInfo()}
        </TText>
      )}
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const optionValue = option.value || option.id;
          const isSelected = selectedValues.includes(optionValue);
          const optionLabel = option.label || option.value;
          
          return (
            <TouchableOpacity
              key={option.id || index}
              style={[
                styles.option,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.primary + '10' : colors.surface,
                }
              ]}
              onPress={() => handleSelection(optionValue)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  }
                ]}>
                  {isSelected && (
                    <TIcon 
                      name="checkmark" 
                      size={14} 
                      color={colors.primaryText}
                    />
                  )}
                </View>
                
                <TText style={[
                  styles.optionLabel,
                  { 
                    color: disabled ? colors.textTertiary : colors.text,
                    fontWeight: isSelected ? '600' : '400'
                  }
                ]}>
                  {optionLabel}
                </TText>
                
                {option.icon && (
                  <TIcon 
                    name={option.icon} 
                    size={20} 
                    color={isSelected ? colors.primary : colors.textSecondary}
                    style={styles.optionIcon}
                  />
                )}
              </View>
              
              {/* Affichage du texte important si l'option est sélectionnée */}
              {isSelected && option.important && option.important_text && (
                <View style={styles.importantTextContainer}>
                  <TText style={[styles.importantText, { color: colors.warning }]}>
                    {option.important_text}
                  </TText>
                </View>
              )}
            </TouchableOpacity>
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
    backgroundColor: 'transparent',
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
  selectionInfo: {
    fontSize: 12,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  optionsContainer: {
    backgroundColor: 'transparent',
    gap: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
  },
  optionContent: {
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
  optionIcon: {
    marginLeft: spacing.sm,
  },
  importantTextContainer: {
    marginTop: spacing.xs,
    paddingLeft: spacing.lg,
  },
  importantText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default CheckboxGroup;
