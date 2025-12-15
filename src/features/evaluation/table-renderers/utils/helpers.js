/**
 * helpers.js - Fonctions d'aide et navigation
 * 
 * Contient les fonctions pour afficher les helpers, alertes spécialisées, etc.
 * 
 * ÉTAPE 3 - Fonctions extraites depuis ContentDetector.jsx
 */

/**
 * Affiche un helper (modal d'aide) pour un élément
 * @param {string} helpId - ID du helper (ex: 'burn_stage_1', 'pressure_stage_3')
 * @param {string} title - Titre du helper
 * @param {object} navigation - Objet navigation de React Navigation
 * @param {object} burnStagesData - Données des stades de brûlure
 * @param {object} pressureStagesData - Données des stades de pression
 */
export const showHelper = (helpId, title, navigation, burnStagesData, pressureStagesData) => {
  let helperData = null;
  
  if (helpId.startsWith('burn_stage')) {
    helperData = burnStagesData?.helpers?.[helpId];
  } else if (helpId.startsWith('pressure_stage')) {
    helperData = pressureStagesData?.helpers?.[helpId];
  }
  
  if (helperData) {
    console.log('[helpers] Helper chargé:', helpId, helperData);
    navigation.navigate('HelperDetails', {
      helperId: helpId,
      helperTitle: title || helperData.title,
      helperData
    });
  } else {
    console.warn('[helpers] Aucun helper trouvé pour', helpId);
  }
};

/**
 * Affiche une alerte spécialisée
 * @param {string} condition - Type de condition ('lymphedema', 'neoplasia', etc.)
 * @param {function} setSpecializedCondition - Setter pour la condition
 * @param {function} setSpecializedAlertVisible - Setter pour la visibilité
 */
export const showSpecializedAlert = (condition, setSpecializedCondition, setSpecializedAlertVisible) => {
  setSpecializedCondition(condition);
  setSpecializedAlertVisible(true);
};

