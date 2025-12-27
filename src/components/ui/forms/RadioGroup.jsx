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
  const { colors, isDark } = useTheme();
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
                  borderColor: isSelected 
                    ? colors.primary 
                    : isDark 
                      ? colors.border 
                      : colors.border,
                  borderWidth: isSelected ? 2 : 1.5,
                  backgroundColor: isSelected 
                    ? (isDark ? colors.primary + '15' : colors.primary + '08') 
                    : isDark 
                      ? colors.surface 
                      : colors.white,
                  shadowColor: isDark ? 'transparent' : colors.shadow,
                  shadowOffset: isDark ? { width: 0, height: 0 } : { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0 : 0.04,
                  shadowRadius: isDark ? 0 : 2,
                  elevation: isDark ? 0 : 1,
                }
              ]}
              onPress={() => handleSelection(optionValue)}
              disabled={disabled}
              activeOpacity={0.8}
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
                
                <View style={styles.optionTextContainer}>
                  <TText style={[
                    styles.optionLabel,
                    { 
                      color: disabled ? colors.textTertiary : colors.text,
                      fontWeight: isSelected ? '600' : '400'
                    }
                  ]}>
                    {optionLabel}
                  </TText>
                  
                  {option.description && (
                    <TText style={[
                      styles.optionDescription,
                      { color: colors.textSecondary }
                    ]}>
                      {option.description}
                    </TText>
                  )}
                </View>
                
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
  optionsContainer: {
    gap: 12,
  },
  option: {
    borderRadius: 12,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 24,
    backgroundColor: 'transparent',
  },
  optionTextContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    marginRight: spacing.xs,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionLabel: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    marginTop: spacing.xs,
    lineHeight: 18,
    fontWeight: '400',
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
