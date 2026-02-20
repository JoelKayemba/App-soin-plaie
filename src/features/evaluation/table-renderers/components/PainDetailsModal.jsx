/**
 * PainDetailsModal - Modal regroupant tous les détails de la douleur (table 12).
 * Type, intensité 1-10, échelle visuelle, PACSLAC, contrôle.
 * Ouvrable au clic sur "Remplir les détails" quand Douleur est coché.
 */

import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { renderSubquestion } from '../core/SubquestionRenderer';
import spacing from '@/styles/spacing';

const PainDetailsModal = ({
  visible,
  onClose,
  subquestions = [],
  data,
  handleDataChange,
  errors,
  colors: colorsProp,
}) => {
  const { colors: themeColors } = useTheme();
  const colors = colorsProp || themeColors;

  const subquestionProps = {
    data,
    errors,
    handleDataChange,
    colors,
    embeddedInModal: true,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <TText style={[styles.headerButtonText, { color: colors.primary }]}>
              Annuler
            </TText>
          </TouchableOpacity>
          <TText style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            Détails de la douleur
          </TText>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <TText style={[styles.headerButtonText, { color: colors.primary }]}>
              Valider
            </TText>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {subquestions.map((sq) => {
            const el = renderSubquestion(sq, subquestionProps);
            if (!el || !React.isValidElement(el) || el.type == null) return null;
            return (
              <TView key={sq.qid || sq.id} style={styles.field}>
                {React.cloneElement(el, { key: sq.qid || sq.id })}
              </TView>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 72,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
});

export default PainDetailsModal;
