import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TView, TText, TIcon } from '../Themed';
import { useTheme } from '@/context/ThemeContext';
import spacing from '@/styles/spacing';

const InfoField = ({ 
  content,
  type = 'info', // 'info', 'warning', 'error', 'success'
  icon,
  style,
  ...props 
}) => {
  const { colors } = useTheme();

  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: colors.warning + '20',
          borderColor: colors.warning,
          iconColor: colors.warning,
          defaultIcon: 'warning-outline'
        };
      case 'error':
        return {
          backgroundColor: colors.error + '20',
          borderColor: colors.error,
          iconColor: colors.error,
          defaultIcon: 'alert-circle-outline'
        };
      case 'success':
        return {
          backgroundColor: colors.success + '20',
          borderColor: colors.success,
          iconColor: colors.success,
          defaultIcon: 'checkmark-circle-outline'
        };
      default: // info
        return {
          backgroundColor: colors.primary + '20',
          borderColor: colors.primary,
          iconColor: colors.primary,
          defaultIcon: 'information-circle-outline'
        };
    }
  };

  const config = getTypeConfig();
  const iconName = icon || config.defaultIcon;

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
        <TIcon 
          name={iconName} 
          size={20} 
          color={config.iconColor}
          style={styles.icon}
        />
        
        <TText style={[styles.text, { color: colors.text }]}>
          {content}
        </TText>
      </View>
    </TView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    marginBottom: spacing.form.elementSpacing,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});

export default InfoField;


