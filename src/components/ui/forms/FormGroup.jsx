import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const FormGroup = ({ 
  children, 
  title, 
  description, 
  required = false,
  error,
  style,
  ...props 
}) => {
  const { colors } = useTheme();

  return (
    <TView style={[styles.container, style]} {...props}>
      {title && (
        <TText style={[styles.title, { color: colors.text }]}>
          {title}
          {required && <TText style={{ color: colors.error }}> *</TText>}
        </TText>
      )}
      
      {description && (
        <TText style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </TText>
      )}
      
      <View style={styles.content}>
        {children}
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
    marginBottom: spacing.form.sectionSpacing,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.form.labelSpacing,
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.form.elementSpacing,
    lineHeight: 20,
  },
  content: {
    gap: spacing.form.groupSpacing,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default FormGroup;
