import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TView, TText, TIcon } from './Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const ClinicalAlert = ({ 
  alert,
  style,
  onDismiss,
  ...props 
}) => {
  const { colors } = useTheme();

  if (!alert) return null;

  const getAlertConfig = () => {
    switch (alert.type) {
      case 'alert':
        return {
          backgroundColor: colors.error + '20',
          borderColor: colors.error,
          iconColor: colors.error,
          icon: 'alert-circle',
          title: 'Alerte clinique'
        };
      case 'important':
        return {
          backgroundColor: colors.warning + '20',
          borderColor: colors.warning,
          iconColor: colors.warning,
          icon: 'warning',
          title: 'Important'
        };
      case 'info':
      default:
        return {
          backgroundColor: colors.primary + '20',
          borderColor: colors.primary,
          iconColor: colors.primary,
          icon: 'information-circle',
          title: 'Information'
        };
    }
  };

  const config = getAlertConfig();

  return (
    <TView 
      style={[
        styles.container, 
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        style
      ]} 
      {...props}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <TIcon name={config.icon} size={24} color={config.iconColor} />
        </View>
        
        <View style={styles.textContainer}>
          <TText style={[styles.title, { color: config.iconColor }]}>
            {alert.title || config.title}
          </TText>
          
          <TText style={[styles.message, { color: colors.text }]}>
            {alert.message}
          </TText>
          
          {alert.note && (
            <TText style={[styles.note, { color: colors.textSecondary }]}>
              {alert.note}
            </TText>
          )}
        </View>
        
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <TIcon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {alert.action && (
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: config.iconColor }]}
            onPress={alert.action.onPress}
          >
            <TText style={[styles.actionText, { color: colors.primaryText }]}>
              {alert.action.label}
            </TText>
          </TouchableOpacity>
        </View>
      )}
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 2,
    marginBottom: spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  dismissButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  actionContainer: {
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ClinicalAlert;
