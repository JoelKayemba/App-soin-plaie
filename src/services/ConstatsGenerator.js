/**
 * Service pour générer les constats automatiquement à partir des réponses de l'évaluation
 * 
 * Architecture :
 * - Les données des constats sont en JSON (structure, labels, règles de mapping)
 * - La logique d'évaluation des conditions est en JavaScript (ce fichier)
 */

import tableDataLoader from './TableDataLoader';
import { getBMICategory } from '@/features/evaluation/table-renderers/utils/calculations';

class ConstatsGenerator {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Calcule l'âge à partir d'une date de naissance
   * @param {string} birthDate - Date de naissance (YYYY-MM-DD)
   * @returns {Object} - { days, months, years }
   */
  calculateAge(birthDate) {
    if (!birthDate) return null;
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    
    return {
      days: totalDays,
      months: Math.floor(totalDays / 30),
      years
    };
  }

  /**
   * Calcule l'âge d'une plaie à partir de la date d'apparition
   * @param {string} appearanceDate - Date d'apparition (YYYY-MM-DD)
   * @returns {Object} - { days, isRecent, isChronic }
   */
  calculateWoundAge(appearanceDate) {
    if (!appearanceDate) return null;
    
    const appearance = new Date(appearanceDate);
    const today = new Date();
    const days = Math.floor((today - appearance) / (1000 * 60 * 60 * 24));
    
    return {
      days,
      isRecent: days <= 28,
      isChronic: days > 28
    };
  }

  /**
   * Récupère la valeur d'un champ dans les données d'évaluation
   * @param {string} fieldId - ID du champ (ex: "C1T01E01" ou "C1T03E12")
   * @param {Object} evaluationData - Données complètes de l'évaluation
   * @returns {any} - Valeur du champ
   */
  getFieldValue(fieldId, evaluationData) {
    if (!fieldId || !evaluationData) return null;
    
    // Extraire l'ID de la table (ex: "C1T01" depuis "C1T01E01")
    const tableId = fieldId.substring(0, 5);
    const tableData = evaluationData[tableId];
    
    if (!tableData) return null;
    
    // Chercher directement dans les données de la table
    return tableData[fieldId] ?? null;
  }

