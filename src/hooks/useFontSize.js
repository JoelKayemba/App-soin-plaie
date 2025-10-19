// src/hooks/useFontSize.js
import { useState, useEffect, createContext, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

// Contexte pour partager la taille de police globalement
const FontSizeContext = createContext();

// Valeurs par défaut pour les tailles de police
const FONT_SIZE_SCALES = {
  small: 0.85,    // 15% plus petit
  medium: 1.0,    // Taille normale
  large: 1.15,    // 15% plus grand
};

const FONT_SIZE_LABELS = {
  small: 'Petite',
  medium: 'Moyenne', 
  large: 'Grande',
};

const STORAGE_KEY = 'fontSizePreference';

// Hook pour utiliser la taille de police
export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};

// Provider pour le contexte de taille de police
export const FontSizeProvider = ({ children }) => {
  const [fontSize, setFontSizeState] = useState('medium');
  const [isLoading, setIsLoading] = useState(true);

  // Charger la préférence sauvegardée au démarrage
  useEffect(() => {
    loadFontSizePreference();
  }, []);

  const loadFontSizePreference = async () => {
    try {
      const savedFontSize = await SecureStore.getItemAsync(STORAGE_KEY);
      if (savedFontSize && FONT_SIZE_SCALES[savedFontSize]) {
        setFontSizeState(savedFontSize);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement de la taille de police:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setFontSize = async (newFontSize) => {
    if (!FONT_SIZE_SCALES[newFontSize]) {
      console.warn('Taille de police invalide:', newFontSize);
      return;
    }

    try {
      // Sauvegarder dans SecureStore
      await SecureStore.setItemAsync(STORAGE_KEY, newFontSize);
      
      // Mettre à jour l'état
      setFontSizeState(newFontSize);
      
      console.log('Taille de police mise à jour:', newFontSize);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la taille de police:', error);
    }
  };

  const getFontScale = () => {
    return FONT_SIZE_SCALES[fontSize] || FONT_SIZE_SCALES.medium;
  };

  const getFontSizeLabel = () => {
    return FONT_SIZE_LABELS[fontSize] || FONT_SIZE_LABELS.medium;
  };

  const getAvailableSizes = () => {
    return Object.keys(FONT_SIZE_SCALES).map(size => ({
      key: size,
      label: FONT_SIZE_LABELS[size],
      scale: FONT_SIZE_SCALES[size],
    }));
  };

  const value = {
    fontSize,
    setFontSize,
    getFontScale,
    getFontSizeLabel,
    getAvailableSizes,
    isLoading,
  };

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
};

// Hook utilitaire pour obtenir le facteur d'échelle de police
export const useFontScale = () => {
  const { getFontScale } = useFontSize();
  return getFontScale();
};

export default useFontSize;
