import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
  HelperModal,
  SpecializedAlert
} from './forms';
import { BWATAttribution, ClinicalAlert } from './special';
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
  onNavigateToTable 
}) => {
  const { colors } = useTheme();

  // States pour les modales et alertes
  const [helperModalVisible, setHelperModalVisible] = useState(false);
  const [currentHelperData, setCurrentHelperData] = useState(null);
  const [helperTitle, setHelperTitle] = useState('');
  const [specializedAlertVisible, setSpecializedAlertVisible] = useState(false);
  const [specializedCondition, setSpecializedCondition] = useState('');

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

  // Fonction pour afficher l'aide (helper modal)
  const showHelper = (helpId, title) => {
    let helperData = null;
    
    if (helpId.startsWith('burn_stage')) {
      helperData = burnStagesData.helpers[helpId];
    } else if (helpId.startsWith('pressure_stage')) {
      helperData = pressureStagesData.helpers[helpId];
    }
    
    if (helperData) {
      setCurrentHelperData(helperData);
      setHelperTitle(title);
      setHelperModalVisible(true);
    }
  };

  // Fonction pour afficher l'alerte spécialisée
  const showSpecializedAlert = (condition) => {
    setSpecializedCondition(condition);
    setSpecializedAlertVisible(true);
  };


  // Fonction pour rendre un élément selon son type
  const renderElement = (element) => {

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
        
        // Pour les classifications IMC de la table 04, évaluer la condition automatiquement
        if (tableData.id === 'C1T04' && element.bmi_category && element.condition) {
          const bmiValue = data['C1T04E03']; // L'IMC calculé
          const shouldShow = evaluateBMICondition(bmiValue, element.condition);
          
          if (!shouldShow) {
            return null; // Ne pas afficher cette classification si la condition n'est pas remplie
          }
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
    console.log(`📝 Changement de données pour ${fieldId}:`, value);
    
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
    if (!element.conditional) return true;

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

    return true;
  };

  // Fonction pour extraire tous les éléments des blocs (pour table 34)
  const getAllElementsFromBlocks = () => {
    if (!tableData.blocks) {
      console.log('🔍 Table 34 - Aucun bloc trouvé');
      return [];
    }
    
    const allElements = [];
    Object.values(tableData.blocks).forEach((block, index) => {
      console.log(`🔍 Table 34 - Bloc ${index}:`, block.title || block.id, 'éléments:', block.elements?.length || 0);
      if (block.elements && Array.isArray(block.elements)) {
        allElements.push(...block.elements);
      }
    });
    console.log('🔍 Table 34 - Total éléments extraits:', allElements.length);
    return allElements;
  };

  // Fonction pour convertir les questions en éléments (Table 13)
  const convertQuestionsToElements = () => {
    if (!tableData.questions || !Array.isArray(tableData.questions)) {
      console.log('🔍 Table 13 - Aucune question trouvée');
      return [];
    }
    
    const convertedElements = tableData.questions.map((question, index) => {
      console.log(`🔍 Table 13 - Conversion question ${index}:`, question.qid, question.label);
      
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
    
    console.log('🔍 Table 13 - Total éléments convertis:', convertedElements.length);
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
      console.log('🔍 Table 12 - Changement sous-question:', subquestion.qid || subquestion.id, value);
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

  // Rendu des sections si elles existent
  const renderSections = () => {
    // Gestion spéciale pour différentes structures de table (même logique que renderContent)
    let elementsToUse = tableData.elements;
    if (!elementsToUse && tableData.blocks && tableData.id === 'C1T34') {
      elementsToUse = getAllElementsFromBlocks();
    } else if (!elementsToUse && tableData.questions && tableData.id === 'C1T13') {
      elementsToUse = convertQuestionsToElements();
    }

    // Rendu des éléments principaux
    const mainElements = elementsToUse?.filter(shouldShowElement).map(renderElement) || [];

    // Gestion spéciale pour la table 12 avec ses sous-questions
    if (tableData.id === 'C1T12' && tableData.subquestions) {
      const subquestionsElements = [];
      
      tableData.subquestions
        .filter(shouldShowSubquestion)
        .forEach(subquestion => {
          console.log('🔍 Table 12 - Rendering subquestion:', subquestion.label, 'Type:', subquestion.type);
          
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

    // Gestion spéciale pour différentes structures de table
    let elementsToRender = tableData.elements;
   
    
    if (!elementsToRender && tableData.blocks && tableData.id === 'C1T34') {
      elementsToRender = getAllElementsFromBlocks();
  
    } else if (!elementsToRender && tableData.questions && tableData.id === 'C1T13') {
      elementsToRender = convertQuestionsToElements();
      
    }

   
    if (!elementsToRender || elementsToRender.length === 0) {
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

          {/* Instructions */}
          {tableData.ui_configuration?.instructions && (
            <TView style={[styles.instructions, { backgroundColor: colors.surfaceLight }]}>
              <TText style={[styles.instructionsText, { color: colors.textSecondary }]}>
                {tableData.ui_configuration.instructions}
              </TText>
            </TView>
          )}

          {/* Contenu principal */}
          {renderContent()}
        </TView>
      </TouchableWithoutFeedback>

      {/* Modale d'aide pour les stades */}
      <HelperModal
        visible={helperModalVisible}
        onClose={() => setHelperModalVisible(false)}
        helperData={currentHelperData}
        title={helperTitle}
      />

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
});

export default ContentDetector;
