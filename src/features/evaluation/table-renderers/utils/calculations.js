/**
 * calculations.js - Fonctions de calcul pour les tables
 * 
 * Contient toutes les fonctions de calcul pures (sans dépendances React)
 * utilisées dans les différentes tables.
 * 
 * TODO: Extraire les fonctions depuis ContentDetector.jsx
 */

/**
 * Calcule l'âge de la plaie en jours
 * @param {string} appearanceDate - Date d'apparition (format YYYY-MM-DD)
 * @returns {object|null} - { days, isRecent, isChronic } ou null
 */
export const calculateWoundAge = (appearanceDate) => {
  if (!appearanceDate) return null;
  
  const today = new Date();
  const woundDate = new Date(appearanceDate);
  const diffTime = Math.abs(today - woundDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    days: diffDays,
    isRecent: diffDays <= 28, // < 4 semaines
    isChronic: diffDays > 28  // ≥ 4 semaines
  };
};

/**
 * Interprète un résultat IPSCB (Indice de Pression Systolique Cheville-Bras)
 * @param {string|number} valeur - Valeur IPSCB
 * @returns {object|null} - { niveau, description, color } ou null
 */
export const interpretIPSCB = (valeur) => {
  if (!valeur) return null;
  
  const num = parseFloat(valeur);
  if (num > 1.40) return {
    niveau: 'Indéterminé',
    description: 'Artères non compressibles',
    color: '#9E9E9E'
  };
  if (num >= 1.0) return {
    niveau: 'Normal',
    description: 'Valeur normale',
    color: '#4CAF50'
  };
  if (num >= 0.9) return {
    niveau: 'Limite',
    description: 'Valeur limite',
    color: '#FF9800'
  };
  if (num >= 0.7) return {
    niveau: 'Anormal, atteinte légère',
    description: 'Atteinte artérielle légère',
    color: '#FFC107'
  };
  if (num >= 0.4) return {
    niveau: 'Anormal, atteinte modérée',
    description: 'Atteinte artérielle modérée',
    color: '#FF5722'
  };
  return {
    niveau: 'Anormal, atteinte sévère',
    description: 'Atteinte artérielle sévère',
    color: '#D32F2F'
  };
};

/**
 * Calcule la surface de la plaie BWAT
 * @param {number} longueur - Longueur en cm
 * @param {number} largeur - Largeur en cm
 * @returns {string|null} - Surface calculée (format "X.X") ou null
 */
export const calculateBWATSurface = (longueur, largeur) => {
  if (!longueur || !largeur || longueur <= 0 || largeur <= 0) return null;
  return (longueur * largeur).toFixed(1);
};

/**
 * Classe la taille de la plaie selon l'échelle BWAT
 * @param {string|number} surface - Surface en cm²
 * @returns {object|null} - { score, label, description, color } ou null
 */
export const classifyBWATSize = (surface) => {
  const num = parseFloat(surface) || 0;
  
  if (num === 0) return {
    score: 0,
    label: 'Plaie guérie',
    description: 'Plaie complètement guérie',
    color: '#4CAF50'
  };
  if (num < 4) return {
    score: 1,
    label: '< 4 cm²',
    description: 'Surface inférieure à 4 cm²',
    color: '#8BC34A'
  };
  if (num <= 16) return {
    score: 2,
    label: '4 à 16 cm²',
    description: 'Surface entre 4 et 16 cm²',
    color: '#FFC107'
  };
  if (num <= 36) return {
    score: 3,
    label: '16,1 à 36 cm²',
    description: 'Surface entre 16,1 et 36 cm²',
    color: '#FF9800'
  };
  if (num <= 80) return {
    score: 4,
    label: '36,1 à 80 cm²',
    description: 'Surface entre 36,1 et 80 cm²',
    color: '#F44336'
  };
  return {
    score: 5,
    label: '> 80 cm²',
    description: 'Surface supérieure à 80 cm²',
    color: '#9C27B0'
  };
};

/**
 * Calcule l'IMC (Indice de Masse Corporelle)
 * @param {number} height - Taille en mètres
 * @param {number} weight - Poids en kg
 * @param {string} heightUnit - Unité de taille ('m' ou 'ft')
 * @param {string} weightUnit - Unité de poids ('kg' ou 'lb')
 * @returns {number|null} - IMC calculé ou null
 */
export const calculateBMI = (height, weight, heightUnit = 'm', weightUnit = 'kg') => {
  if (!height || !weight || height <= 0 || weight <= 0) return null;

  let heightInMeters = height;
  let weightInKg = weight;

  // Conversion des unités si nécessaire
  if (heightUnit === 'ft') {
    heightInMeters = height * 0.3048; // 1 pied = 0.3048 mètres
  }

  if (weightUnit === 'lb') {
    weightInKg = weight * 0.453592; // 1 livre = 0.453592 kg
  }

  // Calcul de l'IMC: poids (kg) / taille (m)²
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10; // Arrondir à 1 décimale
};

