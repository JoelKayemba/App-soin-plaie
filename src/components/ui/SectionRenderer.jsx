import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText, TIcon } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const SectionRenderer = ({ 
  section, 
  data, 
  onDataChange, 
  errors,
  renderElement,
  elements = []
}) => {
  const { colors } = useTheme();

  const renderSectionContent = () => {
    switch (section.type) {
      case 'conditional_section':
        return renderConditionalSection();
      
      case 'checkbox_section':
        return renderCheckboxSection();
      
      case 'result_section':
        return renderResultSection();
      
      case 'radio_section':
        return renderRadioSection();
      
      case 'numeric_section':
        return renderNumericSection();
      
      case 'choice_section':
        return renderChoiceSection();
      
      case 'form_section':
      default:
        return renderFormSection();
    }
  };

  const renderConditionalSection = () => {
    // Logique conditionnelle basée sur les données
    const shouldShow = evaluateCondition(section.condition, data);
    
    if (!shouldShow) return null;

    return (
      <TView style={[styles.section, { backgroundColor: colors.surface }]}>
        {section.title && (
          <TText style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </TText>
        )}
        {section.description && (
          <TText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {section.description}
          </TText>
        )}
        {section.elements?.map((elementId, index) => {
          const element = findElementById(elementId);
          return element ? (
            <View key={elementId || index}>
              {renderElement(element)}
            </View>
          ) : null;
        })}
      </TView>
    );
  };

  const renderCheckboxSection = () => {
    return (
      <TView style={[styles.section, { backgroundColor: colors.surface }]}>
        {section.title && (
          <TText style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </TText>
        )}
        <View style={styles.checkboxGrid}>
          {section.elements?.map((elementId, index) => {
            const element = findElementById(elementId);
            return element ? (
              <View key={elementId || index} style={styles.checkboxItem}>
                {renderElement(element)}
              </View>
            ) : null;
          })}
        </View>
      </TView>
    );
  };

  const renderResultSection = () => {
    return (
      <TView style={[styles.resultSection, { backgroundColor: colors.primary + '10' }]}>
        <View style={styles.resultHeader}>
          <TIcon name="checkmark-circle" size={24} color={colors.success} />
          <TText style={[styles.resultTitle, { color: colors.success }]}>
            {section.title || 'Résultat'}
          </TText>
        </View>
        {section.description && (
          <TText style={[styles.resultDescription, { color: colors.text }]}>
            {section.description}
          </TText>
        )}
        {section.elements?.map((elementId, index) => {
          const element = findElementById(elementId);
          return element ? (
            <View key={elementId || index}>
              {renderElement(element)}
            </View>
          ) : null;
        })}
      </TView>
    );
  };

  const renderRadioSection = () => {
    return (
      <TView style={[styles.section, { backgroundColor: colors.surface }]}>
        {section.title && (
          <TText style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </TText>
        )}
        {section.elements?.map((elementId, index) => {
          const element = findElementById(elementId);
          return element ? (
            <View key={elementId || index}>
              {renderElement(element)}
            </View>
          ) : null;
        })}
      </TView>
    );
  };

  const renderNumericSection = () => {
    return (
      <TView style={[styles.section, { backgroundColor: colors.surface }]}>
        {section.title && (
          <TText style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </TText>
        )}
        <View style={styles.numericGrid}>
          {section.elements?.map((elementId, index) => {
            const element = findElementById(elementId);
            return element ? (
              <View key={elementId || index} style={styles.numericItem}>
                {renderElement(element)}
              </View>
            ) : null;
          })}
        </View>
      </TView>
    );
  };

  const renderChoiceSection = () => {
    return (
      <TView style={[styles.section, { backgroundColor: colors.surface }]}>
        {section.title && (
          <TText style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </TText>
        )}
        {section.elements?.map((elementId, index) => {
          const element = findElementById(elementId);
          return element ? (
            <View key={elementId || index}>
              {renderElement(element)}
            </View>
          ) : null;
        })}
      </TView>
    );
  };

  const renderFormSection = () => {
    return (
      <TView style={[styles.section, { backgroundColor: colors.surface }]}>
        {section.title && (
          <TText style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </TText>
        )}
        {section.description && (
          <TText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            {section.description}
          </TText>
        )}
        {section.elements?.map((elementId, index) => {
          const element = findElementById(elementId);
          return element ? (
            <View key={elementId || index}>
              {renderElement(element)}
            </View>
          ) : null;
        })}
      </TView>
    );
  };

  // Fonctions utilitaires
  const evaluateCondition = (condition, data) => {
    if (!condition) return true;
    
    // Logique simplifiée pour les conditions
    if (condition.anyOf) {
      return condition.anyOf.some(fieldId => data[fieldId] === true);
    }
    
    if (condition.allOf) {
      return condition.allOf.every(fieldId => data[fieldId] === true);
    }
    
    return true;
  };

  const findElementById = (elementId) => {
    return elements.find(el => el.id === elementId);
  };

  return (
    <View style={styles.container}>
      {renderSectionContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  section: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  checkboxItem: {
    flex: 1,
    minWidth: '45%',
  },
  numericGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  numericItem: {
    flex: 1,
    minWidth: '45%',
  },
  resultSection: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  resultDescription: {
    fontSize: 14,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
});

export default SectionRenderer;
