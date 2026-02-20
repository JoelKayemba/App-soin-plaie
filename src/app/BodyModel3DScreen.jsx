/**
 * Écran plein écran : WebView avec le modèle 3D (corps) chargé dedans.
 * Ouvert depuis la table 14 (localisation de la plaie) via "Voir le modèle 3D".
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import BodyModelViewer from '@/components/ui/BodyModelViewer';
import spacing from '@/styles/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 56;
const VIEWER_HEIGHT = Math.max(SCREEN_HEIGHT - HEADER_HEIGHT - 100, 400);

export default function BodyModel3DScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <TIcon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TText style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          Modèle 3D – localisation
        </TText>
        <View style={styles.headerRight} />
      </View>

      <TView style={styles.content}>
        <BodyModelViewer
          width={SCREEN_WIDTH}
          height={VIEWER_HEIGHT}
          style={styles.viewer}
        />
      </TView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    minHeight: HEADER_HEIGHT,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.sm,
  },
  viewer: {
    flex: 1,
    minHeight: VIEWER_HEIGHT,
  },
});
