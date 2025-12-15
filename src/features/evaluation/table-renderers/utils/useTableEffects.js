/**
 * useTableEffects - Hook personnalisé pour gérer les effets et calculs automatiques
 * 
 * Ce hook centralise tous les useEffects et la logique de calcul automatique
 * qui étaient dispersés dans ContentDetector.jsx
 * 
 * ÉTAPE 8 - Extraction des hooks et effets
 */

import { useEffect, useState } from 'react';
import { calculateIPSCBValues, calculateBWATSurface, calculateBMI } from './calculations';
import { showSpecializedAlert as showSpecializedAlertUtil } from './helpers';

/**
 * Hook pour gérer tous les effets et calculs automatiques d'une table
 * @param {object} params - Paramètres du hook
 * @param {object} params.tableData - Données de la table
 * @param {object} params.data - Données actuelles de l'évaluation
 * @param {function} params.onDataChange - Callback pour changer les données
 * @param {function} params.setQuestionnaireKey - Setter pour forcer le re-rendu du questionnaire
 * @param {function} params.setSpecializedCondition - Setter pour l'alerte spécialisée
 * @param {function} params.setSpecializedAlertVisible - Setter pour la visibilité de l'alerte
 * @returns {function} handleDataChange - Fonction pour gérer les changements de données
 */
export const useTableEffects = ({
  tableData,
  data,
  onDataChange,
  setQuestionnaireKey,
  setSpecializedCondition,
  setSpecializedAlertVisible,
}) => {
  // Fonction pour calculer les indices IPSCB (table 15)
  const calculateIPSCB = () => {
    if (tableData?.id !== 'C1T15') return;
    
    // C1T15D01 est maintenant "la plus élevée des deux bras"
    const pasBrasMax = parseFloat(data['C1T15D01']) || 0;
    const tibialePosterieureDroite = parseFloat(data['C1T15D03']) || 0;
    const pedieuseDroite = parseFloat(data['C1T15D04']) || 0;
    const tibialePosterieureGauche = parseFloat(data['C1T15D05']) || 0;
    const pedieuseGauche = parseFloat(data['C1T15D06']) || 0;
    
    // Utiliser la fonction importée avec un objet
    const nouveauxCalculs = calculateIPSCBValues({
      pasBrasMax,
      tibialePosterieureDroite,
      pedieuseDroite,
      tibialePosterieureGauche,
      pedieuseGauche
    });
    
    if (!nouveauxCalculs) return; // Pas de calcul si aucun bras
    
    // Vérifier s'il y a des changements à appliquer
    const hasChanges = Object.keys(nouveauxCalculs).some(key => {
      const nouvelleValeur = nouveauxCalculs[key];
      const valeurActuelle = data[key];
      return nouvelleValeur !== valeurActuelle;
    });
    
    if (hasChanges) {
      // Appliquer les nouveaux calculs
      Object.keys(nouveauxCalculs).forEach(key => {
        if (nouveauxCalculs[key] !== null) {
          onDataChange(key, nouveauxCalculs[key]);
        }
      });
    }
  };

  // Fonction pour calculer la surface BWAT (table 16)
  const calculateBWATSurfaceLocal = () => {
    if (tableData?.id !== 'C1T16') return;
    
    const longueur = parseFloat(data['C1T16E01']) || 0;
    const largeur = parseFloat(data['C1T16E02']) || 0;
    
    const surface = calculateBWATSurface(longueur, largeur);
    
    if (surface && data['C1T16E03'] !== surface) {
      onDataChange('C1T16E03', surface);
    }
  };

  // Auto-calcul des indices IPSCB quand les valeurs changent
  useEffect(() => {
    calculateIPSCB();
  }, [data['C1T15D01'], data['C1T15D03'], data['C1T15D04'], data['C1T15D05'], data['C1T15D06']]);

  // Auto-calcul de la surface BWAT quand les valeurs changent
  useEffect(() => {
    calculateBWATSurfaceLocal();
  }, [data['C1T16E01'], data['C1T16E02']]);

  // Forcer le re-rendu du questionnaire d'Édimbourg quand la première question change
  useEffect(() => {
    if (tableData?.id === 'C1T15') {
      setQuestionnaireKey(prev => prev + 1);
    }
  }, [data['C1T15E01']]);

  // Forcer le re-rendu des champs conditionnels de la table 20 quand la sélection change
  useEffect(() => {
    if (tableData?.id === 'C1T20') {
      // Le re-rendu se fera automatiquement via shouldShowElement qui vérifie data['C1T20E01']
    }
  }, [data['C1T20E01']]);

  // Fonction pour afficher l'alerte spécialisée
  const showSpecializedAlert = (condition) => {
    showSpecializedAlertUtil(condition, setSpecializedCondition, setSpecializedAlertVisible);
  };

  // Gestion des changements de données avec calculs automatiques
  const handleDataChange = (fieldId, value) => {
    // Logique spéciale pour la table 11 (Histoire de la plaie)
    if (tableData?.id === 'C1T11') {
      // Gestion des alertes spécialisées (seulement lors de l'ajout, pas de la suppression)
      if (fieldId === 'C1T11E06' && Array.isArray(value)) {
        // Récupérer la valeur précédente pour détecter ce qui vient d'être ajouté
        const previousValue = data[fieldId] || [];
        const newlyAdded = value.filter(item => !previousValue.includes(item));
        
        if (newlyAdded.length > 0) {
          // Trouver l'élément pour accéder aux options
          const etiologyElement = tableData.elements?.find(elem => elem.id === 'C1T11E06');
          const newOptions = etiologyElement?.options?.filter(opt => newlyAdded.includes(opt.value)) || [];
          
          // Afficher les alertes seulement pour les nouvelles sélections
          newOptions.forEach(option => {
            if (option.shows_specialized_alert) {
              if (option.value === 'lymphedeme') {
                showSpecializedAlert('lymphedema');
              } else if (option.value === 'neoplasie') {
                showSpecializedAlert('neoplasia');
              }
            }
          });
        }
      }
    }
    
    // Calcul automatique de l'IMC pour la table 04
    if (tableData?.id === 'C1T04') {
      // Si c'est un changement de taille ou poids, recalculer l'IMC
      if (fieldId === 'C1T04E01' || fieldId === 'C1T04E02') {
        const newData = { ...data, [fieldId]: value };
        const height = fieldId === 'C1T04E01' ? value : newData.C1T04E01;
        const weight = fieldId === 'C1T04E02' ? value : newData.C1T04E02;
        
        // Récupérer les unités sélectionnées (pour l'instant on utilise les défauts)
        // TODO: Récupérer les unités réelles sélectionnées par l'utilisateur
        const heightUnit = 'm'; // Par défaut mètres, à améliorer plus tard
        const weightUnit = 'kg'; // Par défaut kg, à améliorer plus tard
        
        if (height && weight) {
          const bmi = calculateBMI(height, weight, heightUnit, weightUnit);
          if (bmi !== null) {
            // Mettre à jour l'IMC calculé après le changement de la valeur principale
            setTimeout(() => {
              onDataChange('C1T04E03', bmi);
            }, 0);
          }
        }
      }
    }
    
    // Appeler le callback parent pour mettre à jour les données
    onDataChange(fieldId, value);
  };

  return {
    handleDataChange,
  };
};

export default useTableEffects;

