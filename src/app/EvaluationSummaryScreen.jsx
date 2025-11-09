import React, { useMemo, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';
import evaluationSteps from '@/data/evaluations/evaluation_steps.json';
import { clearEvaluationProgress } from '@/storage/evaluationLocalStorage';

const formatValue = (value) => {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '—';
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${formatValue(val)}`)
      .join('\n');
  }
  return String(value);
};

const buildStepMap = () => {
  const steps = evaluationSteps.evaluation_flow.column_1.steps;
  return steps.reduce((acc, step) => {
    acc[step.id] = step;
    return acc;
  }, {});
};

const EvaluationSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { evaluationId, tables = [], completedAt } = route.params || {};

  useEffect(() => {
    console.log('[EvaluationSummaryScreen] params', {
      evaluationId,
      completedAt,
      tables,
    });
  }, [evaluationId, completedAt, tables]);

  const stepMap = useMemo(buildStepMap, []);

  const handleClose = async () => {
    if (evaluationId) {
      await clearEvaluationProgress(evaluationId);
    }
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <TView style={[styles.container, { backgroundColor: colors.background }]}> 
        <TView style={[styles.header, { borderBottomColor: colors.border }]}> 
          <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
            <TIcon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TText style={[styles.title, { color: colors.text }]}>Récapitulatif de l'évaluation</TText>
          <View style={styles.iconSpacer} />
        </TView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {completedAt && (
            <TView style={[styles.infoCard, { backgroundColor: colors.surfaceLight }]}> 
              <TText style={[styles.infoLabel, { color: colors.textSecondary }]}>Date de complétion</TText>
              <TText style={[styles.infoValue, { color: colors.text }]}>{new Date(completedAt).toLocaleString()}</TText>
            </TView>
          )}

          {tables.length === 0 && (
            <TText style={[styles.emptyMessage, { color: colors.textSecondary }]}>Aucune donnée à afficher.</TText>
          )}

          {tables.map((table) => {
            const stepInfo = stepMap[table.id];
            const entries = Object.entries(table.answers || {});
            const labels = table.labels || {};
            return (
              <TView key={table.id} style={[styles.tableCard, { backgroundColor: colors.surface }]}> 
                <TText style={[styles.tableTitle, { color: colors.text }]}>{table.title || stepInfo?.title || table.id}</TText>
                {(table.description || stepInfo?.description) && (
                  <TText style={[styles.tableDescription, { color: colors.textSecondary }]}> 
                    {table.description || stepInfo?.description}
                  </TText>
                )}

                {entries.length === 0 ? (
                  <TText style={[styles.emptyEntry, { color: colors.textSecondary }]}>Aucune réponse enregistrée.</TText>
                ) : (
                  entries.map(([fieldId, value]) => {
                    const fieldMeta = labels[fieldId];
                    const fieldLabel = fieldMeta?.label || fieldId;
                    return (
                      <View key={fieldId} style={styles.entryRow}>
                        <TText style={[styles.entryKey, { color: colors.textSecondary }]}>{fieldLabel}</TText>
                        <TText style={[styles.entryValue, { color: colors.text }]}>{formatValue(value)}</TText>
                      </View>
                    );
                  })
                )}
              </TView>
            );
          })}
        </ScrollView>

        <TView style={styles.footer}>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary }]} onPress={handleClose}>
            <TText style={[styles.closeButtonText, { color: colors.textLight }]}>Terminer</TText>
          </TouchableOpacity>
        </TView>
      </TView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  iconButton: {
    padding: spacing.xs,
  },
  iconSpacer: {
    width: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  infoCard: {
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: spacing.xl,
  },
  tableCard: {
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  tableDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  emptyEntry: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  entryRow: {
    marginBottom: spacing.md,
  },
  entryKey: {
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  entryValue: {
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000020',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.lg,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EvaluationSummaryScreen;
