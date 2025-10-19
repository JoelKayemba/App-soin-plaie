import { useState, useCallback } from 'react';

/**
 * Hook pour gérer la logique de routage et redirection dans l'évaluation
 */
const useEvaluationRouting = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectReason, setRedirectReason] = useState(null);

  /**
   * Calcule l'âge en jours à partir d'une date de naissance
   * @param {string} birthDate - Date de naissance au format YYYY-MM-DD
   * @returns {number} Âge en jours
   */
  const calculateAgeInDays = useCallback((birthDate) => {
    if (!birthDate || birthDate.length !== 10) return null;
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      const diffTime = Math.abs(today - birth);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error('Erreur lors du calcul de l\'âge:', error);
      return null;
    }
  }, []);

  /**
   * Vérifie les conditions de redirection immédiate
   * @param {string} fieldId - ID du champ modifié
   * @param {any} value - Nouvelle valeur
   * @param {Object} element - Élément de la table avec ses règles
   * @returns {Object|null} Informations de redirection ou null
   */
  const checkImmediateRedirect = useCallback((fieldId, value, element) => {
    // Vérifier si c'est un champ de date de naissance
    if (fieldId === 'C1T01E01' && element?.routes) {
      const ageInDays = calculateAgeInDays(value);
      
      if (ageInDays !== null) {
        // Chercher les routes immédiates
        const immediateRoutes = element.routes.filter(route => 
          route.phase === 'immediate' && route.condition
        );

        for (const route of immediateRoutes) {
          if (route.condition?.comparison) {
            const { var: variable, operator, value: threshold } = route.condition.comparison;
            
            // Vérifier la condition d'âge
            if (variable === 'age.days' && operator === 'lt' && ageInDays < threshold) {
              return {
                shouldRedirect: true,
                reason: route.note || 'Redirection immédiate requise',
                constat: element.constats?.[route.to],
                ageInDays
              };
            }
          }
        }
      }
    }

    return null;
  }, [calculateAgeInDays]);

  /**
   * Gère la redirection immédiate
   * @param {Object} redirectInfo - Informations de redirection
   */
  const handleImmediateRedirect = useCallback((redirectInfo) => {
    if (!redirectInfo) return;

    // Déclencher directement la redirection sans alerte native
    setShouldRedirect(true);
    setRedirectReason(redirectInfo);
  }, []);

  /**
   * Réinitialise l'état de redirection
   */
  const resetRedirect = useCallback(() => {
    setShouldRedirect(false);
    setRedirectReason(null);
  }, []);

  /**
   * Vérifie et gère automatiquement les redirections
   * @param {string} fieldId - ID du champ modifié
   * @param {any} value - Nouvelle valeur
   * @param {Object} element - Élément de la table
   */
  const processFieldChange = useCallback((fieldId, value, element) => {
    const redirectInfo = checkImmediateRedirect(fieldId, value, element);
    
    if (redirectInfo?.shouldRedirect) {
      // Délai pour permettre à l'interface de se mettre à jour
      setTimeout(() => {
        handleImmediateRedirect(redirectInfo);
      }, 100);
    }
  }, [checkImmediateRedirect, handleImmediateRedirect]);

  return {
    shouldRedirect,
    redirectReason,
    processFieldChange,
    resetRedirect,
    calculateAgeInDays
  };
};

export default useEvaluationRouting;
