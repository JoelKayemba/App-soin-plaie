import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import ContentDetector from '@/components/ui/ContentDetector';
import RedirectAlert from '@/components/ui/RedirectAlert';
import { EpicConnectionButton, EpicConnectionStatus } from '@/components/epic';
import useTableData from '@/hooks/useTableData';
import useEvaluationRouting from '@/hooks/useEvaluationRouting';
import spacing from '@/styles/spacing';

// Import des données de configuration
import evaluationSteps from '@/data/evaluations/evaluation_steps.json';
import { tableDataLoader } from '@/services';
import { testTableLoader } from '@/utils/testTableLoader';
import { loadEvaluationProgress, loadTableAnswers, saveTableProgress, updateLastVisitedTable, clearEvaluationProgress } from '@/storage/evaluationLocalStorage';

const extractAnswersFromTable = (tableId, tableData = {}) => {
  if (!tableId || !tableData) return {};
  return Object.fromEntries(
    Object.entries(tableData).filter(([key]) => key.startsWith(tableId))
  );
};

const collectLabelsFromTableData = (tableData = {}, accumulator = {}) => {
  if (!tableData) {
    return accumulator;
  }

  const registerElement = (element) => {
    if (!element || typeof element !== 'object') return;
    if (element.id) {
      accumulator[element.id] = {
        label: element.label || element.title || element.id,
        description: element.description || element.help || null,
      };
    }

    if (Array.isArray(element.elements)) {
      element.elements.forEach(registerElement);
    }

    if (Array.isArray(element.additional_fields)) {
      element.additional_fields.forEach(registerElement);
    }

    if (Array.isArray(element.complementary_fields)) {
      element.complementary_fields.forEach(registerElement);
    }

    if (Array.isArray(element.additional_tracts)) {
      element.additional_tracts.forEach(registerElement);
    }
  };

  if (Array.isArray(tableData.elements)) {
    tableData.elements.forEach(registerElement);
  }

  if (Array.isArray(tableData.sub_blocks)) {
    tableData.sub_blocks.forEach((block) => {
      if (Array.isArray(block.elements)) {
        block.elements.forEach(registerElement);
      }
    });
  }

  if (Array.isArray(tableData.questions)) {
    tableData.questions.forEach((question) => {
      if (question.qid) {
        accumulator[question.qid] = {
          label: question.label || question.qid,
          description: question.description || null,
        };
      }
      if (Array.isArray(question.options)) {
        question.options.forEach(registerElement);
      }
      if (Array.isArray(question.subquestions)) {
        question.subquestions.forEach(registerElement);
      }
    });
  }

  if (Array.isArray(tableData.additional_fields)) {
    tableData.additional_fields.forEach(registerElement);
  }

  return accumulator;
};

const EvaluationScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [evaluationData, setEvaluationData] = useState({});
  const [stepValidation, setStepValidation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [shouldNavigateToTable34, setShouldNavigateToTable34] = useState(false);

  // Fonction pour fermer le clavier
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // Hook pour gérer le routage et les redirections
  const { shouldRedirect, redirectReason, processFieldChange, resetRedirect } = useEvaluationRouting();

  // Récupération des étapes de l'évaluation
  const steps = evaluationSteps.evaluation_flow.column_1.steps;
  const evaluationId = evaluationSteps.evaluation_flow.column_1.id || 'C1';
  const [savedProgress, setSavedProgress] = useState({
    version: 1,
    updatedAt: null,
    lastVisitedTableId: null,
    savedTables: {},
  });
  const savedProgressRef = useRef({
    version: 1,
    updatedAt: null,
    lastVisitedTableId: null,
    savedTables: {},
  });
  const [progressLoaded, setProgressLoaded] = useState(false);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Hook pour gérer les données de la table courante
  const { data, errors, isValid, updateWithValidation } = useTableData(currentStep?.id);

  // Chargement des données de la table courante
  const loadCurrentTableData = useCallback(async () => {
    if (!currentStep || !progressLoaded) return;
    setIsLoading(true);
    try {
      const tableData = await tableDataLoader.loadTableData(currentStep.id);
      const savedAnswers = await loadTableAnswers(evaluationId, currentStep.id);
      const answersToMerge = savedAnswers && Object.keys(savedAnswers).length > 0 ? savedAnswers : {};

      setEvaluationData(prev => {
        const existingData = prev[currentStep.id] || {};
        return {
          ...prev,
          [currentStep.id]: {
            ...tableData,
            ...answersToMerge,
            ...existingData,
          }
        };
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données de cette étape.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, evaluationId, progressLoaded]);

  // Gestion des changements de données
  const handleDataChange = useCallback((fieldId, value) => {
    if (!currentStep) return;

    const tableId = currentStep.id;
    const currentTableData = evaluationData[tableId] || {};

    const updatedTableData = {
      ...currentTableData,
      [fieldId]: value,
    };

    const newEvaluationData = {
      ...evaluationData,
      [tableId]: updatedTableData,
    };

    setEvaluationData(newEvaluationData);

    if (tableId === 'C1T11' && fieldId === 'C1T11E06') {
      const isPiedDiabetiqueSelected = Array.isArray(value) && value.includes('pied_diabetique');
      setShouldNavigateToTable34(isPiedDiabetiqueSelected);
    }

    const element = currentTableData.elements?.find?.((el) => el.id === fieldId);
    if (element) {
      processFieldChange(fieldId, value, element);
    }

    const answers = extractAnswersFromTable(tableId, updatedTableData);
    if (progressLoaded) {
      saveTableProgress(
        evaluationId,
        tableId,
        {
          title: currentStep.title,
          answers,
          stepIndex: currentStepIndex,
        },
        { lastVisitedTableId: tableId }
      )
        .then((progress) => {
          if (progress) {
            setSavedProgress(progress);
          }
        })
        .catch((error) => {
          console.error('[EvaluationScreen] erreur sauvegarde table:', error);
        });
    }
  }, [currentStep, currentStepIndex, evaluationData, evaluationId, processFieldChange, progressLoaded]);

  // Gestion des changements de validation
  const handleValidationChange = useCallback((isValid, errors) => {
    setStepValidation(prev => ({
      ...prev,
      [currentStep.id]: { isValid, errors }
    }));
  }, [currentStep]);

  // Validation globale de l'étape courante
  const validateCurrentStep = useCallback(() => {
    if (!currentStep || !evaluationData[currentStep.id]) {
      return false;
    }

    const tableData = evaluationData[currentStep.id];
    const elements = tableData.elements || [];
    const currentData = evaluationData[currentStep.id] || {};
    
    // Vérifier tous les champs requis
    for (const element of elements) {
      if (element.required) {
        const value = currentData[element.id];
        
        // Validation selon le type
        if (element.type === 'date') {
          if (!value || value === '' || value.length !== 10) {
            return false;
          }
        } else if (element.type === 'boolean') {
          if (value === null || value === undefined) {
            return false;
          }
        } else if (element.type === 'multiple_choice' || element.type === 'multiple_selection') {
          if (!value || value.length === 0) {
            return false;
          }
        } else {
          // Pour les autres types (text, number, etc.)
          if (!value || value === '') {
            return false;
          }
        }
      }
    }
    
    return true;
  }, [currentStep, evaluationData]);

  // Navigation vers l'étape précédente
  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      // Si on est sur la table 22 (Tissus nécrotiques), retourner à la table 21
      if (currentStep.id === 'C1T22') {
        //console.log('Navigation depuis table 22 vers table 21');
        handleNavigateToTable('C1T21');
        return;
      }
      
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex, currentStep, handleNavigateToTable]);

  // Navigation vers l'étape suivante
  const handleNext = useCallback(() => {
    const isStepValid = validateCurrentStep();
    
    if (currentStep.required && !isStepValid) {
      Alert.alert(
        'Étape incomplète',
        'Veuillez compléter tous les champs requis avant de continuer.',
        [{ text: 'OK' }]
      );
      return;
    }

    const findNextIndex = (startIndex) => {
      let nextIndex = startIndex + 1;
      while (nextIndex < steps.length) {
        const nextStepId = steps[nextIndex].id;
        if (nextStepId === 'C1T34' && !shouldNavigateToTable34) {
          nextIndex++;
          continue;
        }
        break;
      }
      return nextIndex;
    };

    if (isLastStep) {
      Alert.alert(
        'Évaluation terminée',
        'Voulez-vous terminer l\'évaluation ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Terminer', onPress: handleFinishEvaluation }
        ]
      );
    } else {
      if (currentStep.id === 'C1T21') {
        const necroticTissueValue = parseFloat(evaluationData[currentStep.id]?.['C1T21E01']) || 0;
        
        if (necroticTissueValue > 0) {
          handleNavigateToTable('C1T22');
          return;
        } else {
          const currentIndex = steps.findIndex(s => s.id === currentStep.id);
          let nextIndex = currentIndex + 1;
          while (nextIndex < steps.length && steps[nextIndex].id === 'C1T22') {
            nextIndex++;
          }
          while (nextIndex < steps.length && steps[nextIndex].id === 'C1T34' && !shouldNavigateToTable34) {
            nextIndex++;
          }

          if (nextIndex < steps.length) {
            setCurrentStepIndex(nextIndex);
            return;
          }

          Alert.alert(
            'Évaluation terminée',
            'Voulez-vous terminer l\'évaluation ?',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Terminer', onPress: handleFinishEvaluation }
            ]
          );
          return;
        }
      }
      
      if (currentStep.id === 'C1T22') {
        const currentIndex = steps.findIndex(s => s.id === currentStep.id);
        let nextIndex = findNextIndex(currentIndex);
        if (nextIndex < steps.length) {
          setCurrentStepIndex(nextIndex);
        } else {
          Alert.alert(
            'Évaluation terminée',
            'Voulez-vous terminer l\'évaluation ?',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Terminer', onPress: handleFinishEvaluation }
            ]
          );
        }
        return;
      }
      
      const nextIndex = findNextIndex(currentStepIndex);
      if (nextIndex < steps.length) {
        setCurrentStepIndex(nextIndex);
      } else {
        Alert.alert(
          'Évaluation terminée',
          'Voulez-vous terminer l\'évaluation ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Terminer', onPress: handleFinishEvaluation }
          ]
        );
      }
    }
  }, [currentStep, currentStepIndex, evaluationData, handleFinishEvaluation, handleNavigateToTable, isLastStep, shouldNavigateToTable34, steps, validateCurrentStep]);

  // Terminer l'évaluation
  const handleFinishEvaluation = useCallback(async () => {
    try {
      const completionTimestamp = new Date().toISOString();
      const summaryTables = [];

      for (let index = 0; index < steps.length; index++) {
        const step = steps[index];
        const tableId = step.id;
        const currentData = evaluationData[tableId];
        let answers = extractAnswersFromTable(tableId, currentData);

        if (!answers || Object.keys(answers).length === 0) {
          answers = await loadTableAnswers(evaluationId, tableId);
        }

        if (answers && Object.keys(answers).length > 0) {
          let labelSource = currentData;
          if (!labelSource || !labelSource.elements) {
            try {
              labelSource = await tableDataLoader.loadTableData(tableId);
            } catch (error) {
              console.warn('[EvaluationScreen] impossible de charger la table pour labels:', tableId, error);
            }
          }

          const labels = collectLabelsFromTableData(labelSource, {});

          summaryTables.push({
            id: tableId,
            order: step.order ?? index + 1,
            title: step.title,
            description: step.description,
            answers,
            labels,
          });
        }
      }

      navigation.navigate('EvaluationSummary', {
        evaluationId,
        completedAt: completionTimestamp,
        tables: summaryTables,
      });
    } catch (error) {
      console.error('[EvaluationScreen] erreur lors de la finalisation:', error);
      Alert.alert('Erreur', 'Impossible de finaliser l\'évaluation. Veuillez réessayer.');
    }
  }, [evaluationData, evaluationId, navigation, steps]);

  // Annuler l'évaluation
  const handleCancel = useCallback(() => {
    Alert.alert(
      'Annuler l\'évaluation',
      'Êtes-vous sûr de vouloir annuler cette évaluation ? Toutes les données non sauvegardées seront perdues.',
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Annuler', style: 'destructive', onPress: () => {
          // TODO: Retourner à l'écran précédent
          navigation.goBack();
        }}
      ]
    );
  }, [navigation]);

  // Gérer la fermeture du modal de redirection
  const handleCloseRedirectAlert = useCallback(() => {
    setShowRedirectAlert(false);
    resetRedirect();
  }, [resetRedirect]);

  // Gérer la continuation malgré la redirection
  const handleContinueAnyway = useCallback(() => {
    setShowRedirectAlert(false);
    resetRedirect();
    console.log('Utilisateur a choisi de continuer malgré la redirection recommandée');
  }, [resetRedirect]);

  // Navigation vers une table spécifique (pour les déclenchements conditionnels)
  const handleNavigateToTable = useCallback((tableId) => {
    //console.log(' handleNavigateToTable appelé avec:', tableId);
    //console.log(' Steps disponibles:', steps.map(s => ({ id: s.id, order: s.order, title: s.title })));
    
    const targetStepIndex = steps.findIndex(step => step.id === tableId);
    if (targetStepIndex !== -1) {
      //console.log(` Navigation vers la table ${tableId} (index: ${targetStepIndex})`);
      setCurrentStepIndex(targetStepIndex);
    } else {
      console.warn(` Table ${tableId} non trouvée dans les étapes d'évaluation. Steps disponibles:`, steps.map(s => s.id));
    }
  }, [steps]);

  // Charger les données au changement d'étape
  useEffect(() => {
    loadCurrentTableData();
  }, [loadCurrentTableData]);

  // Gérer l'état de redirection
  useEffect(() => {
    if (shouldRedirect && redirectReason) {
      setShowRedirectAlert(true);
    }
  }, [shouldRedirect, redirectReason]);

  // Réinitialiser le flag de navigation conditionnelle quand on change de table
  useEffect(() => {
    const etiology = evaluationData?.['C1T11']?.['C1T11E06'];
    const isPiedDiabetiqueSelected = Array.isArray(etiology) && etiology.includes('pied_diabetique');
    setShouldNavigateToTable34(isPiedDiabetiqueSelected);
  }, [evaluationData]);

  // Mettre à jour la validation quand les données changent
  useEffect(() => {
    if (currentStep && evaluationData[currentStep.id]) {
      const isStepValid = validateCurrentStep();
      setStepValidation(prev => ({
        ...prev,
        [currentStep.id]: { 
          isValid: isStepValid, 
          errors: {} 
        }
      }));
    }
  }, [currentStep, evaluationData, validateCurrentStep]);

  // Test du TableDataLoader au montage
  useEffect(() => {
    testTableLoader();
  }, []);

  // Gestion des événements clavier
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Chargement initial de la progression
  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      try {
        const storedProgress = await loadEvaluationProgress(evaluationId);
        if (!isMounted) return;

        const normalizedProgress = storedProgress || {
          version: 1,
          updatedAt: null,
          lastVisitedTableId: null,
          savedTables: {},
        };
        setSavedProgress(normalizedProgress);
        savedProgressRef.current = normalizedProgress;

        if (normalizedProgress.lastVisitedTableId) {
          const targetIndex = steps.findIndex(step => step.id === normalizedProgress.lastVisitedTableId);
          if (targetIndex >= 0) {
            setCurrentStepIndex(targetIndex);
          }
        }
      } catch (error) {
        console.error('[EvaluationScreen] erreur chargement progression:', error);
      } finally {
        if (isMounted) {
          setProgressLoaded(true);
        }
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [evaluationId, steps]);

  // Calcul du pourcentage de progression
  const progressPercentage = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  // Rendu du contenu de l'étape courante
  const renderCurrentStepContent = () => {
    if (!currentStep) {
      return (
        <TView style={styles.errorContainer}>
          <TText style={[styles.errorText, { color: colors.error }]}>
            Aucune étape trouvée
          </TText>
        </TView>
      );
    }

    // Utiliser les données chargées de la table
    const tableData = evaluationData[currentStep.id];
    
  
    
    if (!tableData) {
      return (
        <TView style={styles.loadingContainer}>
          <TText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement des données...
          </TText>
        </TView>
      );
    }

    return (
      <ContentDetector
        tableData={tableData}
        data={evaluationData[currentStep.id] || {}}
        errors={stepValidation[currentStep.id]?.errors || {}}
        onDataChange={handleDataChange}
        onValidationChange={handleValidationChange}
        onNavigateToTable={handleNavigateToTable}
        evaluationData={evaluationData}
      />
    );
  };

  useEffect(() => {
    const currentStepId = currentStep?.id;
    if (!progressLoaded || !currentStepId) return;
    if (savedProgressRef.current.lastVisitedTableId === currentStepId) return;

    updateLastVisitedTable(evaluationId, currentStepId)
      .then((progress) => {
        if (progress) {
          setSavedProgress(progress);
        }
      })
      .catch((error) => {
        console.error('[EvaluationScreen] erreur mise à jour dernière table:', error);
      });
  }, [currentStep?.id, evaluationId, progressLoaded]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.touchableContainer}>
          <KeyboardAvoidingView 
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
          {/* En-tête avec navigation */}
          <TView style={styles.header}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <TIcon name="close" size={24} color={colors.text} />
          </TouchableOpacity>

        <TView style={styles.titleContainer}>
          <TText style={[styles.title, { color: colors.text }]}>
            {currentStep?.title || 'Évaluation'}
          </TText>
          <TText style={[styles.stepInfo, { color: colors.textSecondary }]}>
            Étape {currentStepIndex + 1} sur {steps.length}
          </TText>
        </TView>

        <View style={styles.placeholder} />
      </TView>

      {/* Composants Epic */}
      <TView style={styles.epicContainer}>
        <EpicConnectionStatus />
        <EpicConnectionButton />
      </TView>

      {/* Barre de progression */}
      <TView style={styles.progressContainer}>
        <TView style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <TView 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: colors.primary,
                width: `${progressPercentage}%`
              }
            ]} 
          />
        </TView>
        <TText style={[styles.progressText, { color: colors.textSecondary }]}>
          {progressPercentage}%
        </TText>
      </TView>

      {/* Contenu principal */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          keyboardVisible && styles.contentContainerWithKeyboard
        ]}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
        keyboardDismissMode="on-drag"
      >
        {isLoading ? (
          <TView style={styles.loadingContainer}>
            <TText style={[styles.loadingText, { color: colors.textSecondary }]}>
              Chargement...
        </TText>
          </TView>
        ) : (
          renderCurrentStepContent()
        )}
      </ScrollView>
          </KeyboardAvoidingView>

      {/* Navigation en bas */}
      <TView style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.previousButton,
            { 
              backgroundColor: isFirstStep ? colors.surfaceLight : colors.primary,
              opacity: isFirstStep ? 0.5 : 1
            }
          ]}
          onPress={handlePrevious}
          disabled={isFirstStep}
        >
          <TIcon 
            name="chevron-back" 
            size={20} 
            color={isFirstStep ? colors.textTertiary : colors.primaryText} 
          />
          <TText style={[
            styles.navButtonText,
            { color: isFirstStep ? colors.textTertiary : colors.primaryText }
          ]}>
            Précédent
          </TText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, { backgroundColor: colors.success }]}
          onPress={handleNext}
        >
          <TText style={[styles.navButtonText, { color: colors.primaryText }]}>
            {isLastStep ? 'Terminer' : 'Suivant'}
        </TText>
          {!isLastStep && (
            <TIcon name="chevron-forward" size={20} color={colors.primaryText} />
          )}
        </TouchableOpacity>
    </TView>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal de redirection */}
      <RedirectAlert
        visible={showRedirectAlert}
        onClose={handleCloseRedirectAlert}
        onContinueAnyway={handleContinueAnyway}
        redirectReason={redirectReason}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
   
  },
  cancelButton: {
    padding: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepInfo: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  placeholder: {
    width: 40, // Même largeur que le bouton annuler pour centrer le titre
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'right',
  },
  epicContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  contentContainerWithKeyboard: {
    paddingBottom: spacing.xl * 2, // Plus d'espace quand le clavier est visible
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
   
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.md,
    gap: spacing.sm,
  },
  previousButton: {
    // Styles spécifiques pour le bouton précédent
  },
  nextButton: {
    // Styles spécifiques pour le bouton suivant
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EvaluationScreen;