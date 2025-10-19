import { loadTable as loadTableFromJson, loadColumnTables as loadColumnTablesFromJson } from '../utils/jsonLoader';

/**
 * Service pour charger les données des tables depuis les fichiers JSON
 */
class TableLoader {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Charger une table spécifique depuis un fichier JSON
   * @param {string} tableId - ID de la table (ex: "C1T01")
   * @returns {Promise<Object>} - Données de la table
   */
  async loadTable(tableId) {
    try {
      // Vérifier le cache
      if (this.cache.has(tableId)) {
        return this.cache.get(tableId);
      }

      // Charger depuis les fichiers JSON réels
      const tableData = await loadTableFromJson(tableId);
      
      // Mettre en cache
      this.cache.set(tableId, tableData);
      
      return tableData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Charger toutes les tables d'une colonne
   * @param {string} columnId - ID de la colonne (ex: "C1")
   * @returns {Promise<Array>} - Liste des tables
   */
  async loadColumnTables(columnId) {
    try {
      // Charger depuis les fichiers JSON réels
      const tables = await loadColumnTablesFromJson(columnId);
      return tables;
    } catch (error) {
      throw error;
    }
  }


  /**
   * Vider le cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Obtenir les statistiques du cache
   * @returns {Object} - Statistiques du cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Instance singleton
const tableLoader = new TableLoader();

export default tableLoader;
