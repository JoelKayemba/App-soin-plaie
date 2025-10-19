import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TView, TText } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const DebugInfo = ({ data, title = "Debug Info" }) => {
  const { colors } = useTheme();

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'null/undefined';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <TView style={[styles.container, { backgroundColor: colors.surfaceLight }]}>
      <TText style={[styles.title, { color: colors.text }]}>
        {title}
      </TText>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TText style={[styles.content, { color: colors.textSecondary }]}>
          {formatValue(data)}
        </TText>
      </ScrollView>
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: spacing.radius.sm,
    marginBottom: spacing.md,
    maxHeight: 200,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default DebugInfo;
