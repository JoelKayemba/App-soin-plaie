import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TView, TText } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import { 
  RadioGroup, 
  CheckboxGroup, 
  NumericInput, 
  TextInput, 
  DateInput,
  DateTextInput,
  BooleanInput,
  SimpleCheckbox,
  CheckboxWithText,
  CalculatedField,
  ResultBadge,
  InfoField,
  MultipleChoiceWithText,
  PhotoUpload,
  ScaleInput,
  VisualScale,
  PACSLACScale,
  VisualSelector,
  SpecializedAlert
} from './forms';
import { BWATAttribution, ClinicalAlert, BradenScale } from './special';
import DebugInfo from './DebugInfo';
import spacing from '@/styles/spacing';

// Import des helpers
import burnStagesData from '@/data/evaluations/evaluation_helpers/burn_stages.json';
import pressureStagesData from '@/data/evaluations/evaluation_helpers/pressure_stages.json';

const ContentDetector = ({ 
  tableData, 
  data, 
  errors, 
  onDataChange, 
  onValidationChange,
  onNavigateToTable,
  evaluationData 
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // States pour les modales et alertes
  const [specializedAlertVisible, setSpecializedAlertVisible] = useState(false);
  const [specializedCondition, setSpecializedCondition] = useState('');
  const [questionnaireKey, setQuestionnaireKey] = useState(0);

  // Fonction pour fermer le clavier
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Fonction utilitaire pour créer des éléments React
  const createElement = (Component, additionalProps = {}, keyOrChildren = null, children = null) => {
    // Si le troisième paramètre est une string, c'est une key
    // Sinon, c'est probablement des children
    if (typeof keyOrChildren === 'string') {
      if (children) {
        return <Component key={keyOrChildren} {...additionalProps}>{children}</Component>;
      }
      return <Component key={keyOrChildren} {...additionalProps} />;
    } else {
      // Le troisième paramètre est des children
      if (keyOrChildren) {
        return <Component {...additionalProps}>{keyOrChildren}</Component>;
      }
      return <Component {...additionalProps} />;
    }
  };

  // Fonction pour calculer l'âge de la plaie
  const calculateWoundAge = (appearanceDate) => {
    if (!appearanceDate) return null;
    
    const today = new Date();
    const woundDate = new Date(appearanceDate);
    const diffTime = Math.abs(today - woundDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      isRecent: diffDays <= 28, // < 4 semaines
      isChronic: diffDays > 28  // ≥ 4 semaines
    };
  };

  // Fonction pour interpréter les résultats IPSCB (identique à useIPSCBCalculator.js)
  const interpretIPSCB = (valeur) => {
    if (!valeur) return null;
    
    const num = parseFloat(valeur);
    if (num > 1.40) return {
      niveau: 'Indéterminé',
      description: 'Artères non compressibles',
      color: '#9E9E9E'
    };
    if (num >= 1.0) return {
      niveau: 'Normal',
      description: 'Valeur normale',
      color: '#4CAF50'
    };
    if (num >= 0.9) return {
      niveau: 'Limite',
      description: 'Valeur limite',
      color: '#FF9800'
    };
    if (num >= 0.7) return {
      niveau: 'Anormal, atteinte légère',
      description: 'Atteinte artérielle légère',
      color: '#FFC107'
    };
    if (num >= 0.4) return {
      niveau: 'Anormal, atteinte modérée',
      description: 'Atteinte artérielle modérée',
      color: '#FF5722'
    };
    return {
      niveau: 'Anormal, atteinte sévère',
      description: 'Atteinte artérielle sévère',
      color: '#D32F2F'
    };
  };

  // Fonction pour calculer les indices IPSCB
  const calculateIPSCB = () => {
    if (tableData?.id !== 'C1T15') return;
    
    // C1T15D01 est maintenant "la plus élevée des deux bras"
    const pasBrasMax = parseFloat(data['C1T15D01']) || 0;
    const tibialePosterieureDroite = parseFloat(data['C1T15D03']) || 0;
    const pedieuseDroite = parseFloat(data['C1T15D04']) || 0;
    const tibialePosterieureGauche = parseFloat(data['C1T15D05']) || 0;
    const pedieuseGauche = parseFloat(data['C1T15D06']) || 0;
    
    if (pasBrasMax === 0) return; // Pas de calcul si aucun bras
    
    // Calculer les 4 indices IPSCB
    const calculerIPSCB = (pressionPied) => {
      if (pressionPied === 0) return null;
      return (pressionPied / pasBrasMax).toFixed(2);
    };
    
    const nouveauxCalculs = {
      'C1T15D07': calculerIPSCB(tibialePosterieureDroite),
      'C1T15D08': calculerIPSCB(pedieuseDroite),
      'C1T15D09': calculerIPSCB(tibialePosterieureGauche),
      'C1T15D10': calculerIPSCB(pedieuseGauche)
    };
    
    // Vérifier s'il y a des changements à appliquer
    const hasChanges = Object.keys(nouveauxCalculs).some(key => {
      const nouvelleValeur = nouveauxCalculs[key];
      const valeurActuelle = data[key];
      return nouvelleValeur !== valeurActuelle;
    });
    
    if (hasChanges) {
      // Appliquer les nouveaux calculs
      Object.keys(nouveauxCalculs).forEach(key => {
        if (nouveauxCalculs[key] !== null) {
          onDataChange(key, nouveauxCalculs[key]);
        }
      });
    }
  };

  // Auto-calcul des indices IPSCB quand les valeurs changent
  useEffect(() => {
    calculateIPSCB();
  }, [data['C1T15D01'], data['C1T15D03'], data['C1T15D04'], data['C1T15D05'], data['C1T15D06']]);

  // Fonction pour calculer la surface de la plaie BWAT
  const calculateBWATSurface = () => {
    if (tableData?.id !== 'C1T16') return;
    
    const longueur = parseFloat(data['C1T16E01']) || 0;
    const largeur = parseFloat(data['C1T16E02']) || 0;
    
    if (longueur > 0 && largeur > 0) {
      const surface = (longueur * largeur).toFixed(1);
      if (data['C1T16E03'] !== surface) {
        onDataChange('C1T16E03', surface);
      }
    }
  };

  // Fonction pour classer selon l'échelle BWAT
  const classifyBWATSize = (surface) => {
    const num = parseFloat(surface) || 0;
    
    if (num === 0) return {
      score: 0,
      label: 'Plaie guérie',
      description: 'Plaie complètement guérie',
      color: '#4CAF50'
    };
    if (num < 4) return {
      score: 1,
      label: '< 4 cm²',
      description: 'Surface inférieure à 4 cm²',
      color: '#8BC34A'
    };
    if (num <= 16) return {
      score: 2,
      label: '4 à 16 cm²',
      description: 'Surface entre 4 et 16 cm²',
      color: '#FFC107'
    };
    if (num <= 36) return {
      score: 3,
      label: '16,1 à 36 cm²',
      description: 'Surface entre 16,1 et 36 cm²',
      color: '#FF9800'
    };
    if (num <= 80) return {
      score: 4,
      label: '36,1 à 80 cm²',
      description: 'Surface entre 36,1 et 80 cm²',
      color: '#F44336'
    };
    return {
      score: 5,
      label: '> 80 cm²',
      description: 'Surface supérieure à 80 cm²',
      color: '#9C27B0'
    };
  };

  // Auto-calcul de la surface BWAT quand les valeurs changent
  useEffect(() => {
    calculateBWATSurface();
  }, [data['C1T16E01'], data['C1T16E02']]);

  // Forcer le re-rendu du questionnaire d'Édimbourg quand la première question change
  useEffect(() => {
    if (tableData?.id === 'C1T15') {
      setQuestionnaireKey(prev => prev + 1);
    }
  }, [data['C1T15E01']]);

  // Forcer le re-rendu des champs conditionnels de la table 20 quand la sélection change
  useEffect(() => {
    if (tableData?.id === 'C1T20') {
      // Le re-rendu se fera automatiquement via shouldShowElement qui vérifie data['C1T20E01']
    }
  }, [data['C1T20E01']]);

  // Fonction pour afficher l'aide (helper modal)
  const showHelper = (helpId, title) => {
    let helperData = null;
    
    if (helpId.startsWith('burn_stage')) {
      helperData = burnStagesData.helpers[helpId];
    } else if (helpId.startsWith('pressure_stage')) {
      helperData = pressureStagesData.helpers[helpId];
    }
    
    if (helperData) {
      console.log('[ContentDetector] Helper chargé:', helpId, helperData);
      navigation.navigate('HelperDetails', {
        helperId: helpId,
        helperTitle: title || helperData.title,
        helperData
      });
    } else {
      console.warn('[ContentDetector] Aucun helper trouvé pour', helpId);
    }
  };

  // Fonction pour afficher l'alerte spécialisée
  const showSpecializedAlert = (condition) => {
    setSpecializedCondition(condition);
    setSpecializedAlertVisible(true);
  };

  const renderSpecialNote = () => {
    if (!tableData?.special_note) return null;
    const { title, message, severity } = tableData.special_note;
    const alertType = severity === 'critical' ? 'alert' : severity === 'important' ? 'important' : 'info';

    return (
      <TView style={{ marginBottom: spacing.lg }}>
        <ClinicalAlert
          alert={{
            type: alertType,
            title: title || 'Information importante',
            message
          }}
        />
      </TView>
    );
  };

  // Fonction pour rendre un élément selon son type
  const renderElement = (element) => {
    if (!element || !element.id) {
      console.warn('Table 22 - Élément invalide:', element);
      return null;
    }

    // Debug pour la table 22
    if (tableData.id === 'C1T22') {
      console.log('Table 22 - renderElement appelé pour:', element.id, 'type:', element.type, 'options:', element.options?.length);
    }

    const commonProps = {
      error: errors[element.id],
      disabled: element.disabled || false,
      help: element.help,
      style: element.style,
    };

    // Fonction locale pour créer l'élément avec les props communes
    const createElementWithCommonProps = (Component, additionalProps = {}) => 
      createElement(Component, { ...commonProps, ...additionalProps }, element.id);

    switch (element.type) {
      case 'single_choice':
        // Pour la table 04 (Poids & IMC), utiliser SimpleCheckbox pour les choix binaires sans options
        if (tableData.id === 'C1T04' && (!element.options || element.options.length === 0)) {
          return createElementWithCommonProps(SimpleCheckbox, {
            value: data[element.id] || false,
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            required: element.required,
            help: element.help
          });
        }
        
        // Pour la table 11, ajouter la gestion des helpers pour les stades
        const enhancedOptions = tableData.id === 'C1T11' && element.options ? 
          element.options.map(option => ({
            ...option,
            onHelpPress: option.help_id ? () => showHelper(option.help_id, option.label) : undefined
          })) : 
          element.options || [];

        // Pour la table 24, vérifier si le biofilm est suspecté et afficher une alerte stylisée
        if (tableData.id === 'C1T24' && element.id === 'C1T24E01') {
          const selectedValue = data[element.id];
          const isBiofilmSuspect = selectedValue && selectedValue !== 'C1T24E01_01';
          
          const radioGroupElement = createElementWithCommonProps(RadioGroup, {
            options: enhancedOptions,
            value: data[element.id],
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            required: element.required,
            error: undefined // Ne pas afficher l'erreur dans le RadioGroup, utiliser ClinicalAlert à la place
          });
          
          if (isBiofilmSuspect) {
            const alertElement = createElement(ClinicalAlert, {
              alert: {
                type: 'warning',
                title: 'Biofilm suspecté',
                message: tableData.validation_rules?.error_messages?.biofilm_suspect || 
                  "Biofilm suspecté : évaluation approfondie recommandée (épithélium ≠ 100%)",
                note: "Lorsque l'épithéliatisation n'est pas complète (≠ 100%), un biofilm peut être présent et nécessite une évaluation approfondie."
              },
              style: { marginTop: spacing.md }
            }, `${element.id}-biofilm-alert`);
            
            return (
              <React.Fragment key={element.id}>
                {radioGroupElement}
                {alertElement}
              </React.Fragment>
            );
          }
          
          return radioGroupElement;
        }

        return createElementWithCommonProps(RadioGroup, {
          options: enhancedOptions,
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required
        });

      case 'multiple_choice':
      case 'multiple_selection':
        return createElementWithCommonProps(CheckboxGroup, {
          options: element.options || [],
          value: data[element.id] || [],
          onValueChange: (values) => handleDataChange(element.id, values),
          label: element.label,
          description: element.description,
          required: element.required,
          minSelections: element.minSelections,
          maxSelections: element.maxSelections
        });

      case 'multiple_choice_with_text':
        // Pour les tables avec champs de texte (allergies, conditions de santé, facteurs de risque), utiliser CheckboxWithText
        if (tableData.id === 'C1T02' || tableData.id === 'C1T03' || tableData.id === 'C1T06') {
          return createElementWithCommonProps(CheckboxWithText, {
            value: data[element.id] || { checked: false, text: '' },
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            required: element.required,
            placeholder: element.conditional?.text_field_placeholder || "Précisez...",
            textFieldLabel: element.conditional?.text_field_label || "Détails",
            maxLength: element.conditional?.text_field_max_length || 200,
            help: element.help
          });
        }
        
        // Pour les autres tables, utiliser MultipleChoiceWithText
        return createElementWithCommonProps(MultipleChoiceWithText, {
          options: element.options || [],
          value: data[element.id] || {},
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          minSelections: element.minSelections,
          maxSelections: element.maxSelections,
          placeholder: element.placeholder
        });

      case 'boolean':
        if (tableData.id === 'C1T27') {
          const currentValue = !!data[element.id];
          const checkboxElement = createElement(SimpleCheckbox, {
            ...commonProps,
            value: currentValue,
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            required: element.required,
            help: element.help
          }, element.id);

          if (element.alert && currentValue) {
            const alertElement = createElement(ClinicalAlert, {
              alert: {
                type: element.alert?.type === 'emergency' ? 'alert' : 'important',
                title: element.alert?.title || 'Urgence clinique détectée',
                message: element.alert?.message || 'Ce signe requiert une prise en charge immédiate.',
                note: "Orienter immédiatement le patient vers l'urgence ou contacter un médecin."
              },
              style: { marginTop: spacing.md }
            }, `${element.id}-alert`);

            return (
              <React.Fragment key={`${element.id}-wrapper`}>
                {checkboxElement}
                {alertElement}
              </React.Fragment>
            );
          }

          return checkboxElement;
        }

        // Pour les tables avec sélections multiples (allergies, conditions de santé, nutrition, médication, psychosocial), utiliser SimpleCheckbox
        if (tableData.id === 'C1T02' || tableData.id === 'C1T03' || tableData.id === 'C1T05' || tableData.id === 'C1T07' || tableData.id === 'C1T08') {
          return createElementWithCommonProps(SimpleCheckbox, {
            value: data[element.id] || false,
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            required: element.required,
            help: element.help
          });
        }
        
        // Pour les autres tables, utiliser BooleanInput (Oui/Non)
        return createElementWithCommonProps(BooleanInput, {
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required
        });

      case 'number':
        return createElementWithCommonProps(NumericInput, {
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder,
          unit: element.unit,
          unit_options: element.unit_options,
          required: element.required,
          min: element.validation?.min,
          max: element.validation?.max,
          step: element.validation?.step,
          precision: element.validation?.precision,
          help: element.help
        });

      case 'text':
        // Vérifier si c'est un TextArea (Table 13) ou TextInput standard
        const isTextArea = element.ui?.component === 'TextArea' || element.rows > 1 || element.multiline;
        
        if (isTextArea) {
          return createElementWithCommonProps(TextInput, {
            value: data[element.id] || '',
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            placeholder: element.placeholder || element.ui?.placeholder,
            required: element.required,
            multiline: true,
            minLength: element.validation?.min_length || element.min_length,
            maxLength: element.validation?.max_length || element.max_length || 1000
          });
        }
        
        return createElementWithCommonProps(TextInput, {
          value: data[element.id] || '',
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder || element.ui?.placeholder,
          required: element.required,
          multiline: element.multiline || false,
          minLength: element.validation?.min_length || element.min_length,
          maxLength: element.validation?.max_length || element.max_length
        });

      case 'date':
        // Utiliser DateTextInput pour les champs de date de naissance (format AAAA-MM-JJ)
        if (element.id?.includes('birth') || element.id?.includes('naissance') || 
            element.label?.toLowerCase().includes('naissance') || 
            element.label?.toLowerCase().includes('birth') ||
            element.validation?.format === 'YYYY-MM-DD') {
          return createElementWithCommonProps(DateTextInput, {
            value: data[element.id],
            onValueChange: (value) => handleDataChange(element.id, value),
            label: element.label,
            description: element.description,
            placeholder: element.placeholder || "AAAA-MM-JJ",
            required: element.required,
            help: element.help
          });
        }
        
        // Utiliser DateInput standard pour les autres dates
        return createElementWithCommonProps(DateInput, {
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          placeholder: element.placeholder,
          required: element.required,
          minDate: element.validation?.min_date,
          maxDate: element.validation?.max_date
        });

      case 'calculated':
        // Logique spéciale pour les badges d'âge de plaie (table 11)
        if (tableData.id === 'C1T11' && (element.id === 'C1T11E02' || element.id === 'C1T11E03')) {
          const appearanceDate = data['C1T11E01'];
          if (!appearanceDate) {
            return null; // Ne pas afficher si aucune date d'apparition
          }
          
          const woundAge = calculateWoundAge(appearanceDate);
          if (!woundAge) {
            return null;
          }
          
          // Afficher seulement le bon badge selon l'âge
          if (element.id === 'C1T11E02' && woundAge.isRecent) {
            return createElementWithCommonProps(ResultBadge, {
              value: '< 4 semaines',
              label: element.label,
              description: element.description,
              displayFormat: element.ui?.display_format,
              color: element.ui?.color,
              icon: element.icon,
              help: element.help
            });
          } else if (element.id === 'C1T11E03' && woundAge.isChronic) {
            return createElementWithCommonProps(ResultBadge, {
              value: '≥ 4 semaines',
              label: element.label,
              description: element.description,
              displayFormat: element.ui?.display_format,
              color: element.ui?.color,
              icon: element.icon,
              help: element.help
            });
          } else {
            return null; // Ne pas afficher le badge si la condition n'est pas remplie
          }
        }

        // Logique spéciale pour la quantité de tissu nécrotique (table 22)
        if (tableData.id === 'C1T22' && element.id && element.id.startsWith('C1T22E0') && parseInt(element.id.slice(-1)) >= 6 && parseInt(element.id.slice(-1)) <= 10) {
          // Récupérer la valeur de C1T21E01 depuis les données d'évaluation
          const necroticTissueValue = parseFloat(evaluationData?.['C1T21']?.['C1T21E01']) || 0;
          
          // Vérifier la condition pour chaque élément de quantité
          let shouldDisplay = false;
          const elementNum = parseInt(element.id.slice(-1));
          
          if (elementNum === 6 && necroticTissueValue === 0) {
            shouldDisplay = true;
          } else if (elementNum === 7 && necroticTissueValue > 0 && necroticTissueValue < 25) {
            shouldDisplay = true;
          } else if (elementNum === 8 && necroticTissueValue >= 25 && necroticTissueValue <= 50) {
            shouldDisplay = true;
          } else if (elementNum === 9 && necroticTissueValue > 50 && necroticTissueValue < 75) {
            shouldDisplay = true;
          } else if (elementNum === 10 && necroticTissueValue >= 75 && necroticTissueValue <= 100) {
            shouldDisplay = true;
          }
          
          if (!shouldDisplay) {
            return null; // Ne pas afficher si la condition n'est pas remplie
          }
          
          // Extraire le score du label (ex: "1 = Aucun visible" -> "1")
          const scoreMatch = element.label.match(/^(\d+)\s*=/);
          const scoreValue = scoreMatch ? scoreMatch[1] : element.label.split('=')[0].trim();
          
          return createElementWithCommonProps(ResultBadge, {
            value: scoreValue,
            label: element.label,
            description: element.description,
            displayFormat: element.ui?.display_format,
            color: element.ui?.color || element.clinical_notes?.color,
            icon: element.icon,
            help: element.help || element.ui?.help
          });
        }
        
        // Pour les classifications IMC de la table 04, évaluer la condition automatiquement
        if (tableData.id === 'C1T04' && element.bmi_category && element.condition) {
          const bmiValue = data['C1T04E03']; // L'IMC calculé
          const shouldShow = evaluateBMICondition(bmiValue, element.condition);
          
          if (!shouldShow) {
            return null; // Ne pas afficher cette classification si la condition n'est pas remplie
          }
        }

        // Logique spéciale pour la classification BWAT (table 16)
        if (tableData.id === 'C1T16' && element.id === 'C1T16E04') {
          const surfaceValue = data['C1T16E03'];
          if (!surfaceValue || surfaceValue === '0' || surfaceValue === '0.0') {
            return null; // Ne pas afficher si pas de surface calculée
          }
          
          const classification = classifyBWATSize(surfaceValue);
          if (classification) {
            return createElementWithCommonProps(ResultBadge, {
              value: classification.label,
              label: element.label || 'Classification BWAT',
              description: classification.description,
              displayFormat: element.ui?.display_format,
              color: classification.color,
              icon: element.icon,
              help: element.help || `Score BWAT: ${classification.score}`
            });
          }
        }

        // Logique spéciale pour la surface calculée BWAT (table 16)
        if (tableData.id === 'C1T16' && element.id === 'C1T16E03') {
          const surfaceValue = data[element.id];
          if (surfaceValue && surfaceValue !== '0' && surfaceValue !== '0.0') {
            return createElementWithCommonProps(ResultBadge, {
              value: surfaceValue,
              label: element.label,
              description: element.description,
              displayFormat: element.ui?.display_format || `${surfaceValue} cm²`,
              color: element.ui?.color || colors.primary,
              icon: element.icon,
              help: element.help,
              unit: element.unit || 'cm²'
            });
          }
          return null; // Ne pas afficher si pas de surface calculée
        }
        
        // Utiliser ResultBadge si spécifié dans ui.component, sinon CalculatedField
        if (element.ui?.component === 'ResultBadge') {
          return createElementWithCommonProps(ResultBadge, {
            value: data[element.id] || data['C1T04E03'], // Utiliser l'IMC pour les classifications
            label: element.label,
            description: element.description,
            displayFormat: element.ui?.display_format,
            color: element.ui?.color,
            icon: element.icon,
            help: element.help
          });
        }
        
        return createElementWithCommonProps(CalculatedField, {
          value: data[element.id],
          label: element.label,
          description: element.description,
          unit: element.unit,
          icon: element.icon
        });

      case 'informational':
        return createElementWithCommonProps(InfoField, {
          content: element.content || element.description,
          type: element.info_type || 'info',
          icon: element.icon
        });

      case 'photo':
        return createElementWithCommonProps(PhotoUpload, {
          value: data[element.id] || [],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          maxPhotos: element.maxPhotos || 3
        });

      case 'scale':
        return createElementWithCommonProps(ScaleInput, {
          value: data[element.id],
          onValueChange: (value) => handleDataChange(element.id, value),
          label: element.label,
          description: element.description,
          required: element.required,
          scale: element.scale || []
        });

      case 'mixed_input':
      case 'mixed_questions':
        // Pour les questions mixtes, on rend chaque sous-élément
        return (
          <TView key={element.id} style={styles.mixedContainer}>
            <TText style={[styles.mixedTitle, { color: colors.text }]}>
              {element.label}
            </TText>
            {element.description && (
              <TText style={[styles.mixedDescription, { color: colors.textSecondary }]}>
                {element.description}
              </TText>
            )}
            {element.elements?.map((subElement, index) => (
              <View key={subElement.id || index} style={styles.subElement}>
                {renderElement(subElement)}
              </View>
            ))}
          </TView>
        );

      case 'coordinates':
        // Callback pour synchroniser avec le radio group principal (Table 14)
        const onLocationSelect = (selectedZoneId) => {
          if (tableData.id === 'C1T14' && selectedZoneId) {
            // Mettre à jour le champ principal de sélection
            handleDataChange('C1T14E01', selectedZoneId);
          }
        };
        
        return createElementWithCommonProps(VisualSelector, {
          value: data[element.id] || null,
          onValueChange: (value) => handleDataChange(element.id, value),
          onLocationSelect: onLocationSelect,
          selectedOptionId: tableData.id === 'C1T14' ? data['C1T14E01'] : null, // Synchroniser avec le radio group principal
          label: element.label,
          description: element.description,
          help: element.help,
          required: element.required,
          width: element.ui?.width || 300,
          height: element.ui?.height || 400
        });

      case 'calculated':
        // Affichage des résultats calculés IPSCB
        return createElementWithCommonProps(ResultBadge, {
          value: data[element.id] || '0.00',
          label: element.label,
          description: element.description,
          displayFormat: element.ui?.display_format || 'decimal',
          color: element.ui?.color || colors.success,
          icon: element.icon,
          help: element.help,
          unit: element.unit || ''
        });

      case 'braden_scale':
        return createElementWithCommonProps(BradenScale, {
          scaleType: element.scale_type || element.scaleType || 'braden',
          value: data[element.id] || {},
          onValueChange: (value) => handleDataChange(element.id, value)
        });

      default:
        return (
          <TView key={element.id} style={[styles.unknownType, { backgroundColor: colors.surfaceLight }]}>
            <TText style={[styles.unknownTypeText, { color: colors.error }]}>
              Type non supporté: {element.type}
            </TText>
            <TText style={[styles.unknownTypeId, { color: colors.textSecondary }]}>
              ID: {element.id}
            </TText>
          </TView>
        );
    }
  };

  // Calcul de l'IMC pour la table 04
  const calculateBMI = (height, weight, heightUnit, weightUnit) => {
    if (!height || !weight || height <= 0 || weight <= 0) return null;

    let heightInMeters = height;
    let weightInKg = weight;

    // Conversion des unités si nécessaire
    if (heightUnit === 'ft') {
      // Conversion pieds vers mètres
      heightInMeters = height * 0.3048; // 1 pied = 0.3048 mètres
    }

    if (weightUnit === 'lb') {
      // Conversion livres vers kg
      weightInKg = weight * 0.453592; // 1 livre = 0.453592 kg
    }

    // Calcul de l'IMC: poids (kg) / taille (m)²
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10; // Arrondir à 1 décimale
  };

  // Déterminer la classification IMC
  const getBMICategory = (bmi) => {
    if (bmi === null || isNaN(bmi)) return null;
    
    if (bmi < 18.5) return 'underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'normal';
    if (bmi >= 25.0 && bmi <= 29.9) return 'overweight';
    if (bmi >= 30.0 && bmi <= 34.9) return 'obesity_class1';
    if (bmi >= 35.0 && bmi <= 39.9) return 'obesity_class2';
    if (bmi >= 40.0) return 'obesity_class3';
    
    return null;
  };

  // Évaluer les conditions BMI définies dans le JSON
  const evaluateBMICondition = (bmiValue, condition) => {
    if (bmiValue === null || bmiValue === undefined || isNaN(bmiValue)) {
      return false;
    }

    // Fonction helper pour évaluer une condition simple
    const evaluateSimpleCondition = (cond) => {
      if (cond.operator && cond.value !== undefined) {
        switch (cond.operator) {
          case 'lt':
            return bmiValue < cond.value;
          case 'lte':
            return bmiValue <= cond.value;
          case 'gt':
            return bmiValue > cond.value;
          case 'gte':
            return bmiValue >= cond.value;
          case 'eq':
            return bmiValue === cond.value;
          default:
            return false;
        }
      }
      return false;
    };

    // Gérer les conditions avec AND (comme dans le JSON)
    if (condition.and) {
      const firstCondition = condition.comparison || condition;
      const secondCondition = condition.and;
      
      // Évaluer la première condition
      let firstResult = false;
      if (firstCondition.operator && firstCondition.value !== undefined) {
        firstResult = evaluateSimpleCondition(firstCondition);
      } else if (firstCondition.comparison) {
        firstResult = evaluateSimpleCondition(firstCondition.comparison);
      }
      
      // Évaluer la seconde condition
      let secondResult = false;
      if (secondCondition.operator && secondCondition.value !== undefined) {
        secondResult = evaluateSimpleCondition(secondCondition);
      } else if (secondCondition.var === 'C1T04E03') {
        secondResult = evaluateSimpleCondition(secondCondition);
      }
      
      return firstResult && secondResult;
    }

    // Gérer les conditions simples avec var (structure du JSON)
    if (condition.comparison && condition.comparison.var === 'C1T04E03') {
      return evaluateSimpleCondition(condition.comparison);
    }

    // Gérer les conditions directes
    if (condition.operator) {
      return evaluateSimpleCondition(condition);
    }

    return false;
  };

  // Gestion des changements de données
  const handleDataChange = (fieldId, value) => {
    //console.log(` Changement de données pour ${fieldId}:`, value);
    
    // Debug spécial pour la table 14 (localisation)
    if (fieldId === 'C1T14E01') {
     // console.log(` Table 14 - Changement de localisation détecté:`, value);
      //console.log(` Table 14 - Type de la valeur:`, typeof value);
    }
    
    // Logique spéciale pour la table 11 (Histoire de la plaie)
    if (tableData.id === 'C1T11') {
      // Gestion des alertes spécialisées (seulement lors de l'ajout, pas de la suppression)
      if (fieldId === 'C1T11E06' && Array.isArray(value)) {
        // Récupérer la valeur précédente pour détecter ce qui vient d'être ajouté
        const previousValue = data[fieldId] || [];
        const newlyAdded = value.filter(item => !previousValue.includes(item));
        
        if (newlyAdded.length > 0) {
          // Trouver l'élément pour accéder aux options
          const etiologyElement = tableData.elements?.find(elem => elem.id === 'C1T11E06');
          const newOptions = etiologyElement?.options?.filter(opt => newlyAdded.includes(opt.value)) || [];
          
          // Afficher les alertes seulement pour les nouvelles sélections
          newOptions.forEach(option => {
            if (option.shows_specialized_alert) {
              if (option.value === 'lymphedeme') {
                showSpecializedAlert('lymphedema');
              } else if (option.value === 'neoplasie') {
                showSpecializedAlert('neoplasia');
              }
              // Note: Suppression de l'alerte pour 'pied_diabetique' selon la demande
            }
          });
        }
      }

      // Note: Le calcul de l'âge de la plaie pour les badges se fait maintenant 
      // directement dans le rendu des éléments calculés (C1T11E02 et C1T11E03)
    }
    
    // Calcul automatique de l'IMC pour la table 04
    if (tableData.id === 'C1T04') {
      // Si c'est un changement de taille ou poids, recalculer l'IMC
      if (fieldId === 'C1T04E01' || fieldId === 'C1T04E02') {
        const newData = { ...data, [fieldId]: value };
        const height = fieldId === 'C1T04E01' ? value : newData.C1T04E01;
        const weight = fieldId === 'C1T04E02' ? value : newData.C1T04E02;
        
        // Récupérer les unités sélectionnées (pour l'instant on utilise les défauts)
        // TODO: Récupérer les unités réelles sélectionnées par l'utilisateur
        const heightUnit = 'm'; // Par défaut mètres, à améliorer plus tard
        const weightUnit = 'kg'; // Par défaut kg, à améliorer plus tard
        
        const bmi = calculateBMI(height, weight, heightUnit, weightUnit);
        
        // Mettre à jour l'IMC calculé après le changement de la valeur principale
        setTimeout(() => {
          onDataChange?.('C1T04E03', bmi);
        }, 0);
      }
    }
    
    onDataChange?.(fieldId, value);
  };

  // Fonction pour vérifier si un élément conditionnel doit être affiché
  const shouldShowElement = (element) => {
    // Si l'élément n'a pas de condition, l'afficher
    if (!element.conditional && !element.conditional_display) return true;

    // Gestion des conditions standard (conditional)
    if (element.conditional) {
      const { depends_on, value } = element.conditional;
      
      // Vérifier si la dépendance est satisfaite
      if (depends_on && value !== undefined) {
        const dependentValue = data[depends_on];
        
        // Pour les sélections multiples (arrays)
        if (Array.isArray(dependentValue)) {
          return dependentValue.includes(value);
        }
        
        // Pour les sélections simples
        return dependentValue === value;
      }
    }

    // Gestion des conditions conditional_display (table 20)
    if (element.conditional_display && element.conditional_display.condition) {
      const { anyOf } = element.conditional_display.condition;
      
      if (anyOf && Array.isArray(anyOf)) {
        // Pour la table 20, vérifier si la valeur sélectionnée dans C1T20E01 correspond à l'une des options
        const selectedValue = data['C1T20E01'];
        return anyOf.includes(selectedValue);
      }
    }

    // Pour la table 22, ne pas filtrer les éléments de qualité (ils doivent toujours être affichés)
    if (tableData.id === 'C1T22' && element.id === 'C1T22E01') {
      return true;
    }

    return true;
  };

  // Fonction pour extraire tous les éléments des blocs (pour table 34)
  const getAllElementsFromBlocks = () => {
    if (!tableData.blocks) {
      console.log(' Table 34 - Aucun bloc trouvé');
      return [];
    }
    
    const allElements = [];
    Object.values(tableData.blocks).forEach((block, index) => {
      // console.log(` Table 34 - Bloc ${index}:`, block.title || block.id, 'éléments:', block.elements?.length || 0);
      if (block.elements && Array.isArray(block.elements)) {
        allElements.push(...block.elements);
      }
    });
   //console.log('Table 34 - Total éléments extraits:', allElements.length);
    return allElements;
  };

  // Nouvelle approche : fonction simple qui retourne TOUS les blocs
  // La logique d'affichage conditionnel sera gérée directement dans le rendu
  const getAllBlocksForTable15 = () => {
    if (tableData?.id !== 'C1T15' || !tableData.blocks) {
      return [];
    }
    
    // Retourner tous les blocs disponibles dans l'ordre
    const allBlocks = [
      tableData.blocks.inspection,
      tableData.blocks.palpation,
      tableData.blocks.edinburgh_questionnaire,
      tableData.blocks.ipscb
    ].filter(Boolean); // Filtrer les blocs qui n'existent pas
    
    //console.log(' Table 15 - All available blocks:', allBlocks.map(b => b?.id));
    return allBlocks;
  };

  // Fonction pour extraire tous les éléments des blocs actifs (pour table 15)
  const getAllElementsFromActiveBlocks = () => {
    if (tableData?.id !== 'C1T15') return [];
    
    const activeBlocks = getAllBlocksForTable15();
    const allElements = [];
    
    activeBlocks.forEach((block) => {
      // Ajouter les éléments de mesure
      if (block.measurements && Array.isArray(block.measurements)) {
        allElements.push(...block.measurements);
      }
      
      // Ajouter les éléments standard
      if (block.elements && Array.isArray(block.elements)) {
        allElements.push(...block.elements);
      }
      
      // Ajouter les résultats calculés pour la section IPSCB
      if (block.results && Array.isArray(block.results)) {
        allElements.push(...block.results);
      }
    });
    
    return allElements;
  };

  // Nouvelle approche : fonction qui gère l'affichage conditionnel directement
  const renderTable15Blocks = () => {
    if (tableData?.id !== 'C1T15') return null;
    
    // Récupérer la sélection de localisation de plusieurs façons
    let locationSelection = data['C1T14E01'];
   // console.log('Table 15 - === NOUVELLE APPROCHE ===');
    //console.log('Table 15 - Location selection direct:', locationSelection);
    //console.log('Table 15 - All data keys:', Object.keys(data));
    //console.log('Table 15 - C1T14 keys:', Object.keys(data).filter(k => k.startsWith('C1T14')));
    
    // Essayer de trouver la sélection autrement si elle n'est pas trouvée directement
    if (!locationSelection) {
      const possibleKeys = ['C1T14E01_05', 'C1T14E01_06'];
      for (const key of possibleKeys) {
        if (data[key] === true || data[key] === key) {
          locationSelection = key;
          //console.log(' Table 15 - Found location via alternative key:', key);
          break;
        }
      }
    }
    
    //console.log(' Table 15 - Final location selection:', locationSelection);
    
    // Obtenir tous les blocs disponibles
    const allBlocks = getAllBlocksForTable15();
    //console.log('Table 15 - All blocks available:', allBlocks.map(b => b?.id));
    
    if (allBlocks.length === 0) {
      return (
        <TView style={styles.emptyContainer}>
          <TText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aucun bloc disponible
          </TText>
        </TView>
      );
    }

    // Fonction pour déterminer si un bloc est spécifique aux membres inférieurs
    const isLowerLimbSpecific = (block) => {
      if (!block || !block.id) return false;
      return block.id === 'C1T15E' || block.id === 'C1T15D'; // Questionnaire d'Édimbourg et IPSCB
    };

    // Vérifier si la localisation est un membre inférieur
    const isLowerLimb = locationSelection === 'C1T14E01_05' || locationSelection === 'C1T14E01_06';

    return (
      <TView style={styles.table15Container}>
        {allBlocks.map((block, blockIndex) => {
          // Vérifier si ce bloc est spécifique aux membres inférieurs
          const isLowerLimbBlock = isLowerLimbSpecific(block);
          const showLowerLimbMessage = isLowerLimbBlock && !isLowerLimb;
          // Rendre les éléments du bloc
          const blockElements = [];
          
          // Éléments standard
          if (block.elements && Array.isArray(block.elements)) {
            block.elements.forEach((element, elementIndex) => {
              if (shouldShowElement(element)) {
                blockElements.push(
                  <TView key={`${block.id}-element-${elementIndex}`} style={styles.blockElement}>
                    {renderElement(element)}
                  </TView>
                );
              }
            });
          }
          
          // Mesures pour IPSCB
          if (block.measurements && Array.isArray(block.measurements)) {
            block.measurements.forEach((measurement, measurementIndex) => {
              if (shouldShowElement(measurement)) {
                blockElements.push(
                  <TView key={`${block.id}-measurement-${measurementIndex}`} style={styles.blockElement}>
                    {renderElement(measurement)}
                  </TView>
                );
              }
            });
          }
          
          // Résultats calculés pour IPSCB avec interprétation colorée
          if (block.results && Array.isArray(block.results) && block.id === 'C1T15D') {
            block.results.forEach((result, resultIndex) => {
              if (shouldShowElement(result)) {
                const resultValue = data[result.id];
                const shouldDisplayResult = resultValue && resultValue !== 'N/A' && resultValue !== null && resultValue !== undefined;
                
                if (shouldDisplayResult) {
                  // Interpréter le résultat IPSCB pour obtenir la couleur et le niveau
                  const interpretation = interpretIPSCB(resultValue);
                  
                  if (interpretation) {
                    blockElements.push(
                      <TView key={`${block.id}-result-${resultIndex}`} style={styles.blockElement}>
                        <TView style={styles.ipscbResultContainer}>
                          <TText style={[styles.ipscbResultLabel, { color: colors.text }]}>
                            {result.label}
                          </TText>
                          <TView style={[
                            styles.ipscbResultBadge, 
                            { 
                              backgroundColor: interpretation.color + '15',
                              borderColor: interpretation.color,
                            }
                          ]}>
                            <TText style={[
                              styles.ipscbResultValue, 
                              { color: interpretation.color }
                            ]}>
                              {resultValue}
                            </TText>
                            <TText style={[
                              styles.ipscbResultLevel, 
                              { color: interpretation.color }
                            ]}>
                              {interpretation.niveau}
                            </TText>
                          </TView>
                        </TView>
                      </TView>
                    );
                  }
                }
              }
            });
          } else if (block.results && Array.isArray(block.results)) {
            // Pour les autres blocs, utiliser le rendu standard
            block.results.forEach((result, resultIndex) => {
              if (shouldShowElement(result)) {
                const resultValue = data[result.id];
                const shouldDisplayResult = resultValue && resultValue !== 'N/A' && resultValue !== null && resultValue !== undefined;
                
                if (shouldDisplayResult) {
                  blockElements.push(
                    <TView key={`${block.id}-result-${resultIndex}`} style={styles.blockElement}>
                      {renderElement(result)}
                    </TView>
                  );
                }
              }
            });
          }

          // Gestion spéciale pour le questionnaire d'Édimbourg
          if (block.id === 'C1T15E' && block.questions) {
            block.questions.forEach((question, questionIndex) => {
              // Rendre la question principale
              const questionElement = {
                id: question.id,
                type: question.type,
                label: question.label,
                required: question.required,
                options: question.options,
                conditional_questions: question.conditional_questions,
                ui: question.ui || {}
              };
              
              if (shouldShowElement(questionElement)) {
                blockElements.push(
                  <TView key={`${block.id}-question-${questionIndex}-${questionnaireKey}`} style={styles.blockElement}>
                    {renderElement(questionElement)}
                  </TView>
                );
                
                // Vérifier si on doit afficher les questions conditionnelles
                if (question.conditional_questions && question.conditional_questions.questions) {
                  const firstQuestionValue = data[question.id];
                  const shouldShowConditional = firstQuestionValue === question.conditional_questions.condition;
                  
                 // console.log(` Questionnaire Édimbourg - Question ${question.id}:`, firstQuestionValue);
                  //console.log(` Questionnaire Édimbourg - Condition:`, question.conditional_questions.condition);
                  //console.log(`Questionnaire Édimbourg - Show conditional:`, shouldShowConditional);
                  
                  if (shouldShowConditional) {
                    question.conditional_questions.questions.forEach((conditionalQuestion, conditionalIndex) => {
                      const conditionalElement = {
                        id: conditionalQuestion.id,
                        type: conditionalQuestion.type,
                        label: conditionalQuestion.label,
                        required: conditionalQuestion.required,
                        options: conditionalQuestion.options,
                        ui: conditionalQuestion.ui || {}
                      };
                      
                      blockElements.push(
                        <TView key={`${block.id}-conditional-${conditionalIndex}-${questionnaireKey}`} style={styles.blockElement}>
                          {renderElement(conditionalElement)}
                        </TView>
                      );
                    });
                  }
                }
              }
            });
          }

          // Liens vidéo pour IPSCB
          const videoLink = block.video_link;
          
          return (
            <TView key={`block-${blockIndex}`} style={[styles.blockContainer, { backgroundColor: colors.surface }]}>
              {/* Titre du bloc */}
              {block.title && (
                <TView style={styles.blockHeader}>
                  <TText style={[styles.blockTitle, { color: colors.text }]}>
                    {block.title}
                  </TText>
                  {block.description && (
                    <TText style={[styles.blockDescription, { color: colors.textSecondary }]}>
                      {block.description}
                    </TText>
                  )}
                </TView>
              )}
              
              {/* Message informatif pour les blocs spécifiques aux membres inférieurs */}
              {showLowerLimbMessage && (
                <TView style={[styles.infoBox, { backgroundColor: colors.surfaceLight, borderColor: colors.primary }]}>
                  <TText style={[styles.infoText, { color: colors.primary }]}>
                    ⚠️ Ce bloc ne doit être rempli que si la plaie est localisée au membre inférieur (jambe, pied).
                  </TText>
                </TView>
              )}
              
              {/* Lien vidéo pour IPSCB */}
              {videoLink && (
                <TView style={styles.videoLinkContainer}>
                  <TText style={[styles.videoLinkText, { color: colors.primary }]}>
                    Lien vers vidéo
                  </TText>
                </TView>
              )}
              
              {/* Contenu du bloc */}
              <TView style={styles.blockContent}>
                {blockElements}
              </TView>
            </TView>
          );
        })}
      </TView>
    );
  };

  // Fonction pour convertir les questions en éléments (Table 13)
  const convertQuestionsToElements = () => {
    if (!tableData.questions || !Array.isArray(tableData.questions)) {
      //console.log('Table 13 - Aucune question trouvée');
      return [];
    }
    
    const convertedElements = tableData.questions.map((question, index) => {
      //console.log(`Table 13 - Conversion question ${index}:`, question.qid, question.label);
      
      // Convertir la structure question en structure element
      return {
        id: question.element_id || question.qid,
        qid: question.qid,
        type: question.type,
        label: question.label,
        description: question.help || question.ui?.help,
        required: question.required || false,
        validation: question.validation || {},
        ui: question.ui || {},
        // Propriétés additionnelles pour la compatibilité
        element_id: question.element_id,
        multiline: question.validation?.multiline || question.type === 'text',
        maxLength: question.validation?.max_length || 1000,
        placeholder: question.ui?.placeholder || '',
        rows: question.ui?.rows || 4
      };
    });
    
    //console.log('Table 13 - Total éléments convertis:', convertedElements.length);
    return convertedElements;
  };

  // Fonction pour convertir les additional_fields en éléments (Table 14)
  const convertAdditionalFieldsToElements = () => {
    if (!tableData.additional_fields || typeof tableData.additional_fields !== 'object') {
      //console.log(' Table 14 - Aucun champ additionnel trouvé');
      return [];
    }
    
    const convertedElements = Object.values(tableData.additional_fields).map((field, index) => {
     // console.log(` Table 14 - Conversion champ additionnel ${index}:`, field.id, field.label);
      
      return {
        id: field.id,
        type: field.type,
        label: field.label,
        description: field.description,
        required: field.required || false,
        validation: field.validation || {},
        ui: field.ui || {},
        help: field.ui?.help
      };
    });
    
    //console.log('Table 14 - Total champs additionnels convertis:', convertedElements.length);
    return convertedElements;
  };

  // Fonction pour convertir les champs complémentaires et additionnels de la table 20
  const convertTable20FieldsToElements = () => {
    const convertedElements = [];
    
    // Convertir les champs complémentaires
    if (tableData.complementary_fields && typeof tableData.complementary_fields === 'object') {
      Object.values(tableData.complementary_fields).forEach((field) => {
        convertedElements.push({
          id: field.id,
          type: field.type,
          label: field.label,
          description: field.description,
          required: field.required || false,
          validation: field.validation || {},
          ui: field.ui || {},
          help: field.ui?.help,
          conditional_display: field.conditional_display
        });
      });
    }
    
    // Convertir les trajets additionnels
    if (tableData.additional_tracts && typeof tableData.additional_tracts === 'object') {
      Object.values(tableData.additional_tracts).forEach((tract) => {
        // Pour les trajets de type mixed (fistule), créer un élément pour chaque champ
        if (tract.type === 'mixed' && tract.fields) {
          tract.fields.forEach((field) => {
            convertedElements.push({
              id: field.id,
              type: field.type,
              label: `${tract.label} - ${field.label}`,
              description: field.description || tract.description,
              required: field.required || false,
              validation: field.validation || {},
              ui: field.ui || {},
              help: field.ui?.help,
              conditional_display: tract.conditional_display
            });
          });
        } else {
          // Pour les trajets simples (sinus, tunnel)
          convertedElements.push({
            id: tract.id,
            type: tract.type,
            label: tract.label,
            description: tract.description,
            required: tract.required || false,
            validation: tract.validation || {},
            ui: tract.ui || {},
            help: tract.ui?.help,
            conditional_display: tract.conditional_display
          });
        }
      });
    }
    
    return convertedElements;
  };

  // Fonction pour vérifier si une sous-question doit être affichée
  const shouldShowSubquestion = (subquestion) => {
    if (!subquestion.condition) return true;
    
    const { anyOf } = subquestion.condition;
    if (!anyOf || !Array.isArray(anyOf)) return true;
    
    // Vérifier si au moins un des éléments listés est sélectionné
    return anyOf.some(elementId => {
      const value = data[elementId];
      return value === true || value === "true" || (Array.isArray(value) && value.length > 0);
    });
  };

  // Fonction pour rendre une sous-question
  const renderSubquestion = (subquestion) => {
    const currentValue = data[subquestion.qid] || data[subquestion.id];
    
    // Fonction pour gérer le changement de valeur
    const handleSubquestionChange = (value) => {
      //console.log(' Table 12 - Changement sous-question:', subquestion.qid || subquestion.id, value);
      handleDataChange(subquestion.qid || subquestion.id, value);
    };

    const commonProps = {
      label: subquestion.label,
      description: subquestion.description,
      required: subquestion.required,
      value: currentValue,
      onValueChange: handleSubquestionChange,
      error: errors[subquestion.qid || subquestion.id]
    };

    switch (subquestion.type) {
      case 'single_choice':
        return createElement(RadioGroup, {
          ...commonProps,
          options: subquestion.options?.map(option => ({
            ...option,
            onHelpPress: option.help ? () => {} : undefined
          })) || []
        }, subquestion.qid);

      case 'number':
        return createElement(NumericInput, {
          ...commonProps,
          min: subquestion.validation?.min,
          max: subquestion.validation?.max,
          step: subquestion.validation?.step,
          unit: subquestion.validation?.unit
        }, subquestion.qid);

      case 'visual_scale':
        return createElement(VisualScale, {
          ...commonProps,
          min: subquestion.validation?.min || 0,
          max: subquestion.validation?.max || 100,
          unit: subquestion.ui?.unit || '',
          scaleType: subquestion.ui?.scale_type || 'pain_analog'
        }, subquestion.qid);

      case 'pacslac_scale':
        return createElement(PACSLACScale, {
          ...commonProps,
          minScore: subquestion.validation?.min_score || 0,
          maxScore: subquestion.validation?.max_score || 60,
          scaleType: subquestion.ui?.scale_type || 'pacslac_assessment'
        }, subquestion.qid);

      default:
        console.warn(`Type de sous-question non géré: ${subquestion.type}`);
        return null;
    }
  };

  // Fonction pour rendre les champs associés aux options
  const renderAssociatedFields = (selectedOptionId, subquestion) => {
    if (!selectedOptionId || !subquestion.options) return null;

    const selectedOption = subquestion.options.find(opt => opt.id === selectedOptionId);
    if (!selectedOption || !selectedOption.associated_field) return null;

    const field = selectedOption.associated_field;
    const fieldValue = data[field.id];

    const fieldProps = {
      label: field.label,
      value: fieldValue,
      onValueChange: (value) => handleDataChange(field.id, value),
      error: errors[field.id],
      required: true
    };

    let fieldComponent;
    switch (field.type) {
      case 'number':
        fieldComponent = createElement(NumericInput, {
          ...fieldProps,
          min: field.validation?.min,
          max: field.validation?.max,
          step: field.validation?.step,
          unit: field.validation?.unit
        }, field.id);
        break;

      case 'text':
        fieldComponent = createElement(TextInput, {
          ...fieldProps,
          multiline: false,
          maxLength: field.validation?.max_length,
          placeholder: field.ui?.placeholder
        }, field.id);
        break;

      case 'visual_scale':
        fieldComponent = createElement(VisualScale, {
          ...fieldProps,
          min: field.validation?.min || 0,
          max: field.validation?.max || 100,
          unit: field.ui?.unit || '',
          scaleType: field.ui?.scale_type || 'pain_analog'
        }, field.id);
        break;

      case 'pacslac_scale':
        fieldComponent = createElement(PACSLACScale, {
          ...fieldProps,
          minScore: field.validation?.min_score || 0,
          maxScore: field.validation?.max_score || 60,
          scaleType: field.ui?.scale_type || 'pacslac_assessment'
        }, field.id);
        break;

      default:
        console.warn(`Type de champ associé non géré: ${field.type}`);
        return null;
    }

    // Wrapper avec style pour indiquer que c'est un champ associé
    return (
      <TView 
        style={[styles.associatedFieldContainer, { backgroundColor: colors.surfaceLight }]}
      >
        {fieldComponent}
      </TView>
    );
  };

  // Fonction pour convertir les sub_blocks de la table 25 en éléments
  const convertTable25SubBlocksToElements = () => {
    const convertedElements = [];
    
    if (tableData.sub_blocks && typeof tableData.sub_blocks === 'object') {
      Object.values(tableData.sub_blocks).forEach((subBlock) => {
        // Pour les deux sous-blocs (quality et quantity), convertir les éléments boolean en un seul single_choice
        if (subBlock.type === 'single_choice' && subBlock.elements && Array.isArray(subBlock.elements)) {
          const options = subBlock.elements.map((element) => ({
            id: element.id,
            label: element.label.split('=')[0].trim(), // Extraire juste le score (ex: "1")
            description: element.description,
            score: element.score
          }));
          
          // Déterminer l'ID principal selon le sous-bloc
          let mainElementId;
          if (subBlock.id === 'C1T25Q1') {
            mainElementId = 'C1T25E01'; // Qualité
          } else if (subBlock.id === 'C1T25Q2') {
            mainElementId = 'C1T25E06'; // Quantité
          } else {
            mainElementId = subBlock.elements[0]?.id || 'C1T25E01';
          }
          
          convertedElements.push({
            id: mainElementId,
            type: 'single_choice',
            label: subBlock.title || subBlock.id,
            description: subBlock.description,
            options: options,
            required: subBlock.required || true,
            ui: {
              component: 'RadioGroup'
            }
          });
        }
      });
    }
    
    return convertedElements;
  };

  // Fonction pour convertir les sub_blocks de la table 22 en éléments
  const convertTable22SubBlocksToElements = () => {
    const convertedElements = [];
    
    console.log('Table 22 - sub_blocks disponibles:', tableData.sub_blocks ? Object.keys(tableData.sub_blocks) : 'aucun');
    console.log('Table 22 - tableData:', tableData.id, 'sub_blocks:', !!tableData.sub_blocks);
    
    if (tableData.sub_blocks && typeof tableData.sub_blocks === 'object') {
      Object.values(tableData.sub_blocks).forEach((subBlock, index) => {
        console.log(`Table 22 - Sous-bloc ${index}:`, subBlock.id, subBlock.type, 'éléments:', subBlock.elements?.length);
        
        // Pour le sous-bloc "quality", convertir les éléments boolean en un seul single_choice
        if (subBlock.id === 'C1T22Q' && subBlock.type === 'single_choice' && subBlock.elements && Array.isArray(subBlock.elements)) {
          // Créer un seul élément single_choice avec toutes les options
          const options = subBlock.elements.map((element) => ({
            id: element.id,
            label: element.label.split('=')[0].trim(), // Extraire juste le score (ex: "1")
            description: element.description,
            score: element.score
          }));
          
          console.log('Table 22 - Options créées pour qualité:', options.length);
          
          convertedElements.push({
            id: 'C1T22E01', // Utiliser le premier ID comme ID principal
            type: 'single_choice',
            label: subBlock.title || 'Qualité du tissu nécrotique',
            description: subBlock.description,
            options: options,
            required: subBlock.required || true,
            ui: {
              component: 'RadioGroup'
            }
          });
        } else if (subBlock.elements && Array.isArray(subBlock.elements)) {
          // Pour les autres sous-blocs (quantity), garder les éléments tels quels
          console.log(`Table 22 - Ajout des éléments du sous-bloc ${subBlock.id}:`, subBlock.elements.length);
          subBlock.elements.forEach((element) => {
            convertedElements.push({
              ...element,
              subBlockId: subBlock.id,
              subBlockTitle: subBlock.title,
              subBlockDescription: subBlock.description
            });
          });
        }
      });
    }
    
    console.log('Table 22 - Éléments convertis:', convertedElements.length, convertedElements.map(e => ({ id: e.id, type: e.type })));
    return convertedElements;
  };

  // Rendu des sections si elles existent
  const renderSections = () => {
    // Gestion spéciale pour différentes structures de table (même logique que renderContent)
    let elementsToUse = tableData.elements;
    if (!elementsToUse && tableData.blocks && tableData.id === 'C1T34') {
      elementsToUse = getAllElementsFromBlocks();
    } else if (!elementsToUse && tableData.blocks && tableData.id === 'C1T15') {
      elementsToUse = getAllElementsFromActiveBlocks();
    } else if (!elementsToUse && tableData.questions && tableData.id === 'C1T13') {
      elementsToUse = convertQuestionsToElements();
    } else if (!elementsToUse && tableData.sub_blocks && tableData.id === 'C1T22') {
      elementsToUse = convertTable22SubBlocksToElements();
      console.log('Table 22 - renderSections - elementsToUse après conversion:', elementsToUse?.length);
    } else if (!elementsToUse && tableData.sub_blocks && tableData.id === 'C1T25') {
      elementsToUse = convertTable25SubBlocksToElements();
    }

    // Rendu des éléments principaux
    const mainElements = elementsToUse?.filter(shouldShowElement).map(renderElement).filter(el => el !== null && el !== undefined) || [];
    
    // Debug pour la table 22
    if (tableData.id === 'C1T22') {
      console.log('Table 22 - elementsToUse:', elementsToUse?.length, elementsToUse?.map(e => ({ id: e.id, type: e.type })));
      console.log('Table 22 - mainElements après filtrage:', mainElements.length);
      console.log('Table 22 - mainElements:', mainElements.map((el, idx) => ({ idx, type: el?.type, key: el?.key })));
    }

    // Gestion spéciale pour la table 12 avec ses sous-questions
    if (tableData.id === 'C1T12' && tableData.subquestions) {
      const subquestionsElements = [];
      
      tableData.subquestions
        .filter(shouldShowSubquestion)
        .forEach(subquestion => {
          //console.log(' Table 12 - Rendering subquestion:', subquestion.label, 'Type:', subquestion.type);
          
          // Rendre la sous-question avec une clé unique
          const subquestionElement = renderSubquestion(subquestion);
          if (subquestionElement) {
            subquestionsElements.push(
              React.cloneElement(subquestionElement, { 
                key: subquestion.qid || subquestion.id 
              })
            );
          }
          
          // Pour les sous-questions de type single_choice, vérifier s'il y a des champs associés
          if (subquestion.type === 'single_choice') {
            const selectedOptionId = data[subquestion.qid];
            if (selectedOptionId && subquestion.options) {
              const associatedField = renderAssociatedFields(selectedOptionId, subquestion);
              if (associatedField) {
                subquestionsElements.push(
                  React.cloneElement(associatedField, { 
                    key: `associated-${subquestion.qid}-${selectedOptionId}` 
                  })
                );
              }
            }
          }
        });
      
      return [...mainElements, ...subquestionsElements];
    }

    // Gestion spéciale pour la table 14 avec ses additional_fields
    if (tableData.id === 'C1T14' && tableData.additional_fields) {
      const additionalElements = convertAdditionalFieldsToElements();
      const renderedAdditionalElements = additionalElements
        .filter(shouldShowElement)
        .map(renderElement)
        .filter(element => element); // Filtrer les éléments null/undefined

      return [...mainElements, ...renderedAdditionalElements];
    }

    // Gestion spéciale pour la table 20 avec ses champs complémentaires et additionnels
    if (tableData.id === 'C1T20' && (tableData.complementary_fields || tableData.additional_tracts)) {
      const table20Fields = convertTable20FieldsToElements();
      const renderedTable20Fields = table20Fields
        .filter(shouldShowElement)
        .map(renderElement)
        .filter(element => element); // Filtrer les éléments null/undefined

      return [...mainElements, ...renderedTable20Fields];
    }

    if (!tableData.ui_configuration?.sections) {
      // Rendu simple sans sections - juste les éléments avec gestion conditionnelle
      return mainElements;
    }

    // TODO: Implémenter le rendu des sections
    return mainElements;
  };

  // Rendu du contenu principal
  const renderContent = () => {
    if (!tableData) {
      return (
        <TView style={styles.errorContainer}>
          <TText style={[styles.errorText, { color: colors.error }]}>
            Aucune donnée de table disponible
          </TText>
        </TView>
      );
    }

    // Gestion spéciale pour la table 15 avec blocs organisés
    if (tableData.id === 'C1T15' && tableData.blocks) {
      return (
        <TView style={styles.contentContainer}>
          {/* Affichage du titre et des instructions si présents */}
          {tableData.ui_configuration?.group_label && (
            <TView style={styles.headerContainer}>
              <TText style={[styles.groupLabel, { color: colors.text }]}>
                {tableData.ui_configuration.group_label}
              </TText>
            </TView>
          )}
          
          {tableData.ui_configuration?.instructions && (
            <TView style={styles.instructionsContainer}>
              <TText style={[styles.instructions, { color: colors.textSecondary }]}>
                {tableData.ui_configuration.instructions}
              </TText>
            </TView>
          )}
          
          {/* Rendu spécialisé pour la table 15 */}
          {renderTable15Blocks()}
        </TView>
      );
    }

    // Gestion spéciale pour différentes structures de table
    let elementsToRender = tableData.elements;
   
    
    if (!elementsToRender && tableData.blocks && tableData.id === 'C1T34') {
      elementsToRender = getAllElementsFromBlocks();
    } else if (!elementsToRender && tableData.questions && tableData.id === 'C1T13') {
      elementsToRender = convertQuestionsToElements();
    } else if (!elementsToRender && tableData.sub_blocks && tableData.id === 'C1T22') {
      elementsToRender = convertTable22SubBlocksToElements();
    } else if (!elementsToRender && tableData.sub_blocks && tableData.id === 'C1T25') {
      elementsToRender = convertTable25SubBlocksToElements();
    }

    // Pour les tables 22 et 25, ne pas bloquer même si elementsToRender est vide car renderSections() gère les sub_blocks
    if ((!elementsToRender || elementsToRender.length === 0) && tableData.id !== 'C1T22' && tableData.id !== 'C1T25') {
      return (
        <TView style={styles.emptyContainer}>
          <TText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aucun élément à afficher dans cette table
          </TText>
        </TView>
      );
    }

    return (
      <TView style={styles.contentContainer}>
        {/* Affichage du titre et des instructions si présents */}
        {tableData.ui_configuration?.group_label && (
          <TView style={styles.headerContainer}>
            <TText style={[styles.groupLabel, { color: colors.text }]}>
              {tableData.ui_configuration.group_label}
            </TText>
          </TView>
        )}
        
        {tableData.ui_configuration?.instructions && (
          <TView style={styles.instructionsContainer}>
            <TText style={[styles.instructions, { color: colors.textSecondary }]}>
              {tableData.ui_configuration.instructions}
            </TText>
          </TView>
        )}
        
        {renderSpecialNote()}
        
        {renderSections()}
      </TView>
    );
  };

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <TView style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Debug Info - Temporaire */}
          {/*<DebugInfo data={tableData} title="TableData Debug" />
          <DebugInfo data={data} title="Current Data" />
          <DebugInfo data={errors} title="Current Errors" />*/}

          {/* Attribution BWAT si présente */}
          {tableData.bwat_attribution && (
            <BWATAttribution attribution={tableData.bwat_attribution} />
          )}

          {/* Alerte clinique si présente */}
          {tableData.clinical_alert && (
            <ClinicalAlert alert={tableData.clinical_alert} />
          )}

          {/* Contenu principal */}
          {renderContent()}
        </TView>
      </TouchableWithoutFeedback>

      {/* Alerte spécialisée pour lymphœdème et pied diabétique */}
      <SpecializedAlert
        visible={specializedAlertVisible}
        onClose={() => setSpecializedAlertVisible(false)}
        condition={specializedCondition}
        onContinueAnyway={() => setSpecializedAlertVisible(false)}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  contentContainer: {
    flexGrow: 1,
  },
  mixedContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    backgroundColor: '#F8F9FA',
  },
  mixedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  mixedDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  subElement: {
    marginBottom: spacing.md,
  },
  instructions: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  instructionsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  associatedFieldContainer: {
    padding: spacing.md,
    marginTop: spacing.sm,
    marginLeft: spacing.lg,
    borderRadius: spacing.radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  unknownType: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  unknownTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  unknownTypeId: {
    fontSize: 12,
  },
  headerContainer: {
    marginBottom: spacing.md,
  },
  groupLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  // Styles spécifiques pour la table 15
  table15Container: {
    flex: 1,
  },
  blockContainer: {
   marginBottom: spacing.xl,
   //padding: spacing.md,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  blockHeader: {
    //marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  blockDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  blockContent: {
    flex: 1,
  },
  blockElement: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  videoLinkContainer: {
    marginBottom: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
  },
  videoLinkText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  infoBox: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Styles pour les résultats IPSCB
  ipscbResultContainer: {
    marginBottom: spacing.md,
  },
  ipscbResultLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  ipscbResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    minWidth: 200,
  },
  ipscbResultValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  ipscbResultLevel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
});

export default ContentDetector;
