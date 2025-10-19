import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const BooleanInput = ({ 
  value,
  onValueChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  help,
  style,
  ...props 
}) => {
  const { colors } = useTheme();

  const handleSelection = (selectedValue) => {
    if (disabled) return;
    onValueChange?.(selectedValue);
  };

  return (
    <TView style={[styles.container, style]} {...props}>
      {label && (
        <TText style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <TText style={{ color: colors.error }}> *</TText>}
        </TText>
      )}
      
      {description && (
        <TText style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </TText>
      )}
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            {
              borderColor: value === true ? colors.success : colors.border,
              backgroundColor: value === true ? colors.success + '10' : colors.surface,
            }
          ]}
          onPress={() => handleSelection(true)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            {
              borderColor: value === true ? colors.success : colors.border,
              backgroundColor: value === true ? colors.success : 'transparent',
            }
          ]}>
            {value === true && (
              <TIcon name="checkmark" size={14} color={colors.primaryText} />
            )}
          </View>
          
          <TText style={[
            styles.optionLabel,
            { 
              color: disabled ? colors.textTertiary : colors.text,
              fontWeight: value === true ? '600' : '400'
            }
          ]}>
            Oui
          </TText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            {
              borderColor: value === false ? colors.error : colors.border,
              backgroundColor: value === false ? colors.error + '10' : colors.surface,
            }
          ]}
          onPress={() => handleSelection(false)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            {
              borderColor: value === false ? colors.error : colors.border,
              backgroundColor: value === false ? colors.error : 'transparent',
            }
          ]}>
            {value === false && (
              <TIcon name="close" size={14} color={colors.primaryText} />
            )}
          </View>
          
          <TText style={[
            styles.optionLabel,
            { 
              color: disabled ? colors.textTertiary : colors.text,
              fontWeight: value === false ? '600' : '400'
            }
          ]}>
            Non
          </TText>
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.form.labelSpacing,
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.form.elementSpacing,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
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
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default BooleanInput;


