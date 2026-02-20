import React, { useMemo, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { RadioGroup, NumericInput } from '@/components/ui/forms';
import spacing from '@/styles/spacing';
import bradenData from '@/data/braden.json';
import bradenQData from '@/data/braden-q.json';
import { useBradenCalculator } from '@/features/calculators/braden';
import { useBradenQCalculator } from '@/features/calculators/braden-q';

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const BradenScale = ({
  scaleType = 'braden',
  value = {},
  onValueChange,
  error,
  style
}) => {
  const scaleData = scaleType === 'braden_q' ? bradenQData : bradenData;
  const useCalculator = scaleType === 'braden_q' ? useBradenQCalculator : useBradenCalculator;
  const initialSelections = value?.selections || {};

  const {
    selectedScores,
    totalScore,
    riskLevel,
    selectScore,
    resetSelections,
    isComplete
  } = useCalculator(initialSelections);

  useEffect(() => {
    if (!value || !value.selections) {
      resetSelections();
    }
  }, []);

  useEffect(() => {
    const payload = {
      selections: selectedScores,
      totalScore,
      riskLevel
    };
    if (!deepEqual(value, payload)) {
      onValueChange?.(payload);
    }
  }, [selectedScores, totalScore, riskLevel]);

  const renderDimension = (dimension) => {
    const selectedValue = selectedScores[dimension.id] ?? value?.selections?.[dimension.id] ?? null;
    
    // Gestion spéciale pour le type "count" (dispositifs médicaux)
    if (dimension.type === 'count') {
      return (
        <TView key={dimension.id} style={styles.dimensionCard}>
          <TView style={styles.dimensionHeaderRow}>
            <TText style={styles.dimensionTitle}>{dimension.label}</TText>
            {dimension.description ? (
              <TouchableOpacity
                onPress={() => Alert.alert(dimension.label, dimension.description, [{ text: 'OK' }])}
                style={styles.infoIconButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <TIcon name="information-circle-outline" size={22} />
              </TouchableOpacity>
            ) : null}
          </TView>
          <NumericInput
            label="Nombre de dispositifs médicaux"
            value={selectedValue ?? 0}
            onValueChange={(val) => selectScore(dimension.id, Math.min(val, dimension.max_score || 8))}
            min={0}
            max={dimension.max_score || 8}
            step={1}
            required
          />
        </TView>
      );
    }
    
    // Rendu standard avec RadioGroup
    const options = dimension.levels.map(level => ({
      id: `${dimension.id}_${level.score}`,
      label: `${level.score} - ${level.title}`,
      description: level.text,
      value: level.score
    }));

    return (
      <TView key={dimension.id} style={styles.dimensionCard}>
        <TView style={styles.dimensionHeaderRow}>
          <TText style={styles.dimensionTitle}>{dimension.label}</TText>
          {dimension.description ? (
            <TouchableOpacity
              onPress={() => Alert.alert(dimension.label, dimension.description, [{ text: 'OK' }])}
              style={styles.infoIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <TIcon name="information-circle-outline" size={22} />
            </TouchableOpacity>
          ) : null}
        </TView>
        <RadioGroup
          options={options}
          value={selectedValue}
          onValueChange={(score) => selectScore(dimension.id, score)}
          required
        />
      </TView>
    );
  };

  const summary = useMemo(() => ({ totalScore: totalScore || 0, riskLevel }), [totalScore, riskLevel]);

  // Déterminer le texte du sous-titre selon le type d'échelle
  const getSubtitle = () => {
    if (scaleType === 'braden_q') {
      return "Sélectionnez un score pour chaque dimension. Les scores varient selon la dimension (0-2, 0-3, ou 0-8 pour les dispositifs médicaux).";
    }
    return "Sélectionnez un score (1 à 4) pour chaque dimension.";
  };

  // Grouper les dimensions par catégorie si disponible
  const renderDimensionsByCategory = () => {
    if (!scaleData.categories || scaleType !== 'braden_q') {
      // Pas de catégories ou pas Braden-Q : affichage simple
      return scaleData.dimensions.map(renderDimension);
    }

    // Grouper par catégorie
    return Object.entries(scaleData.categories).map(([categoryId, category]) => {
      const categoryDimensions = category.dimensions
        .map(dimId => scaleData.dimensions.find(d => d.id === dimId))
        .filter(Boolean);

      if (categoryDimensions.length === 0) return null;

      return (
        <TView key={categoryId} style={styles.categorySection}>
          <TText style={styles.categoryTitle}>{category.label}</TText>
          {categoryDimensions.map(renderDimension)}
        </TView>
      );
    });
  };

  return (
    <TView style={[styles.container, style]}>
      <TText style={styles.subtitle}>{getSubtitle()}</TText>
      {renderDimensionsByCategory()}

      <TView style={[styles.summaryCard, { borderColor: summary.riskLevel.color }]}> 
        <TText style={styles.summaryTitle}>Score total</TText>
        <TText style={[styles.summaryValue, { color: summary.riskLevel.color }]}>{summary.totalScore}</TText>
        <TText style={[styles.summaryRisk, { color: summary.riskLevel.color }]}>{summary.riskLevel.level}</TText>
        <TText style={styles.summaryDescription}>{summary.riskLevel.description}</TText>
        <TText style={styles.completionNote}>
          {isComplete(scaleData.dimensions.length)
            ? 'Toutes les dimensions ont été évaluées.'
            : 'Veuillez compléter toutes les dimensions pour valider le score.'}
        </TText>
      </TView>
      {error && (
        <TText style={styles.error}>{error}</TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  dimensionCard: {
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderColor: '#D0D5DD'
  },
  dimensionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  dimensionTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1
  },
  infoIconButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: spacing.radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280'
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700'
  },
  summaryRisk: {
    fontSize: 18,
    fontWeight: '700'
  },
  summaryDescription: {
    fontSize: 14,
    textAlign: 'center'
  },
  completionNote: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: '#6B7280'
  },
  error: {
    color: '#F04438',
    fontSize: 12,
    fontWeight: '600'
  },
  categorySection: {
    marginBottom: spacing.xl,
    gap: spacing.md
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: '#1F2937'
  }
});

export default BradenScale;
