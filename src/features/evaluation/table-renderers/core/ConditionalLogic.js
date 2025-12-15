/**
 * ConditionalLogic - Logique conditionnelle pour l'affichage des éléments
 * 
 * Fournit des fonctions pour déterminer si un élément doit être affiché
 * selon les conditions définies dans le schéma de la table.
 */

/**
 * Vérifie si un élément conditionnel doit être affiché
 * @param {object} element - L'élément à vérifier
 * @param {object} data - Les données actuelles de la table
 * @param {string} tableId - ID de la table (pour logique spéciale)
 * @returns {boolean} - true si l'élément doit être affiché
 */
export const shouldShowElement = (element, data, tableId = null) => {
  // Si l'élément n'a pas de condition, l'afficher
  if (!element.conditional && !element.conditional_display) return true;

  // Gestion des conditions standard (conditional)
  if (element.conditional) {
    const { depends_on, value } = element.conditional;
    
    // Vérifier si la dépendance est satisfaite
    if (depends_on && value !== undefined) {
      const dependentValue = data[depends_on];
      
      // Pour les sélections multiples (arrays)
      if (Array.isArray(dependentValue)) {
        return dependentValue.includes(value);
      }
      
      // Pour les valeurs booléennes, comparer strictement
      if (typeof value === 'boolean') {
        return dependentValue === value;
      }
      
      // Pour les sélections simples
      return dependentValue === value;
    }
  }

  // Gestion des conditions conditional_display (table 20)
  if (element.conditional_display && element.conditional_display.condition) {
    const { anyOf } = element.conditional_display.condition;
    
    if (anyOf && Array.isArray(anyOf)) {
      // Pour la table 20, vérifier si la valeur sélectionnée correspond
      const selectedValue = data['C1T20E01'];
      return anyOf.includes(selectedValue);
    }
  }

  // Pour la table 22, ne pas filtrer les éléments de qualité
  if (tableId === 'C1T22' && element.id === 'C1T22E01') {
    return true;
  }

  return true;
};

/**
 * Vérifie si une sous-question doit être affichée
 * @param {object} subquestion - La sous-question à vérifier
 * @param {object} data - Les données actuelles de la table
 * @returns {boolean} - true si la sous-question doit être affichée
 */
export const shouldShowSubquestion = (subquestion, data) => {
  if (!subquestion.condition) return true;
  
  const { anyOf } = subquestion.condition;
  if (!anyOf || !Array.isArray(anyOf)) return true;
  
  // Vérifier si au moins un des éléments listés est sélectionné
  return anyOf.some(elementId => {
    const value = data[elementId];
    return value === true || value === "true" || (Array.isArray(value) && value.length > 0);
  });
};

export default {
  shouldShowElement,
  shouldShowSubquestion,
};

