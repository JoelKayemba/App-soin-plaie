import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const BirthDateInput = ({ 
  value,
  onValueChange,
  label,
  description,
  placeholder = "AAAA-MM-JJ",
  required = false,
  error,
  disabled = false,
  help,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState(value || '');
  const [age, setAge] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Validation du format AAAA-MM-JJ
  const validateDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return { valid: false, error: 'Format requis: AAAA-MM-JJ' };
    }

    const [year, month, day] = dateString.split('-').map(Number);
    
    // Validation des limites
    if (year < 1900 || year > new Date().getFullYear()) {
      return { valid: false, error: 'Année doit être entre 1900 et ' + new Date().getFullYear() };
    }
    
    if (month < 1 || month > 12) {
      return { valid: false, error: 'Mois doit être entre 01 et 12' };
    }
    
    if (day < 1 || day > 31) {
      return { valid: false, error: 'Jour doit être entre 01 et 31' };
    }

    // Validation de la date réelle
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return { valid: false, error: 'Date invalide' };
    }

    // Vérifier que la date n'est pas dans le futur
    if (date > new Date()) {
      return { valid: false, error: 'La date ne peut pas être dans le futur' };
    }

    return { valid: true, error: null };
  };

  // Calcul de l'âge
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let ageYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      ageYears--;
    }
    
    const ageMonths = Math.max(0, (today.getFullYear() - birth.getFullYear()) * 12 + 
      (today.getMonth() - birth.getMonth()) - (today.getDate() < birth.getDate() ? 1 : 0));
    
    const ageDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    
    return {
      years: ageYears,
      months: ageMonths,
      days: ageDays
    };
  };

  // Gestion du changement de texte
  const handleTextChange = (text) => {
    // Nettoyer le texte (enlever les caractères non numériques sauf les tirets)
    const cleaned = text.replace(/[^\d-]/g, '');
    
    // Limiter la longueur
    if (cleaned.length <= 10) {
      setInputValue(cleaned);
      
      // Validation en temps réel
      if (cleaned.length === 10) {
        const validation = validateDateFormat(cleaned);
        setIsValid(validation.valid);
        
        if (validation.valid) {
          const ageData = calculateAge(cleaned);
          setAge(ageData);
          onValueChange?.(cleaned);
        } else {
          setAge(null);
        }
      } else {
        setIsValid(false);
        setAge(null);
      }
    }
  };

  // Formatage automatique pendant la saisie
  const handleTextChangeWithFormat = (text) => {
    // Enlever tout sauf les chiffres
    const numbers = text.replace(/\D/g, '');
    
    let formatted = '';
    if (numbers.length >= 1) {
      formatted = numbers.substring(0, 4);
    }
    if (numbers.length >= 5) {
      formatted += '-' + numbers.substring(4, 6);
    }
    if (numbers.length >= 7) {
      formatted += '-' + numbers.substring(6, 8);
    }
    
    handleTextChange(formatted);
  };

  const showHelp = () => {
    if (help) {
      Alert.alert(
        label || 'Aide',
        help,
        [{ text: 'OK' }]
      );
    }
  };

  const getAgeDisplay = () => {
    if (!age) return null;
    
    if (age.years < 1) {
      if (age.months < 1) {
        return `${age.days} jour${age.days > 1 ? 's' : ''}`;
      }
      return `${age.months} mois`;
    }
    
    return `${age.years} an${age.years > 1 ? 's' : ''}`;
  };

  return (
    <TView style={[styles.container, style]} {...props}>
      {label && (
        <View style={styles.header}>
          <TText style={[styles.label, { color: colors.text }]}>
            {label}
            {required && <TText style={{ color: colors.error }}> *</TText>}
          </TText>
          {help && (
            <TouchableOpacity onPress={showHelp} style={styles.helpButton}>
              <TIcon name="help-circle-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {description && (
        <TText style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </TText>
      )}

      <View style={styles.inputContainer}>
        <TView style={[
          styles.inputWrapper,
          {
            borderColor: error ? colors.error : 
                       isValid ? colors.success || '#4CAF50' : 
                       colors.border,
            backgroundColor: disabled ? colors.surfaceLight : colors.surface,
          }
        ]}>
          <TIcon 
            name="calendar-outline" 
            size={20} 
            color={disabled ? colors.textTertiary : colors.primary}
          />
          
          <TText style={[
            styles.input,
            { 
              color: disabled ? colors.textTertiary : colors.text,
              opacity: disabled ? 0.5 : 1
            }
          ]}>
            {inputValue || placeholder}
          </TText>
          
          {isValid && (
            <TIcon 
              name="checkmark-circle" 
              size={20} 
              color={colors.success || '#4CAF50'}
            />
          )}
        </TView>
        
        {/* Champ de saisie invisible pour la capture du clavier */}
        <TText
          style={styles.hiddenInput}
          onPress={() => {
            if (!disabled) {
              // Ouvrir un modal de saisie ou utiliser un TextInput
              Alert.prompt(
                'Date de naissance',
                'Entrez la date au format AAAA-MM-JJ',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { 
                    text: 'OK', 
                    onPress: (text) => {
                      if (text) {
                        handleTextChange(text);
                      }
                    }
                  }
                ],
                'plain-text',
                inputValue
              );
            }
          }}
        />
      </View>

      {/* Affichage de l'âge calculé */}
      {age && isValid && (
        <TView style={[styles.ageContainer, { backgroundColor: colors.primary + '10' }]}>
          <TIcon name="person" size={16} color={colors.primary} />
          <TText style={[styles.ageText, { color: colors.primary }]}>
            Âge: {getAgeDisplay()}
          </TText>
        </TView>
      )}
      
      {error && (
        <TText style={[styles.error, { color: colors.error }]}>
          {error}
        </TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.form.elementSpacing,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.form.labelSpacing,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  helpButton: {
    padding: spacing.xs,
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.form.elementSpacing,
    lineHeight: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderRadius: spacing.radius.md,
    gap: spacing.sm,
  },
  input: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'monospace', // Pour un meilleur alignement des chiffres
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  ageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default BirthDateInput;


