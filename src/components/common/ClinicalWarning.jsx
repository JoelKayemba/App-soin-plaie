// src/components/common/ClinicalWarning.jsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const ClinicalWarning = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const useStyles = makeStyles((c) => ({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: c.background,
      borderRadius: 20,
      padding: spacing.xl,
      marginHorizontal: spacing.lg,
      maxWidth: screenWidth * 0.9,
      elevation: 8,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: 20 * typeScale,
      fontWeight: '800',
      color: c.text,
      textAlign: 'center',
      marginLeft: spacing.sm,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.warning + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      alignSelf: 'center',
    },
    content: {
      fontSize: 16 * typeScale,
      color: c.text,
      lineHeight: 24 * typeScale,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    closeButton: {
      backgroundColor: c.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      marginTop:spacing.lg,
      borderRadius: 25,
      alignSelf: 'center',
      elevation: 2,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    closeButtonText: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: c.primaryText,
      textAlign: 'center',
    },
    warningText: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      marginTop: spacing.sm,
    },
  }));

  const s = useStyles();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={s.modalOverlay}>
        <TView style={s.modalContainer}>
          {/* Icône d'avertissement */}
          <View style={s.iconContainer}>
            <Ionicons 
              name="warning" 
              size={32} 
              color={colors.warning}
            />
          </View>

          {/* Titre */}
          <View style={s.header}>
            <TText style={s.title}>
              Avertissement Clinique
            </TText>
          </View>
          
          {/* Contenu principal */}
          <TText style={s.content}>
            Cette application a été créée pour la relève infirmière du Québec et ne remplace pas le jugement clinique.
          </TText>

          {/* Détails supplémentaires */}
          <TText style={s.warningText}>
            Avant d’utiliser cette application, veuillez vous assurer que son usage correspond à votre champ d’exercice et à vos compétences professionnelles. Vous demeurez responsable de l’interprétation et de l’application des informations fournies. En cas de doute, consultez une personne d'expérience ou une ressource spécialisée.
          </TText>

          {/* Bouton de fermeture */}
          <TouchableOpacity 
            style={s.closeButton} 
            onPress={() => setIsVisible(false)}
          >
            <TText style={s.closeButtonText}>
              J'ai compris
            </TText>
          </TouchableOpacity>
        </TView>
      </View>
    </Modal>
  );
};

export default ClinicalWarning;