/**
 * Détermine la catégorie IMC
 * @param {number} bmi - Valeur IMC
 * @returns {string|null} - Catégorie IMC ou null
 */
export const getBMICategory = (bmi) => {
  if (bmi === null || isNaN(bmi)) return null;
  
  if (bmi < 18.5) return 'underweight';
  if (bmi >= 18.5 && bmi <= 24.9) return 'normal';
  if (bmi >= 25.0 && bmi <= 29.9) return 'overweight';
  if (bmi >= 30.0 && bmi <= 34.9) return 'obesity_class1';
  if (bmi >= 35.0 && bmi <= 39.9) return 'obesity_class2';
  if (bmi >= 40.0) return 'obesity_class3';
  
  return null;
};

/**
 * Évalue une condition BMI définie dans le JSON
 * @param {number} bmiValue - Valeur IMC
 * @param {object} condition - Condition à évaluer
 * @returns {boolean} - true si la condition est satisfaite
 */
export const evaluateBMICondition = (bmiValue, condition) => {
  if (bmiValue === null || bmiValue === undefined || isNaN(bmiValue)) {
    return false;
  }

  // Fonction helper pour évaluer une condition simple
  const evaluateSimpleCondition = (cond) => {
    if (cond.operator && cond.value !== undefined) {
      switch (cond.operator) {
        case 'lt':
          return bmiValue < cond.value;
        case 'lte':
          return bmiValue <= cond.value;
        case 'gt':
          return bmiValue > cond.value;
        case 'gte':
          return bmiValue >= cond.value;
        case 'eq':
          return bmiValue === cond.value;
        default:
          return false;
      }
    }
    return false;
  };

  // Gérer les conditions avec AND
  if (condition.and) {
    const firstCondition = condition.comparison || condition;
    const secondCondition = condition.and;
    
    let firstResult = false;
    if (firstCondition.operator && firstCondition.value !== undefined) {
      firstResult = evaluateSimpleCondition(firstCondition);
    } else if (firstCondition.comparison) {
      firstResult = evaluateSimpleCondition(firstCondition.comparison);
    }
    
    let secondResult = false;
    if (secondCondition.operator && secondCondition.value !== undefined) {
      secondResult = evaluateSimpleCondition(secondCondition);
    } else if (secondCondition.var === 'C1T04E03') {
      secondResult = evaluateSimpleCondition(secondCondition);
    }
    
    return firstResult && secondResult;
  }

  // Gérer les conditions simples avec var
  if (condition.comparison && condition.comparison.var === 'C1T04E03') {
    return evaluateSimpleCondition(condition.comparison);
  }

  // Gérer les conditions directes
  if (condition.operator) {
    return evaluateSimpleCondition(condition);
  }

  return false;
};

/**
 * Calcule les valeurs IPSCB (Indice de Pression Systolique Cheville-Bras)
 * Version pure qui retourne les valeurs calculées sans side effects
 * @param {object} pressures - Objet avec les pressions
 * @param {number} pressures.pasBrasMax - Pression artérielle systolique la plus élevée des deux bras
 * @param {number} pressures.tibialePosterieureDroite - PAS tibiale postérieure droite
 * @param {number} pressures.pedieuseDroite - PAS pédieuse droite
 * @param {number} pressures.tibialePosterieureGauche - PAS tibiale postérieure gauche
 * @param {number} pressures.pedieuseGauche - PAS pédieuse gauche
 * @returns {object|null} - Objet avec les 4 indices IPSCB calculés ou null
 */
export const calculateIPSCBValues = (pressures) => {
  const {
    pasBrasMax = 0,
    tibialePosterieureDroite = 0,
    pedieuseDroite = 0,
    tibialePosterieureGauche = 0,
    pedieuseGauche = 0
  } = pressures;

  if (pasBrasMax === 0) return null; // Pas de calcul si aucun bras

  // Calculer les 4 indices IPSCB
  const calculerIPSCB = (pressionPied) => {
    if (pressionPied === 0) return null;
    return (pressionPied / pasBrasMax).toFixed(2);
  };

  return {
    'C1T15D07': calculerIPSCB(tibialePosterieureDroite),
    'C1T15D08': calculerIPSCB(pedieuseDroite),
    'C1T15D09': calculerIPSCB(tibialePosterieureGauche),
    'C1T15D10': calculerIPSCB(pedieuseGauche)
  };
};

/** IDs des tables BWAT qui contribuent au score total (ordre logique) */
const BWAT_TABLE_IDS = ['C1T16', 'C1T18', 'C1T19', 'C1T20', 'C1T22', 'C1T23', 'C1T24', 'C1T25', 'C1T26'];

