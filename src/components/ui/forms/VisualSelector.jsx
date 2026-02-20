import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';
import BodyModelViewer from '../BodyModelViewer';

const VisualSelector = ({
  label,
  value = null,
  onValueChange,
  onLocationSelect,
  selectedOptionId,
  error,
  disabled = false,
  help,
  required = false,
  width = 300,
  height = 400,
  showBodyView = true, // false quand le 3D est rendu par le table renderer (ex. Table14Renderer)
  ...props
}) => {
  const { colors } = useTheme();
  const [selectedArea, setSelectedArea] = useState(null);
  const containerRef = useRef(null);

  // Définir les zones anatomiques cliquables
  // Ces coordonnées sont approximatives et devront être ajustées selon votre SVG
  const anatomicalZones = {
    head_neck: {
      id: 'C1T14E01_01',
      label: 'Tête / cou',
      bounds: { x: 60, y: 20, width: 80, height: 60 }, // Zone tête/cou
      color: colors.primary
    },
    trunk: {
      id: 'C1T14E01_02', 
      label: 'Tronc',
      bounds: { x: 70, y: 80, width: 65, height: 120 }, // Zone tronc
      color: colors.secondary
    },
    upper_limb_left: {
      id: 'C1T14E01_03',
      label: 'Membre supérieur gauche',
      bounds: { x: 20, y: 80, width: 45, height: 100 }, // Bras gauche
      color: colors.accent
    },
    upper_limb_right: {
      id: 'C1T14E01_04',
      label: 'Membre supérieur droit', 
      bounds: { x: 140, y: 80, width: 45, height: 100 }, // Bras droit
      color: colors.accent
    },
    lower_limb_left: {
      id: 'C1T14E01_05',
      label: 'Membre inférieur gauche',
      bounds: { x: 80, y: 200, width: 50, height: 120 }, // Jambe gauche
      color: colors.warning
    },
    lower_limb_right: {
      id: 'C1T14E01_06',
      label: 'Membre inférieur droit',
      bounds: { x: 75, y: 200, width: 50, height: 120 }, // Jambe droite
      color: colors.warning
    }
  };

  // Synchroniser la sélection avec le radio group principal
  useEffect(() => {
    if (selectedOptionId) {
      // Chercher la zone correspondante
      const matchingZone = Object.values(anatomicalZones).find(zone => zone.id === selectedOptionId);
      if (matchingZone) {
        setSelectedArea(matchingZone);
      }
    } else {
      setSelectedArea(null);
    }
  }, [selectedOptionId]);

  return (
    <TView style={styles.container}>
      {label && (
        <TText style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <TText style={{ color: colors.error }}> *</TText>}
        </TText>
      )}
      
      {showBodyView && (
        <TView style={[styles.imageContainer, { borderColor: colors.border }]}>
          <View style={styles.touchableArea} ref={containerRef}>
            <BodyModelViewer width={width} height={height} />
          </View>
        </TView>
      )}

      {/* Affichage de la zone sélectionnée */}
      {selectedArea && (
        <TView style={styles.selectedAreas}>
          <TText style={[styles.selectedLabel, { color: colors.textSecondary }]}>
            Zone sélectionnée :
          </TText>
          <TText 
            key={selectedArea.id} 
            style={[styles.selectedArea, { color: colors.text }]}
          >
            • {selectedArea.label}
          </TText>
        </TView>
      )}

      {/* Coordonnées si disponibles */}
      {value?.x !== undefined && (
        <TText style={[styles.coordinates, { color: colors.textSecondary }]}>
          Position : ({Math.round(value.x)}, {Math.round(value.y)})
        </TText>
      )}

      {help && (
        <TText style={[styles.help, { color: colors.textSecondary }]}>
          {help}
        </TText>
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
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  imageContainer: {
    borderRadius: spacing.radius.md,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  touchableArea: {
    position: 'relative',
  },
  selectedAreas: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: spacing.radius.sm,
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  selectedArea: {
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  coordinates: {
    fontSize: 12,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  help: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default VisualSelector;
