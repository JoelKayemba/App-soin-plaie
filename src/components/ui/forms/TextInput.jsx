import React, { useState } from 'react';
import { View, StyleSheet, TextInput as RNTextInput, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const TextInput = ({ 
  value,
  onValueChange,
  label,
  description,
  placeholder,
  required = false,
  multiline = false,
  minLength,
  maxLength,
  error,
  disabled = false,
  help,
  style,
  ...props 
}) => {
  const { colors, isDark } = useTheme();
  const [inputValue, setInputValue] = useState(value || '');

  const handleTextChange = (text) => {
    setInputValue(text);
    onValueChange?.(text);
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
    if (required && !inputValue.trim()) {
      return 'Ce champ est requis';
    }
    
    if (minLength && inputValue.length < minLength) {
      return `Minimum ${minLength} caractères requis`;
    }
    
    if (maxLength && inputValue.length > maxLength) {
      return `Maximum ${maxLength} caractères autorisés`;
    }
    
    return null;
  };

  const validationError = getValidationError();
  const characterCount = maxLength ? `${inputValue.length}/${maxLength}` : null;

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
      
      <View style={[
        styles.inputWrapper,
        {
          borderColor: (error || validationError) ? colors.error : colors.border,
          backgroundColor: disabled 
            ? colors.surfaceLight 
            : isDark 
              ? colors.surface 
              : colors.white, // Amélioration pour le mode clair
          minHeight: multiline ? 80 : spacing.height.input,
        }
      ]}>
        <RNTextInput
          style={[
            styles.input,
            {
              color: disabled ? colors.textTertiary : colors.text,
              textAlignVertical: multiline ? 'top' : 'center',
            }
          ]}
          value={inputValue}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline={multiline}
          editable={!disabled}
          maxLength={maxLength}
          {...props}
        />
      </View>
      
      <View style={styles.footer}>
        {characterCount && (
          <TText style={[styles.characterCount, { color: colors.textSecondary }]}>
            {characterCount}
          </TText>
        )}
        
        {(error || validationError) && (
          <TText style={[styles.error, { color: colors.error }]}>
            {error || validationError}
          </TText>
        )}
      </View>
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
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    fontSize: 16,
    minHeight: 22,
    lineHeight: 22,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  characterCount: {
    fontSize: 12,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});

export default TextInput;
