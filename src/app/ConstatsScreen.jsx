import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';
import { constatsGenerator } from '@/services';
import { loadTableAnswers } from '@/storage/evaluationLocalStorage';
import { tableDataLoader } from '@/services';

const ConstatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { evaluationId, evaluationData: routeEvaluationData } = route.params || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [constats, setConstats] = useState({});
  const [evaluationData, setEvaluationData] = useState(routeEvaluationData || {});

  // Charger les données d'évaluation si non fournies
  useEffect(() => {
    const loadEvaluationData = async () => {
      if (!evaluationId || Object.keys(evaluationData).length > 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const loadedData = {};
        
        // Charger toutes les tables de l'évaluation
        const evaluationSteps = require('@/data/evaluations/evaluation_steps.json');
        const steps = evaluationSteps.evaluation_flow.column_1.steps;
        
        for (const step of steps) {
          const tableId = step.id;
          try {
            const tableData = await tableDataLoader.loadTableData(tableId);
            const answers = await loadTableAnswers(evaluationId, tableId);
            
            loadedData[tableId] = {
              ...tableData,
              ...answers
            };
          } catch (error) {
            console.warn(`[ConstatsScreen] Erreur chargement table ${tableId}:`, error);
          }
        }
        
        setEvaluationData(loadedData);
      } catch (error) {
        console.error('[ConstatsScreen] Erreur chargement données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluationData();
  }, [evaluationId]);

  // Générer les constats quand les données sont prêtes
  useEffect(() => {
    const generateConstats = async () => {
      if (isLoading || Object.keys(evaluationData).length === 0) return;

      try {
        setIsLoading(true);
        const generatedConstats = await constatsGenerator.generateAllConstats(evaluationData);
        setConstats(generatedConstats);
      } catch (error) {
        console.error('[ConstatsScreen] Erreur génération constats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateConstats();
  }, [evaluationData, isLoading]);

  const handleClose = () => {
    navigation.goBack();
  };

  const renderConstatTable = (tableId, constatData) => {
    const { detectedConstats = [], constatTable } = constatData;
    
    if (!constatTable) return null;

    // Filtrer les éléments détectés
    const activeElements = constatTable.elements?.filter(element => 
      detectedConstats.includes(element.id)
    ) || [];

    if (activeElements.length === 0) return null;

    return (
      <TView key={tableId} style={[styles.constatCard, { backgroundColor: colors.surface }]}>
        <TText style={[styles.constatTableTitle, { color: colors.text }]}>
          {constatTable.title || tableId}
        </TText>
        {constatTable.description && (
          <TText style={[styles.constatTableDescription, { color: colors.textSecondary }]}>
            {constatTable.description}
          </TText>
        )}

        {activeElements.map((element) => (
          <TView key={element.id} style={[styles.constatItem, { backgroundColor: colors.surfaceLight }]}>
            <TView style={styles.constatItemHeader}>
              <TView 
                style={[
                  styles.constatBadge, 
                  { backgroundColor: element.ui?.color || colors.primary + '20' }
                ]}
              >
                <TText 
                  style={[
                    styles.constatBadgeText, 
                    { color: element.ui?.color || colors.primary }
                  ]}
                >
                  {element.label || element.id}
                </TText>
              </TView>
            </TView>
            {element.description && (
              <TText style={[styles.constatDescription, { color: colors.textSecondary }]}>
                {element.description}
              </TText>
            )}
          </TView>
        ))}
      </TView>
    );
  };

  const constatTables = useMemo(() => {
    return Object.entries(constats).map(([tableId, constatData]) => 
      renderConstatTable(tableId, constatData)
    ).filter(Boolean);
  }, [constats, colors]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <TView style={[styles.container, { backgroundColor: colors.background }]}>
        <TView style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
            <TIcon name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TText style={[styles.title, { color: colors.text }]}>Constats de l'évaluation</TText>
          <View style={styles.iconSpacer} />
        </TView>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <TText style={[styles.loadingText, { color: colors.textSecondary }]}>
                Génération des constats...
              </TText>
            </View>
          ) : constatTables.length === 0 ? (
            <TView style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
              <TIcon name="document-text-outline" size={64} color={colors.textSecondary} />
              <TText style={[styles.emptyText, { color: colors.textSecondary }]}>
                Aucun constat détecté pour cette évaluation.
              </TText>
            </TView>
          ) : (
            <>
              <TView style={[styles.infoCard, { backgroundColor: colors.surfaceLight }]}>
                <TText style={[styles.infoText, { color: colors.textSecondary }]}>
                  Les constats suivants ont été générés automatiquement à partir de vos réponses.
                </TText>
              </TView>
              {constatTables}
            </>
          )}
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
  },
  emptyContainer: {
    borderRadius: spacing.radius.lg,
    padding: spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: 16,
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  constatCard: {
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  constatTableTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  constatTableDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  constatItem: {
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  constatItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    backgroundColor: 'transparent',
  },
  constatBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.full,
  },
  constatBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  constatDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
});

export default ConstatsScreen;

