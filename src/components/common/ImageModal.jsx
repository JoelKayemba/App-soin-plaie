// src/components/common/ImageModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageModal = ({ visible, imageUrl, onClose, title }) => {
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const useStyles = makeStyles((c) => ({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl*2,
      paddingBottom: spacing.md,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    title: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: '#FFFFFF',
      flex: 1,
      marginRight: spacing.md,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: screenWidth,
      height: screenHeight * 0.7,
      resizeMode: 'contain',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      fontSize: 16 * typeScale,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    zoomHint: {
      position: 'absolute',
      bottom: spacing.xl,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: spacing.md,
      borderRadius: 8,
    },
    zoomHintText: {
      fontSize: 12 * typeScale,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  }));

  const s = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={s.modal}>
        {/* En-tête avec titre et bouton fermer */}
        <View style={s.header}>
          <TText style={s.title} numberOfLines={1}>
            {title || 'Image du produit'}
          </TText>
          <TouchableOpacity style={s.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Zone d'image */}
        <View style={s.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={s.image}
              resizeMode="contain"
            />
          ) : (
            <View style={s.emptyState}>
              <Ionicons name="image-outline" size={64} color="#FFFFFF" />
              <TText style={s.emptyText}>
                Aucune image disponible
              </TText>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;
