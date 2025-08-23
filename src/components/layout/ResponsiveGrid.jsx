// cards auto-wrap + colonnes adaptatives
import React from 'react';
import { View } from 'react-native';
import useResponsive from '@/hooks/useResponsive';

const ResponsiveGrid = ({ children, gap }) => {
  const { gridColumns, spacing } = useResponsive();
  const G = gap ?? spacing.md;
  const col = gridColumns;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -G / 2,
      }}
    >
      {React.Children.map(children, (child) => (
        <View style={{ width: `${100 / col}%`, paddingHorizontal: G / 2, marginBottom: G }}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default ResponsiveGrid;
