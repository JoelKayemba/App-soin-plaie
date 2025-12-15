/**
 * Service d'Authentification Epic OAuth 2.0 / SMART on FHIR
 * 
 * Gère l'authentification OAuth 2.0 avec Epic, incluant :
 * - Détection de lancement depuis Epic (EHR Launch)
 * - Récupération de la configuration SMART
 * - Flow OAuth 2.0 avec PKCE
 * - Échange authorization code → access token
 * - Gestion des refresh tokens
 */

import * as Linking from 'expo-linking';
import { getEpicConfig, getSMARTConfigurationUrl, getAuthServerUrl } from '@/config/epic';
import { generatePKCE, generateState } from '../utils/PKCEService';

class EpicAuthService {
  constructor() {
    this.config = null;
    this.smartConfig = null;
  }

  /**
   * Initialise le service avec la configuration Epic
   */
  initialize() {
    this.config = getEpicConfig();
    
    // Valider la configuration
    const { isValid, errors } = this.validateConfig();
    if (!isValid) {
      console.warn('[EpicAuthService] Configuration invalide:', errors);
    }
  }

  /**
   * Valide la configuration Epic
   */
  validateConfig() {
    if (!this.config) {
      return { isValid: false, errors: ['Configuration non initialisée'] };
    }
    
    const errors = [];
    if (!this.config.clientId) {
      errors.push('Client ID non configuré');
    }
    if (!this.config.redirectUri) {
      errors.push('Redirect URI non configuré');
    }
    if (!this.config.scope) {
      errors.push('Scopes non configurés');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Détecte si l'app est lancée depuis Epic (EHR Launch)
   * 
   * Epic ajoute les paramètres ?launch=xxx&iss=https://... dans l'URL
   * 
   * @returns {Promise<{isLaunched: boolean, launchToken?: string, iss?: string}>}
   */
  async detectEpicLaunch() {
    try {
      // Vérifier l'URL initiale lorsque l'app est lancée
      const initialUrl = await Linking.getInitialURL();
      
      if (initialUrl) {
        const params = this.parseLaunchParams(initialUrl);
        if (params.launch && params.iss) {
          return {
            isLaunched: true,
            launchToken: params.launch,
            iss: params.iss,
          };
        }
      }
      
      // Note: Pour les liens reçus pendant l'exécution (app déjà ouverte),
      // ils sont gérés par l'event listener dans useEpicAuth
      
      return { isLaunched: false };
    } catch (error) {
      console.error('[EpicAuthService] Erreur détection lancement:', error);
      return { isLaunched: false };
    }
  }

  /**
   * Parse les paramètres de lancement depuis l'URL
   * 
   * @param {string} url - URL avec paramètres de lancement
   * @returns {{launch?: string, iss?: string}}
   */
  parseLaunchParams(url) {
    try {
      const parsed = Linking.parse(url);
      const queryParams = parsed.queryParams || {};
      
      return {
        launch: queryParams.launch || null,
        iss: queryParams.iss || null,
      };
    } catch (error) {
      console.error('[EpicAuthService] Erreur parsing URL:', error);
      return {};
    }
  }

  /**
   * Récupère la configuration SMART depuis Epic
   * 
   * @param {string} iss - Issuer URL fourni par Epic
   * @returns {Promise<Object>} Configuration SMART
   */
  async getSMARTConfiguration(iss) {
    try {
      const configUrl = getSMARTConfigurationUrl(iss);
      
      const response = await fetch(configUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur récupération config SMART: ${response.status}`);
      }

      const smartConfig = await response.json();
      this.smartConfig = smartConfig;
      
      return smartConfig;
    } catch (error) {
      console.error('[EpicAuthService] Erreur récupération SMART config:', error);
      
      // Fallback : essayer le endpoint metadata
      return await this.getSMARTConfigFromMetadata(iss);
    }
  }

  /**
   * Fallback : Récupère la configuration SMART depuis le endpoint metadata
   * 
   * @param {string} iss - Issuer URL
   * @returns {Promise<Object>} Configuration SMART extraite des metadata
   */
  async getSMARTConfigFromMetadata(iss) {
    try {
      const metadataUrl = `${iss}/metadata`;
      
      const response = await fetch(metadataUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/fhir+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur récupération metadata: ${response.status}`);
      }

      const metadata = await response.json();
      
      // Extraire les endpoints OAuth depuis les extensions
      const oauthExtension = metadata.extension?.find(
        ext => ext.url === 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris'
      );
      
      if (!oauthExtension || !oauthExtension.extension) {
        throw new Error('Configuration OAuth non trouvée dans metadata');
      }
      
      const smartConfig = {};
      oauthExtension.extension.forEach(ext => {
        if (ext.url === 'authorize') {
          smartConfig.authorization_endpoint = ext.valueUri;
        } else if (ext.url === 'token') {
          smartConfig.token_endpoint = ext.valueUri;
        }
      });
      
      this.smartConfig = smartConfig;
      return smartConfig;
    } catch (error) {
      console.error('[EpicAuthService] Erreur récupération metadata:', error);
      throw error;
    }
  }

  /**
   * Lance le flow OAuth 2.0 avec PKCE
   * 
   * @param {string} launchToken - Token de lancement (pour EHR Launch)
   * @param {string} iss - Issuer URL (pour EHR Launch)
   * @returns {Promise<{authUrl: string, pkce: Object, state: string}>}
   */
  async launchOAuthFlow(launchToken = null, iss = null) {
    if (!this.config) {
      this.initialize();
    }

    // Valider la configuration avant de continuer
    const { isValid, errors } = this.validateConfig();
    if (!isValid) {
      const errorMsg = `Configuration Epic invalide: ${errors.join(', ')}. Vérifiez votre fichier .env`;
      console.error('[EpicAuthService]', errorMsg);
      throw new Error(errorMsg);
    }

    if (!this.config.clientId || this.config.clientId.trim() === '') {
      throw new Error('Client ID Epic non configuré. Ajoutez EPIC_CLIENT_ID_SANDBOX dans votre fichier .env et redémarrez Expo.');
    }

    // Générer PKCE pour sécurité
    const pkce = await generatePKCE(this.config.pkce.codeVerifierLength);
    
    // Générer state pour sécurité CSRF
    const state = await generateState();
    
    // Récupérer la configuration SMART si nécessaire
    if (!this.smartConfig && iss) {
      await this.getSMARTConfiguration(iss);
    }
    
    // Utiliser la config SMART ou la config par défaut
    const authServerUrl = iss ? getAuthServerUrl(iss) : this.config.baseUrl;
    const authorizeEndpoint = this.smartConfig?.authorization_endpoint || 
                              `${authServerUrl}/oauth2/authorize`;
    
    // Construire l'URL d'autorisation
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state: state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: pkce.codeChallengeMethod,
    });

