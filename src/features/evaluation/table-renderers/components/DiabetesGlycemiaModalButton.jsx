/**
 * DiabetesGlycemiaModalButton - Bouton qui ouvre le modal de glycémie
 */

import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import DiabetesGlycemiaModal from './DiabetesGlycemiaModal';
import spacing from '@/styles/spacing';

const styles = {
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  iconContainer: {
    marginLeft: spacing.sm,
  },
};

const DiabetesGlycemiaModalButton = ({ element, data, handleDataChange, colors }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors: themeColors } = useTheme();

  // Vérifier si des valeurs sont déjà saisies
  const hasValues = 
    data?.['C1T03_DIAB_HBA1C_VALUE'] || 
    data?.['C1T03_DIAB_HBA1C_UNKNOWN'] ||
    data?.['C1T03_DIAB_FASTING_VALUE'] ||
    data?.['C1T03_DIAB_FASTING_UNKNOWN'] ||
    data?.['C1T03_DIAB_POSTPRANDIAL_VALUE'] ||
    data?.['C1T03_DIAB_POSTPRANDIAL_UNKNOWN'];

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: hasValues ? colors.primary + '15' : colors.surfaceLight,
            borderWidth: 1,
            borderColor: hasValues ? colors.primary : colors.border,
          }
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <TText style={[styles.buttonText, { color: colors.text }]}>
          {element.ui?.button_label || element.label}
        </TText>
        <TView style={styles.iconContainer}>
          <TIcon 
            name={hasValues ? "check-circle" : "chevron-forward"} 
            size={20} 
            color={hasValues ? colors.primary : colors.textSecondary} 
          />
        </TView>
      </TouchableOpacity>

      <DiabetesGlycemiaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={data}
        handleDataChange={handleDataChange}
        colors={themeColors}
      />
    </>
  );
};

export default DiabetesGlycemiaModalButton;

