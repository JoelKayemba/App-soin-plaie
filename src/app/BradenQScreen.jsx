// src/app/BradenQScreen.jsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';
import { useBradenQCalculator } from '@/features/calculators/braden-q';
import bradenQData from '@/data/braden-q.json';

const BradenQScreen = () => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [storedScores, setStoredScores] = useState({});
  const { makeStyles, colors, elevation, isDark } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const {
    selectedScores,
    expandedTexts,
    totalScore,
    riskLevel,
    selectScore,
    toggleTextExpansion,
    resetSelections,
    isComplete
  } = useBradenQCalculator(storedScores, setStoredScores);

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
    if (isComplete(bradenQData.dimensions.length)) {
      setShowResultModal(true);
    }
  };

  const useStyles = makeStyles((c, isDarkMode) => ({
    root: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      backgroundColor: c.background,
      
    },
    title: {
      fontSize: 24 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginLeft: spacing.md,
      flex: 1,
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
      color: c.text,
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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: isDarkMode ? c.surface : '#FFFFFF',
      borderRadius: 24,
      padding: spacing.xl,
      margin: spacing.lg,
      maxWidth: 400,
      width: '100%',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDarkMode ? 0.3 : 0.15,
      shadowRadius: isDarkMode ? 8 : 20,
      elevation: isDarkMode ? 8 : 12,
      borderWidth: 1,
      borderColor: isDarkMode ? c.border : 'rgba(226, 232, 240, 0.3)',
    },
    modalTitle: {
      fontSize: 24 * typeScale,
      fontWeight: '800',
      color: c.text,
      textAlign: 'center',
      marginBottom: spacing.xl,
      letterSpacing: -0.5,
    },
    modalRiskLevel: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      borderRadius: 16,
      backgroundColor: isDarkMode ? c.surfaceLight : '#F8FAFC',
    },
    modalRiskText: {
      fontSize: 20 * typeScale,
      fontWeight: '700',
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    modalScore: {
      fontSize: 36 * typeScale,
      fontWeight: '800',
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    modalDescription: {
      fontSize: 16 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.sm,
    },
    modalButton: {
      backgroundColor: c.primary,
      paddingVertical: spacing.lg,
      borderRadius: 16,
      alignItems: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    modalButtonText: {
      fontSize: 16 * typeScale,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
  }));

  const s = useStyles();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TView style={s.root}>
        {/* En-tête avec bouton retour et titre */}
        <View style={s.header}>
          <BackButton />
          <TText style={s.title}>Échelle de Braden Q</TText>
          
          {/* Bouton réinitialiser */}
          <TouchableOpacity style={s.resetButton} onPress={handleResetSelections} activeOpacity={0.8}>
            <TIcon name="refresh" size={16} color={colors.primary} />
            <TText style={s.resetText}>Réinitialiser</TText>
          </TouchableOpacity>
        </View>

        {/* Contenu principal */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          {/* Affichage des dimensions */}
          {bradenQData.dimensions.map((dimension) => (
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
                          numberOfLines={shouldTruncate && !isExpanded ? 1 : undefined}
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
              !isComplete(bradenQData.dimensions.length) && s.resultButtonDisabled
            ]}
            onPress={showResult}
            disabled={!isComplete(bradenQData.dimensions.length)}
            activeOpacity={0.8}
          >
            <TText style={[
              s.resultButtonText,
              !isComplete(bradenQData.dimensions.length) && s.resultButtonTextDisabled
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

export default BradenQScreen;