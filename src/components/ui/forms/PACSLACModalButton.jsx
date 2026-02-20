/**
 * PACSLACModalButton - Bouton qui ouvre l'échelle PACSLAC dans une modale.
 * UX : clic sur le bouton → ouverture de la modale avec l'échelle complète.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';
import PACSLACScale, { getPACSLACScore } from './PACSLACScale';

const PACSLACModalButton = ({
  label = "Évaluer avec l'échelle PACSLAC",
  value = {},
  onValueChange,
  min_score = 0,
  max_score = 60,
  error,
  disabled = false,
  help,
  required = false,
  scaleType = 'pacslac_assessment',
  /** Quand true, affiche l'échelle directement (pleine largeur), sans bouton ni modale interne (ex. déjà dans PainDetailsModal) */
  embeddedInModal = false,
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingValue, setPendingValue] = useState(value || {});

  const openModal = useCallback(() => {
    if (disabled) return;
    setPendingValue(value || {});
    setModalVisible(true);
  }, [disabled, value]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleValidate = useCallback(() => {
    onValueChange?.(pendingValue);
    setModalVisible(false);
  }, [pendingValue, onValueChange]);

  const handleChangeInModal = useCallback((newValue) => {
    setPendingValue(newValue);
  }, []);

  const hasValue = value && typeof value === 'object' && Object.keys(value).length > 0;
  const displayScore = hasValue ? getPACSLACScore(value) : null;

  // Mode intégré : déjà dans une modale → afficher l'échelle en pleine largeur, pas de sous-modale
  if (embeddedInModal) {
    return (
      <TView style={styles.embeddedWrapper}>
        {(label || help) && (
          <TView style={styles.embeddedHeader}>
            {label && (
              <TText style={[styles.embeddedLabel, { color: colors.text }]}>
                {label}
                {required && <TText style={{ color: colors.error }}> *</TText>}
              </TText>
            )}
            {help && (
              <TText style={[styles.embeddedHelp, { color: colors.textSecondary }]} numberOfLines={2}>
                {help}
              </TText>
            )}
          </TView>
        )}
        <PACSLACScale
          label={null}
          value={value}
          onValueChange={onValueChange}
          min_score={min_score}
          max_score={max_score}
          scaleType={scaleType}
          embeddedInModal
        />
        {error && (
          <TText style={[styles.errorText, { color: colors.error }]}>
            {error}
          </TText>
        )}
      </TView>
    );
  }

  return (
    <TView style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            borderColor: colors.border,
            backgroundColor: isDark ? colors.surface : colors.surfaceLight,
          },
        ]}
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.triggerContent}>
          <TIcon
            name="clipboard-outline"
            size={24}
            color={colors.primary}
            style={styles.triggerIcon}
          />
          <View style={styles.triggerText}>
            <TText style={[styles.triggerLabel, { color: colors.text }]}>
              {label}
              {required && <TText style={{ color: colors.error }}> *</TText>}
            </TText>
            {help && (
              <TText style={[styles.triggerHelp, { color: colors.textSecondary }]} numberOfLines={1}>
                {help}
              </TText>
            )}
            {hasValue && displayScore !== null && (
              <TText style={[styles.triggerScore, { color: colors.primary }]}>
                Score enregistré : {displayScore} / {max_score} — Appuyez pour modifier
              </TText>
            )}
          </View>
          <TIcon name="chevron-forward" size={22} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={[styles.modalRoot, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={closeModal} style={styles.modalHeaderButton}>
              <TText style={[styles.modalHeaderButtonText, { color: colors.primary }]}>
                Annuler
              </TText>
            </TouchableOpacity>
            <TText style={[styles.modalTitle, { color: colors.text }]} numberOfLines={1}>
              {label}
            </TText>
            <TouchableOpacity onPress={handleValidate} style={styles.modalHeaderButton}>
              <TText style={[styles.modalHeaderButtonText, { color: colors.primary }]}>
                Valider
              </TText>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <PACSLACScale
              label={null}
              value={pendingValue}
              onValueChange={handleChangeInModal}
              min_score={min_score}
              max_score={max_score}
              scaleType={scaleType}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {error && (
        <TText style={[styles.errorText, { color: colors.error }]}>
          {error}
        </TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  embeddedWrapper: {
    width: '100%',
    alignSelf: 'stretch',
    marginBottom: spacing.lg,
  },
  embeddedHeader: {
    marginBottom: spacing.md,
  },
  embeddedLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  embeddedHelp: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerIcon: {
    marginRight: spacing.sm,
  },
  triggerText: {
    flex: 1,
  },
  triggerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  triggerHelp: {
    fontSize: 13,
    marginTop: 2,
  },
  triggerScore: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  modalRoot: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  modalHeaderButton: {
    minWidth: 80,
  },
  modalTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalHeaderButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default PACSLACModalButton;
