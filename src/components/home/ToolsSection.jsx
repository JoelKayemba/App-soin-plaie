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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <TText style={{ fontSize: 20 * typeScale, fontWeight: '700', flex: 1 }}>
          {title}
        </TText>
        <TouchableOpacity onPress={onPressVoirTout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <TText style={{ fontSize: 14 * typeScale, fontWeight: '600', color: colors.primary }}>
            Voir tout
          </TText>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.sm / 2 }}>
        {items.map((it, idx) => {
          // Fond de carte selon le mode
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
            <View key={idx} style={{ width: computeWidth(idx), padding: spacing.md / 2 }}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => onPressItem?.(it, idx)}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 14,
                  padding: spacing.md,
                  ...elevation(2),
                  minHeight:137,
                  justifyContent: 'space-between', // pour bien répartir le contenu

                }}
              >
                {/* Ligne top: chip + flèche */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                  <View
                    style={{
                      width: 52, height: 52, borderRadius: 26,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: chipBg,
                    }}
                  >
                    <TIcon name={it.icon} size={22} color={iconColor} />
                  </View>

                  <View style={{ flex: 1 }} />

                  <TIcon name="chevron-forward" size={20} color={readable} />
                </View>

                {/* Titre + sous-titre */}
                <TText style={{ fontSize: 15 * typeScale, fontWeight: '700', marginBottom: 4, color: readable }}>
                  {it.title}
                </TText>
                {!!it.subtitle && (
                  <TText style={{ fontSize: 13 * typeScale, opacity: 0.9, color: readable }}>
                    {it.subtitle}
                  </TText>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ToolsSection;
