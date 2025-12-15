/**
 * Service PKCE (Proof Key for Code Exchange)
 * 
 * PKCE est une extension OAuth 2.0 pour améliorer la sécurité
 * des applications natives (comme React Native) qui ne peuvent pas
 * stocker de client secret de manière sécurisée.
 * 
 * Référence : RFC 7636
 */

import * as Crypto from 'expo-crypto';

/**
 * Génère une chaîne aléatoire pour le code verifier
 * 
 * @param {number} length - Longueur de la chaîne (par défaut 128)
 * @returns {Promise<string>} Code verifier
 */
export const generateCodeVerifier = async (length = 128) => {
  try {
    // Générer des octets aléatoires
    const randomBytes = await Crypto.getRandomBytesAsync(length);
    
    // Convertir en base64url (sans padding, avec caractères URL-safe)
    const base64 = btoa(String.fromCharCode(...randomBytes));
    const base64url = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return base64url;
  } catch (error) {
    console.error('[PKCEService] Erreur génération code verifier:', error);
    throw new Error('Impossible de générer le code verifier');
  }
};

/**
 * Génère le code challenge à partir du code verifier
 * 
 * @param {string} codeVerifier - Code verifier généré
 * @returns {Promise<string>} Code challenge (SHA256 hash encodé en base64url)
 */
export const generateCodeChallenge = async (codeVerifier) => {
  try {
    // Calculer SHA256 du code verifier
    // digestStringAsync retourne une chaîne hex par défaut
    const hashHex = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
    
    // Convertir hex → bytes → base64url
    // Convertir la chaîne hex en tableau de bytes
    const bytes = [];
    for (let i = 0; i < hashHex.length; i += 2) {
      bytes.push(parseInt(hashHex.substr(i, 2), 16));
    }
    
    // Convertir bytes en base64
    const base64 = btoa(String.fromCharCode(...bytes));
    
    // Convertir base64 en base64url (URL-safe)
    const base64url = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return base64url;
  } catch (error) {
    console.error('[PKCEService] Erreur génération code challenge:', error);
    throw new Error('Impossible de générer le code challenge');
  }
};

/**
 * Génère un code verifier et son challenge PKCE
 * 
 * @param {number} length - Longueur du code verifier (par défaut 128)
 * @returns {Promise<{codeVerifier: string, codeChallenge: string, codeChallengeMethod: string}>}
 */
export const generatePKCE = async (length = 128) => {
  try {
    const codeVerifier = await generateCodeVerifier(length);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256', // Epic supporte uniquement S256
    };
  } catch (error) {
    console.error('[PKCEService] Erreur génération PKCE:', error);
    throw error;
  }
};

/**
 * Génère un state aléatoire pour la sécurité OAuth
 * 
 * Le state est utilisé pour prévenir les attaques CSRF
 * 
 * @param {number} length - Longueur du state (par défaut 32)
 * @returns {Promise<string>} State aléatoire
 */
export const generateState = async (length = 32) => {
  try {
    const randomBytes = await Crypto.getRandomBytesAsync(length);
    const base64 = btoa(String.fromCharCode(...randomBytes));
    const base64url = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return base64url;
  } catch (error) {
    console.error('[PKCEService] Erreur génération state:', error);
    throw new Error('Impossible de générer le state');
  }
};

export default {
  generateCodeVerifier,
  generateCodeChallenge,
  generatePKCE,
  generateState,
};

