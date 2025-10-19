import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const RedirectAlert = ({ 
  visible, 
  onClose, 
  redirectReason,
  onContinueAnyway 
}) => {
  const { colors } = useTheme();

  if (!redirectReason) return null;

  const { reason, constat, ageInDays } = redirectReason;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TView style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* En-tête avec icône d'alerte */}
          <View style={styles.header}>
            <TView style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
              <TIcon name="warning" size={32} color={colors.warning} />
            </TView>
            <TText style={[styles.title, { color: colors.text }]}>
              Cette clientèle demande une expertise particulière, veuillez consulter une ressource spécialisée.
              
            </TText>
          </View>

          {/* Contenu principal */}
          <View style={styles.content}>
            {ageInDays && (
              <TView style={[styles.ageInfo, { backgroundColor: colors.primary + '10' }]}>
                <TIcon name="person" size={16} color={colors.primary} />
                <TText style={[styles.ageText, { color: colors.primary }]}>
                  Âge du patient: {ageInDays} jours
                </TText>
              </TView>
            )}

            
          </View>

          {/* Boutons d'action */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.continueButton, { backgroundColor: colors.surfaceLight }]}
              onPress={onContinueAnyway}
            >
              <TText style={[styles.buttonText, { color: colors.text }]}>
                Continuer 
              </TText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.understandButton, { backgroundColor: colors.warning }]}
              onPress={onClose}
            >
              <TText style={[styles.buttonText, { color: colors.buttonText }]}>
                Comprendre
              </TText>
            </TouchableOpacity>
          </View>
        </TView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    marginBottom: spacing.lg,
  },
  ageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  constatContainer: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  constatMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
  },
  continueButton: {
     
  },
  understandButton: {
    // Styles pour le bouton "Comprendre"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RedirectAlert;
