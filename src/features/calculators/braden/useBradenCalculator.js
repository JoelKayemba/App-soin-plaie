// src/features/calculators/braden/useBradenCalculator.js
import { useState, useMemo } from 'react';

const useBradenCalculator = () => {
  const [selectedScores, setSelectedScores] = useState({});
  const [expandedTexts, setExpandedTexts] = useState({});

  // Calculer le score total
  const totalScore = useMemo(() => {
    return Object.values(selectedScores).reduce((sum, score) => sum + score, 0);
  }, [selectedScores]);

  // Déterminer le niveau de risque
  const riskLevel = useMemo(() => {
    if (totalScore >= 18) return { 
      level: 'Aucun risque', 
      color: '#4CAF50', 
      description: 'L\'usager n\'est pas exposé au risque de développer une lésion de pression.' 
    };
    if (totalScore >= 15) return { 
      level: 'Faible risque', 
      color: '#FF9800', 
      description: 'L\'usager présente un faible risque de développer une lésion de pression.' 
    };
    if (totalScore >= 13) return { 
      level: 'Risque modéré', 
      color: '#FF5722', 
      description: 'L\'usager présente un risque modéré de développer une lésion de pression.' 
    };
    if (totalScore >= 10) return { 
      level: 'Risque élevé', 
      color: '#F44336', 
      description: 'L\'usager présente un risque élevé de développer une lésion de pression.' 
    };
    return { 
      level: 'Risque très élevé', 
      color: '#D32F2F', 
      description: 'L\'usager présente un risque très élevé de développer une lésion de pression.' 
    };
  }, [totalScore]);

  // Sélectionner un score pour une dimension
  const selectScore = (dimensionId, score) => {
    setSelectedScores(prev => ({
      ...prev,
      [dimensionId]: score
    }));
  };

  // Basculer l'expansion du texte
  const toggleTextExpansion = (dimensionId, score) => {
    const key = `${dimensionId}-${score}`;
    setExpandedTexts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Réinitialiser toutes les sélections
  const resetSelections = () => {
    setSelectedScores({});
    setExpandedTexts({});
  };

  // Vérifier si toutes les dimensions sont sélectionnées
  const isComplete = (totalDimensions) => {
    return totalDimensions === Object.keys(selectedScores).length;
  };

  return {
    selectedScores,
    expandedTexts,
    totalScore,
    riskLevel,
    selectScore,
    toggleTextExpansion,
    resetSelections,
    isComplete
  };
};

export default useBradenCalculator;
