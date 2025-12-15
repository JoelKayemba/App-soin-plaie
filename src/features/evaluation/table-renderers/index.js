/**
 * Table Renderers - Point d'entrée et registre centralisé
 * 
 * Ce fichier sert de registre pour tous les renderers de tables.
 * Il permet de récupérer le renderer approprié selon l'ID de la table.
 */

// Import des renderers spécifiques (à créer progressivement)
import Table01Renderer from './tables/Table01Renderer';
import Table02Renderer from './tables/Table02Renderer';
import Table03Renderer from './tables/Table03Renderer';
import Table05Renderer from './tables/Table05Renderer';
import Table06Renderer from './tables/Table06Renderer';
import Table07Renderer from './tables/Table07Renderer';
import Table08Renderer from './tables/Table08Renderer';
import Table09Renderer from './tables/Table09Renderer';
import Table10Renderer from './tables/Table10Renderer';
import Table11Renderer from './tables/Table11Renderer';
import Table12Renderer from './tables/Table12Renderer';
import Table13Renderer from './tables/Table13Renderer';
import Table14Renderer from './tables/Table14Renderer';
import Table16Renderer from './tables/Table16Renderer';
import Table17Renderer from './tables/Table17Renderer';
import Table18Renderer from './tables/Table18Renderer';
import Table19Renderer from './tables/Table19Renderer';
import Table20Renderer from './tables/Table20Renderer';
import Table21Renderer from './tables/Table21Renderer';
import Table22Renderer from './tables/Table22Renderer';
import Table23Renderer from './tables/Table23Renderer';
import Table24Renderer from './tables/Table24Renderer';
import Table25Renderer from './tables/Table25Renderer';
import Table26Renderer from './tables/Table26Renderer';
import Table27Renderer from './tables/Table27Renderer';
import Table28Renderer from './tables/Table28Renderer';
import Table29Renderer from './tables/Table29Renderer';
import Table30Renderer from './tables/Table30Renderer';
import Table31Renderer from './tables/Table31Renderer';
import Table32Renderer from './tables/Table32Renderer';
import Table33Renderer from './tables/Table33Renderer';
import Table34Renderer from './tables/Table34Renderer';
import Table15Renderer from './tables/Table15Renderer';
import Table04Renderer from './tables/Table04Renderer';

// Registre des renderers spécifiques
const TABLE_RENDERERS = {
  'C1T01': Table01Renderer,
  'C1T02': Table02Renderer,
  'C1T03': Table03Renderer,
  'C1T04': Table04Renderer,
  'C1T05': Table05Renderer,
  'C1T06': Table06Renderer,
  'C1T07': Table07Renderer,
  'C1T08': Table08Renderer,
  'C1T09': Table09Renderer,
  'C1T10': Table10Renderer,
  'C1T11': Table11Renderer,
  'C1T12': Table12Renderer,
  'C1T13': Table13Renderer,
  'C1T14': Table14Renderer,
  'C1T15': Table15Renderer,
  'C1T16': Table16Renderer,
  'C1T17': Table17Renderer,
  'C1T18': Table18Renderer,
  'C1T19': Table19Renderer,
  'C1T20': Table20Renderer,
  'C1T21': Table21Renderer,
  'C1T22': Table22Renderer,
  'C1T23': Table23Renderer,
  'C1T24': Table24Renderer,
  'C1T25': Table25Renderer,
  'C1T26': Table26Renderer,
  'C1T27': Table27Renderer,
  'C1T28': Table28Renderer,
  'C1T29': Table29Renderer,
  'C1T30': Table30Renderer,
  'C1T31': Table31Renderer,
  'C1T32': Table32Renderer,
  'C1T33': Table33Renderer,
  'C1T34': Table34Renderer,
};

/**
 * Récupère le renderer spécifique pour une table donnée
 * @param {string} tableId - ID de la table (ex: 'C1T15')
 * @returns {React.Component|null} - Le renderer spécifique ou null si aucun
 */
export const getTableRenderer = (tableId) => {
  return TABLE_RENDERERS[tableId] || null;
};

/**
 * Vérifie si une table a un renderer spécifique
 * @param {string} tableId - ID de la table
 * @returns {boolean} - True si un renderer spécifique existe
 */
export const hasTableRenderer = (tableId) => {
  return !!TABLE_RENDERERS[tableId];
};

// Exports des utilitaires pour utilisation dans les renderers
export * from './core/ElementFactory';
export * from './core/ConditionalLogic';
export * from './core/ElementRenderer';
export * from './core/SubquestionRenderer';
export * from './utils/calculations';
export * from './utils/helpers';
export * from './utils/converters';
export * from './utils/useTableEffects';

export default {
  getTableRenderer,
  hasTableRenderer,
  TABLE_RENDERERS,
};
