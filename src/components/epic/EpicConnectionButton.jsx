/**
 * Composant Bouton de Connexion Epic
 * 
 * Bouton UI pour se connecter à Epic via OAuth
 */

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import spacing from '@/styles/spacing';
import { useEpic } from '@/context/EpicContext';

const EpicConnectionButton = ({ style, onSuccess, onError }) => {
  const { colors, elevation } = useThemeMode();
  const { typeScale } = useResponsive();
  const { connect, isLoading, isConnected, detectEpicLaunch } = useEpic();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      // Détecter si l'app est lancée depuis Epic
      const launch = await detectEpicLaunch();
      
      if (launch?.isLaunched) {
        // EHR Launch : utiliser les paramètres de lancement
        await connect(launch.launchToken, launch.iss);
      } else {
        // Standalone Launch : connexion sans contexte patient
        await connect();
      }

      // Succès
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('[EpicConnectionButton] Erreur connexion:', error);
      
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Impossible de se connecter à Epic. Veuillez réessayer.',
        [{ text: 'OK' }]
      );

      if (onError) {
        onError(error);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Ne pas afficher si déjà connecté
  if (isConnected) {
    return null;
  }

  const buttonLoading = isLoading || isConnecting;

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: spacing.radius.md,
      gap: spacing.sm,
      ...elevation(2),
    },
    buttonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 16 * typeScale,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    icon: {
      marginRight: spacing.xs,
    },
  });

  return (
    <TView style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, buttonLoading && styles.buttonDisabled]}
        onPress={handleConnect}
        disabled={buttonLoading}
        accessibilityLabel="Se connecter à Epic"
        accessibilityRole="button"
      >
        {buttonLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <TIcon name="link" size={20} color="#FFFFFF" style={styles.icon} />
        )}
        <TText style={styles.buttonText}>
          {buttonLoading ? 'Connexion...' : 'Se connecter à Epic'}
        </TText>
      </TouchableOpacity>
    </TView>
  );
};

export default EpicConnectionButton;

