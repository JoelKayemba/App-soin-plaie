import { useState, useEffect } from 'react';

/**
 * Hook pour gérer les données d'une table d'évaluation
 * @param {string} tableId - ID de la table (ex: "C1T01")
 * @param {Object} initialData - Données initiales de la table
 * @returns {Object} - État et fonctions de gestion des données
 */
const useTableData = (tableId, initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validation des données
  const validateData = (tableData, elements = []) => {
    const newErrors = {};
    let valid = true;

    // Validation basée sur les règles des éléments
    elements.forEach(element => {
      const value = tableData[element.id];
      const fieldErrors = validateField(element.id, value, {
        required: element.required,
        type: element.type,
        minLength: element.min_length,
        maxLength: element.max_length,
        min: element.validation?.min,
        max: element.validation?.max,
        minSelections: element.minSelections,
        maxSelections: element.maxSelections,
        maxPhotos: element.maxPhotos
      });

      if (fieldErrors.length > 0) {
        newErrors[element.id] = fieldErrors[0];
        valid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(valid);
    return valid;
  };

  // Mise à jour des données
  const updateData = (fieldId, value) => {
    const newData = {
      ...data,
      [fieldId]: value
    };
    
    setData(newData);
    validateData(newData);
    
    return newData;
  };

  // Mise à jour multiple
  const updateMultipleData = (updates) => {
    const newData = {
      ...data,
      ...updates
    };
    
    setData(newData);
    validateData(newData);
    
    return newData;
  };

  // Réinitialisation
  const resetData = () => {
    setData(initialData);
    setErrors({});
    setIsValid(false);
  };

  // Sauvegarde (à implémenter avec AsyncStorage plus tard)
  const saveData = async () => {
    try {
      // TODO: Implémenter la sauvegarde avec AsyncStorage
      return true;
    } catch (error) {
      return false;
    }
  };

  // Chargement (à implémenter avec AsyncStorage plus tard)
  const loadData = async () => {
    try {
      // TODO: Implémenter le chargement avec AsyncStorage
      return null;
    } catch (error) {
      return null;
    }
  };

  // Validation d'un champ spécifique
  const validateField = (fieldId, value, rules = {}) => {
    const fieldErrors = [];

    // Validation requise
    if (rules.required && (!value || value === '')) {
      fieldErrors.push('Ce champ est requis');
    }

    // Validation de longueur minimale
    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(`Minimum ${rules.minLength} caractères requis`);
    }

    // Validation de longueur maximale
    if (rules.maxLength && value && value.length > rules.maxLength) {
      fieldErrors.push(`Maximum ${rules.maxLength} caractères autorisés`);
    }

    // Validation numérique
    if (rules.type === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        fieldErrors.push('Valeur numérique invalide');
      } else {
        if (rules.min !== undefined && numValue < rules.min) {
          fieldErrors.push(`Valeur minimale: ${rules.min}`);
        }
        if (rules.max !== undefined && numValue > rules.max) {
          fieldErrors.push(`Valeur maximale: ${rules.max}`);
        }
      }
    }

    // Validation de sélection multiple
    if (rules.type === 'multiple_choice') {
      if (rules.minSelections && (!value || value.length < rules.minSelections)) {
        fieldErrors.push(`Minimum ${rules.minSelections} sélection(s) requise(s)`);
      }
      if (rules.maxSelections && value && value.length > rules.maxSelections) {
        fieldErrors.push(`Maximum ${rules.maxSelections} sélection(s) autorisée(s)`);
      }
    }

    // Validation de sélection multiple avec texte
    if (rules.type === 'multiple_choice_with_text') {
      const selectedCount = value ? Object.keys(value).length : 0;
      
      if (rules.minSelections && selectedCount < rules.minSelections) {
        fieldErrors.push(`Minimum ${rules.minSelections} sélection(s) requise(s)`);
      }
      if (rules.maxSelections && selectedCount > rules.maxSelections) {
        fieldErrors.push(`Maximum ${rules.maxSelections} sélection(s) autorisée(s)`);
      }
      
      // Validation du texte pour chaque sélection
      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([optionId, optionData]) => {
          if (optionData.selected && optionData.text && optionData.text.trim() === '') {
            fieldErrors.push(`Le texte est requis pour la sélection "${optionId}"`);
          }
        });
      }
    }

    // Validation des photos
    if (rules.type === 'photo') {
      if (rules.required && (!value || value.length === 0)) {
        fieldErrors.push('Au moins une photo est requise');
      }
      if (value && value.length > (rules.maxPhotos || 3)) {
        fieldErrors.push(`Maximum ${rules.maxPhotos || 3} photo(s) autorisée(s)`);
      }
    }

    // Validation des échelles
    if (rules.type === 'scale') {
      if (rules.required && !value) {
        fieldErrors.push('Une valeur d\'échelle est requise');
      }
    }

    // Validation des dates
    if (rules.type === 'date') {
      if (rules.required && (!value || value === '')) {
        fieldErrors.push('Une date est requise');
      }
      
      // Validation du format de date si une valeur est fournie
      if (value && value !== '') {
        // Vérifier le format AAAA-MM-JJ
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          fieldErrors.push('Format de date invalide (AAAA-MM-JJ requis)');
        } else {
          // Vérifier que c'est une date valide
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            fieldErrors.push('Date invalide');
          }
        }
      }
    }

    // Validation des booléens
    if (rules.type === 'boolean') {
      if (rules.required && (value === null || value === undefined)) {
        fieldErrors.push('Une réponse est requise');
      }
    }

    return fieldErrors;
  };

  // Mise à jour avec validation
  const updateWithValidation = (fieldId, value, rules = {}) => {
    const fieldErrors = validateField(fieldId, value, rules);
    
    const newErrors = {
      ...errors,
      [fieldId]: fieldErrors.length > 0 ? fieldErrors[0] : null
    };

    // Supprimer les erreurs vides
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);

    const newData = updateData(fieldId, value);
    const isValid = Object.keys(newErrors).length === 0;
    setIsValid(isValid);

    return {
      data: newData,
      errors: newErrors,
      isValid
    };
  };

  return {
    // État
    data,
    errors,
    isValid,
    
    // Actions
    updateData,
    updateMultipleData,
    updateWithValidation,
    resetData,
    saveData,
    loadData,
    validateData,
    validateField,
  };
};

export default useTableData;
