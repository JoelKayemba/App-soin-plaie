/**
 * Configuration Epic OAuth 2.0 / SMART on FHIR
 * 
 *  IMPORTANT : 
 * - Les variables d'environnement sont chargées depuis le fichier .env
 * - Elles sont injectées automatiquement par react-native-dotenv
 */

// Import des variables d'environnement depuis @env
// Les valeurs sont remplacées automatiquement par babel-plugin-react-native-dotenv
import {
  EPIC_CLIENT_ID_SANDBOX,
  EPIC_SANDBOX_BASE_URL,
  EPIC_REDIRECT_URI_SANDBOX,
  EPIC_SCOPES_SANDBOX,
  EPIC_CLIENT_ID_PRODUCTION,
  EPIC_PRODUCTION_BASE_URL,
  EPIC_REDIRECT_URI_PRODUCTION,
  EPIC_SCOPES_PRODUCTION,
  EPIC_MODE,
  EPIC_FHIR_VERSION,
  EPIC_SMART_VERSION,
  EPIC_PKCE_METHOD,
  EPIC_PKCE_VERIFIER_LENGTH,
  APP_NAME,
  APP_VERSION,
} from '@env';

// Fonction helper pour obtenir une variable d'environnement avec valeur par défaut
const getEnvVar = (value, defaultValue) => {
  return value || defaultValue;
};

/**
 * Configuration Epic
 */
const EPIC_CONFIG = {
  // Mode actuel : 'sandbox' ou 'production'
  mode: getEnvVar(EPIC_MODE, __DEV__ ? 'sandbox' : 'production'),
  
  // Configuration Sandbox (Non-Production)
  sandbox: {
    clientId: getEnvVar(EPIC_CLIENT_ID_SANDBOX, ''),
    baseUrl: getEnvVar(EPIC_SANDBOX_BASE_URL, 'https://fhir.epic.com/interconnect-fhir-oauth'),
    redirectUri: getEnvVar(EPIC_REDIRECT_URI_SANDBOX, 'app-soin-plaie://oauth/callback'),
    scope: getEnvVar(EPIC_SCOPES_SANDBOX, 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access'),
    issuer: getEnvVar(EPIC_SANDBOX_BASE_URL, 'https://fhir.epic.com/interconnect-fhir-oauth'),
    fhirVersion: getEnvVar(EPIC_FHIR_VERSION, 'R4'),
  },
  
  // Configuration Production
  production: {
    clientId: getEnvVar(EPIC_CLIENT_ID_PRODUCTION, ''),
    baseUrl: getEnvVar(EPIC_PRODUCTION_BASE_URL, ''),
    redirectUri: getEnvVar(EPIC_REDIRECT_URI_PRODUCTION, 'app-soin-plaie://oauth/callback'),
    scope: getEnvVar(EPIC_SCOPES_PRODUCTION, 'launch openid fhirUser patient/Patient.read patient/Observation.read patient/Observation.write patient/Condition.read patient/AllergyIntolerance.read patient/MedicationStatement.read offline_access'),
    issuer: getEnvVar(EPIC_PRODUCTION_BASE_URL, ''),
    fhirVersion: getEnvVar(EPIC_FHIR_VERSION, 'R4'),
  },
  
  // Configuration PKCE (Sécurité pour apps natives)
  pkce: {
    codeChallengeMethod: getEnvVar(EPIC_PKCE_METHOD, 'S256'),
    codeVerifierLength: parseInt(getEnvVar(EPIC_PKCE_VERIFIER_LENGTH, '128'), 10),
  },
  
  // Configuration SMART
  smart: {
    version: getEnvVar(EPIC_SMART_VERSION, 'v2'),
  },
};

/**
 * Obtenir la configuration active selon le mode
 * 
 * @returns {Object} Configuration Epic active
 */
export const getEpicConfig = () => {
  const mode = EPIC_CONFIG.mode;
  const config = EPIC_CONFIG[mode];
  
  if (!config.clientId) {
    console.warn(
      `[EpicConfig]  Client ID non configuré pour le mode "${mode}". ` +
      `Vérifiez votre fichier .env ou la configuration.`
    );
  }
  
  return {
    ...config,
    mode,
    pkce: EPIC_CONFIG.pkce,
    smart: EPIC_CONFIG.smart,
  };
};

/**
 * Obtenir l'URL de base FHIR selon le serveur (iss)
 * 
 * @param {string} iss - Issuer URL fourni par Epic lors du lancement
 * @returns {string} URL de base FHIR
 */
export const getFhirBaseUrl = (iss) => {
  // Si iss est fourni (lors d'un lancement Epic), l'utiliser
  if (iss) {
    // Format : https://[org].epic.com/interconnect-fhir-oauth/api/FHIR/R4
    // ou : https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4
    if (iss.includes('/api/FHIR/')) {
      return iss;
    }
    // Si iss est juste la base URL, construire l'URL FHIR
    const config = getEpicConfig();
    return `${iss}/api/FHIR/${config.fhirVersion}`;
  }
  
  // Sinon, utiliser la configuration par défaut
  const config = getEpicConfig();
  return `${config.baseUrl}/api/FHIR/${config.fhirVersion}`;
};

/**
 * Obtenir l'URL du serveur d'autorisation OAuth
 * 
 * @param {string} iss - Issuer URL fourni par Epic lors du lancement
 * @returns {string} URL du serveur d'autorisation
 */
export const getAuthServerUrl = (iss) => {
  // Si iss est fourni, extraire le serveur d'autorisation
  if (iss) {
    // Retirer /api/FHIR/R4 si présent
    return iss.replace(/\/api\/FHIR\/[^/]+$/, '').replace(/\/api\/FHIR$/, '');
  }
  
  // Sinon, utiliser la configuration par défaut
  const config = getEpicConfig();
  return config.baseUrl;
};

/**
 * Obtenir l'URL du endpoint SMART Configuration
 * 
 * @param {string} iss - Issuer URL fourni par Epic lors du lancement
 * @returns {string} URL du endpoint SMART configuration
 */
export const getSMARTConfigurationUrl = (iss) => {
  const authServer = getAuthServerUrl(iss);
  return `${authServer}/.well-known/smart-configuration`;
};

/**
 * Obtenir l'URL du endpoint Metadata FHIR
 * 
 * @param {string} iss - Issuer URL fourni par Epic lors du lancement
 * @returns {string} URL du endpoint metadata
 */
export const getMetadataUrl = (iss) => {
  const fhirBase = getFhirBaseUrl(iss);
  return `${fhirBase}/metadata`;
};

/**
 * Vérifier si la configuration est valide
 * 
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateEpicConfig = () => {
  const errors = [];
  const config = getEpicConfig();
  
  if (!config.clientId) {
    errors.push('Client ID non configuré');
  }
  
  if (!config.baseUrl) {
    errors.push('Base URL non configurée');
  }
  
  if (!config.redirectUri) {
    errors.push('Redirect URI non configuré');
  }
  
  if (!config.scope) {
    errors.push('Scopes non configurés');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Afficher la configuration (pour debugging, sans les valeurs sensibles)
 */
export const logEpicConfig = () => {
  const config = getEpicConfig();
  console.log('[EpicConfig] Configuration active:', {
    mode: config.mode,
    baseUrl: config.baseUrl,
    redirectUri: config.redirectUri,
    scope: config.scope,
    fhirVersion: config.fhirVersion,
    smartVersion: config.smart.version,
    clientIdConfigured: !!config.clientId,
    pkce: config.pkce,
  });
};

// Export par défaut
export default EPIC_CONFIG;

