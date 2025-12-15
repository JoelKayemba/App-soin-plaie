// src/features/calculators/braden-q/useBradenQCalculator.js
import { useState, useMemo, useEffect } from 'react';

const shallowEqual = (objA = {}, objB = {}) => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
};

const useBradenQCalculator = (initialScores = {}, onScoresChange) => {
  const [selectedScores, setSelectedScores] = useState(initialScores || {});
  const [expandedTexts, setExpandedTexts] = useState({});

  useEffect(() => {
    if (!initialScores) return;
    setSelectedScores(prev => (shallowEqual(prev, initialScores) ? prev : initialScores));
  }, [initialScores]);

  const totalScore = useMemo(() => {
    return Object.values(selectedScores).reduce((sum, score) => {
      // Gérer les valeurs null/undefined (score non sélectionné)
      const numScore = score ?? 0;
      return sum + numScore;
    }, 0);
  }, [selectedScores]);

  const riskLevel = useMemo(() => {
    // Nouvelle échelle Braden-Q : score max = 23, plus le score est élevé, plus le risque est élevé
    if (totalScore <= 3) return { 
      level: 'Risque très faible', 
      color: '#4CAF50', 
      description: 'Le patient présente un risque très faible de développer une lésion de pression.' 
    };
    if (totalScore <= 6) return { 
      level: 'Risque faible', 
      color: '#8BC34A', 
      description: 'Le patient présente un risque faible de développer une lésion de pression.' 
    };
    if (totalScore <= 10) return { 
      level: 'Risque modéré', 
      color: '#FF9800', 
      description: 'Le patient présente un risque modéré de développer une lésion de pression.' 
    };
    if (totalScore <= 15) return { 
      level: 'Risque élevé', 
      color: '#FF5722', 
      description: 'Le patient présente un risque élevé de développer une lésion de pression.' 
    };
    return { 
      level: 'Risque très élevé', 
      color: '#F44336', 
      description: 'Le patient présente un risque très élevé de développer une lésion de pression.' 
    };
  }, [totalScore]);

  const notifyChange = (updatedScores) => {
    onScoresChange?.(updatedScores);
  };

  const selectScore = (dimensionId, score) => {
    setSelectedScores(prev => {
      if (prev[dimensionId] === score) return prev;
      const updated = { ...prev, [dimensionId]: score };
      notifyChange(updated);
      return updated;
    });
  };

  const toggleTextExpansion = (dimensionId, score) => {
    const key = `${dimensionId}-${score}`;
    setExpandedTexts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetSelections = () => {
    setSelectedScores({});
    setExpandedTexts({});
    notifyChange({});
  };

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

export default useBradenQCalculator;
