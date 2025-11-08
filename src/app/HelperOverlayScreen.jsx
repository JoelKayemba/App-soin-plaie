import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TView, TText, TIcon } from '@/components/ui/Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const formatKey = (key) => {
  if (!key) return '';
  if (key === 'points') return 'Points clés';
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
};

const HelperOverlayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { helperData, helperTitle } = route.params || {};
  const title = helperTitle || helperData?.title || 'Information';

  console.log('[HelperOverlayScreen] params', route.params);

  const renderContentItem = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <TView key={key} style={styles.section}>
          <TText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {formatKey(key)}
          </TText>
          {value.map((item, index) => (
            <View key={`${key}-${index}`} style={styles.bulletRow}>
              <TText style={[styles.bulletSymbol, { color: colors.primary }]}>•</TText>
              <TText style={[styles.sectionText, { color: colors.text }]}>{item}</TText>
            </View>
          ))}
        </TView>
      );
    }

    if (typeof value === 'string') {
      return (
        <TView key={key} style={styles.section}>
          <TText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {formatKey(key)}
          </TText>
          <TText style={[styles.sectionText, { color: colors.text }]}>{value}</TText>
        </TView>
      );
    }

    return null;
  };

  if (!helperData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
        <TView style={[styles.fallbackContainer, { backgroundColor: colors.background }]}> 
          <TText style={[styles.fallbackTitle, { color: colors.text }]}>Aucune information disponible</TText>
          <TText style={[styles.fallbackMessage, { color: colors.textSecondary }]}>La ressource demandée n'a pas pu être chargée.</TText>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
            <TText style={[styles.closeButtonText, { color: colors.textLight }]}>Fermer</TText>
          </TouchableOpacity>
        </TView>
      </SafeAreaView>
    );
  }

  const contentEntries = helperData.content ? Object.entries(helperData.content) : [];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <TView style={[styles.container, { backgroundColor: colors.background }]}> 
        <TView style={[styles.header, { borderBottomColor: colors.border }]}> 
          <TText style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</TText>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <TIcon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </TView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {helperData.media?.type === 'image' && helperData.media?.url ? (
            <Image source={{ uri: helperData.media.url }} style={styles.image} resizeMode="cover" />
          ) : null}

          {contentEntries.length > 0 ? (
            contentEntries.map(([key, value]) => renderContentItem(key, value))
          ) : (
            <TText style={[styles.fallbackMessage, { color: colors.textSecondary }]}>Aucun détail supplémentaire.</TText>
          )}
        </ScrollView>
      </TView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    marginRight: spacing.md,
  },
  iconButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    paddingRight: spacing.md,
  },
  bulletSymbol: {
    marginRight: spacing.sm,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  fallbackMessage: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.md,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HelperOverlayScreen;
