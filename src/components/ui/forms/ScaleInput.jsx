import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const ScaleInput = ({ 
  value,
  onValueChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  help,
  scale,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueSelect = (scaleValue) => {
    if (disabled) return;
    
    setSelectedValue(scaleValue);
    onValueChange?.(scaleValue);
  };

  const showHelp = () => {
    if (help) {
      // TODO: Implémenter l'aide
    }
  };

  const renderScaleItem = (item) => {
    const isSelected = selectedValue === item.value;
    
    return (
      <TouchableOpacity
        key={item.value}
        style={[
          styles.scaleItem,
          {
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isSelected ? colors.primary + '10' : colors.surface,
          }
        ]}
        onPress={() => handleValueSelect(item.value)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.scaleItemHeader}>
          <TText style={[
            styles.scaleValue,
            { 
              color: isSelected ? colors.primary : colors.text,
              fontWeight: isSelected ? 'bold' : 'normal'
            }
          ]}>
            {item.value}
          </TText>
          
          {isSelected && (
            <TIcon name="checkmark-circle" size={20} color={colors.primary} />
          )}
        </View>
        
        <TText style={[
          styles.scaleLabel,
          { color: isSelected ? colors.text : colors.textSecondary }
        ]}>
          {item.label}
        </TText>
        
        {item.description && (
          <TText style={[
            styles.scaleDescription,
            { color: colors.textSecondary }
          ]}>
            {item.description}
          </TText>
        )}
        
        {item.help && (
          <TouchableOpacity onPress={() => showHelp()} style={styles.helpButton}>
            <TIcon name="information-circle-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
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

      {/* Échelle */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scaleContainer}
        contentContainerStyle={styles.scaleContent}
      >
        {scale?.map(renderScaleItem)}
      </ScrollView>

      {/* Valeur sélectionnée */}
      {selectedValue && (
        <TView style={[styles.selectedValue, { backgroundColor: colors.primary + '20' }]}>
          <TIcon name="checkmark-circle" size={16} color={colors.primary} />
          <TText style={[styles.selectedText, { color: colors.primary }]}>
            Sélectionné: {selectedValue}
          </TText>
        </TView>
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
  scaleContainer: {
    marginBottom: spacing.md,
  },
  scaleContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  scaleItem: {
    minWidth: 120,
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  scaleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  scaleValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scaleLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  scaleDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedValue: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
    gap: spacing.sm,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default ScaleInput;


