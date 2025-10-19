// src/components/products/ProductCategories.jsx
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { TView, TText } from '@/components/ui/Themed';
import { useThemeMode } from '@/hooks/useThemeMode';
import useResponsive from '@/hooks/useResponsive';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProductCategories = ({ selectedCategory, onCategoryChange }) => {
  const { makeStyles, colors } = useThemeMode();
  const { spacing, typeScale } = useResponsive();

  const categories = [
    {
      id: 'all',
      name: 'Tous',
    },
    {
      id: 'dressings',
      name: 'Pansements',
    },
    {
      id: 'cleaning',
      name: 'Nettoyants & Désinfectants',
    },
    {
      id: 'protection',
      name: 'Protection de la peau',
    },
    {
      id: 'debridement',
      name: 'Débridement enzymatique',
    },
  ];

  const useStyles = makeStyles((c) => ({
    container: {
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: 18 * typeScale,
      fontWeight: '600',
      color: c.text,
      marginBottom: spacing.sm,
    },
    categoriesContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.sm,
    },
    categoryItem: {
      marginRight: spacing.sm,
    },
    categoryButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.background,
    },
    activeCategoryButton: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    categoryName: {
      fontSize: 14 * typeScale,
      color: c.textSecondary,
      fontWeight: '500',
    },
    activeCategoryName: {
      color: c.primaryText,
      fontWeight: '600',
    },
  }));

  const s = useStyles();



  return (
    <TView style={s.container}>
      <TText style={s.title}>Catégories</TText>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.categoriesContainer}
      >
                 {categories.map((category) => (
           <TouchableOpacity
             key={category.id}
             style={s.categoryItem}
             onPress={() => onCategoryChange(category.id)}
           >
             <TView 
               style={[
                 s.categoryButton,
                 selectedCategory === category.id && s.activeCategoryButton
               ]}
             >
               <TText 
                 style={[
                   s.categoryName,
                   selectedCategory === category.id && s.activeCategoryName
                 ]}
               >
                 {category.name}
               </TText>
             </TView>
           </TouchableOpacity>
         ))}
      </ScrollView>
    </TView>
  );
};

export default ProductCategories;
