/**
 * Context React pour partager l'état Epic dans l'application
 * 
 * Fournit un accès global à l'authentification Epic,
 * aux données patient, et aux services FHIR
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useEpicAuth } from '@/hooks/useEpicAuth';
import EpicFHIRService from '@/integration/epic/services/EpicFHIRService';
import epicDataMapper from '@/integration/epic/mappers/EpicDataMapper';

const EpicContext = createContext(null);

/**
 * Hook pour utiliser le contexte Epic
 * 
 * @returns {Object} État et fonctions Epic
 */
export const useEpic = () => {
  const context = useContext(EpicContext);
  if (!context) {
    throw new Error('useEpic must be used within an EpicProvider');
  }
  return context;
};

/**
 * Provider pour le contexte Epic
 */
export const EpicProvider = ({ children }) => {
  const auth = useEpicAuth();
  
  // Instance du service FHIR (configurée automatiquement par useEpicAuth)
  const fhirService = useMemo(() => {
    if (auth.accessToken) {
      const service = new EpicFHIRService();
      service.configure(auth.accessToken, auth.iss);
      return service;
    }
    return null;
  }, [auth.accessToken, auth.iss]);

  /**
   * Charge les données patient depuis Epic
   * 
   * @param {string} patientId - ID du patient (optionnel, utilise le patient connecté si non fourni)
   * @returns {Promise<Object>} Données patient formatées pour l'évaluation
   */
  const loadPatientData = async (patientId = null) => {
    if (!fhirService) {
      throw new Error('Non connecté à Epic');
    }

    const targetPatientId = patientId || auth.patientId;
    if (!targetPatientId) {
      throw new Error('ID patient non disponible');
    }

    try {
      // Récupérer toutes les données en parallèle
      const [patient, allergies, conditions, medications] = await Promise.all([
        fhirService.getPatient(targetPatientId),
        fhirService.getAllergies(targetPatientId),
        fhirService.getConditions(targetPatientId),
        fhirService.getMedications(targetPatientId),
      ]);

      // Mapper vers le format de l'application
      const mappedData = epicDataMapper.mapEpicDataToEvaluation({
        patient,
        allergies,
        conditions,
        medications,
      });

      return {
        raw: {
          patient,
          allergies,
          conditions,
          medications,
        },
        mapped: mappedData,
        patientName: epicDataMapper.getPatientFullName(patient),
        patientId: targetPatientId,
      };
    } catch (error) {
      console.error('[EpicContext] Erreur chargement données patient:', error);
      throw error;
    }
  };

  /**
   * Charge le Patient Summary (RDP-CA) depuis Epic
   * 
   * @param {string} patientId - ID du patient (optionnel)
   * @returns {Promise<Object>} Bundle FHIR contenant le Patient Summary
   */
  const loadPatientSummary = async (patientId = null) => {
    if (!fhirService) {
      throw new Error('Non connecté à Epic');
    }

    const targetPatientId = patientId || auth.patientId;
    if (!targetPatientId) {
      throw new Error('ID patient non disponible');
    }

    try {
      return await fhirService.getPatientSummary(targetPatientId);
    } catch (error) {
      console.error('[EpicContext] Erreur chargement Patient Summary:', error);
      throw error;
    }
  };

  /**
   * Envoie une évaluation complétée vers Epic
   * 
   * @param {Object} evaluation - Données de l'évaluation à envoyer
   * @returns {Promise<Object>} Réponse Epic
   */
  const sendEvaluationToEpic = async (evaluation) => {
    if (!fhirService) {
      throw new Error('Non connecté à Epic');
    }

    try {
      // TODO: Convertir l'évaluation en ressources FHIR (Observation, etc.)
      // Pour l'instant, cette fonction est un placeholder
      // Vous devrez créer un mapper inverse (Evaluation → FHIR)
      
      console.warn('[EpicContext] sendEvaluationToEpic non implémenté');
      throw new Error('Fonctionnalité non implémentée');
    } catch (error) {
      console.error('[EpicContext] Erreur envoi évaluation:', error);
      throw error;
    }
  };

  // Valeur du contexte
  const value = useMemo(() => ({
    // État d'authentification
    isConnected: auth.isConnected,
    isLoading: auth.isLoading,
    error: auth.error,
    patientId: auth.patientId,
    accessToken: auth.accessToken,
    iss: auth.iss,

    // Services
    fhirService,

    // Fonctions d'authentification
    connect: auth.connect,
    disconnect: auth.disconnect,
    detectEpicLaunch: auth.detectEpicLaunch,
    refreshAccessToken: auth.refreshAccessToken,

    // Fonctions de données
    loadPatientData,
    loadPatientSummary,
    sendEvaluationToEpic,
  }), [
    auth.isConnected,
    auth.isLoading,
    auth.error,
    auth.patientId,
    auth.accessToken,
    auth.iss,
    auth.connect,
    auth.disconnect,
    auth.detectEpicLaunch,
    auth.refreshAccessToken,
    fhirService,
  ]);

  return (
    <EpicContext.Provider value={value}>
      {children}
    </EpicContext.Provider>
  );
};

export default EpicProvider;