  /**
   * Évalue une condition simple (string) en JavaScript
   * @param {string} condition - Condition à évaluer (ex: "age >= 65", "C1T03E12 === true")
   * @param {Object} context - Contexte avec les valeurs disponibles
   * @returns {boolean} - True si la condition est satisfaite
   */
  evaluateCondition(condition, context) {
    if (!condition) return false;
    
    try {
      // Créer un contexte sécurisé pour l'évaluation
      const safeContext = {
        ...context,
        // Fonctions helper
        contains: (arr, value) => Array.isArray(arr) && arr.includes(value),
        // Opérateurs de comparaison
        gte: (a, b) => a >= b,
        lte: (a, b) => a <= b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b
      };
      
      // Remplacer les références de champs par leurs valeurs
      let evaluatedCondition = condition;
      
      // Gérer les conditions "contains" spéciales
      const containsPattern = /contains\s*\(\s*([^,]+)\s*,\s*['"]([^'"]+)['"]\s*\)/g;
      evaluatedCondition = evaluatedCondition.replace(containsPattern, (match, fieldRef, searchValue) => {
        const fieldId = fieldRef.trim();
        const value = context[fieldId] ?? null;
        if (Array.isArray(value)) {
          return value.includes(searchValue);
        }
        if (typeof value === 'string') {
          return value.includes(searchValue);
        }
        return false;
      });
      
      // Étape 1: Identifier tous les champs et leurs types
      const fieldTypes = new Map();
      const fieldPattern = /C\d+T\d+[EPID]\d+/g;
      const allFields = [...new Set(evaluatedCondition.match(fieldPattern) || [])];
      
      allFields.forEach(fieldId => {
        const value = context[fieldId];
        if (Array.isArray(value)) {
          fieldTypes.set(fieldId, 'array');
        } else if (typeof value === 'boolean') {
          fieldTypes.set(fieldId, 'boolean');
        } else if (typeof value === 'number') {
          fieldTypes.set(fieldId, 'number');
        } else if (value === null || value === undefined) {
          fieldTypes.set(fieldId, 'null');
        } else {
          fieldTypes.set(fieldId, 'string');
        }
      });
      
      // Étape 2: Remplacer les comparaisons avec des tableaux AVANT de remplacer les valeurs
      // Remplacer C1T15P03 === 'C1T15P03_1' par C1T15P03.includes('C1T15P03_1') si c'est un tableau
      fieldTypes.forEach((type, fieldId) => {
        if (type === 'array') {
          // Échapper les caractères spéciaux pour le regex
          const escapedFieldId = fieldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          
          // Remplacer les comparaisons directes: fieldId === 'value'
          const directPattern = new RegExp(`\\b${escapedFieldId}\\s*===\\s*['"]([^'"]+)['"]`, 'g');
          evaluatedCondition = evaluatedCondition.replace(directPattern, (match, searchValue) => {
            return `${fieldId}.includes("${searchValue}")`;
          });
          
          // Remplacer dans les parenthèses: (fieldId === 'value')
          const parenPattern = new RegExp(`\\(\\s*${escapedFieldId}\\s*===\\s*['"]([^'"]+)['"]\\s*\\)`, 'g');
          evaluatedCondition = evaluatedCondition.replace(parenPattern, (match, searchValue) => {
            return `(${fieldId}.includes("${searchValue}"))`;
          });
        }
      });
      
      // Étape 3: Maintenant remplacer les références de champs par leurs valeurs
      evaluatedCondition = evaluatedCondition.replace(fieldPattern, (match) => {
        const value = context[match] ?? null;
        const fieldType = fieldTypes.get(match);
        
        // Si c'est un booléen, retourner directement
        if (fieldType === 'boolean') return value;
        // Si c'est un nombre, retourner le nombre
        if (fieldType === 'number') return value;
        // Si c'est un tableau, garder la référence (déjà géré avec .includes())
        if (fieldType === 'array') return match;
        // Si c'est null ou undefined
        if (fieldType === 'null') return 'null';
        // Si c'est une string, retourner avec guillemets
        if (fieldType === 'string') return `"${value}"`;
        // Sinon, retourner comme string JSON
        return JSON.stringify(value);
      });
      
      // Remplacer les variables contextuelles (ex: age, bmi_category)
      // Faire cela en dernier pour éviter les conflits avec les champs
      const contextKeys = Object.keys(context).filter(key => !key.startsWith('C'));
      // Trier par longueur décroissante pour éviter les remplacements partiels (ex: "age" avant "age_years")
      contextKeys.sort((a, b) => b.length - a.length);
      
      contextKeys.forEach(key => {
        const value = context[key];
        // Échapper les caractères spéciaux pour le regex
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Utiliser un word boundary pour éviter de remplacer des parties de mots
        const regex = new RegExp(`\\b${escapedKey}\\b`, 'g');
        
        if (value === null || value === undefined) {
          evaluatedCondition = evaluatedCondition.replace(regex, 'null');
        } else if (typeof value === 'string') {
          evaluatedCondition = evaluatedCondition.replace(regex, `"${value}"`);
        } else if (typeof value === 'boolean' || typeof value === 'number') {
          evaluatedCondition = evaluatedCondition.replace(regex, String(value));
        } else {
          evaluatedCondition = evaluatedCondition.replace(regex, JSON.stringify(value));
        }
      });
      
      // Debug: afficher la condition évaluée si elle contient "age"
      if (condition.includes('age') && evaluatedCondition.includes('age')) {
        console.log(`[ConstatsGenerator] Condition originale: ${condition}`);
        console.log(`[ConstatsGenerator] Condition évaluée: ${evaluatedCondition}`);
        console.log(`[ConstatsGenerator] Contexte age:`, context.age, context.age_years);
      }
      
      // Évaluer la condition de manière sécurisée
      // Note: En production, utiliser un parser d'expressions plus sûr
      try {
        // Ajouter toutes les valeurs du contexte dans safeContext pour l'évaluation
        // Cela permet d'accéder aux variables comme 'age' directement
        const evalContext = {
          ...safeContext,
          ...context
        };
        
        const result = new Function('return ' + evaluatedCondition).call(evalContext);
        return result;
      } catch (evalError) {
        // Si l'évaluation échoue, essayer une approche plus simple
        console.warn(`[ConstatsGenerator] Évaluation directe échouée, tentative alternative pour: ${condition}`);
        console.warn(`[ConstatsGenerator] Condition évaluée: ${evaluatedCondition}`);
        console.warn(`[ConstatsGenerator] Erreur:`, evalError.message);
        console.warn(`[ConstatsGenerator] Contexte disponible:`, Object.keys(context).filter(k => !k.startsWith('C')));
        return false;
      }
    } catch (error) {
      console.warn(`[ConstatsGenerator] Erreur lors de l'évaluation de la condition: ${condition}`, error);
      return false;
    }
  }

