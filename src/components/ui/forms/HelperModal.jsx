import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const { height: screenHeight } = Dimensions.get('window');

const HelperModal = ({ visible, onClose, helperData, title }) => {
  const { colors } = useTheme();

  if (!visible || !helperData) return null;

  const renderContentItem = (key, value) => {
    if (typeof value === 'string') {
      return (
        <View key={key} style={styles.contentItem}>
          <TText style={[styles.contentKey, { color: colors.textSecondary }]}>
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
          </TText>
          <TText style={[styles.contentValue, { color: colors.text }]}>
            {value}
          </TText>
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TText style={[styles.title, { color: colors.text }]}>
              {title || helperData.title}
            </TText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <TIcon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {helperData.content && Object.entries(helperData.content).map(([key, value]) =>
                renderContentItem(key, value)
              )}
            </View>
          </ScrollView>
        </TView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: screenHeight * 0.8,
    borderRadius: spacing.radius.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  contentItem: {
    marginBottom: spacing.md,
  },
  contentKey: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  contentValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HelperModal;
