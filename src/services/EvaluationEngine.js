/**
 * Moteur d'évaluation pour gérer la logique métier des tables d'évaluation
 */
class EvaluationEngine {
  constructor() {
    this.tables = new Map();
    this.dependencies = new Map();
    this.routes = new Map();
  }

  /**
   * Charger une table depuis un fichier JSON
   * @param {string} tableId - ID de la table
   * @returns {Promise<Object>} - Données de la table
   */
  async loadTable(tableId) {
    try {
      // TODO: Implémenter le chargement depuis les fichiers JSON
      // Pour l'instant, on retourne des données de test
      const mockTableData = {
        id: tableId,
        title: `Table ${tableId}`,
        description: `Description de la table ${tableId}`,
        elements: [],
        conditional_table: null,
        routes: [],
        ui_configuration: {
          instructions: 'Instructions de test',
          sections: []
        }
      };

      this.tables.set(tableId, mockTableData);
      return mockTableData;
    } catch (error) {
      console.error(`Erreur lors du chargement de la table ${tableId}:`, error);
      throw error;
    }
  }

  /**
   * Charger toutes les tables d'une colonne
   * @param {string} columnId - ID de la colonne
   * @returns {Promise<Array>} - Liste des tables
   */
  async loadColumnTables(columnId) {
    try {
      // TODO: Charger depuis les fichiers JSON réels
      const tableIds = [
        'C1T01', 'C1T02', 'C1T03', 'C1T04', 'C1T05',
        'C1T06', 'C1T07', 'C1T08', 'C1T09', 'C1T10',
        'C1T11', 'C1T12', 'C1T13', 'C1T14', 'C1T15',
        'C1T16', 'C1T17', 'C1T18', 'C1T19', 'C1T20',
        'C1T21', 'C1T22', 'C1T23', 'C1T24', 'C1T25',
        'C1T26', 'C1T27', 'C1T28', 'C1T31', 'C1T32',
        'C1T33', 'C1T34'
      ];

      const tables = [];
      for (const tableId of tableIds) {
        const table = await this.loadTable(tableId);
        tables.push(table);
      }

      return tables;
    } catch (error) {
      console.error(`Erreur lors du chargement des tables de la colonne ${columnId}:`, error);
      throw error;
    }
  }

  /**
   * Évaluer les conditions d'activation d'une table
   * @param {Object} tableData - Données de la table
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {boolean} - True si la table doit être activée
   */
  evaluateTableConditions(tableData, evaluationData) {
    if (!tableData.conditional_table) {
      return true; // Table toujours active
    }

    const { depends_on, trigger_condition } = tableData.conditional_table;
    
    if (!depends_on || !trigger_condition) {
      return true;
    }

    // Récupérer les données de la table source
    const sourceData = evaluationData[depends_on];
    if (!sourceData) {
      return false;
    }

    const { source_field, operator, value } = trigger_condition;
    
    switch (operator) {
      case 'anyOf':
        return source_field.some(field => sourceData[field] === true);
      case 'allOf':
        return source_field.every(field => sourceData[field] === true);
      case 'eq':
        return sourceData[source_field] === value;
      case 'gt':
        return sourceData[source_field] > value;
      case 'lt':
        return sourceData[source_field] < value;
      case 'gte':
        return sourceData[source_field] >= value;
      case 'lte':
        return sourceData[source_field] <= value;
      default:
        console.warn(`Opérateur non supporté: ${operator}`);
        return false;
    }
  }

  /**
   * Évaluer les routes conditionnelles
   * @param {Object} tableData - Données de la table
   * @param {Object} elementData - Données de l'élément
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {Array} - Liste des routes activées
   */
  evaluateRoutes(tableData, elementData, evaluationData) {
    const activatedRoutes = [];

    if (!tableData.routes) {
      return activatedRoutes;
    }

    for (const route of tableData.routes) {
      if (this.evaluateRouteCondition(route.condition, evaluationData)) {
        activatedRoutes.push(route);
      }
    }

    return activatedRoutes;
  }

  /**
   * Évaluer une condition de route
   * @param {Object} condition - Condition à évaluer
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {boolean} - True si la condition est remplie
   */
  evaluateRouteCondition(condition, evaluationData) {
    if (!condition) {
      return true;
    }

    // Gérer les conditions complexes
    if (condition.anyOf) {
      return condition.anyOf.some(cond => this.evaluateRouteCondition(cond, evaluationData));
    }

    if (condition.allOf) {
      return condition.allOf.every(cond => this.evaluateRouteCondition(cond, evaluationData));
    }

    // Gérer les conditions simples
    if (condition.eq) {
      const { var: fieldPath, value } = condition.eq;
      return this.getFieldValue(fieldPath, evaluationData) === value;
    }

    if (condition.gt) {
      const { var: fieldPath, value } = condition.gt;
      return this.getFieldValue(fieldPath, evaluationData) > value;
    }

    if (condition.lt) {
      const { var: fieldPath, value } = condition.lt;
      return this.getFieldValue(fieldPath, evaluationData) < value;
    }

    if (condition.gte) {
      const { var: fieldPath, value } = condition.gte;
      return this.getFieldValue(fieldPath, evaluationData) >= value;
    }

    if (condition.lte) {
      const { var: fieldPath, value } = condition.lte;
      return this.getFieldValue(fieldPath, evaluationData) <= value;
    }

    return false;
  }

