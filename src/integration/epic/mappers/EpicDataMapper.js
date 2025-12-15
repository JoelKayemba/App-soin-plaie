/**
 * Mapper de Données Epic FHIR → Format Application
 * 
 * Convertit les ressources FHIR Epic vers le format utilisé
 * par l'application pour pré-remplir les évaluations
 */

class EpicDataMapper {
  /**
   * Mappe les données patient Epic vers le format de l'évaluation
   * 
   * @param {Object} patient - Ressource FHIR Patient
   * @returns {Object} Données mappées pour C1T01 (Données de base)
   */
  mapPatientToEvaluation(patient) {
    const mapping = {};
    
    // Date de naissance (C1T01E01)
    if (patient.birthDate) {
      mapping['C1T01E01'] = patient.birthDate;
    }
    
    // Nom et prénom (si ces champs existent dans votre table)
    if (patient.name && patient.name.length > 0) {
      const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
      if (officialName.given && officialName.given.length > 0) {
        mapping['C1T01E02'] = officialName.given.join(' '); // Prénom
      }
      if (officialName.family) {
        mapping['C1T01E03'] = officialName.family; // Nom de famille
      }
    }
    
    // Sexe/genre (si ce champ existe)
    if (patient.gender) {
      mapping['C1T01E04'] = patient.gender;
    }
    
    // Identifiants (ex: RAMQ)
    if (patient.identifier && patient.identifier.length > 0) {
      const ramqId = patient.identifier.find(id => 
        id.system?.includes('ramq') || id.type?.coding?.[0]?.code === 'JHN'
      );
      if (ramqId && ramqId.value) {
        mapping['C1T01E05'] = ramqId.value;
      }
    }
    
    return mapping;
  }

  /**
   * Mappe les allergies Epic vers le format de l'évaluation
   * 
   * Structure de C1T02 : Champs booléens individuels
   * - C1T02E01 : Chlorhexidine
   * - C1T02E02 : Iode
   * - C1T02E03 : Latex
   * - C1T02E04 : Autre (avec texte)
   * 
   * @param {Array<Object>} allergies - Liste de ressources FHIR AllergyIntolerance
   * @returns {Object} Mapping des allergies avec les IDs de champs comme clés
   */
  mapAllergiesToEvaluation(allergies) {
    const mapping = {};
    
    if (!allergies || allergies.length === 0) {
      return mapping;
    }
    
    const otherAllergies = [];
    
    allergies
      .filter(allergy => {
        // Filtrer uniquement les allergies actives
        const status = allergy.clinicalStatus?.coding?.[0]?.code;
        return status === 'active' || status === 'confirmed';
      })
      .forEach(allergy => {
        const substance = this.getDisplay(allergy.code);
        const lowerSubstance = substance?.toLowerCase() || '';
        
        // Mapping vers les champs spécifiques
        if (lowerSubstance.includes('chlorhexidine') || lowerSubstance.includes('chlorhexidine')) {
          mapping['C1T02E01'] = true; // Chlorhexidine
        } else if (lowerSubstance.includes('iode') || lowerSubstance.includes('iodine')) {
          mapping['C1T02E02'] = true; // Iode
        } else if (lowerSubstance.includes('latex')) {
          mapping['C1T02E03'] = true; // Latex
        } else {
          // Autres allergies → ajouter dans "Autre"
          otherAllergies.push(substance);
        }
      });
    
    // Si des allergies "autres" existent, cocher C1T02E04 et ajouter le texte
    if (otherAllergies.length > 0) {
      mapping['C1T02E04'] = true;
      mapping['C1T02E04_text'] = otherAllergies.join(', '); // Texte pour le champ "Autre"
    }
    
    return mapping;
  }

