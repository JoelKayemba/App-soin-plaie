/**
 * Variables d'environnement
 * 
 * Ce fichier permet d'importer les variables d'environnement
 * depuis le fichier .env de manière typée
 * 
 * Usage :
 * import { EPIC_CLIENT_ID_SANDBOX } from '@env';
 */

// Les variables sont injectées automatiquement par babel-plugin-react-native-dotenv
// depuis le fichier .env à la racine du projet

// Ces exports seront remplacés automatiquement par les valeurs du .env
// TypeScript/IDE pourrait ne pas reconnaître ces imports, c'est normal

export const EPIC_CLIENT_ID_SANDBOX = process.env.EPIC_CLIENT_ID_SANDBOX;
export const EPIC_SANDBOX_BASE_URL = process.env.EPIC_SANDBOX_BASE_URL;
export const EPIC_REDIRECT_URI_SANDBOX = process.env.EPIC_REDIRECT_URI_SANDBOX;
export const EPIC_SCOPES_SANDBOX = process.env.EPIC_SCOPES_SANDBOX;

export const EPIC_CLIENT_ID_PRODUCTION = process.env.EPIC_CLIENT_ID_PRODUCTION;
export const EPIC_PRODUCTION_BASE_URL = process.env.EPIC_PRODUCTION_BASE_URL;
export const EPIC_REDIRECT_URI_PRODUCTION = process.env.EPIC_REDIRECT_URI_PRODUCTION;
export const EPIC_SCOPES_PRODUCTION = process.env.EPIC_SCOPES_PRODUCTION;

export const EPIC_MODE = process.env.EPIC_MODE;
export const EPIC_FHIR_VERSION = process.env.EPIC_FHIR_VERSION;
export const EPIC_SMART_VERSION = process.env.EPIC_SMART_VERSION;
export const EPIC_PKCE_METHOD = process.env.EPIC_PKCE_METHOD;
export const EPIC_PKCE_VERIFIER_LENGTH = process.env.EPIC_PKCE_VERIFIER_LENGTH;

export const APP_NAME = process.env.APP_NAME;
export const APP_VERSION = process.env.APP_VERSION;

