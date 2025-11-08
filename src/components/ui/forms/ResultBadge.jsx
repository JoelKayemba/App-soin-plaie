import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const ResultBadge = ({ 
  value,
  displayFormat,
  color,
  label,
  description,
  icon,
  required = false,
  error,
  help,
  style,
  ...props 
}) => {
  const { colors } = useTheme();

  // Formater la valeur selon le format d'affichage
  const formatValue = (val, format) => {
    if (!val && val !== 0) return 'N/A';
    
    if (format && format.includes('{value}')) {
      return format.replace('{value}', val.toString());
    }
    
    return val.toString();
  };

  // Déterminer la couleur à utiliser
  const badgeColor = color || colors.primary;

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
      
      <View style={[
        styles.badge,
        {
          backgroundColor: badgeColor + '15',
          borderColor: badgeColor,
        }
      ]}>
        {icon && (
          <TIcon 
            name={icon} 
            size={16} 
            color={badgeColor}
            style={styles.icon}
          />
        )}
        
        <TText style={[
          styles.value,
          { color: badgeColor }
        ]}>
          {formatValue(value, displayFormat)}
        </TText>
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default ResultBadge;

