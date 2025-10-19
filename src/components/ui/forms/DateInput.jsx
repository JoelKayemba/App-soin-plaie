import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, Platform } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const DateInput = ({ 
  value,
  onValueChange,
  label,
  description,
  placeholder = "Sélectionner une date",
  required = false,
  minDate,
  maxDate,
  error,
  disabled = false,
  help,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const handleDatePress = () => {
    if (disabled) return;
    setIsPickerOpen(true);
  };

  const handleDateConfirm = () => {
    const dateString = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    onValueChange?.(dateString);
    setIsPickerOpen(false);
  };

  const handleDateCancel = () => {
    setIsPickerOpen(false);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    if (!date) return placeholder;
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('fr-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return placeholder;
    }
  };

  const getMinDate = () => {
    if (minDate === '1900-01-01') return new Date(1900, 0, 1);
    if (minDate === 'today') return new Date();
    return minDate ? new Date(minDate) : undefined;
  };

  const getMaxDate = () => {
    if (maxDate === 'today') return new Date();
    return maxDate ? new Date(maxDate) : undefined;
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
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: disabled ? colors.surfaceLight : colors.surface,
          }
        ]}
        onPress={handleDatePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <TIcon 
          name="calendar-outline" 
          size={20} 
          color={disabled ? colors.textTertiary : colors.primary}
        />
        
        <TText style={[
          styles.dateText,
          { 
            color: disabled ? colors.textTertiary : 
                   selectedDate ? colors.text : colors.textSecondary
          }
        ]}>
          {formatDate(selectedDate)}
        </TText>
        
        <TIcon 
          name="chevron-down" 
          size={16} 
          color={disabled ? colors.textTertiary : colors.textSecondary}
        />
      </TouchableOpacity>
      
      {error && (
        <TText style={[styles.error, { color: colors.error }]}>
          {error}
        </TText>
      )}

      {/* Date Picker Modal */}
      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={handleDateCancel}
      >
        <View style={styles.modalOverlay}>
          <TView style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <TText style={[styles.modalTitle, { color: colors.text }]}>
                Sélectionner une date
              </TText>
              <TouchableOpacity onPress={handleDateCancel} style={styles.closeButton}>
                <TIcon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <TText style={[styles.currentDate, { color: colors.text }]}>
                Date sélectionnée: {formatDate(selectedDate)}
              </TText>
              
              <ScrollView style={styles.dateOptions} showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[styles.dateOption, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => handleDateChange(new Date())}
                >
                  <TText style={[styles.dateOptionText, { color: colors.text }]}>
                    Aujourd'hui
                  </TText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    handleDateChange(yesterday);
                  }}
                >
                  <TText style={[styles.dateOptionText, { color: colors.text }]}>
                    Hier
                  </TText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => {
                    const lastWeek = new Date();
                    lastWeek.setDate(lastWeek.getDate() - 7);
                    handleDateChange(lastWeek);
                  }}
                >
                  <TText style={[styles.dateOptionText, { color: colors.text }]}>
                    Il y a une semaine
                  </TText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => {
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    handleDateChange(lastMonth);
                  }}
                >
                  <TText style={[styles.dateOptionText, { color: colors.text }]}>
                    Il y a un mois
                  </TText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, { backgroundColor: colors.surfaceLight }]}
                  onPress={() => {
                    const lastYear = new Date();
                    lastYear.setFullYear(lastYear.getFullYear() - 1);
                    handleDateChange(lastYear);
                  }}
                >
                  <TText style={[styles.dateOptionText, { color: colors.text }]}>
                    Il y a un an
                  </TText>
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: colors.surfaceLight }]}
                onPress={handleDateCancel}
              >
                <TText style={[styles.buttonText, { color: colors.text }]}>
                  Annuler
                </TText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleDateConfirm}
              >
                <TText style={[styles.buttonText, { color: colors.primaryText }]}>
                  Confirmer
                </TText>
              </TouchableOpacity>
            </View>
          </TView>
        </View>
      </Modal>
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    gap: spacing.sm,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    maxWidth: 400,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: spacing.xs,
  },
  datePickerContainer: {
    marginBottom: spacing.lg,
  },
  currentDate: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  dateOptions: {
    maxHeight: 200,
  },
  dateOption: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.sm,
  },
  dateOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DateInput;