  /**
   * Construit le contexte d'évaluation à partir des données d'évaluation
   * @param {Object} evaluationData - Données complètes de l'évaluation
   * @returns {Object} - Contexte avec toutes les valeurs nécessaires
   */
  buildEvaluationContext(evaluationData) {
    const context = {};
    
    // Extraire toutes les valeurs de champs
    Object.keys(evaluationData).forEach(tableId => {
      const tableData = evaluationData[tableId];
      if (typeof tableData === 'object' && tableData !== null) {
        Object.keys(tableData).forEach(key => {
          if (key.startsWith(tableId)) {
            context[key] = tableData[key];
          }
        });
      }
    });
    
    // Calculer l'âge si date de naissance disponible
    const birthDate = this.getFieldValue('C1T01E01', evaluationData);
    if (birthDate) {
      const age = this.calculateAge(birthDate);
      if (age && age.years !== undefined) {
        context.age = age.years;
        context.age_days = age.days;
        context.age_months = age.months;
        context.age_years = age.years; // Alias pour compatibilité
      } else {
        context.age = null;
        context.age_years = null;
        context.age_days = null;
        context.age_months = null;
      }
    } else {
      // Initialiser à null si pas de date
      context.age = null;
      context.age_years = null;
      context.age_days = null;
      context.age_months = null;
    }
    
    // Calculer la catégorie BMI si poids et taille disponibles
    const weight = this.getFieldValue('C1T04E01', evaluationData);
    const height = this.getFieldValue('C1T04E02', evaluationData);
    if (weight && height && height > 0) {
      const bmi = weight / Math.pow(height / 100, 2);
      context.bmi = bmi;
      context.bmi_category = getBMICategory(bmi);
    }
    
    // Calculer l'âge de la plaie si date d'apparition disponible
    const appearanceDate = this.getFieldValue('C1T11E01', evaluationData);
    if (appearanceDate) {
      const woundAge = this.calculateWoundAge(appearanceDate);
      if (woundAge) {
        context.wound_age = woundAge.days;
        context.wound_age_days = woundAge.days;
      }
    }
    
    // Détecter les signes d'infection (exemple simplifié)
    const infectionSigns = this.getFieldValue('C1T27E01', evaluationData);
    context.infection_signs_present = infectionSigns === true || (Array.isArray(infectionSigns) && infectionSigns.length > 0);
    
    // Détecter le biofilm suspecté (exemple simplifié)
    context.biofilm_suspected = this.getFieldValue('C1T27E12', evaluationData) === true;
    
    // Détecter le tabagisme
    const riskFactors = this.getFieldValue('C1T06E01', evaluationData);
    context.smoking_present = Array.isArray(riskFactors) && riskFactors.includes('tabagisme');
    
    // Détecter les maladies autoimmunes
    const healthConditions = evaluationData['C1T03'] || {};
    context.autoimmune_disease_present = 
      healthConditions['C1T03E13'] === true || // Polyarthrite rhumatoïde
      healthConditions['C1T03E14'] === true;   // Autre maladie autoimmune
    
    // Détecter les désordres thyroïdiens
    context.thyroid_disorder_present = healthConditions['C1T03E16'] === true;
    
    // Détecter la nutrition insuffisante
    const nutritionData = evaluationData['C1T05'] || {};
    context.nutrition_insufficient = 
      nutritionData['C1T05E01'] === 'insuffisant' ||
      nutritionData['C1T05E02'] === 'insuffisant';
    
    // Détecter la vascularisation inadéquate
    const vascularData = evaluationData['C1T15'] || {};
    context.vascular_assessment_inadequate = 
      vascularData['C1T15E01'] === 'inadequate' ||
      vascularData['C1T15E02'] === 'inadequate';
    
    // Détecter les médicaments affectant la cicatrisation
    const medications = evaluationData['C1T07'] || {};
    context.medication_affecting_healing = 
      medications['C1T07E01'] === true || // Corticostéroïdes
      medications['C1T07E02'] === true;   // Immunosuppresseurs
    
    // Ajouter toutes les valeurs des champs directement dans le contexte
    // pour permettre l'évaluation de conditions comme "C1T27E01 === true"
    for (const tableId in evaluationData) {
      const tableData = evaluationData[tableId];
      if (tableData && typeof tableData === 'object') {
        for (const fieldId in tableData) {
          // Ignorer les propriétés spéciales comme 'elements', 'id', etc.
          if (!['elements', 'id', 'title', 'description', 'sections', 'ui_configuration'].includes(fieldId)) {
            context[fieldId] = tableData[fieldId];
          }
        }
      }
    }
    
    return context;
  }

