// src/features/calculators/braden/useBradenCalculator.js
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

const useBradenCalculator = (initialScores = {}, onScoresChange) => {
  const [selectedScores, setSelectedScores] = useState(initialScores || {});
  const [expandedTexts, setExpandedTexts] = useState({});

  useEffect(() => {
    if (!initialScores) return;
    setSelectedScores(prev => (shallowEqual(prev, initialScores) ? prev : initialScores));
  }, [initialScores]);

  const totalScore = useMemo(() => {
    return Object.values(selectedScores).reduce((sum, score) => sum + score, 0);
  }, [selectedScores]);

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

export default useBradenCalculator;
