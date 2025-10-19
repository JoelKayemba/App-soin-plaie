import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const CalculatedField = ({ 
  value,
  label,
  description,
  unit,
  icon,
  style,
  ...props 
}) => {
  const { colors } = useTheme();

  const formatValue = (val) => {
    if (val === null || val === undefined) return 'Non calculé';
    if (typeof val === 'number') {
      return unit ? `${val} ${unit}` : val.toString();
    }
    return val.toString();
  };

  return (
    <TView style={[styles.container, style]} {...props}>
      {label && (
        <TText style={[styles.label, { color: colors.text }]}>
          {label}
        </TText>
      )}
      
      {description && (
        <TText style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </TText>
      )}
      
      <TView style={[styles.valueContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.valueContent}>
          {icon && (
            <TIcon name={icon} size={20} color={colors.primary} style={styles.icon} />
          )}
          
          <TText style={[styles.value, { color: colors.text }]}>
            {formatValue(value)}
          </TText>
        </View>
        
        <TView style={[styles.calculatedBadge, { backgroundColor: colors.primary + '20' }]}>
          <TIcon name="calculator-outline" size={16} color={colors.primary} />
          <TText style={[styles.calculatedText, { color: colors.primary }]}>
            Calculé
          </TText>
        </TView>
      </TView>
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
  valueContainer: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  valueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  calculatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.sm,
    gap: spacing.xs,
  },
  calculatedText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CalculatedField;