  /**
   * Récupérer la valeur d'un champ dans les données d'évaluation
   * @param {string} fieldPath - Chemin du champ (ex: "C1T14E05")
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {any} - Valeur du champ
   */
  getFieldValue(fieldPath, evaluationData) {
    // Extraire l'ID de la table et l'ID de l'élément
    const tableId = fieldPath.substring(0, 5); // ex: "C1T14"
    const elementId = fieldPath; // ex: "C1T14E05"

    const tableData = evaluationData[tableId];
    if (!tableData) {
      return null;
    }

    return tableData[elementId];
  }

  /**
   * Calculer les tables suivantes à activer
   * @param {string} completedTableId - ID de la table complétée
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {Array} - Liste des tables à activer
   */
  calculateNextTables(completedTableId, evaluationData) {
    const nextTables = [];

    // Parcourir toutes les tables pour trouver celles qui dépendent de la table complétée
    for (const [tableId, tableData] of this.tables) {
      if (tableData.conditional_table && 
          tableData.conditional_table.depends_on === completedTableId) {
        
        if (this.evaluateTableConditions(tableData, evaluationData)) {
          nextTables.push(tableId);
        }
      }
    }

    return nextTables;
  }

  /**
   * Valider les données d'une table
   * @param {Object} tableData - Données de la table
   * @param {Object} inputData - Données saisies
   * @returns {Object} - Résultat de la validation
   */
  validateTableData(tableData, inputData) {
    const errors = {};
    let isValid = true;

    // Valider chaque élément
    if (tableData.elements) {
      for (const element of tableData.elements) {
        const elementErrors = this.validateElement(element, inputData[element.id]);
        if (elementErrors.length > 0) {
          errors[element.id] = elementErrors[0]; // Prendre la première erreur
          isValid = false;
        }
      }
    }

    return { isValid, errors };
  }

  /**
   * Valider un élément spécifique
   * @param {Object} element - Données de l'élément
   * @param {any} value - Valeur à valider
   * @returns {Array} - Liste des erreurs
   */
  validateElement(element, value) {
    const errors = [];

    // Validation requise
    if (element.required && (value === null || value === undefined || value === '')) {
      errors.push('Ce champ est requis');
    }

    // Validation de longueur
    if (element.min_length && value && value.length < element.min_length) {
      errors.push(`Minimum ${element.min_length} caractères requis`);
    }

    if (element.max_length && value && value.length > element.max_length) {
      errors.push(`Maximum ${element.max_length} caractères autorisés`);
    }

    // Validation numérique
    if (element.validation) {
      const { min, max } = element.validation;
      const numValue = parseFloat(value);
      
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          errors.push(`Valeur minimale: ${min}`);
        }
        if (max !== undefined && numValue > max) {
          errors.push(`Valeur maximale: ${max}`);
        }
      }
    }

    // Validation des sélections
    if (element.minSelections && (!value || value.length < element.minSelections)) {
      errors.push(`Minimum ${element.minSelections} sélection(s) requise(s)`);
    }

    if (element.maxSelections && value && value.length > element.maxSelections) {
      errors.push(`Maximum ${element.maxSelections} sélection(s) autorisée(s)`);
    }

    return errors;
  }

  /**
   * Calculer les scores BWAT
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {Object} - Scores calculés
   */
  calculateBWATScores(evaluationData) {
    const scores = {};

    // TODO: Implémenter le calcul des scores BWAT
    // Pour l'instant, on retourne des scores de test
    scores.total = 0;
    scores.categories = {};

    return scores;
  }

  /**
   * Générer un résumé de l'évaluation
   * @param {Object} evaluationData - Données de l'évaluation
   * @returns {Object} - Résumé de l'évaluation
   */
  generateEvaluationSummary(evaluationData) {
    const summary = {
      completedTables: Object.keys(evaluationData),
      totalTables: this.tables.size,
      progress: (Object.keys(evaluationData).length / this.tables.size) * 100,
      scores: this.calculateBWATScores(evaluationData),
      recommendations: [],
      alerts: []
    };

    // TODO: Générer les recommandations et alertes
    // basées sur les données de l'évaluation

    return summary;
  }
}

// Instance singleton
const evaluationEngine = new EvaluationEngine();

export default evaluationEngine;
