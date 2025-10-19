/**
 * Utilitaire pour charger les fichiers JSON
 */

// Import des données JSON (React Native ne supporte pas les imports dynamiques)
import table01 from '../data/evaluations/columns/col1/table_01_basic_data.json';
import table02 from '../data/evaluations/columns/col1/table_02_allergies.json';
import table03 from '../data/evaluations/columns/col1/table_03_health_conditions.json';
import table04 from '../data/evaluations/columns/col1/table_04_weight_bmi.json';
import table05 from '../data/evaluations/columns/col1/table_05_nutrition.json';
import table06 from '../data/evaluations/columns/col1/table_06_risk_factors.json';
import table07 from '../data/evaluations/columns/col1/table_07_active_medication.json';
import table08 from '../data/evaluations/columns/col1/table_08_psychosocial_environment.json';
import table09 from '../data/evaluations/columns/col1/table_09_insurance.json';
import table10 from '../data/evaluations/columns/col1/table_10_care_level.json';
import table11 from '../data/evaluations/columns/col1/table_11_wound_history.json';
import table12 from '../data/evaluations/columns/col1/table_12_symptoms.json';
import table13 from '../data/evaluations/columns/col1/table_13_perceptions_goals.json';
import table14 from '../data/evaluations/columns/col1/table_14_wound_location.json';
import table15 from '../data/evaluations/columns/col1/table_15_vascular_assessment.json';
import table16 from '../data/evaluations/columns/col1/table_16_bwat_size.json';
import table17 from '../data/evaluations/columns/col1/table_17_wound_shape.json';
import table18 from '../data/evaluations/columns/col1/table_18_bwat_depth.json';
import table19 from '../data/evaluations/columns/col1/table_19_bwat_edges.json';
import table20 from '../data/evaluations/columns/col1/table_20_bwat_undermining.json';
import table21 from '../data/evaluations/columns/col1/table_21_wound_bed_composition.json';
import table22 from '../data/evaluations/columns/col1/table_22_bwat_necrotic_tissue.json';
import table23 from '../data/evaluations/columns/col1/table_23_bwat_granulation_tissue.json';
import table24 from '../data/evaluations/columns/col1/table_24_bwat_epithelialization.json';
import table25 from '../data/evaluations/columns/col1/table_25_bwat_exudate.json';
import table26 from '../data/evaluations/columns/col1/table_26_bwat_surrounding_skin.json';
import table27 from '../data/evaluations/columns/col1/table_27_infection_signs_symptoms.json';
import table28 from '../data/evaluations/columns/col1/table_28_laboratory_tests.json';
import table31 from '../data/evaluations/columns/col1/table_31_pressure_injury.json';
import table32 from '../data/evaluations/columns/col1/table_32_venous_ulcer.json';
import table33 from '../data/evaluations/columns/col1/table_33_lymphedema.json';
import table34 from '../data/evaluations/columns/col1/table_34_diabetic_foot.json';

// Mapping des tables
const tableMap = {
  'C1T01': table01,
  'C1T02': table02,
  'C1T03': table03,
  'C1T04': table04,
  'C1T05': table05,
  'C1T06': table06,
  'C1T07': table07,
  'C1T08': table08,
  'C1T09': table09,
  'C1T10': table10,
  'C1T11': table11,
  'C1T12': table12,
  'C1T13': table13,
  'C1T14': table14,
  'C1T15': table15,
  'C1T16': table16,
  'C1T17': table17,
  'C1T18': table18,
  'C1T19': table19,
  'C1T20': table20,
  'C1T21': table21,
  'C1T22': table22,
  'C1T23': table23,
  'C1T24': table24,
  'C1T25': table25,
  'C1T26': table26,
  'C1T27': table27,
  'C1T28': table28,
  'C1T31': table31,
  'C1T32': table32,
  'C1T33': table33,
  'C1T34': table34,
};

/**
 * Charger une table spécifique
 * @param {string} tableId - ID de la table
 * @returns {Promise<Object>} - Données de la table
 */
export const loadTable = async (tableId) => {
  try {
    const tableData = tableMap[tableId];
    if (!tableData) {
      throw new Error(`Table ${tableId} not found`);
    }
    
    // Normaliser l'ID de la table
    const normalizedData = {
      ...tableData,
      id: tableId // S'assurer que l'ID est correct
    };
    
    return normalizedData;
  } catch (error) {
    throw error;
  }
};

/**
 * Charger toutes les tables d'une colonne
 * @param {string} columnId - ID de la colonne
 * @returns {Promise<Array>} - Liste des tables
 */
export const loadColumnTables = async (columnId) => {
  try {
    const tableIds = Object.keys(tableMap);
    const tables = [];
    
    for (const tableId of tableIds) {
      const table = await loadTable(tableId);
      tables.push(table);
    }
    
    return tables;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtenir la liste des IDs de tables disponibles
 * @returns {Array} - Liste des IDs de tables
 */
export const getAvailableTableIds = () => {
  return Object.keys(tableMap);
};

/**
 * Vérifier si une table existe
 * @param {string} tableId - ID de la table
 * @returns {boolean} - True si la table existe
 */
export const tableExists = (tableId) => {
  return tableId in tableMap;
};

export default {
  loadTable,
  loadColumnTables,
  getAvailableTableIds,
  tableExists,
};
