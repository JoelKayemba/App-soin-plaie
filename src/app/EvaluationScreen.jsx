// src/app/EvaluationScreen.jsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import BackButton from '@/components/common/BackButton';

const BradenScreen = () => {
  const { makeStyles, colors, elevation } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const useStyles = makeStyles((c) => ({
    root: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: spacing.md,
      backgroundColor: c.background,
      
    },
    title: {
      fontSize: 24 * typeScale,
      fontWeight: '700',
      color: c.text,
      marginLeft: spacing.md,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    placeholder: {
      fontSize: 16 * typeScale,
      color: c.text,
      textAlign: 'center',
      marginTop: spacing.xl * 2,
    },
  }));

  const s = useStyles();

  return (
    <TView style={s.root}>
      {/* En-tête avec bouton retour et titre */}
      <View style={s.header}>
        <BackButton />
        <TText style={s.title}>Démarche clinique</TText>
      </View>

      {/* Contenu principal */}
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        <TText style={s.placeholder}>
          Interface d'évaluation du risque de lésion de pression
        </TText>
        {/* TODO: Implémenter le formulaire Braden */}
      </ScrollView>
    </TView>
  );
};

export default BradenScreen;