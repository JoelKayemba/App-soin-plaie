/**
 * Service FHIR pour Epic
 * 
 * Gère les requêtes FHIR vers Epic pour récupérer les données patient
 */

import { getFhirBaseUrl } from '@/config/epic';

class EpicFHIRService {
  constructor() {
    this.fhirBaseUrl = null;
    this.accessToken = null;
  }

  /**
   * Configure le service avec l'access token et l'URL FHIR
   * 
   * @param {string} accessToken - Access token OAuth
   * @param {string} iss - Issuer URL (optionnel, pour déterminer l'URL FHIR)
   */
  configure(accessToken, iss = null) {
    this.accessToken = accessToken;
    this.fhirBaseUrl = getFhirBaseUrl(iss);
  }

  /**
   * Fait une requête FHIR authentifiée
   * 
   * @param {string} endpoint - Endpoint FHIR (ex: "/Patient/123")
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse FHIR
   */
  async makeRequest(endpoint, options = {}) {
    if (!this.accessToken) {
      throw new Error('Access token non configuré. Appelez configure() d\'abord.');
    }

    if (!this.fhirBaseUrl) {
      throw new Error('URL FHIR non configurée');
    }

    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.fhirBaseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EpicFHIRService] Erreur requête FHIR:', response.status, errorText);
      throw new Error(`Erreur FHIR ${response.status}: ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Récupère les données patient
   * 
   * @param {string} patientId - ID du patient FHIR
   * @returns {Promise<Object>} Ressource Patient FHIR
   */
  async getPatient(patientId) {
    return await this.makeRequest(`/Patient/${patientId}`, {
      method: 'GET',
    });
  }

  /**
   * Récupère les allergies du patient
   * 
   * @param {string} patientId - ID du patient FHIR
   * @returns {Promise<Array>} Liste des ressources AllergyIntolerance
   */
  async getAllergies(patientId) {
    const bundle = await this.makeRequest(`/AllergyIntolerance?patient=${patientId}`, {
      method: 'GET',
    });
    
    return bundle.entry?.map(entry => entry.resource) || [];
  }

  /**
   * Récupère les conditions de santé actives du patient
   * 
   * @param {string} patientId - ID du patient FHIR
   * @returns {Promise<Array>} Liste des ressources Condition
   */
  async getConditions(patientId) {
    const bundle = await this.makeRequest(
      `/Condition?patient=${patientId}&clinical-status=active`,
      {
        method: 'GET',
      }
    );
    
    return bundle.entry?.map(entry => entry.resource) || [];
  }

  /**
   * Récupère les médicaments actifs du patient
   * 
   * @param {string} patientId - ID du patient FHIR
   * @returns {Promise<Array>} Liste des ressources MedicationStatement
   */
  async getMedications(patientId) {
    const bundle = await this.makeRequest(
      `/MedicationStatement?patient=${patientId}&status=active`,
      {
        method: 'GET',
      }
    );
    
    return bundle.entry?.map(entry => entry.resource) || [];
  }

  /**
   * Récupère le Patient Summary (RDP-CA) depuis Epic
   * 
   * @param {string} patientId - ID du patient FHIR
   * @returns {Promise<Object>} Bundle FHIR contenant le Patient Summary
   */
  async getPatientSummary(patientId) {
    try {
      // Essayer d'abord le endpoint $summary s'il existe
      const summary = await this.makeRequest(`/Patient/${patientId}/$summary`, {
        method: 'GET',
      });
      
      return summary;
    } catch (error) {
      console.warn('[EpicFHIRService] Endpoint $summary non disponible, construction manuelle');
      
      // Fallback : construire le résumé manuellement
      return await this.buildPatientSummary(patientId);
    }
  }

  /**
   * Construit un Patient Summary manuellement depuis les ressources FHIR
   * 
   * @param {string} patientId - ID du patient FHIR
   * @returns {Promise<Object>} Bundle FHIR contenant le résumé
   */
  async buildPatientSummary(patientId) {
    const [patient, allergies, conditions, medications] = await Promise.all([
      this.getPatient(patientId),
      this.getAllergies(patientId),
      this.getConditions(patientId),
      this.getMedications(patientId),
    ]);

    // Construire un Bundle FHIR
    const bundle = {
      resourceType: 'Bundle',
      type: 'document',
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patientId}`,
          resource: patient,
        },
        ...allergies.map((allergy, index) => ({
          fullUrl: `urn:uuid:allergy-${index}`,
          resource: allergy,
        })),
        ...conditions.map((condition, index) => ({
          fullUrl: `urn:uuid:condition-${index}`,
          resource: condition,
        })),
        ...medications.map((medication, index) => ({
          fullUrl: `urn:uuid:medication-${index}`,
          resource: medication,
        })),
      ],
    };

    return bundle;
  }

  /**
   * Recherche un patient par identifiant
   * 
   * @param {string} identifier - Identifiant du patient (ex: numéro RAMQ)
   * @returns {Promise<Array>} Liste de patients trouvés
   */
  async searchPatient(identifier) {
    const bundle = await this.makeRequest(`/Patient?identifier=${identifier}`, {
      method: 'GET',
    });
    
    return bundle.entry?.map(entry => entry.resource) || [];
  }

  /**
   * Crée une Observation FHIR
   * 
   * @param {Object} observation - Ressource Observation FHIR
   * @returns {Promise<Object>} Observation créée
   */
  async createObservation(observation) {
    return await this.makeRequest('/Observation', {
      method: 'POST',
      body: JSON.stringify(observation),
    });
  }

  /**
   * Envoie un Bundle FHIR vers Epic
   * 
   * @param {Object} bundle - Bundle FHIR à envoyer
   * @returns {Promise<Object>} Réponse Epic
   */
  async sendBundle(bundle) {
    return await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify(bundle),
    });
  }
}

export default EpicFHIRService;




