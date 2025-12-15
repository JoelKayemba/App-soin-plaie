/**
 * Composant Statut de Connexion Epic
 * 
 * Affiche le statut de connexion Epic et le nom du patient si connecté
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import spacing from '@/styles/spacing';
import { useEpic } from '@/context/EpicContext';

const EpicConnectionStatus = ({ style, showDisconnectButton = true }) => {
  const { colors, elevation } = useThemeMode();
  const { typeScale } = useResponsive();
  const { isConnected, isLoading, patientId, disconnect, loadPatientData } = useEpic();
  const [patientName, setPatientName] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  // Charger le nom du patient si connecté
  useEffect(() => {
    const fetchPatientName = async () => {
      if (isConnected && patientId && !patientName) {
        try {
          setLoadingPatient(true);
          const data = await loadPatientData(patientId);
          setPatientName(data.patientName);
        } catch (error) {
          console.error('[EpicConnectionStatus] Erreur chargement patient:', error);
          // Ne pas afficher d'erreur, juste garder patientName à null
        } finally {
          setLoadingPatient(false);
        }
      }
    };

    fetchPatientName();
  }, [isConnected, patientId, patientName, loadPatientData]);

  const handleDisconnect = () => {
    Alert.alert(
      'Déconnexion Epic',
      'Êtes-vous sûr de vouloir vous déconnecter d\'Epic ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnect();
              setPatientName(null);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se déconnecter d\'Epic.');
            }
          },
        },
      ]
    );
  };

  // Ne rien afficher si non connecté
  if (!isConnected) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: spacing.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
      ...elevation(1),
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.sm,
    },
    statusIcon: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#10B981', // Vert pour "connecté"
    },
    textSection: {
      flex: 1,
    },
    statusText: {
      fontSize: 14 * typeScale,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.xs / 2,
    },
    patientText: {
      fontSize: 12 * typeScale,
      color: colors.textSecondary,
    },
    disconnectButton: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: spacing.radius.sm,
      backgroundColor: colors.error + '20',
      borderWidth: 1,
      borderColor: colors.error,
    },
    disconnectButtonText: {
      fontSize: 12 * typeScale,
      fontWeight: '600',
      color: colors.error,
    },
  });

  return (
    <TView style={[styles.container, style]}>
      <View style={styles.leftSection}>
        <View style={styles.statusIcon} />
        <View style={styles.textSection}>
          <TText style={styles.statusText}>Connecté à Epic</TText>
          {loadingPatient ? (
            <TText style={styles.patientText}>Chargement...</TText>
          ) : patientName ? (
            <TText style={styles.patientText}>{patientName}</TText>
          ) : patientId ? (
            <TText style={styles.patientText}>Patient ID: {patientId}</TText>
          ) : null}
        </View>
      </View>
      
      {showDisconnectButton && (
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={handleDisconnect}
          accessibilityLabel="Se déconnecter d'Epic"
          accessibilityRole="button"
        >
          <TText style={styles.disconnectButtonText}>Déconnecter</TText>
        </TouchableOpacity>
      )}
    </TView>
  );
};

export default EpicConnectionStatus;

