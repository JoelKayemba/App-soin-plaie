import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput as RNTextInput, Alert, Keyboard } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const CheckboxWithText = ({ 
  value = { checked: false, text: '' },
  onValueChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  help,
  placeholder = "Précisez...",
  textFieldLabel = "Détails",
  maxLength = 200,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = { ...internalValue, checked: !internalValue.checked };
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const handleTextChange = (text) => {
    const newValue = { ...internalValue, text };
    setInternalValue(newValue);
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

  return (
    <TView style={[styles.container, style]} {...props}>
      {/* Checkbox principale */}
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
            borderColor: internalValue.checked ? colors.primary : colors.border,
            backgroundColor: internalValue.checked ? colors.primary : 'transparent',
          }
        ]}>
          {internalValue.checked && (
            <TIcon name="checkmark" size={16} color={colors.primaryText} />
          )}
        </View>
        
        <View style={styles.labelContainer}>
          <TText style={[
            styles.label,
            { 
              color: disabled ? colors.textTertiary : colors.text,
              fontWeight: internalValue.checked ? '600' : '400'
            }
          ]}>
            {label}
            {required && <TText style={{ color: colors.error }}> *</TText>}
          </TText>
          
          {description && (
            <TText style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </TText>
          )}
        </View>

        {help && (
          <TouchableOpacity onPress={showHelp} style={styles.helpButton}>
            <TIcon name="help-circle-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Champ de texte conditionnel */}
      {internalValue.checked && (
        <View style={styles.textFieldContainer}>
          <TText style={[styles.textFieldLabel, { color: colors.text }]}>
            {textFieldLabel}
          </TText>
          
          <View style={[
            styles.textInputContainer,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }
          ]}>
            <RNTextInput
              style={[
                styles.textInput,
                { 
                  color: colors.text,
                }
              ]}
              value={internalValue.text}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              editable={!disabled}
              multiline={true}
              numberOfLines={3}
              maxLength={maxLength}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          
          {maxLength && (
            <TText style={[styles.characterCount, { color: colors.textSecondary }]}>
              {internalValue.text.length}/{maxLength}
            </TText>
          )}
        </View>
      )}
      
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: spacing.radius.sm,
    borderWidth: 2,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  labelContainer: {
    flex: 1,
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
  textFieldContainer: {
    marginTop: spacing.md,
    marginLeft: 32, // Alignement avec le texte de la checkbox
  },
  textFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    minHeight: 80,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 50,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default CheckboxWithText;
