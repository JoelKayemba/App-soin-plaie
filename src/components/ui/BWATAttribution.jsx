import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { TView, TText, TIcon } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const BWATAttribution = ({ 
  attribution,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);

  if (!attribution) return null;

  const handleInfoPress = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <TView 
        style={[
          styles.container, 
          { backgroundColor: colors.primary + '10', borderColor: colors.primary },
          style
        ]} 
        {...props}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <TIcon name="medical" size={20} color={colors.primary} />
          </View>
          
          <View style={styles.textContainer}>
            <TText style={[styles.title, { color: colors.primary }]}>
              {attribution.title || 'BWAT - Bates-Jensen Wound Assessment Tool'}
            </TText>
            {attribution.version && (
              <TText style={[styles.version, { color: colors.textSecondary }]}>
                {attribution.version}
              </TText>
            )}
          </View>
          
          <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
            <TIcon name="information-circle-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </TView>

      {/* Modal d'information */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TView style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <TText style={[styles.modalTitle, { color: colors.text }]}>
                Attribution BWAT
              </TText>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <TIcon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <TView style={[styles.attributionBox, { backgroundColor: colors.primary + '10' }]}>
                <TIcon name="medical" size={32} color={colors.primary} style={styles.modalIcon} />
                <TText style={[styles.attributionTitle, { color: colors.primary }]}>
                  Bates-Jensen Wound Assessment Tool
                </TText>
                <TText style={[styles.attributionText, { color: colors.text }]}>
                  {attribution.attribution}
                </TText>
              </TView>
              
              <TText style={[styles.modalDescription, { color: colors.textSecondary }]}>
                Cette échelle est utilisée avec permission et selon les termes de reproduction autorisés.
              </TText>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.okButton, { backgroundColor: colors.primary }]}
                onPress={closeModal}
              >
                <TText style={[styles.okButtonText, { color: colors.primaryText }]}>
                  Compris
                </TText>
              </TouchableOpacity>
            </View>
          </TView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  infoButton: {
    padding: spacing.xs,
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
  modalBody: {
    marginBottom: spacing.lg,
  },
  attributionBox: {
    padding: spacing.lg,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalIcon: {
    marginBottom: spacing.sm,
  },
  attributionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  attributionText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalFooter: {
    alignItems: 'center',
  },
  okButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.md,
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BWATAttribution;
