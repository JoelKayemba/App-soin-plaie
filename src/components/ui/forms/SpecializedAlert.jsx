import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const SpecializedAlert = ({ 
  visible, 
  onClose, 
  condition,
  onContinueAnyway 
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  const getConditionInfo = () => {
    switch (condition) {
      case 'lymphedema':
        return {
          title: 'Lymphœdème',
          message: 'Cette situation demande une expertise particulière, veuillez consulter une ressource spécialisée.'
        };
      case 'diabetic_foot':
        return {
          title: 'Pied diabétique',
          message: 'Cette situation demande une expertise particulière, veuillez consulter une ressource spécialisée.'
        }
      case 'neoplasia':
        return {
          title: 'Néoplasie / Tumeur maligne',
          message: 'Cette situation demande une expertise particulière, veuillez consulter une ressource spécialisée.'
        };
      default:
        return {
          title: 'Situation spécialisée',
          message: 'Cette situation demande une expertise particulière, veuillez consulter une ressource spécialisée.'
        };
    }
  };

  const { title, message } = getConditionInfo();

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
              <TIcon name="medical" size={32} color={colors.warning} />
            </TView>
            <TText style={[styles.conditionTitle, { color: colors.text }]}>
              {title}
            </TText>
          </View>

          {/* Contenu principal */}
          <View style={styles.content}>
            <TText style={[styles.message, { color: colors.text }]}>
              {message}
            </TText>
          </View>

          {/* Boutons d'action */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.continueButton, { backgroundColor: colors.surfaceLight }]}
              onPress={onContinueAnyway}
            >
              <TText style={[styles.buttonText, { color: colors.text }]}>
                Continuer quand même
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
  conditionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
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
    // Styles pour le bouton "Continuer quand même"
  },
  understandButton: {
    // Styles pour le bouton "Comprendre"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SpecializedAlert;
