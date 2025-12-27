import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const SimpleCheckbox = ({ 
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

  const handleToggle = () => {
    if (disabled) return;
    onValueChange?.(!value);
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
    <View style={[styles.container, { backgroundColor: 'transparent' }, style]} {...props}>
      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          {
            opacity: disabled ? 0.5 : 1
          }
        ]}
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox,
          {
            borderColor: value ? colors.primary : colors.border,
            backgroundColor: value ? colors.primary : 'transparent',
          }
        ]}>
          {value && (
            <TIcon name="checkmark" size={16} color={colors.primaryText} />
          )}
        </View>
        
        <View style={styles.labelContainer}>
          <Text style={[
            styles.label,
            { 
              color: disabled ? colors.textTertiary : colors.text,
              fontWeight: value ? '600' : '400'
            }
          ]}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
          
          {description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>

        {help && (
          <TouchableOpacity onPress={showHelp} style={styles.helpButton}>
            <TIcon name="help-circle-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.form.elementSpacing,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    backgroundColor: 'transparent',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: spacing.radius.sm,
    borderWidth: 2,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2, // Alignement avec le texte
  },
  labelContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  helpButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default SimpleCheckbox;


