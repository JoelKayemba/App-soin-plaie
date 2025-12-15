/**
 * ContentDetector - Routeur léger pour les renderers de tables
 * 
 * Ce composant sert maintenant uniquement de routeur :
 * - Vérifie si un renderer spécifique existe pour la table
 * - Si oui, l'utilise
 * - Si non, affiche un message d'erreur (ne devrait plus arriver)
 * 
 * Toute la logique de rendu a été extraite vers :
 * - table-renderers/core/ : Logique commune
 * - table-renderers/utils/ : Utilitaires
 * - table-renderers/tables/ : Renderers spécifiques par table
 */

import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TView, TText } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import { BWATAttribution, ClinicalAlert } from './special';
import { SpecializedAlert } from './forms';
import spacing from '@/styles/spacing';

// Import des helpers pour showHelper
import burnStagesData from '@/data/evaluations/evaluation_helpers/burn_stages.json';
import pressureStagesData from '@/data/evaluations/evaluation_helpers/pressure_stages.json';

// Import du registre de renderers
import { getTableRenderer } from '@/features/evaluation/table-renderers';
import { useTableEffects } from '@/features/evaluation/table-renderers/utils/useTableEffects';
import { showHelper as showHelperUtil } from '@/features/evaluation/table-renderers/utils/helpers';

const ContentDetector = ({ 
  tableData, 
  data, 
  errors, 
  onDataChange, 
  onValidationChange,
  onNavigateToTable,
  evaluationData 
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // States pour les modales et alertes
  const [specializedAlertVisible, setSpecializedAlertVisible] = useState(false);
  const [specializedCondition, setSpecializedCondition] = useState('');
  const [questionnaireKey, setQuestionnaireKey] = useState(0);

  // Fonction pour fermer le clavier
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Hook pour gérer les effets et calculs automatiques
  const { handleDataChange } = useTableEffects({
    tableData,
    data,
    onDataChange,
    setQuestionnaireKey,
    setSpecializedCondition,
    setSpecializedAlertVisible,
  });

  // Fonction pour afficher l'aide
  const showHelper = (helpId, title) => {
    showHelperUtil(helpId, title, navigation, burnStagesData, pressureStagesData);
  };

  // Vérifier si un renderer spécifique existe pour cette table
  const SpecificRenderer = getTableRenderer(tableData?.id);
  
  // Si un renderer spécifique existe, l'utiliser
  if (SpecificRenderer) {
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <TView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Attribution BWAT si présente */}
            {tableData.bwat_attribution && (
              <BWATAttribution attribution={tableData.bwat_attribution} />
            )}

            {/* Alerte clinique si présente */}
            {tableData.clinical_alert && (
              <ClinicalAlert alert={tableData.clinical_alert} />
            )}

            {/* Utiliser le renderer spécifique */}
            <SpecificRenderer
              tableData={tableData}
              data={data}
              errors={errors}
              handleDataChange={handleDataChange}
              evaluationData={evaluationData}
              showHelper={showHelper}
              questionnaireKey={questionnaireKey}
            />
          </TView>
        </TouchableWithoutFeedback>

        {/* Alerte spécialisée pour lymphœdème et pied diabétique */}
        <SpecializedAlert
          visible={specializedAlertVisible}
          onClose={() => setSpecializedAlertVisible(false)}
          condition={specializedCondition}
          onContinueAnyway={() => setSpecializedAlertVisible(false)}
        />
      </React.Fragment>
    );
  }

  // Fallback : ne devrait plus arriver maintenant que tous les renderers sont créés
  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <TView style={[styles.container, { backgroundColor: colors.background }]}>
          <TView style={styles.errorContainer}>
            <TText style={[styles.errorText, { color: colors.error }]}>
              Aucun renderer disponible pour la table {tableData?.id || 'inconnue'}
            </TText>
            <TText style={[styles.errorSubtext, { color: colors.textSecondary }]}>
              Veuillez contacter le développeur.
            </TText>
          </TView>
        </TView>
      </TouchableWithoutFeedback>

      {/* Alerte spécialisée pour lymphœdème et pied diabétique */}
      <SpecializedAlert
        visible={specializedAlertVisible}
        onClose={() => setSpecializedAlertVisible(false)}
        condition={specializedCondition}
        onContinueAnyway={() => setSpecializedAlertVisible(false)}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ContentDetector;

