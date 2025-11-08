import React, { useMemo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { RadioGroup } from '@/components/ui/forms';
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
    const options = dimension.levels.map(level => ({
      id: `${dimension.id}_${level.score}`,
      label: `${level.score} - ${level.title}`,
      description: level.text,
      value: level.score
    }));

    return (
      <TView key={dimension.id} style={styles.dimensionCard}>
        <TText style={styles.dimensionTitle}>{dimension.label}</TText>
        {dimension.description ? (
          <TText style={styles.dimensionDescription}>{dimension.description}</TText>
        ) : null}
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

  return (
    <TView style={[styles.container, style]}>
      <TText style={styles.subtitle}>Sélectionnez un score (1 à 4) pour chaque dimension.</TText>
      {scaleData.dimensions.map(renderDimension)}

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
  dimensionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs
  },
  dimensionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: spacing.sm
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
  }
});

export default BradenScale;
