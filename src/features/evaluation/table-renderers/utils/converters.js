/**
 * converters.js - Fonctions de conversion de structures
 * 
 * Contient les fonctions pour convertir différentes structures de données
 * (questions, sub_blocks, additional_fields, etc.) en éléments standardisés.
 * 
 * ÉTAPE 6 - Fonctions extraites depuis ContentDetector.jsx
 */

/**
 * Convertit les questions en éléments (pour table 13)
 * @param {object} tableData - Données de la table
 * @returns {array} - Tableau d'éléments convertis
 */
export const convertQuestionsToElements = (tableData) => {
  if (!tableData.questions || !Array.isArray(tableData.questions)) {
    return [];
  }
  
  const convertedElements = tableData.questions.map((question) => {
    // Convertir la structure question en structure element
    return {
      id: question.element_id || question.qid,
      qid: question.qid,
      type: question.type,
      label: question.label,
      description: question.help || question.ui?.help,
      required: question.required || false,
      validation: question.validation || {},
      ui: question.ui || {},
      // Propriétés additionnelles pour la compatibilité
      element_id: question.element_id,
      multiline: question.validation?.multiline || question.type === 'text',
      maxLength: question.validation?.max_length || 1000,
      placeholder: question.ui?.placeholder || '',
      rows: question.ui?.rows || 4
    };
  });
  
  return convertedElements;
};

/**
 * Convertit les additional_fields en éléments (pour table 14)
 * @param {object} tableData - Données de la table
 * @returns {array} - Tableau d'éléments convertis
 */
export const convertAdditionalFieldsToElements = (tableData) => {
  if (!tableData.additional_fields || typeof tableData.additional_fields !== 'object') {
    return [];
  }
  
  const convertedElements = Object.values(tableData.additional_fields).map((field) => {
    return {
      id: field.id,
      type: field.type,
      label: field.label,
      description: field.description,
      required: field.required || false,
      validation: field.validation || {},
      ui: field.ui || {},
      help: field.ui?.help
    };
  });
  
  return convertedElements;
};

/**
 * Convertit les champs de la table 20 en éléments
 * @param {object} tableData - Données de la table
 * @returns {array} - Tableau d'éléments convertis
 */
export const convertTable20FieldsToElements = (tableData) => {
  const convertedElements = [];
  
  // Convertir les champs complémentaires
  if (tableData.complementary_fields && typeof tableData.complementary_fields === 'object') {
    Object.values(tableData.complementary_fields).forEach((field) => {
      convertedElements.push({
        id: field.id,
        type: field.type,
        label: field.label,
        description: field.description,
        required: field.required || false,
        validation: field.validation || {},
        ui: field.ui || {},
        help: field.ui?.help,
        conditional_display: field.conditional_display
      });
    });
  }
  
  // Convertir les trajets additionnels
  if (tableData.additional_tracts && typeof tableData.additional_tracts === 'object') {
    Object.values(tableData.additional_tracts).forEach((tract) => {
      // Pour les trajets de type mixed (fistule), créer un élément pour chaque champ
      if (tract.type === 'mixed' && tract.fields) {
        tract.fields.forEach((field) => {
          convertedElements.push({
            id: field.id,
            type: field.type,
            label: `${tract.label} - ${field.label}`,
            description: field.description || tract.description,
            required: field.required || false,
            validation: field.validation || {},
            ui: field.ui || {},
            help: field.ui?.help,
            conditional_display: tract.conditional_display
          });
        });
      } else {
        // Pour les trajets simples (sinus, tunnel)
        convertedElements.push({
          id: tract.id,
          type: tract.type,
          label: tract.label,
          description: tract.description,
          required: tract.required || false,
          validation: tract.validation || {},
          ui: tract.ui || {},
          help: tract.ui?.help,
          conditional_display: tract.conditional_display
        });
      }
    });
  }
  
  return convertedElements;
};

/**
 * Convertit les sub_blocks de la table 22 en éléments
 * @param {object} tableData - Données de la table
 * @returns {array} - Tableau d'éléments convertis
 */
export const convertTable22SubBlocksToElements = (tableData) => {
  const convertedElements = [];
  
  if (tableData.sub_blocks && typeof tableData.sub_blocks === 'object') {
    Object.values(tableData.sub_blocks).forEach((subBlock) => {
      // Pour le sous-bloc "quality", convertir les éléments boolean en un seul single_choice
      if (subBlock.id === 'C1T22Q' && subBlock.type === 'single_choice' && subBlock.elements && Array.isArray(subBlock.elements)) {
        // Qualité : un seul single_choice, labels uniquement (pas de description affichée)
        const options = subBlock.elements.map((element) => ({
          id: element.id,
          label: element.label,
          description: '',
          score: element.score
        }));
        
        convertedElements.push({
          id: 'C1T22E01',
          type: 'single_choice',
          label: subBlock.title || 'Qualité du tissu nécrotique',
          description: subBlock.description,
          options: options,
          required: subBlock.required || true,
          ui: {
            component: 'RadioGroup'
          }
        });
      } else if (subBlock.id === 'C1T22Q2' && subBlock.type === 'single_choice' && subBlock.elements && Array.isArray(subBlock.elements)) {
        // Quantité : un seul single_choice avec options (score 1-5), pas de calcul
        const options = subBlock.elements.map((element) => ({
          id: element.id,
          label: element.label,
          description: element.description || '',
          score: element.score
        }));
        
        convertedElements.push({
          id: 'C1T22E06',
          type: 'single_choice',
          label: subBlock.title || 'Quantité',
          description: subBlock.description,
          options: options,
          required: subBlock.required !== false,
          ui: {
            component: 'RadioGroup'
          }
        });
      } else if (subBlock.elements && Array.isArray(subBlock.elements)) {
        subBlock.elements.forEach((element) => {
          convertedElements.push({
            ...element,
            subBlockId: subBlock.id,
            subBlockTitle: subBlock.title,
            subBlockDescription: subBlock.description
          });
        });
      }
    });
  }
  
  return convertedElements;
};

/**
 * Convertit les sub_blocks de la table 25 en éléments
 * @param {object} tableData - Données de la table
 * @returns {array} - Tableau d'éléments convertis
 */
export const convertTable25SubBlocksToElements = (tableData) => {
  const convertedElements = [];
  
  if (tableData.sub_blocks && typeof tableData.sub_blocks === 'object') {
    Object.values(tableData.sub_blocks).forEach((subBlock) => {
      // Pour les deux sous-blocs (quality et quantity), convertir les éléments boolean en un seul single_choice
      if (subBlock.type === 'single_choice' && subBlock.elements && Array.isArray(subBlock.elements)) {
        const options = subBlock.elements.map((element) => ({
          id: element.id,
          label: element.label,
          description: element.description || '',
          score: element.score
        }));
        
        // Déterminer l'ID principal selon le sous-bloc
        let mainElementId;
        if (subBlock.id === 'C1T25Q1') {
          mainElementId = 'C1T25E01'; // Qualité
        } else if (subBlock.id === 'C1T25Q2') {
          mainElementId = 'C1T25E06'; // Quantité
        } else {
          mainElementId = subBlock.elements[0]?.id || 'C1T25E01';
        }
        
        convertedElements.push({
          id: mainElementId,
          type: 'single_choice',
          label: subBlock.title || subBlock.id,
          description: subBlock.description,
          options: options,
          required: subBlock.required || true,
          ui: {
            component: 'RadioGroup'
          }
        });
      }
    });
  }
  
  return convertedElements;
};

