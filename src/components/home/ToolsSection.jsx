import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TText, TIcon } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';

// Helpers contraste
const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};
const relativeLuminance = ({ r, g, b }) => {
  const srgb = [r, g, b].map((v) => v / 255);
  const linear = srgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};
const pickReadableOn = (bgHex, light = '#FFFFFF', dark = '#111111') => {
  try {
    const lum = relativeLuminance(hexToRgb(bgHex));
    return lum < 0.5 ? light : dark;
  } catch {
    return light;
  }
};

const ToolsSection = ({ title = 'Outils', items = [], onPressItem, onPressVoirTout }) => {
  const { colors, elevation, isDark } = useThemeMode();
  const { spacing, typeScale, windowClass } = useResponsive();

  const columns = (windowClass === 'expanded' || windowClass === 'wide') ? 3 : 2;

  const computeWidth = (idx) => {
    const isLast = idx === items.length - 1;
    const remainder = items.length % columns;
    if (isLast && remainder === 1) return '100%';
    return `${100 / columns}%`;
  };

  return (
    <View style={{ marginTop: spacing.lg }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
      }}>
        <TText style={{ 
          fontSize: 20 * typeScale, 
          fontWeight: '700', 
          flex: 1,
          color: colors.text,
        }}>
          {title}
        </TText>
      </View>

      {/* Grid */}
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginHorizontal: -spacing.lg / 2,
        paddingHorizontal: spacing.md,
      }}>
        {items.map((it, idx) => {
          // Fond de carte selon le mode (style original)
          const cardBg = isDark ? (it.colorDark || it.color || colors.primary)
                                : (it.color || colors.primary);
          // Icône = palette inversée
          const iconColor = isDark ? (it.color || it.colorDark || colors.primary)
                                   : (it.colorDark || it.color || colors.primary);

          const readable = useMemo(
            () => pickReadableOn(cardBg, '#FFFFFF', colors.text),
            [cardBg, colors.text]
          );
          const chipBg = isDark ? (colors.surfaceLight ?? '#2A2F3A') : '#FFFFFF';

          return (
            <View key={idx} style={{ 
              width: computeWidth(idx), 
              padding: spacing.sm / 2,
            }}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => onPressItem?.(it, idx)}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: spacing.lg,
                  ...elevation(2),
                  height: 170, // Hauteur fixe pour toutes les cartes
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                {/* Header avec icône et flèche */}
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: spacing.sm,
                }}>
                  <View
                    style={{
                      width: 44, 
                      height: 44, 
                      borderRadius: 12,
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: chipBg,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <TIcon name={it.icon} size={20} color={iconColor} />
                  </View>

                  <TIcon 
                    name="chevron-forward" 
                    size={16} 
                    color={readable} 
                    style={{ opacity: 0.8 }}
                  />
                </View>

                {/* Contenu principal avec gestion intelligente de l'espace */}
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  {/* Titre */}
                  <View style={{ marginBottom: spacing.xs }}>
                    <TText style={{ 
                      fontSize: 14 * typeScale, 
                      fontWeight: '700', 
                      color: readable,
                      lineHeight: 18,
                    }} numberOfLines={2}>
                      {it.title}
                    </TText>
                  </View>
                  
                  {/* Sous-titre avec espace limité */}
                  {!!it.subtitle && (
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                      <TText style={{ 
                        fontSize: 11 * typeScale, 
                        opacity: 0.85, 
                        color: readable,
                        lineHeight: 14,
                      }} numberOfLines={4}>
                        {it.subtitle}
                      </TText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ToolsSection;
