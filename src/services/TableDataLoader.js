/**
 * Service pour charger les données des tables d'évaluation
 */
class TableDataLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.allTablesLoaded = false;
    this.allTablesCache = null;
  }

  /**
   * Charge les données d'une table spécifique
   * @param {string} tableId - ID de la table (ex: "C1T01")
   * @returns {Promise<Object>} Données de la table
   */
  async loadTableData(tableId) {
    if (tableId == null || typeof tableId !== 'string') {
      console.warn('TableDataLoader.loadTableData: tableId invalide', tableId);
      return this._getDefaultTableStructure(String(tableId ?? 'UNKNOWN'));
    }
    // Vérifier le cache
    if (this.cache.has(tableId)) {
      return this.cache.get(tableId);
    }

    // Vérifier si une requête est déjà en cours
    if (this.loadingPromises.has(tableId)) {
      return this.loadingPromises.get(tableId);
    }

    // Créer une nouvelle promesse de chargement
    const loadingPromise = this._loadTableFromFile(tableId);
    this.loadingPromises.set(tableId, loadingPromise);

    try {
      const data = await loadingPromise;
      this.cache.set(tableId, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors du chargement de la table ${tableId}:`, error);
      throw error;
    } finally {
      this.loadingPromises.delete(tableId);
    }
  }

  /**
   * Charge les données depuis le fichier JSON
   * @param {string} tableId - ID de la table
   * @returns {Promise<Object>} Données de la table
   * @private
   */
  async _loadTableFromFile(tableId) {
    try {
      // Import statique de tous les fichiers JSON
      const tableImports = await this._getAllTableImports();
      const fileName = this._getTableFileName(tableId);
      
      // Rechercher le bon fichier
      const tableData = tableImports[fileName];
      if (tableData) {
        return tableData;
      }
      
      throw new Error(`Fichier ${fileName} non trouvé`);
    } catch (error) {
      console.error(`Impossible de charger le fichier pour ${tableId}:`, error);
      
      // Retourner une structure de base en cas d'erreur
      return this._getDefaultTableStructure(tableId);
    }
  }

  /**
   * Import statique de tous les fichiers de tables
   * @returns {Promise<Object>} Objet contenant toutes les tables
   * @private
   */
  async _getAllTableImports() {
    // Si déjà chargé, retourner le cache
    if (this.allTablesLoaded && this.allTablesCache) {
      return this.allTablesCache;
    }

        try {
          // Chargement via require() (chemins statiques) pour que Metro bundle correctement les JSON
          console.log('Chargement des tables 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33 et 34...');

          const table01 = require('../data/evaluations/columns/col1/table_01_basic_data.json');
          const table02 = require('../data/evaluations/columns/col1/table_02_allergies.json');
          const table03 = require('../data/evaluations/columns/col1/table_03_health_conditions.json');
          const table04 = require('../data/evaluations/columns/col1/table_04_weight_bmi.json');
          const table05 = require('../data/evaluations/columns/col1/table_05_nutrition.json');
          const table06 = require('../data/evaluations/columns/col1/table_06_risk_factors.json');
          const table07 = require('../data/evaluations/columns/col1/table_07_active_medication.json');
          const table08 = require('../data/evaluations/columns/col1/table_08_psychosocial_environment.json');
          const table09 = require('../data/evaluations/columns/col1/table_09_insurance.json');
          const table10 = require('../data/evaluations/columns/col1/table_10_care_level.json');
          const table11 = require('../data/evaluations/columns/col1/table_11_wound_history.json');
          const table12 = require('../data/evaluations/columns/col1/table_12_symptoms.json');
          const table13 = require('../data/evaluations/columns/col1/table_13_perceptions_goals.json');
          const table14 = require('../data/evaluations/columns/col1/table_14_wound_location.json');
          const table15 = require('../data/evaluations/columns/col1/table_15_vascular_assessment.json');
          const table16 = require('../data/evaluations/columns/col1/table_16_bwat_size.json');
          const table17 = require('../data/evaluations/columns/col1/table_17_wound_shape.json');
          const table18 = require('../data/evaluations/columns/col1/table_18_bwat_depth.json');
          const table19 = require('../data/evaluations/columns/col1/table_19_bwat_edges.json');
          const table20 = require('../data/evaluations/columns/col1/table_20_bwat_undermining.json');
          const table21 = require('../data/evaluations/columns/col1/table_21_wound_bed_composition.json');
          const table22 = require('../data/evaluations/columns/col1/table_22_bwat_necrotic_tissue.json');
          const table23 = require('../data/evaluations/columns/col1/table_23_bwat_granulation_tissue.json');
          const table24 = require('../data/evaluations/columns/col1/table_24_bwat_epithelialization.json');
          const table25 = require('../data/evaluations/columns/col1/table_25_bwat_exudate.json');
          const table26 = require('../data/evaluations/columns/col1/table_26_bwat_surrounding_skin.json');
          const table27 = require('../data/evaluations/columns/col1/table_27_infection_signs_symptoms.json');
          const table28 = require('../data/evaluations/columns/col1/table_28_laboratory_tests.json');
          const table29 = require('../data/evaluations/columns/col1/table_29_braden_scale.json');
          const table30 = require('../data/evaluations/columns/col1/table_30_braden_q_scale.json');
          const table31 = require('../data/evaluations/columns/col1/table_31_pressure_injury.json');
          const table32 = require('../data/evaluations/columns/col1/table_32_venous_ulcer.json');
          const table33 = require('../data/evaluations/columns/col1/table_33_arterial_ulcer.json');
          const table34 = require('../data/evaluations/columns/col1/table_34_diabetic_foot.json');

          const col2Table01 = require('../data/evaluations/columns/col2_constats/table_01_cicatrisation_ralentie.json');
          const col2Table02 = require('../data/evaluations/columns/col2_constats/table_02_statut_plaie.json');
          const col2Table03 = require('../data/evaluations/columns/col2_constats/table_03_type_plaie.json');
          const col2Table04 = require('../data/evaluations/columns/col2_constats/table_04_stade_continuum_microbien.json');
          const col2Table05 = require('../data/evaluations/columns/col2_constats/table_05_vascularisation_plaie.json');

          // Créer l'objet avec les tables (require() renvoie l'objet JSON directement)
          this.allTablesCache = {
            'table_01_basic_data.json': table01,
            'table_02_allergies.json': table02,
            'table_03_health_conditions.json': table03,
            'table_04_weight_bmi.json': table04,
            'table_05_nutrition.json': table05,
            'table_06_risk_factors.json': table06,
            'table_07_active_medication.json': table07,
            'table_08_psychosocial_environment.json': table08,
            'table_09_insurance.json': table09,
            'table_10_care_level.json': table10,
            'table_11_wound_history.json': table11,
            'table_12_symptoms.json': table12,
            'table_13_perceptions_goals.json': table13,
            'table_14_wound_location.json': table14,
            'table_15_vascular_assessment.json': table15,
            'table_16_bwat_size.json': table16,
            'table_17_wound_shape.json': table17,
            'table_18_bwat_depth.json': table18,
            'table_19_bwat_edges.json': table19,
            'table_20_bwat_undermining.json': table20,
            'table_21_wound_bed_composition.json': table21,
            'table_22_bwat_necrotic_tissue.json': table22,
            'table_23_bwat_granulation_tissue.json': table23,
            'table_24_bwat_epithelialization.json': table24,
            'table_25_bwat_exudate.json': table25,
            'table_26_bwat_surrounding_skin.json': table26,
            'table_27_infection_signs_symptoms.json': table27,
            'table_28_laboratory_tests.json': table28,
            'table_29_braden_scale.json': table29,
            'table_30_braden_q_scale.json': table30,
            'table_31_pressure_injury.json': table31,
            'table_32_venous_ulcer.json': table32,
            'table_33_arterial_ulcer.json': table33,
            'table_34_diabetic_foot.json': table34,
            'table_01_cicatrisation_ralentie.json': col2Table01,
            'table_02_statut_plaie.json': col2Table02,
            'table_03_type_plaie.json': col2Table03,
            'table_04_stade_continuum_microbien.json': col2Table04,
            'table_05_vascularisation_plaie.json': col2Table05
          };

          this.allTablesLoaded = true;
          console.log(' Tables 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33 et 34 chargées avec succès');
          return this.allTablesCache;
    } catch (error) {
      console.error(' Erreur lors de l\'import de la première table:', error);
      return {};
    }
  }

  /**
   * Génère le nom de fichier basé sur l'ID de la table
   * @param {string} tableId - ID de la table
   * @returns {string} Nom du fichier
   * @private
   */
  _getTableFileName(tableId) {
    if (tableId == null || typeof tableId !== 'string') {
      return 'table_01_basic_data.json';
    }
    // Détecter la colonne (C1 ou C2)
    const columnMatch = tableId.match(/^C(\d+)T/);
    const column = columnMatch ? columnMatch[1] : '1';
    const tableNumber = tableId.replace(/^C\d+T/, '').padStart(2, '0');
    
    // Mapping des noms de fichiers pour colonne 1
    const col1FileNames = {
      '01': 'table_01_basic_data.json',
      '02': 'table_02_allergies.json',
      '03': 'table_03_health_conditions.json',
      '04': 'table_04_weight_bmi.json',
      '05': 'table_05_nutrition.json',
      '06': 'table_06_risk_factors.json',
      '07': 'table_07_active_medication.json',
      '08': 'table_08_psychosocial_environment.json',
      '09': 'table_09_insurance.json',
      '10': 'table_10_care_level.json',
      '11': 'table_11_wound_history.json',
      '12': 'table_12_symptoms.json',
      '13': 'table_13_perceptions_goals.json',
      '14': 'table_14_wound_location.json',
      '15': 'table_15_vascular_assessment.json',
      '16': 'table_16_bwat_size.json',
      '17': 'table_17_wound_shape.json',
      '18': 'table_18_bwat_depth.json',
      '19': 'table_19_bwat_edges.json',
      '20': 'table_20_bwat_undermining.json',
      '21': 'table_21_wound_bed_composition.json',
      '22': 'table_22_bwat_necrotic_tissue.json',
      '23': 'table_23_bwat_granulation_tissue.json',
      '24': 'table_24_bwat_epithelialization.json',
      '25': 'table_25_bwat_exudate.json',
      '26': 'table_26_bwat_surrounding_skin.json',
      '27': 'table_27_infection_signs_symptoms.json',
      '28': 'table_28_laboratory_tests.json',
      '29': 'table_29_braden_scale.json',
      '30': 'table_30_braden_q_scale.json',
      '31': 'table_31_pressure_injury.json',
      '32': 'table_32_venous_ulcer.json',
      '33': 'table_33_arterial_ulcer.json',
      '34': 'table_34_diabetic_foot.json'
    };
    
    // Mapping des noms de fichiers pour colonne 2
    const col2FileNames = {
      '01': 'table_01_cicatrisation_ralentie.json',
      '02': 'table_02_statut_plaie.json',
      '03': 'table_03_type_plaie.json',
      '04': 'table_04_stade_continuum_microbien.json',
      '05': 'table_05_vascularisation_plaie.json'
    };
    
    // Sélectionner le mapping selon la colonne
    const fileNames = column === '2' ? col2FileNames : col1FileNames;
    
    return fileNames[tableNumber] || `table_${tableNumber}.json`;
  }

  /**
   * Retourne une structure de table par défaut en cas d'erreur
   * @param {string} tableId - ID de la table
   * @returns {Object} Structure par défaut
   * @private
   */
  _getDefaultTableStructure(tableId) {
    return {
      id: tableId,
      version: "1.0.0",
      title: "Table non trouvée",
      description: "Cette table n'a pas pu être chargée",
      category: "error",
      column: 1,
      table: parseInt(tableId.replace('C1T', '')),
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        author: "Système d'évaluation clinique",
        language: "fr-CA"
      },
      elements: [
        {
          id: `${tableId}E01`,
          type: "informational",
          content: "Cette table n'a pas pu être chargée. Veuillez vérifier que le fichier existe.",
          info_type: "error"
        }
      ],
      ui_configuration: {
        sections: []
      }
    };
  }

  /**
   * Préchage plusieurs tables
   * @param {string[]} tableIds - Liste des IDs de tables
   * @returns {Promise<Object[]>} Données des tables
   */
  async preloadTables(tableIds) {
    const promises = tableIds.map(id => this.loadTableData(id));
    return Promise.all(promises);
  }

  /**
   * Vide le cache
   */
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.allTablesLoaded = false;
    this.allTablesCache = null;
  }

  /**
   * Retourne les statistiques du cache
   * @returns {Object} Statistiques
   */
  getCacheStats() {
    return {
      cachedTables: this.cache.size,
      loadingTables: this.loadingPromises.size,
      allTablesLoaded: this.allTablesLoaded,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Instance singleton
const tableDataLoader = new TableDataLoader();

export default tableDataLoader;