  /**
   * Génère les constats pour une table de constats spécifique
   * @param {string} constatTableId - ID de la table de constats (ex: "C2T01")
   * @param {Object} evaluationData - Données complètes de l'évaluation
   * @returns {Promise<Object>} - { detectedConstats: [...], constatData: {...} }
   */
  async generateConstatsForTable(constatTableId, evaluationData) {
    try {
      // Charger la table de constats
      const constatTable = await tableDataLoader.loadTableData(constatTableId);
      
      if (!constatTable) {
        return {
          detectedConstats: [],
          constatData: {},
          constatTable: null
        };
      }
      
      // Construire le contexte d'évaluation
      const context = this.buildEvaluationContext(evaluationData);
      
      // Évaluer chaque règle de mapping (si source_mapping existe)
      const detectedConstats = [];
      const constatData = {};
      
      if (constatTable.source_mapping && constatTable.source_mapping.mapping_rules) {
        const mappingRules = constatTable.source_mapping.mapping_rules;
        
        for (const rule of mappingRules) {
          const { constat_id, condition, source } = rule;
          
          // Évaluer la condition
          const isDetected = this.evaluateCondition(condition, context);
          
          if (isDetected) {
            detectedConstats.push(constat_id);
            constatData[constat_id] = {
              detected: true,
              source,
              rule
            };
          }
        }
      }
      
      // Évaluer aussi les conditions directement dans les éléments (pour C2T04 par exemple)
      if (constatTable.elements && Array.isArray(constatTable.elements)) {
        for (const element of constatTable.elements) {
          // Ignorer les éléments qui nécessitent une confirmation manuelle
          if (element.read_only === false || element.type === 'single_choice') {
            continue;
          }
          
          // Si l'élément a une condition, l'évaluer
          if (element.condition) {
            const isDetected = this.evaluateCondition(element.condition, context);
            
            if (isDetected && !detectedConstats.includes(element.id)) {
              detectedConstats.push(element.id);
              constatData[element.id] = {
                detected: true,
                source: element.section || 'elements',
                element
              };
            }
          }
        }
      }
      
      // Appliquer la logique d'affichage (most_severe_only, etc.)
      if (constatTable.sections) {
        for (const section of constatTable.sections) {
          if (section.display_logic && section.display_logic.rule === 'most_severe_only') {
            const priorityOrder = section.display_logic.priority_order || [];
            const sectionElements = constatTable.elements?.filter(
              el => el.section === section.id && detectedConstats.includes(el.id)
            ) || [];
            
            if (sectionElements.length > 1) {
              // Trier par priorité
              sectionElements.sort((a, b) => {
                const priorityA = priorityOrder.indexOf(a.id);
                const priorityB = priorityOrder.indexOf(b.id);
                // Les éléments avec priorité plus élevée (index plus petit) viennent en premier
                if (priorityA === -1 && priorityB === -1) return 0;
                if (priorityA === -1) return 1;
                if (priorityB === -1) return -1;
                return priorityA - priorityB;
              });
              
              // Garder uniquement le premier (le plus grave)
              const toKeep = sectionElements[0].id;
              const toRemove = sectionElements.slice(1).map(el => el.id);
              
              // Retirer les éléments moins prioritaires
              const newDetectedConstats = detectedConstats.filter(id => !toRemove.includes(id));
              detectedConstats.length = 0;
              detectedConstats.push(...newDetectedConstats);
              
              // Supprimer les données des éléments retirés
              toRemove.forEach(id => {
                delete constatData[id];
              });
            }
          }
        }
      }
      
      return {
        detectedConstats,
        constatData,
        constatTable
      };
    } catch (error) {
      console.error(`[ConstatsGenerator] Erreur lors de la génération des constats pour ${constatTableId}:`, error);
      return {
        detectedConstats: [],
        constatData: {},
        constatTable: null,
        error: error.message
      };
    }
  }

  /**
   * Génère tous les constats à partir des données d'évaluation
   * @param {Object} evaluationData - Données complètes de l'évaluation
   * @returns {Promise<Object>} - Tous les constats générés par table
   */
  async generateAllConstats(evaluationData) {
    const allConstats = {};
    
    // Liste des tables de constats (colonne 2)
    const constatTableIds = ['C2T01', 'C2T02', 'C2T03', 'C2T04', 'C2T05'];
    
    for (const tableId of constatTableIds) {
      const result = await this.generateConstatsForTable(tableId, evaluationData);
      allConstats[tableId] = result;
    }
    
    return allConstats;
  }
}

// Instance singleton
const constatsGenerator = new ConstatsGenerator();

export default constatsGenerator;

