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
import evaluationSteps from '@/data/evaluations/evaluation_steps.json';

const buildStepMap = () => {
  const steps = evaluationSteps.evaluation_flow.column_1.steps;
  return steps.reduce((acc, step) => {
    acc[step.id] = step;
    return acc;
  }, {});
};

const ConstatsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { evaluationId, evaluationData: routeEvaluationData } = route.params || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [constats, setConstats] = useState({});
  const [evaluationData, setEvaluationData] = useState(routeEvaluationData || {});
  const [sourceTitles, setSourceTitles] = useState({});

  const stepMap = useMemo(buildStepMap, []);

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
        const titles = {};
        
        // Charger toutes les tables de l'évaluation
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
            
            titles[tableId] = step.title || tableData.title || tableId;
          } catch (error) {
            console.warn(`[ConstatsScreen] Erreur chargement table ${tableId}:`, error);
          }
        }

        try {
          const bwatAnswers = await loadTableAnswers(evaluationId, 'BWAT');
          if (bwatAnswers && (bwatAnswers.total != null || bwatAnswers.statusLabel)) {
            loadedData.BWAT = bwatAnswers;
            titles.BWAT = 'Score BWAT – Continuum du statut de la plaie';
          }
        } catch (_) {}

        setEvaluationData(loadedData);
        setSourceTitles(titles);
      } catch (error) {
        console.error('[ConstatsScreen] Erreur chargement données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluationData();
  }, [evaluationId]);

  // Charger les titres des sources si pas déjà chargés
  useEffect(() => {
    const loadSourceTitles = async () => {
      if (Object.keys(sourceTitles).length > 0) return;
      
      const titles = {};
      const steps = evaluationSteps.evaluation_flow.column_1.steps;
      
      for (const step of steps) {
        titles[step.id] = step.title || step.id;
      }
      
      setSourceTitles(titles);
    };
    
    loadSourceTitles();
  }, []);

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

  const getSourceTitle = (sourceId) => {
    if (!sourceId) return null;
    return sourceTitles[sourceId] || stepMap[sourceId]?.title || sourceId;
  };

  const renderConstatTable = (tableId, constatData) => {
    const { detectedConstats = [], constatTable, constatData: constatDetails } = constatData;
    
    if (!constatTable) return null;

    // Filtrer les éléments détectés
    const activeElements = constatTable.elements?.filter(element => 
      detectedConstats.includes(element.id)
    ) || [];

    if (activeElements.length === 0) return null;

    return (
      <TView key={tableId} style={[styles.tableCard, { backgroundColor: colors.surface }]}>
        <TText style={[styles.tableTitle, { color: colors.text }]}>
          {constatTable.title || tableId}
        </TText>
        {constatTable.description && (
          <TText style={[styles.tableDescription, { color: colors.textSecondary }]}>
            {constatTable.description}
          </TText>
        )}

        {activeElements.map((element) => {
          const constatDetail = constatDetails?.[element.id];
          const sourceId = constatDetail?.source || element.section;
          const sourceTitle = getSourceTitle(sourceId);
          const badgeColor = element.ui?.color || colors.primary;

          return (
            <View key={element.id} style={styles.constatItem}>
              <TView 
                style={[
                  styles.constatBadge, 
                  { backgroundColor: badgeColor + '20' }
                ]}
              >
                <TText 
                  style={[
                    styles.constatBadgeText, 
                    { color: badgeColor }
                  ]}
                >
                  {element.label || element.id}
                </TText>
              </TView>
              
              {element.description && (
                <TText style={[styles.constatDescription, { color: colors.textSecondary }]}>
                  {element.description}
                </TText>
              )}
              
              {sourceTitle && (
                <View style={styles.sourceInfo}>
                  <TIcon 
                    name="link" 
                    size={14} 
                    color={colors.textSecondary}
                  />
                  <TText style={[styles.sourceLabel, { color: colors.textSecondary }]}>Source :</TText>
                  <TText style={[styles.sourceValue, { color: colors.primary }]}>{sourceTitle}</TText>
                </View>
              )}
            </View>
          );
        })}
      </TView>
    );
  };

  const constatTables = useMemo(() => {
    return Object.entries(constats).map(([tableId, constatData]) => 
      renderConstatTable(tableId, constatData)
    ).filter(Boolean);
  }, [constats, colors, sourceTitles, stepMap]);

  const totalConstats = useMemo(() => {
    return Object.values(constats).reduce((sum, data) => {
      return sum + (data.detectedConstats?.length || 0);
    }, 0);
  }, [constats]);

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
              <ActivityIndicator size="small" color={colors.primary} />
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
                  Les constats suivants ont été générés automatiquement à partir de vos réponses à l'évaluation. 
                  Chaque constat indique sa source dans l'évaluation.
                </TText>
              </TView>
              {evaluationData.BWAT && (evaluationData.BWAT.total != null || evaluationData.BWAT.statusLabel) && (
                <TView key="BWAT" style={[styles.tableCard, { backgroundColor: colors.surface }]}>
                  <TText style={[styles.tableTitle, { color: colors.text }]}>
                    Score BWAT – Continuum du statut de la plaie
                  </TText>
                  <TText style={[styles.tableDescription, { color: colors.textSecondary }]}>
                    Score total BWAT et interprétation selon le continuum du statut de la plaie.
                  </TText>
                  <View style={styles.constatItem}>
                    <TView style={[styles.constatBadge, { backgroundColor: colors.primary + '20' }]}>
                      <TText style={[styles.constatBadgeText, { color: colors.primary }]}>
                        Score total : {evaluationData.BWAT.total != null ? evaluationData.BWAT.total : '—'}
                      </TText>
                    </TView>
                    <TText style={[styles.constatDescription, { color: colors.textSecondary }]}>
                      Statut : {evaluationData.BWAT.statusLabel || '—'}
                    </TText>
                  </View>
                </TView>
              )}
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
  infoCard: {
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
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
  constatItem: {
    marginBottom: spacing.md,
  },
  constatBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.full,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
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
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#00000020',
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
  },
  sourceValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ConstatsScreen;