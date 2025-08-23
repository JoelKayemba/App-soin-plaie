// screens/EvaluationScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const EvaluationScreen = () => {
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={isDark ? styles.darkText : styles.lightText}>
        Écran Évaluation
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  lightText: {
    color: '#000',
    fontSize: 18,
  },
  darkText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EvaluationScreen;