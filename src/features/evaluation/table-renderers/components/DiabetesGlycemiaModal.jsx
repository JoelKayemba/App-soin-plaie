/**
 * DiabetesGlycemiaModal - Modal pour saisir les valeurs de glycémie
 * 
 * S'affiche automatiquement quand le diabète de type 1 ou 2 est sélectionné
 */

import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, ScrollView, Alert, Text } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { NumericInput } from '@/components/ui/forms';
import spacing from '@/styles/spacing';

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalBody: {
    marginBottom: spacing.lg,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
    backgroundColor: 'transparent',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  fieldDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: spacing.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  numericInput: {
    flex: 1,
    marginRight: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
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
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  helpIcon: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
};

const DiabetesGlycemiaModal = ({ 
  visible, 
  onClose, 
  data, 
  handleDataChange,
  colors 
}) => {
  const [localData, setLocalData] = useState({
    hba1c_value: data?.['C1T03_DIAB_HBA1C_VALUE'] || null,
    hba1c_unknown: data?.['C1T03_DIAB_HBA1C_UNKNOWN'] || false,
    fasting_value: data?.['C1T03_DIAB_FASTING_VALUE'] || null,
    fasting_unknown: data?.['C1T03_DIAB_FASTING_UNKNOWN'] || false,
    postprandial_value: data?.['C1T03_DIAB_POSTPRANDIAL_VALUE'] || null,
    postprandial_unknown: data?.['C1T03_DIAB_POSTPRANDIAL_UNKNOWN'] || false,
  });

  const handleSave = () => {
    // Sauvegarder toutes les valeurs
    if (handleDataChange) {
      handleDataChange('C1T03_DIAB_HBA1C_VALUE', localData.hba1c_value);
      handleDataChange('C1T03_DIAB_HBA1C_UNKNOWN', localData.hba1c_unknown);
      handleDataChange('C1T03_DIAB_FASTING_VALUE', localData.fasting_value);
      handleDataChange('C1T03_DIAB_FASTING_UNKNOWN', localData.fasting_unknown);
      handleDataChange('C1T03_DIAB_POSTPRANDIAL_VALUE', localData.postprandial_value);
      handleDataChange('C1T03_DIAB_POSTPRANDIAL_UNKNOWN', localData.postprandial_unknown);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TView style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TText style={[styles.modalTitle, { color: colors.text }]}>
              Évaluation de la glycémie
            </TText>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
            >
              <TIcon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={[styles.modalBody, { backgroundColor: 'transparent' }]} 
            contentContainerStyle={{ backgroundColor: 'transparent' }}
            showsVerticalScrollIndicator={false}
          >
            {/* HbA1C */}
            <View style={styles.fieldContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TText style={[styles.fieldLabel, { color: colors.text }]}>
                  HbA1C*
                </TText>
                
              </View>
              <TText style={[styles.fieldDescription, { color: colors.textSecondary }]}>
                Hémoglobine glyquée
              </TText>
              <View style={styles.fieldRow}>
                <View style={styles.numericInput}>
                  <NumericInput
                    value={localData.hba1c_value}
                    onValueChange={(value) => setLocalData({ ...localData, hba1c_value: value })}
                    placeholder="0.0"
                    unit="%"
                    min={0}
                    max={20}
                    step={0.1}
                    disabled={localData.hba1c_unknown}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  const newValue = !localData.hba1c_unknown;
                  setLocalData({
                    ...localData,
                    hba1c_unknown: newValue,
                    hba1c_value: newValue ? null : localData.hba1c_value
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: localData.hba1c_unknown ? colors.primary : colors.border,
                    backgroundColor: localData.hba1c_unknown ? colors.primary : 'transparent',
                  }
                ]}>
                  {localData.hba1c_unknown && (
                    <TIcon name="checkmark" size={16} color={colors.primaryText || '#fff'} />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                  Inconnue
                </Text>
              </TouchableOpacity>
            </View>

            {/* Glycémie à jeun */}
            <View style={styles.fieldContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TText style={[styles.fieldLabel, { color: colors.text }]}>
                  Glycémie à jeun
                </TText>
                
              </View>
              <TText style={[styles.fieldDescription, { color: colors.textSecondary }]}>
                Au lever ou 4h postrepas
              </TText>
              <View style={styles.fieldRow}>
                <View style={styles.numericInput}>
                  <NumericInput
                    value={localData.fasting_value}
                    onValueChange={(value) => setLocalData({ ...localData, fasting_value: value })}
                    placeholder="0.0"
                    unit="mmol/L"
                    min={0}
                    max={30}
                    step={0.1}
                    disabled={localData.fasting_unknown}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  const newValue = !localData.fasting_unknown;
                  setLocalData({
                    ...localData,
                    fasting_unknown: newValue,
                    fasting_value: newValue ? null : localData.fasting_value
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: localData.fasting_unknown ? colors.primary : colors.border,
                    backgroundColor: localData.fasting_unknown ? colors.primary : 'transparent',
                  }
                ]}>
                  {localData.fasting_unknown && (
                    <TIcon name="checkmark" size={16} color={colors.primaryText || '#fff'} />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                  Inconnue
                </Text>
              </TouchableOpacity>
            </View>

            {/* Glycémie 2h postprandiale */}
            <View style={styles.fieldContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TText style={[styles.fieldLabel, { color: colors.text }]}>
                  Glycémie 2h postprandiale
                </TText>
                
              </View>
              <TText style={[styles.fieldDescription, { color: colors.textSecondary }]}>
                Entrez un chiffre
              </TText>
              <View style={styles.fieldRow}>
                <View style={styles.numericInput}>
                  <NumericInput
                    value={localData.postprandial_value}
                    onValueChange={(value) => setLocalData({ ...localData, postprandial_value: value })}
                    placeholder="0.0"
                    unit="mmol/L"
                    min={0}
                    max={30}
                    step={0.1}
                    disabled={localData.postprandial_unknown}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => {
                  const newValue = !localData.postprandial_unknown;
                  setLocalData({
                    ...localData,
                    postprandial_unknown: newValue,
                    postprandial_value: newValue ? null : localData.postprandial_value
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  {
                    borderColor: localData.postprandial_unknown ? colors.primary : colors.border,
                    backgroundColor: localData.postprandial_unknown ? colors.primary : 'transparent',
                  }
                ]}>
                  {localData.postprandial_unknown && (
                    <TIcon name="checkmark" size={16} color={colors.primaryText || '#fff'} />
                  )}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                  Inconnue
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <TText style={[styles.saveButtonText, { color: colors.primaryText || '#fff' }]}>
                Enregistrer
              </TText>
            </TouchableOpacity>
          </View>
        </TView>
      </View>
    </Modal>
  );
};

export default DiabetesGlycemiaModal;