  /**
   * Mappe les conditions de santé Epic vers le format de l'évaluation
   * 
   * Structure de C1T03 : Champs booléens individuels
   * - C1T03E01 : Altération de la capacité cognitive
   * - C1T03E02 : Amputation
   * - C1T03E03 : Anémie non contrôlée
   * - C1T03E04 : Cancer actif
   * - C1T03E07 : Désaturation en O₂
   * - C1T03E08 : Diabète type 1
   * - C1T03E09 : Diabète type 2
   * etc.
   * 
   * @param {Array<Object>} conditions - Liste de ressources FHIR Condition
   * @returns {Object} Mapping des conditions avec les IDs de champs comme clés
   */
  mapConditionsToEvaluation(conditions) {
    const mapping = {};
    
    if (!conditions || conditions.length === 0) {
      return mapping;
    }
    
    conditions
      .filter(condition => {
        // Filtrer uniquement les conditions actives
        const status = condition.clinicalStatus?.coding?.[0]?.code;
        return status === 'active' || status === 'recurrence' || status === 'relapse';
      })
      .forEach(condition => {
        const code = this.getDisplay(condition.code);
        const lowerCode = code?.toLowerCase() || '';
        
        // Mapping vers les champs spécifiques de C1T03
        if (lowerCode.includes('cognitive') || lowerCode.includes('dementia') || 
            lowerCode.includes('confusion') || lowerCode.includes('memory')) {
          mapping['C1T03E01'] = true; // Altération cognitive
        } else if (lowerCode.includes('amputation')) {
          mapping['C1T03E02'] = true; // Amputation
        } else if (lowerCode.includes('anemia') || lowerCode.includes('anémie')) {
          mapping['C1T03E03'] = true; // Anémie non contrôlée
        } else if (lowerCode.includes('cancer') || lowerCode.includes('malignant') || 
                   lowerCode.includes('neoplasm')) {
          mapping['C1T03E04'] = true; // Cancer actif
        } else if (lowerCode.includes('hepatic') || lowerCode.includes('liver') || 
                   lowerCode.includes('hépatique')) {
          mapping['C1T03E05'] = true; // Maladie hépatique
        } else if (lowerCode.includes('immunosuppress') || lowerCode.includes('hiv')) {
          mapping['C1T03E06'] = true; // Immunosuppression
        } else if (lowerCode.includes('oxygen') || lowerCode.includes('oxygène') || 
                   lowerCode.includes('saturation')) {
          mapping['C1T03E07'] = true; // Désaturation O₂
        } else if (lowerCode.includes('diabetes type 1') || 
                   lowerCode.includes('diabète type 1') ||
                   (lowerCode.includes('diabetes') && lowerCode.includes('type 1'))) {
          mapping['C1T03E08'] = true; // Diabète type 1
        } else if (lowerCode.includes('diabetes type 2') || 
                   lowerCode.includes('diabète type 2') ||
                   (lowerCode.includes('diabetes') && lowerCode.includes('type 2'))) {
          mapping['C1T03E09'] = true; // Diabète type 2
        }
        // Ajoutez d'autres mappings selon les IDs de vos champs
      });
    
    return mapping;
  }