    // Ajouter les paramètres spécifiques à EHR Launch
    if (launchToken) {
      params.append('launch', launchToken);
    }
    
    // Ajouter aud (requis depuis mai 2023 pour Epic)
    if (iss) {
      params.append('aud', iss);
    } else {
      params.append('aud', `${this.config.baseUrl}/api/FHIR/${this.config.fhirVersion}`);
    }

    const authUrl = `${authorizeEndpoint}?${params.toString()}`;
    
    // Log de débogage (à retirer en production)
    if (__DEV__) {
      console.log('[EpicAuthService] URL d\'autorisation générée:');
      console.log('  Endpoint:', authorizeEndpoint);
      console.log('  Client ID:', this.config.clientId);
      console.log('  Redirect URI:', this.config.redirectUri);
      console.log('  Scopes:', this.config.scope);
      console.log('  URL complète:', authUrl);
    }
    
    return {
      authUrl,
      pkce,
      state,
    };
  }

  /**
   * Échange le code d'autorisation contre un access token
   * 
   * @param {string} authorizationCode - Code d'autorisation reçu
   * @param {string} codeVerifier - Code verifier PKCE
   * @param {string} state - State utilisé dans la requête initiale
   * @param {string} iss - Issuer URL (optionnel)
   * @returns {Promise<Object>} Tokens et contexte (access_token, patient, etc.)
   */
  async exchangeCodeForToken(authorizationCode, codeVerifier, state, iss = null) {
    if (!this.config) {
      this.initialize();
    }

    // Récupérer le token endpoint
    let tokenEndpoint;
    if (this.smartConfig?.token_endpoint) {
      tokenEndpoint = this.smartConfig.token_endpoint;
    } else {
      const authServerUrl = iss ? getAuthServerUrl(iss) : this.config.baseUrl;
      tokenEndpoint = `${authServerUrl}/oauth2/token`;
    }

    // Préparer les paramètres
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      code_verifier: codeVerifier, // PKCE
    });

    // Faire la requête
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EpicAuthService] Erreur échange token:', response.status, errorText);
      throw new Error(`Erreur échange token: ${response.status} - ${errorText}`);
    }

    const tokenData = await response.json();
    
    // Extraire les informations importantes
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || null,
      expiresIn: tokenData.expires_in || 3600,
      tokenType: tokenData.token_type || 'bearer',
      scope: tokenData.scope,
      
      // Contexte patient/practitioner
      patientId: tokenData.patient || null,
      encounterId: tokenData.encounter || null,
      locationId: tokenData.location || null,
      appointmentId: tokenData.appointment || null,
      
      // ID Token (si OpenID Connect utilisé)
      idToken: tokenData.id_token || null,
      
      // State (pour vérification)
      state: tokenData.state || state,
    };
  }

  /**
   * Rafraîchit un access token expiré en utilisant le refresh token
   * 
   * @param {string} refreshToken - Refresh token obtenu précédemment
   * @param {string} iss - Issuer URL (optionnel)
   * @returns {Promise<Object>} Nouveaux tokens
   */
  async refreshAccessToken(refreshToken, iss = null) {
    if (!this.config) {
      this.initialize();
    }

    // Récupérer le token endpoint
    let tokenEndpoint;
    if (this.smartConfig?.token_endpoint) {
      tokenEndpoint = this.smartConfig.token_endpoint;
    } else {
      const authServerUrl = iss ? getAuthServerUrl(iss) : this.config.baseUrl;
      tokenEndpoint = `${authServerUrl}/oauth2/token`;
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId,
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EpicAuthService] Erreur refresh token:', response.status, errorText);
      throw new Error(`Erreur refresh token: ${response.status}`);
    }

    const tokenData = await response.json();
    
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken, // Nouveau refresh token si fourni
      expiresIn: tokenData.expires_in || 3600,
      tokenType: tokenData.token_type || 'bearer',
      scope: tokenData.scope,
    };
  }

  /**
   * Ouvre l'URL d'autorisation dans le navigateur/app
   * 
   * @param {string} authUrl - URL d'autorisation
   */
  async openAuthUrl(authUrl) {
    try {
      const canOpen = await Linking.canOpenURL(authUrl);
      if (canOpen) {
        await Linking.openURL(authUrl);
      } else {
        throw new Error('Impossible d\'ouvrir l\'URL d\'autorisation');
      }
    } catch (error) {
      console.error('[EpicAuthService] Erreur ouverture URL:', error);
      throw error;
    }
  }

  /**
   * Parse le callback OAuth depuis l'URL de redirection
   * 
   * @param {string} redirectUrl - URL de callback
   * @returns {{code?: string, state?: string, error?: string}}
   */
  parseCallback(redirectUrl) {
    try {
      const parsed = Linking.parse(redirectUrl);
      const queryParams = parsed.queryParams || {};
      
      if (queryParams.error) {
        return {
          error: queryParams.error,
          errorDescription: queryParams.error_description || null,
        };
      }
      
      return {
        code: queryParams.code || null,
        state: queryParams.state || null,
      };
    } catch (error) {
      console.error('[EpicAuthService] Erreur parsing callback:', error);
      return { error: 'Invalid callback URL' };
    }
  }
}

// Export d'une instance singleton
const epicAuthService = new EpicAuthService();
epicAuthService.initialize();

export default epicAuthService;

