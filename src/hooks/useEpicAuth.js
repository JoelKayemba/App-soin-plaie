/**
 * Hook React pour gérer l'authentification Epic
 * 
 * Gère l'état de connexion, le stockage des tokens,
 * et les fonctions de connexion/déconnexion
 */

import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';
import epicAuthService from '@/integration/epic/services/EpicAuthService';
import EpicFHIRService from '@/integration/epic/services/EpicFHIRService';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'epic_access_token',
  REFRESH_TOKEN: 'epic_refresh_token',
  TOKEN_EXPIRY: 'epic_token_expiry',
  PATIENT_ID: 'epic_patient_id',
  ENCOUNTER_ID: 'epic_encounter_id',
  ISS: 'epic_iss',
};

// Instance du service FHIR
const fhirService = new EpicFHIRService();

/**
 * Hook useEpicAuth
 * 
 * @returns {Object} État et fonctions d'authentification Epic
 */
export const useEpicAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [iss, setIss] = useState(null);

  /**
   * Rafraîchit l'access token en utilisant le refresh token
   */
  const refreshAccessToken = useCallback(async (refreshToken, issuerUrl = null) => {
    try {
      const tokenData = await epicAuthService.refreshAccessToken(refreshToken, issuerUrl);
      
      // Calculer l'expiry time
      const expiryTime = Date.now() + (tokenData.expiresIn * 1000);
      
      // Sauvegarder les nouveaux tokens
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken || refreshToken),
        SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()),
      ]);

      setAccessToken(tokenData.accessToken);
      setIsConnected(true);
      
      // Configurer le service FHIR
      fhirService.configure(tokenData.accessToken, issuerUrl);
      
      return tokenData.accessToken;
    } catch (err) {
      console.error('[useEpicAuth] Erreur refresh token:', err);
      await disconnect();
      throw err;
    }
  }, []);

  /**
   * Charge l'état d'authentification depuis le stockage
   */
  const loadAuthState = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [storedToken, storedRefreshToken, storedExpiry, storedPatientId, storedIss] = 
        await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
          SecureStore.getItemAsync(STORAGE_KEYS.PATIENT_ID),
          SecureStore.getItemAsync(STORAGE_KEYS.ISS),
        ]);

      // Vérifier si le token existe et n'est pas expiré
      if (storedToken && storedExpiry) {
        const expiryTime = parseInt(storedExpiry, 10);
        const now = Date.now();
        
        if (now < expiryTime) {
          // Token valide
          setAccessToken(storedToken);
          setPatientId(storedPatientId);
          setIss(storedIss);
          setIsConnected(true);
          
          // Configurer le service FHIR
          fhirService.configure(storedToken, storedIss);
        } else if (storedRefreshToken) {
          // Token expiré mais refresh token disponible
          await refreshAccessToken(storedRefreshToken, storedIss);
        }
      }
    } catch (err) {
      console.error('[useEpicAuth] Erreur chargement état:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshAccessToken]);

  /**
   * Connecte l'utilisateur à Epic via OAuth
   * 
   * @param {string} launchToken - Token de lancement (si EHR Launch)
   * @param {string} issuerUrl - Issuer URL (si EHR Launch)
   */
  const connect = useCallback(async (launchToken = null, issuerUrl = null) => {
    try {
      setIsLoading(true);
      setError(null);

      // Récupérer la configuration SMART si nécessaire
      if (issuerUrl && !epicAuthService.smartConfig) {
        await epicAuthService.getSMARTConfiguration(issuerUrl);
      }

      // Lancer le flow OAuth
      const { authUrl, pkce, state } = await epicAuthService.launchOAuthFlow(launchToken, issuerUrl);
      
      // Sauvegarder temporairement PKCE et state (pour le callback)
      await Promise.all([
        SecureStore.setItemAsync('epic_pkce_code_verifier', pkce.codeVerifier),
        SecureStore.setItemAsync('epic_oauth_state', state),
      ]);

      // Ouvrir l'URL d'autorisation
      await epicAuthService.openAuthUrl(authUrl);
      
      // Note: Le callback sera géré par handleOAuthCallback
      
    } catch (err) {
      console.error('[useEpicAuth] Erreur connexion:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Gère le callback OAuth après la redirection
   * 
   * @param {string} redirectUrl - URL de redirection avec le code d'autorisation
   */
  const handleOAuthCallback = useCallback(async (redirectUrl) => {
    try {
      setIsLoading(true);
      setError(null);

      // Parser le callback
      const callback = epicAuthService.parseCallback(redirectUrl);
      
      if (callback.error) {
        throw new Error(callback.errorDescription || callback.error);
      }

      if (!callback.code) {
        throw new Error('Code d\'autorisation manquant');
      }

      // Récupérer PKCE et state depuis le stockage
      const [codeVerifier, storedState, storedIss] = await Promise.all([
        SecureStore.getItemAsync('epic_pkce_code_verifier'),
        SecureStore.getItemAsync('epic_oauth_state'),
        SecureStore.getItemAsync(STORAGE_KEYS.ISS),
      ]);

      // Vérifier le state
      if (callback.state !== storedState) {
        throw new Error('State mismatch - possible CSRF attack');
      }

      // Échanger le code contre un token
      const tokenData = await epicAuthService.exchangeCodeForToken(
        callback.code,
        codeVerifier,
        storedState,
        storedIss
      );

      // Calculer l'expiry time
      const expiryTime = Date.now() + (tokenData.expiresIn * 1000);

      // Sauvegarder les tokens et le contexte
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken || ''),
        SecureStore.setItemAsync(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()),
        SecureStore.setItemAsync(STORAGE_KEYS.PATIENT_ID, tokenData.patientId || ''),
        SecureStore.setItemAsync(STORAGE_KEYS.ENCOUNTER_ID, tokenData.encounterId || ''),
        SecureStore.setItemAsync(STORAGE_KEYS.ISS, storedIss || ''),
      ]);

      // Nettoyer les valeurs temporaires
      await Promise.all([
        SecureStore.deleteItemAsync('epic_pkce_code_verifier'),
        SecureStore.deleteItemAsync('epic_oauth_state'),
      ]);

      // Mettre à jour l'état
      setAccessToken(tokenData.accessToken);
      setPatientId(tokenData.patientId);
      setIss(storedIss);
      setIsConnected(true);
      
      // Configurer le service FHIR
      fhirService.configure(tokenData.accessToken, storedIss);

    } catch (err) {
      console.error('[useEpicAuth] Erreur callback OAuth:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déconnecte l'utilisateur d'Epic
   */
  const disconnect = useCallback(async () => {
    try {
      // Supprimer tous les tokens et données
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN_EXPIRY),
        SecureStore.deleteItemAsync(STORAGE_KEYS.PATIENT_ID),
        SecureStore.deleteItemAsync(STORAGE_KEYS.ENCOUNTER_ID),
        SecureStore.deleteItemAsync(STORAGE_KEYS.ISS),
      ]);

      setAccessToken(null);
      setPatientId(null);
      setIss(null);
      setIsConnected(false);
      setError(null);
      
    } catch (err) {
      console.error('[useEpicAuth] Erreur déconnexion:', err);
      setError(err.message);
    }
  }, []);

  /**
   * Détecte si l'app a été lancée depuis Epic
   */
  const detectEpicLaunch = useCallback(async () => {
    try {
      const launch = await epicAuthService.detectEpicLaunch();
      if (launch.isLaunched) {
        // Sauvegarder l'iss pour l'utiliser plus tard
        await SecureStore.setItemAsync(STORAGE_KEYS.ISS, launch.iss);
        setIss(launch.iss);
        return launch;
      }
      return null;
    } catch (err) {
      console.error('[useEpicAuth] Erreur détection lancement:', err);
      return null;
    }
  }, []);

  // Charger l'état au démarrage
  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  // Écouter les deep links (pour le callback OAuth et lancement Epic)
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      if (!url) return;

      // Vérifier si c'est un callback OAuth
      if (url.includes('oauth') && url.includes('code=')) {
        await handleOAuthCallback(url);
        return;
      }

      // Vérifier si c'est un lancement Epic (avec paramètres launch et iss)
      const params = epicAuthService.parseLaunchParams(url);
      if (params.launch && params.iss) {
        // Sauvegarder l'iss
        await SecureStore.setItemAsync(STORAGE_KEYS.ISS, params.iss);
        setIss(params.iss);
        // Optionnel : connecter automatiquement
        // await connect(params.launch, params.iss);
      }
    };

    // Écouter les liens reçus pendant l'exécution
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Vérifier si l'app a été ouverte via un lien initial
    Linking.getInitialURL().then((url) => {
      if (!url) return;

      // Vérifier si c'est un callback OAuth
      if (url.includes('oauth') && url.includes('code=')) {
        handleOAuthCallback(url);
        return;
      }

      // Vérifier si c'est un lancement Epic
      const params = epicAuthService.parseLaunchParams(url);
      if (params.launch && params.iss) {
        SecureStore.setItemAsync(STORAGE_KEYS.ISS, params.iss).then(() => {
          setIss(params.iss);
        });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [handleOAuthCallback]);

  return {
    // État
    isConnected,
    isLoading,
    error,
    patientId,
    accessToken,
    iss,
    fhirService,
    
    // Fonctions
    connect,
    disconnect,
    handleOAuthCallback,
    detectEpicLaunch,
    refreshAccessToken,
  };
};

export default useEpicAuth;