  /**
   * Mappe les médicaments Epic vers le format de l'évaluation
   * 
   * Structure de C1T07 : Champs booléens individuels
   * - C1T07E01 : AINS
   * - C1T07E02 : Antibiotique
   * - C1T07E03 : Anticoagulant
   * - C1T07E05 : Chimiothérapie
   * etc.
   * 
   * @param {Array<Object>} medications - Liste de ressources FHIR MedicationStatement
   * @returns {Object} Mapping des médicaments avec les IDs de champs comme clés
   */
  mapMedicationsToEvaluation(medications) {
    const mapping = {};
    
    if (!medications || medications.length === 0) {
      return mapping;
    }
    
    medications
      .filter(medication => {
        // Filtrer uniquement les médicaments actifs
        const status = medication.status;
        return status === 'active' || status === 'intended' || status === 'on-hold';
      })
      .forEach(medication => {
        const medName = this.getDisplay(medication.medicationCodeableConcept);
        const lowerName = medName?.toLowerCase() || '';
        
        // Mapping vers les champs spécifiques de C1T07
        if (lowerName.includes('nsaid') || lowerName.includes('ibuprofen') || 
            lowerName.includes('naproxen') || lowerName.includes('diclofenac') ||
            lowerName.includes('anti-inflammatoire')) {
          mapping['C1T07E01'] = true; // AINS
        } else if (lowerName.includes('antibiotic') || lowerName.includes('antibiotique') ||
                   lowerName.includes('penicillin') || lowerName.includes('cephalosporin')) {
          mapping['C1T07E02'] = true; // Antibiotique
        } else if (lowerName.includes('anticoagulant') || lowerName.includes('warfarin') ||
                   lowerName.includes('heparin') || lowerName.includes('apixaban') ||
                   lowerName.includes('rivaroxaban')) {
          mapping['C1T07E03'] = true; // Anticoagulant
        } else if (lowerName.includes('antiplatelet') || lowerName.includes('antiplaquettaire') ||
                   lowerName.includes('aspirin') || lowerName.includes('clopidogrel')) {
          mapping['C1T07E04'] = true; // Antiplaquettaire
        } else if (lowerName.includes('chemotherapy') || lowerName.includes('chimiothérapie') ||
                   lowerName.includes('chemotherapy')) {
          mapping['C1T07E05'] = true; // Chimiothérapie
        } else if (lowerName.includes('colchicine')) {
          mapping['C1T07E06'] = true; // Colchicine
        } else if (lowerName.includes('corticosteroid') || lowerName.includes('corticoïde') ||
                   lowerName.includes('prednisone') || lowerName.includes('prednisolone')) {
          mapping['C1T07E07'] = true; // Corticostéroïde
        }
        // Ajoutez d'autres mappings selon les IDs de vos champs
      });
    
    return mapping;
  }

  /**
   * Mappe toutes les données Epic vers le format d'évaluation complet
   * 
   * @param {Object} epicData - Objet contenant patient, allergies, conditions, medications
   * @returns {Object} Mapping complet pour toutes les tables d'évaluation
   */
  mapEpicDataToEvaluation(epicData) {
    const mapping = {};
    
    // Données patient (C1T01)
    if (epicData.patient) {
      Object.assign(mapping, this.mapPatientToEvaluation(epicData.patient));
    }
    
    // Allergies (C1T02)
    if (epicData.allergies) {
      mapping['C1T02'] = this.mapAllergiesToEvaluation(epicData.allergies);
    }
    
    // Conditions de santé (C1T03)
    if (epicData.conditions) {
      mapping['C1T03'] = this.mapConditionsToEvaluation(epicData.conditions);
    }
    
    // Médications (C1T07)
    if (epicData.medications) {
      mapping['C1T07'] = this.mapMedicationsToEvaluation(epicData.medications);
    }
    
    return mapping;
  }

  /**
   * Extrait le display text d'un CodeableConcept FHIR
   * 
   * @param {Object} codeableConcept - CodeableConcept FHIR
   * @returns {string} Texte à afficher
   */
  getDisplay(codeableConcept) {
    if (!codeableConcept) {
      return '';
    }
    
    // Si c'est un string, le retourner tel quel
    if (typeof codeableConcept === 'string') {
      return codeableConcept;
    }
    
    // Essayer d'extraire depuis coding
    if (codeableConcept.coding && codeableConcept.coding.length > 0) {
      const coding = codeableConcept.coding[0];
      return coding.display || coding.code || '';
    }
    
    // Essayer le champ text
    if (codeableConcept.text) {
      return codeableConcept.text;
    }
    
    return '';
  }

  /**
   * Extrait le nom complet d'un Patient FHIR
   * 
   * @param {Object} patient - Ressource FHIR Patient
   * @returns {string} Nom complet
   */
  getPatientFullName(patient) {
    if (!patient.name || patient.name.length === 0) {
      return '';
    }
    
    const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
    const parts = [];
    
    if (officialName.given && officialName.given.length > 0) {
      parts.push(...officialName.given);
    }
    if (officialName.family) {
      parts.push(officialName.family);
    }
    
    return parts.join(' ');
  }
}

export default new EpicDataMapper();

