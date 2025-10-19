import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const RadioGroup = ({ 
  options = [],
  value,
  onValueChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  help,
  tooltip,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [selectedValue, setSelectedValue] = useState(value || null);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    setSelectedValue(value || null);
  }, [value]);

  const handleSelection = (optionValue) => {
    if (disabled) return;
    
    setSelectedValue(optionValue);
    onValueChange?.(optionValue);
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
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value || selectedValue === option.id;
          const optionLabel = option.label || option.value;
          const optionValue = option.value || option.id;
          
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
                  styles.radioButton,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  }
                ]}>
                  {isSelected && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primaryText }]} />
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

                {option.onHelpPress && (
                  <TouchableOpacity 
                    onPress={option.onHelpPress}
                    style={styles.helpButton}
                  >
                    <TIcon name="information-circle-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              
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
  optionsContainer: {
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
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
  },
  optionIcon: {
    marginLeft: spacing.sm,
  },
  helpButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default RadioGroup;