/**
 * Interprète le score total BWAT selon le continuum du statut de la plaie
 * @param {number} total - Score total BWAT
 * @returns {{ key: string, label: string }}
 */
export const getBWATContinuumStatus = (total) => {
  const t = Number(total) || 0;
  if (t >= 1 && t < 5) return { key: 'sante_tissulaire', label: 'Santé tissulaire' };
  if (t >= 5 && t < 15) return { key: 'guerison', label: 'Guérison' };
  if (t >= 15 && t < 30) return { key: 'regenerescence', label: 'Régénérescence de la plaie' };
  if (t >= 30) return { key: 'degenerescence', label: 'Dégénérescence de la plaie' };
  return { key: 'non_calcule', label: 'Non calculé' };
};const getScoreFromOption = (schema, elementId, selectedOptionId) => {
  if (!schema || selectedOptionId == null || selectedOptionId === '') return null;
  const findInElements = (elements) => {
    if (!Array.isArray(elements)) return null;
    for (const el of elements) {
      if (el.id === elementId && Array.isArray(el.options)) {
        const opt = el.options.find((o) => (o.id || o.value) === selectedOptionId);
        return opt != null && typeof opt.score === 'number' ? opt.score : null;
      }
    }
    return null;
  };
  let s = findInElements(schema.elements);
  if (s != null) return s;
  if (schema.sub_blocks && typeof schema.sub_blocks === 'object') {
    for (const block of Object.values(schema.sub_blocks)) {
      if (Array.isArray(block.elements)) {
        const el = block.elements.find((e) => e.id === selectedOptionId);
        if (el && typeof el.score === 'number') return el.score;
      }
    }
  }
  return null;
};

/**
 * Calcule le score total BWAT à partir des données d'évaluation et des schémas des tables
 * @param {Object} evaluationData - Données par table (evaluationData[tableId])
 * @param {Object} tableDataLoader - Service pour charger les tables (loadTableData)
 * @returns {Promise<{ total: number, statusKey: string, statusLabel: string }>}
 */
export const calculateBWATTotal = async (evaluationData, tableDataLoader) => {
  let total = 0;

  for (const tableId of BWAT_TABLE_IDS) {
    const tableData = evaluationData[tableId];
    if (!tableData) continue;

    try {
      const schema = await tableDataLoader.loadTableData(tableId);

      if (tableId === 'C1T16') {
        const surface = parseFloat(tableData.C1T16E03) || 0;
        if (tableData.C1T16E01 != null && tableData.C1T16E02 != null && !surface) {
          const l = parseFloat(tableData.C1T16E01) || 0;
          const w = parseFloat(tableData.C1T16E02) || 0;
          const classified = classifyBWATSize(l * w);
          if (classified) total += classified.score;
        } else {
          const classified = classifyBWATSize(surface);
          if (classified) total += classified.score;
        }
        continue;
      }

      if (tableId === 'C1T22') {
        const qualityScore = getScoreFromOption(schema, 'C1T22E01', tableData.C1T22E01);
        if (qualityScore != null) total += qualityScore;
        const quantityScore = getScoreFromOption(schema, 'C1T22E06', tableData.C1T22E06);
        if (quantityScore != null) total += quantityScore;
        continue;
      }

      if (tableId === 'C1T25') {
        const qualityScore = getScoreFromOption(schema, 'C1T25E01', tableData.C1T25E01);
        if (qualityScore != null) total += qualityScore;
        const quantityScore = getScoreFromOption(schema, 'C1T25E06', tableData.C1T25E06);
        if (quantityScore != null) total += quantityScore;
        continue;
      }

      if (tableId === 'C1T26') {
        const scoreColoration = getScoreFromOption(schema, 'C1T26_COLORATION', tableData.C1T26_COLORATION);
        if (scoreColoration != null) total += scoreColoration;
        const scoreEdema = getScoreFromOption(schema, 'C1T26_EDEMA', tableData.C1T26_EDEMA);
        if (scoreEdema != null) total += scoreEdema;
        const scoreInduration = getScoreFromOption(schema, 'C1T26_INDURATION', tableData.C1T26_INDURATION);
        if (scoreInduration != null) total += scoreInduration;
        continue;
      }

      const singleChoiceIds = {
        C1T18: 'C1T18E01',
        C1T19: 'C1T19E01',
        C1T20: 'C1T20E01',
        C1T23: 'C1T23E01',
        C1T24: 'C1T24E01',
      };
      const fieldId = singleChoiceIds[tableId];
      if (fieldId) {
        const score = getScoreFromOption(schema, fieldId, tableData[fieldId]);
        if (score != null) total += score;
      }
    } catch (err) {
      if (__DEV__) console.warn(`[calculateBWATTotal] ${tableId}`, err);
    }
  }

  const status = getBWATContinuumStatus(total);
  return {
    total,
    statusKey: status.key,
    statusLabel: status.label,
  };
};
