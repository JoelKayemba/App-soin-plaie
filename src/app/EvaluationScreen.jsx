import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import ContentDetector from '@/components/ui/ContentDetector';
import RedirectAlert from '@/components/ui/RedirectAlert';
import useTableData from '@/hooks/useTableData';
import useEvaluationRouting from '@/hooks/useEvaluationRouting';
import spacing from '@/styles/spacing';

// Import des données de configuration
import evaluationSteps from '@/data/evaluations/evaluation_steps.json';
import uiTypeMapping from '@/data/evaluations/ui_type_mapping.json';
import { tableDataLoader } from '@/services';
import { testTableLoader } from '@/utils/testTableLoader';

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
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Hook pour gérer les données de la table courante
  const { data, errors, isValid, updateWithValidation } = useTableData(currentStep?.id);

  // Chargement des données de la table courante
  const loadCurrentTableData = useCallback(async () => {
    if (!currentStep) return;
    
    setIsLoading(true);
    try {
      // Charger les données réelles de la table
      const tableData = await tableDataLoader.loadTableData(currentStep.id);
      
      setEvaluationData(prev => ({
        ...prev,
        [currentStep.id]: tableData
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données de cette étape.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStep]);

  // Gestion des changements de données
  const handleDataChange = useCallback((fieldId, value) => {
    console.log(`📝 Changement de données pour ${fieldId}:`, value);
    
    // Mettre à jour les données
    const newEvaluationData = {
      ...evaluationData,
      [currentStep.id]: {
        ...evaluationData[currentStep.id],
        [fieldId]: value
      }
    };
    
    setEvaluationData(newEvaluationData);

    // Vérifier la condition pour la table 34 (Pied diabétique)
    if (currentStep.id === 'C1T11' && fieldId === 'C1T11E06') {
      const isPiedDiabetiqueSelected = Array.isArray(value) && value.includes('pied_diabetique');
      setShouldNavigateToTable34(isPiedDiabetiqueSelected);
      console.log('🔍 Mise à jour flag navigation table 34:', isPiedDiabetiqueSelected);
    }

    // Vérifier les redirections immédiates
    if (currentStep && evaluationData[currentStep.id]) {
      const tableData = evaluationData[currentStep.id];
      const element = tableData.elements?.find(el => el.id === fieldId);
      
      if (element) {
        processFieldChange(fieldId, value, element);
      }
    }
  }, [currentStep, evaluationData, processFieldChange]);

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
      // Si on est sur la table 34 (Pied diabétique), retourner à la table 11
      if (currentStep.id === 'C1T34') {
        console.log('🔙 Navigation depuis table 34 vers table 11');
        handleNavigateToTable('C1T11');
        return;
      }
      
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex, currentStep, handleNavigateToTable]);

  // Navigation vers l'étape suivante
  const handleNext = useCallback(() => {
    // Vérifier si l'étape courante est valide
    const isStepValid = validateCurrentStep();
    
    if (currentStep.required && !isStepValid) {
      Alert.alert(
        'Étape incomplète',
        'Veuillez compléter tous les champs requis avant de continuer.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isLastStep) {
      // Dernière étape - terminer l'évaluation
      Alert.alert(
        'Évaluation terminée',
        'Voulez-vous terminer l\'évaluation ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Terminer', onPress: handleFinishEvaluation }
        ]
      );
    } else {
      // Vérifier s'il y a des conditions de navigation spéciales (table 34 après pied diabétique)
      console.log('🔍 handleNext - currentStep.id:', currentStep.id);
      console.log('🔍 handleNext - shouldNavigateToTable34:', shouldNavigateToTable34);
      
      if (currentStep.id === 'C1T11' && shouldNavigateToTable34) {
        console.log('🚀 Navigation conditionnelle vers la table 34 (Pied diabétique)');
        handleNavigateToTable('C1T34');
        return;
      }
      
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStep, validateCurrentStep, isLastStep, shouldNavigateToTable34, handleNavigateToTable]);

  // Terminer l'évaluation
  const handleFinishEvaluation = useCallback(() => {
    // TODO: Implémenter la logique de fin d'évaluation
    Alert.alert('Succès', 'Évaluation terminée avec succès !');
  }, []);

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
  }, []);

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
    if (currentStep.id !== 'C1T11') {
      setShouldNavigateToTable34(false);
    } else {
      // Vérifier l'état initial de la table 11
      const currentStepData = evaluationData[currentStep.id] || {};
      const etiology = currentStepData['C1T11E06'];
      const isPiedDiabetiqueSelected = Array.isArray(etiology) && etiology.includes('pied_diabetique');
      setShouldNavigateToTable34(isPiedDiabetiqueSelected);
    }
  }, [currentStep.id, evaluationData]);

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
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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