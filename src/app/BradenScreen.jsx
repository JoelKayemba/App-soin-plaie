// src/app/BradenScreen.jsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Alert, SafeAreaView } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import { useBradenCalculator } from '@/features/calculators/braden';
import bradenData from '@/data/braden.json';

const BradenScreen = () => {
  const [showResultModal, setShowResultModal] = useState(false);
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  // Utiliser le hook personnalisé pour la logique métier
  const {
    selectedScores,
    expandedTexts,
    totalScore,
    riskLevel,
    selectScore,
    toggleTextExpansion,
    resetSelections,
    isComplete
  } = useBradenCalculator();

  // Réinitialiser toutes les sélections avec confirmation
  const handleResetSelections = () => {
    Alert.alert(
      'Réinitialiser',
      'Voulez-vous vraiment réinitialiser toutes les sélections ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: resetSelections
        }
      ]
    );
  };

  // Afficher le modal de résultat
  const showResult = () => {
    if (isComplete(bradenData.dimensions.length)) {
      setShowResultModal(true);
    }
  };

  const useStyles = makeStyles((c) => ({
    root: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      backgroundColor: c.blanc,
      ...elevation(1),
    },
    title: {
      fontSize: 24 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginLeft: spacing.md,
      flex: 1,
    },
    infoButton: {
      padding: spacing.xs,
      marginRight: spacing.sm,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.textLight,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      borderWidth:1,
      borderColor:c.primary,
      ...elevation(1),
    },
    resetText: {
      fontSize: 14 * typeScale,
      color: c.primary,
      fontWeight: '600',
      marginLeft: spacing.xs,
      
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    copyright: {
      fontSize: 12 * typeScale,
      color: c.secondary,
      textAlign: 'center',
      marginBottom: spacing.md,
      lineHeight: 16,
    },
    adultClient: {
      fontSize: 14 * typeScale,
      color: '#D32F2F',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    dimensionCard: {
      backgroundColor: c.background,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth:1,
      borderColor:c.border,
      ...elevation(1),
    },
    dimensionHeader: {
      marginBottom: spacing.md,
      
    },
    dimensionTitle: {
      fontSize: 18 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginBottom: spacing.xs,
    },
    dimensionDescription: {
      fontSize: 14 * typeScale,
      color: c.primary,
      lineHeight: 20,
    },
    scoreOptions: {
      marginTop: spacing.sm,
    },
    scoreOption: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 8,
      marginBottom: spacing.xs,
      borderWidth: 1,
      borderColor: c.border,
    },
    scoreOptionSelected: {
      backgroundColor: c.primary + '20',
      borderColor: c.primary,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: c.border,
      marginRight: spacing.sm,
      marginTop: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioButtonSelected: {
      borderColor: c.primary,
      backgroundColor: c.primary,
    },
    radioButtonInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.surface,
    },
    scoreContent: {
      flex: 1,
    },
    scoreHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    scoreTitle: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.text,
      flex: 1,
    },
    scoreValue: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: c.primary,
      marginLeft: spacing.sm,
    },
    scoreText: {
      fontSize: 14 * typeScale,
      color: c.text,
      lineHeight: 20,
    },
    scoreTextTruncated: {
      fontSize: 14 * typeScale,
      color: c.text,
      lineHeight: 20,
      maxHeight: 40, // 2 lignes maximum
    },
    seeMoreButton: {
      marginTop: spacing.xs,
      alignSelf: 'flex-start',
    },
    seeMoreText: {
      fontSize: 12 * typeScale,
      color: c.primary,
      fontWeight: '600',
      
    },
    resultButton: {
      backgroundColor: c.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: spacing.lg,
      ...elevation(2),
    },
    resultButtonText: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: '#fff',
    },
    resultButtonDisabled: {
      backgroundColor: c.border,
    },
    resultButtonTextDisabled: {
      color: c.secondary,
    },
    totalScore: {
      backgroundColor: c.background,
      padding: spacing.md,
      borderRadius: 12,
      borderWidth:1,
      borderColor:c.border,
      alignItems: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    totalScoreText: {
      fontSize: 14 * typeScale,
      color: c.primary,
      fontWeight: '600',
    },
    totalScoreValue: {
      fontSize: 24 * typeScale,
      fontWeight: '700',
      color: c.primary,
      marginTop: spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: c.surface,
      borderRadius: 16,
      padding: spacing.lg,
      margin: spacing.lg,
      maxWidth: 400,
      width: '100%',
      ...elevation(3),
    },
    modalTitle: {
      fontSize: 20 * typeScale,
      fontWeight: '700',
      color: c.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    modalRiskLevel: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    modalRiskText: {
      fontSize: 18 * typeScale,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    modalScore: {
      fontSize: 32 * typeScale,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    modalDescription: {
      fontSize: 16 * typeScale,
      color: c.text,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.lg,
    },
    modalButton: {
      backgroundColor: c.primary,
      paddingVertical: spacing.md,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalButtonText: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: '#fff',
    },
  }));

  const s = useStyles();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* En-tête avec bouton retour et titre */}
        <View style={s.header}>
          <BackButton />
          <TText style={s.title}>Échelle de Braden</TText>
          
       
          
          {/* Bouton réinitialiser */}
          <TouchableOpacity style={s.resetButton} onPress={handleResetSelections} activeOpacity={0.8}>
            <TIcon name="refresh" size={16} color={colors.primary} />
            <TText style={s.resetText}>Réinitialiser</TText>
          </TouchableOpacity>
        </View>

        {/* Contenu principal */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          {/* Clientèle adulte */}
          <TText style={s.adultClient}>Pour la clientèle adulte</TText>

          {/* Affichage des dimensions */}
          {bradenData.dimensions.map((dimension) => (
            <View key={dimension.id} style={s.dimensionCard}>
              <View style={s.dimensionHeader}>
                <TText style={s.dimensionTitle}>{dimension.label}</TText>
                <TText style={s.dimensionDescription}>{dimension.description}</TText>
              </View>
              
              <View style={s.scoreOptions}>
                {dimension.levels.map((level) => {
                  const isSelected = selectedScores[dimension.id] === level.score;
                  const textKey = `${dimension.id}-${level.score}`;
                  const isExpanded = expandedTexts[textKey];
                  const textLength = level.text.length;
                  const shouldTruncate = textLength > 100; // Seuil pour tronquer
                  
                  return (
                    <TouchableOpacity
                      key={level.score}
                      style={[
                        s.scoreOption,
                        isSelected && s.scoreOptionSelected
                      ]}
                      onPress={() => selectScore(dimension.id, level.score)}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        s.radioButton,
                        isSelected && s.radioButtonSelected
                      ]}>
                        {isSelected && <View style={s.radioButtonInner} />}
                      </View>
                      
                      <View style={s.scoreContent}>
                        <View style={s.scoreHeader}>
                          <TText style={s.scoreTitle}>{level.title}</TText>
                          <TText style={s.scoreValue}>{level.score}</TText>
                        </View>
                        
                        <TText 
                          style={shouldTruncate && !isExpanded ? s.scoreTextTruncated : s.scoreText}
                          numberOfLines={shouldTruncate && !isExpanded ? 2 : undefined}
                        >
                          {level.text}
                        </TText>
                        
                        {/* Bouton "voir plus" si le texte est long */}
                        {shouldTruncate && (
                          <TouchableOpacity
                            style={s.seeMoreButton}
                            onPress={() => toggleTextExpansion(dimension.id, level.score)}
                            activeOpacity={0.7}
                          >
                            <TText style={s.seeMoreText}>
                              {isExpanded ? 'Voir moins' : 'Voir plus'}
                            </TText>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Score total */}
          {Object.keys(selectedScores).length > 0 && (
            <View style={s.totalScore}>
              <TText style={s.totalScoreText}>Score total actuel</TText>
              <TText style={s.totalScoreValue}>{totalScore}</TText>
            </View>
          )}

          {/* Bouton de résultat */}
          <TouchableOpacity
            style={[
              s.resultButton,
              !isComplete(bradenData.dimensions.length) && s.resultButtonDisabled
            ]}
            onPress={showResult}
            disabled={!isComplete(bradenData.dimensions.length)}
            activeOpacity={0.8}
          >
            <TText style={[
              s.resultButtonText,
              !isComplete(bradenData.dimensions.length) && s.resultButtonTextDisabled
            ]}>
              Voir le résultat
            </TText>
          </TouchableOpacity>

          {/* Copyright */}
          <TText style={s.copyright}>
            ©2023 Health Sense Ai. All rights reserved.{'\n'}
            All copyrights and trademarks are the property of Health Sense Ai or their respective owners or assigns.{'\n'}
            Septembre 2024. Utilisation autorisée sous licence.
          </TText>
        </ScrollView>

        {/* Modal de résultat */}
        <Modal
          visible={showResultModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowResultModal(false)}
        >
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <TText style={s.modalTitle}>Résultat de l'évaluation</TText>
              
              <View style={s.modalRiskLevel}>
                <TText style={[s.modalRiskText, { color: riskLevel.color }]}>
                  {riskLevel.level}
                </TText>
                <TText style={[s.modalScore, { color: riskLevel.color }]}>
                  Score: {totalScore}
                </TText>
              </View>
              
              <TText style={s.modalDescription}>
                {riskLevel.description}
              </TText>
              
              <TouchableOpacity
                style={s.modalButton}
                onPress={() => setShowResultModal(false)}
                activeOpacity={0.8}
              >
                <TText style={s.modalButtonText}>Fermer</TText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TView>
    </SafeAreaView>
  );
};

export default BradenScreen;