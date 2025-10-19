import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TView, TText } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const VisualScale = ({
  label,
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  error,
  disabled = false,
  help,
  required = false,
  ...props
}) => {
  const { colors } = useTheme();
  const [currentValue, setCurrentValue] = useState(value || 0);
  const scaleWidth = 280;
  const thumbSize = 24;

  useEffect(() => {
    if (value !== undefined && value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleValueUpdate = (newValue) => {
    const clampedValue = Math.max(min, Math.min(max, Math.round(newValue)));
    setCurrentValue(clampedValue);
    onValueChange?.(clampedValue);
  };

  const getSliderPosition = () => {
    const percentage = ((currentValue - min) / (max - min)) * 100;
    return (percentage / 100) * (scaleWidth - thumbSize);
  };

  const handleTouch = (event) => {
    if (disabled) return;
    
    // Pour TouchableOpacity, on utilise une approche différente
    // On pourrait implémenter un GestureHandler plus tard si nécessaire
    // Pour l'instant, on laisse l'utilisateur utiliser des boutons +/-
  };

  const getValueLabel = () => {
    if (unit) {
      return `${currentValue}${unit}`;
    }
    return currentValue.toString();
  };

  const getIntensityLabel = () => {
    if (max === 100) {
      // Échelle de douleur 0-100
      if (currentValue <= 20) return "Aucune douleur";
      if (currentValue <= 40) return "Douleur légère";
      if (currentValue <= 60) return "Douleur modérée";
      if (currentValue <= 80) return "Douleur sévère";
      return "Douleur extrême";
    }
    return null;
  };

  return (
    <TView style={styles.container}>
      {label && (
        <TText style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <TText style={{ color: colors.error }}> *</TText>}
        </TText>
      )}
      
      <TouchableOpacity 
        style={styles.scaleContainer}
        onPress={handleTouch}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {/* Échelle avec labels */}
        <View style={styles.scaleWrapper}>
          {/* Marqueurs */}
          <View style={styles.markers}>
            <TText style={[styles.markerLabel, { color: colors.textSecondary }]}>{min}</TText>
            <TText style={[styles.markerLabel, { color: colors.textSecondary }]}>{Math.round((max - min) * 0.25) + min}</TText>
            <TText style={[styles.markerLabel, { color: colors.textSecondary }]}>{Math.round((max - min) * 0.5) + min}</TText>
            <TText style={[styles.markerLabel, { color: colors.textSecondary }]}>{Math.round((max - min) * 0.75) + min}</TText>
            <TText style={[styles.markerLabel, { color: colors.textSecondary }]}>{max}</TText>
          </View>
          
          {/* Barre de fond */}
          <View style={[styles.scaleTrack, { backgroundColor: colors.surfaceLight }]} />
          
          {/* Barre de progression */}
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${((currentValue - min) / (max - min)) * 100}%`,
                backgroundColor: colors.primary 
              }
            ]} 
          />

          {/* Curseur */}
          <View 
            style={[
              styles.thumb, 
              { 
                left: getSliderPosition(),
                backgroundColor: colors.primary,
                borderColor: colors.background
              }
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* Contrôles de valeur */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.surfaceLight }]}
          onPress={() => handleValueUpdate(currentValue - step)}
          disabled={disabled || currentValue <= min}
        >
          <TText style={[styles.controlButtonText, { color: colors.text }]}>-</TText>
        </TouchableOpacity>
        
        <View style={styles.valueDisplay}>
          <TText style={[styles.valueText, { color: colors.primary }]}>
            {getValueLabel()}
          </TText>
          {getIntensityLabel() && (
            <TText style={[styles.intensityText, { color: colors.textSecondary }]}>
              {getIntensityLabel()}
            </TText>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.surfaceLight }]}
          onPress={() => handleValueUpdate(currentValue + step)}
          disabled={disabled || currentValue >= max}
        >
          <TText style={[styles.controlButtonText, { color: colors.text }]}>+</TText>
        </TouchableOpacity>
      </View>

      {error && (
        <TText style={[styles.errorText, { color: colors.error }]}>
          {error}
        </TText>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  scaleContainer: {
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  scaleWrapper: {
    position: 'relative',
    width: '100%',
    height: 40,
  },
  markers: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markerLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  scaleTrack: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 4,
  },
  progressBar: {
    position: 'absolute',
    top: 16,
    left: 0,
    height: 8,
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    top: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  valueDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  intensityText: {
    fontSize: 14,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default VisualScale;
