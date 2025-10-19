import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const PhotoUpload = ({ 
  value,
  onValueChange,
  label,
  description,
  required = false,
  error,
  disabled = false,
  help,
  maxPhotos = 3,
  style,
  ...props 
}) => {
  const { colors } = useTheme();
  const [photos, setPhotos] = useState(value || []);

  const handleAddPhoto = () => {
    if (disabled) return;
    
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Limite atteinte',
        `Vous ne pouvez ajouter que ${maxPhotos} photo(s) maximum.`
      );
      return;
    }

    // TODO: Implémenter la sélection de photo réelle
    Alert.alert(
      'Ajouter une photo',
      'Fonctionnalité de sélection de photo à implémenter',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Simuler', onPress: () => simulatePhoto() }
      ]
    );
  };

  const simulatePhoto = () => {
    const newPhoto = {
      id: Date.now().toString(),
      uri: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Photo+Simulee',
      timestamp: new Date().toISOString(),
      description: `Photo ${photos.length + 1}`
    };
    
    const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);
    onValueChange?.(newPhotos);
  };

  const handleRemovePhoto = (photoId) => {
    if (disabled) return;
    
    Alert.alert(
      'Supprimer la photo',
      'Êtes-vous sûr de vouloir supprimer cette photo ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter(photo => photo.id !== photoId);
            setPhotos(newPhotos);
            onValueChange?.(newPhotos);
          }
        }
      ]
    );
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

      {/* Photos existantes */}
      {photos.length > 0 && (
        <View style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <TView key={photo.id} style={[styles.photoItem, { backgroundColor: colors.surface }]}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoInfo}>
                <TText style={[styles.photoDescription, { color: colors.text }]}>
                  {photo.description}
                </TText>
                <TText style={[styles.photoTimestamp, { color: colors.textSecondary }]}>
                  {new Date(photo.timestamp).toLocaleString('fr-CA')}
                </TText>
              </View>
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error }]}
                onPress={() => handleRemovePhoto(photo.id)}
                disabled={disabled}
              >
                <TIcon name="close" size={16} color={colors.primaryText} />
              </TouchableOpacity>
            </TView>
          ))}
        </View>
      )}

      {/* Bouton d'ajout */}
      {photos.length < maxPhotos && (
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              borderColor: disabled ? colors.border : colors.primary,
              backgroundColor: disabled ? colors.surfaceLight : colors.primary + '10',
            }
          ]}
          onPress={handleAddPhoto}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <TIcon 
            name="camera-outline" 
            size={24} 
            color={disabled ? colors.textTertiary : colors.primary}
          />
          <TText style={[
            styles.addButtonText,
            { color: disabled ? colors.textTertiary : colors.primary }
          ]}>
            Ajouter une photo
          </TText>
        </TouchableOpacity>
      )}

      {/* Compteur */}
      <TText style={[styles.counter, { color: colors.textSecondary }]}>
        {photos.length}/{maxPhotos} photo(s)
      </TText>
      
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
  photosContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  photoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: spacing.radius.sm,
    marginRight: spacing.sm,
  },
  photoInfo: {
    flex: 1,
  },
  photoDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  photoTimestamp: {
    fontSize: 12,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: spacing.radius.md,
    gap: spacing.sm,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  counter: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  error: {
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

export default PhotoUpload;


