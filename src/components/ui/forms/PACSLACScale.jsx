import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TView, TText } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';
import SimpleCheckbox from './SimpleCheckbox';

// Définition des domaines PACSLAC pour l'évaluation de la douleur
const PACSLAC_DOMAINS = [
  {
    id: 'facial_expressions',
    label: 'Expressions faciales',
    items: [
      { id: 'fearful', label: 'Air craintif', score: 1 },
      { id: 'frown', label: 'Sourcils froncés', score: 1 },
      { id: 'tense', label: 'Air tendu', score: 1 },
    ]
  },
  {
    id: 'activity_body_movement',
    label: 'Activité / Mouvement du corps',
    items: [
      { id: 'rigid', label: 'Rigidité', score: 1 },
      { id: 'crying_sobbing', label: 'Pleurs, sanglots', score: 2 },
      { id: 'bracing', label: 'Position défensive', score: 1 },
    ]
  },
  {
    id: 'social_personality_mood',
    label: 'Social / Personnalité / Humeur',
    items: [
      { id: 'withdrawn', label: 'Retrait, isolement', score: 1 },
      { id: 'less_interactive', label: 'Moins interactif', score: 1 },
      { id: 'irritable', label: 'Irritable', score: 1 },
      { id: 'confused', label: 'Confus', score: 1 },
    ]
  },
  {
    id: 'physiological_change_autonomic',
    label: 'Changements physiologiques / Autonomes',
    items: [
      { id: 'breathing', label: 'Respiration rapide ou difficile', score: 1 },
      { id: 'flushing', label: 'Rougeur', score: 1 },
      { id: 'pallor', label: 'Pâleur', score: 1 },
      { id: 'sweating', label: 'Transpiration', score: 1 },
    ]
  },
  {
    id: 'eating_sleeping_vocalization',
    label: 'Alimentation / Sommeil / Vocalisation',
    items: [
      { id: 'vocalization', label: 'Vocalisations', score: 1 },
      { id: 'eating_changes', label: 'Changements alimentaires', score: 1 },
      { id: 'sleeping_changes', label: 'Troubles du sommeil', score: 1 },
    ]
  }
];

const PACSLACScale = ({
  label,
  value = {},
  onValueChange,
  min_score = 0,
  max_score = 60,
  error,
  disabled = false,
  help,
  required = false,
  ...props
}) => {
  const { colors } = useTheme();
  const [selectedItems, setSelectedItems] = useState(value || {});

  const handleItemChange = (domainId, itemId, checked) => {
    const newSelectedItems = { ...selectedItems };
    
    if (!newSelectedItems[domainId]) {
      newSelectedItems[domainId] = {};
    }
    
    newSelectedItems[domainId][itemId] = checked;
    setSelectedItems(newSelectedItems);
    onValueChange?.(newSelectedItems);
  };

  const calculateScore = () => {
    let totalScore = 0;
    
    Object.entries(selectedItems).forEach(([domainId, domainItems]) => {
      if (domainItems && typeof domainItems === 'object') {
        Object.entries(domainItems).forEach(([itemId, checked]) => {
          if (checked) {
            // Trouver le domaine et l'item correspondants
            const domain = PACSLAC_DOMAINS.find(d => d.id === domainId);
            if (domain) {
              const item = domain.items.find(i => i.id === itemId);
              if (item) {
                totalScore += item.score;
              }
            }
          }
        });
      }
    });
    
    return totalScore;
  };

  const getScoreInterpretation = (score) => {
    if (score === 0) return "Aucune douleur détectée";
    if (score <= 5) return "Douleur légère";
    if (score <= 15) return "Douleur modérée";
    if (score <= 25) return "Douleur sévère";
    return "Douleur très sévère";
  };

  const currentScore = calculateScore();

  return (
    <TView style={styles.container}>
      {label && (
        <TText style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <TText style={{ color: colors.error }}> *</TText>}
        </TText>
      )}
      
      {help && (
        <TText style={[styles.helpText, { color: colors.textSecondary }]}>
          {help}
        </TText>
      )}

      <TView style={[styles.scaleContainer, { backgroundColor: colors.surfaceLight }]}>
        <ScrollView style={styles.scrollView}>
          {PACSLAC_DOMAINS.map((domain) => (
            <TView key={domain.id} style={styles.domain}>
              <TText style={[styles.domainTitle, { color: colors.text }]}>
                {domain.label}
              </TText>
              
              {domain.items.map((item) => {
                const isSelected = selectedItems[domain.id]?.[item.id] || false;
                return (
                  <View key={item.id} style={styles.itemContainer}>
                    <SimpleCheckbox
                      value={isSelected}
                      onValueChange={(checked) => handleItemChange(domain.id, item.id, checked)}
                      label={`${item.label} (${item.score} pt${item.score > 1 ? 's' : ''})`}
                      disabled={disabled}
                    />
                  </View>
                );
              })}
            </TView>
          ))}
        </ScrollView>

        {/* Affichage du score */}
        <TView style={[styles.scoreContainer, { backgroundColor: colors.surface }]}>
          <TText style={[styles.scoreLabel, { color: colors.text }]}>Score total :</TText>
          <TText style={[styles.scoreValue, { color: colors.primary }]}>
            {currentScore} / {max_score}
          </TText>
          <TText style={[styles.scoreInterpretation, { color: colors.textSecondary }]}>
            {getScoreInterpretation(currentScore)}
          </TText>
        </TView>
      </TView>

      {error && (
        <TText style={[styles.errorText, { color: colors.error }]}>
          {error}
        </TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: 14,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  scaleContainer: {
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    maxHeight: 400,
  },
  scrollView: {
    flexGrow: 1,
  },
  domain: {
    marginBottom: spacing.lg,
  },
  domainTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemContainer: {
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  scoreContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: spacing.xs,
  },
  scoreInterpretation: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default PACSLACScale;
