/**
 * BWATScoreModal - Affiche le score total BWAT et le statut (continuum du statut de la plaie)
 * Affiché à la fin des tables BWAT (après C1T26). Au clic sur "Continuer", on enregistre et on poursuit l'évaluation.
 */

import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const BWATScoreModal = ({
  visible,
  totalScore,
  statusLabel,
  onContinue,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onContinue}
    >
      <TView style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { backgroundColor: colors.surfaceLight }]}>
          <TText style={[styles.title, { color: colors.text }]}>
            Continuum du statut de la plaie
          </TText>
          <TText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Score BWAT total (somme des scores des tables BWAT)
          </TText>

          <View style={[styles.scoreBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TText style={[styles.scoreLabel, { color: colors.textSecondary }]}>
              Score total
            </TText>
            <TText style={[styles.scoreValue, { color: colors.primary }]}>
              {totalScore != null ? totalScore : '—'}
            </TText>
          </View>

          <View style={[styles.statusBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TText style={[styles.statusLabel, { color: colors.textSecondary }]}>
              Statut
            </TText>
            <TText style={[styles.statusValue, { color: colors.text }]}>
              {statusLabel || '—'}
            </TText>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <TText style={styles.buttonText}>Continuer l'évaluation</TText>
          </TouchableOpacity>
        </View>
      </TView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  scoreBlock: {
    width: '100%',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statusBlock: {
    width: '100%',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BWATScoreModal;
