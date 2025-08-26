// src/features/calculators/ipscb/useIPSCBCalculator.js
import { useState, useMemo } from 'react';

const useIPSCBCalculator = () => {
  const [pressures, setPressures] = useState({
    brachialeDroite: '',
    brachialeGauche: '',
    tibialePosterieureDroite: '',
    pedieuseDroite: '',
    tibialePosterieureGauche: '',
    pedieuseGauche: ''
  });

  // Calculer la PAS la plus élevée des deux bras
  const pasBrasMax = useMemo(() => {
    const droite = parseFloat(pressures.brachialeDroite) || 0;
    const gauche = parseFloat(pressures.brachialeGauche) || 0;
    return Math.max(droite, gauche);
  }, [pressures.brachialeDroite, pressures.brachialeGauche]);

  // Calculer les indices IPSCB
  const indicesIPSCB = useMemo(() => {
    if (pasBrasMax === 0) return {};

    const calculerIPSCB = (pressionPied) => {
      const pasPied = parseFloat(pressionPied) || 0;
      if (pasPied === 0) return null;
      return (pasPied / pasBrasMax).toFixed(2);
    };

    return {
      tibialePosterieureDroite: calculerIPSCB(pressures.tibialePosterieureDroite),
      pedieuseDroite: calculerIPSCB(pressures.pedieuseDroite),
      tibialePosterieureGauche: calculerIPSCB(pressures.tibialePosterieureGauche),
      pedieuseGauche: calculerIPSCB(pressures.pedieuseGauche)
    };
  }, [pressures, pasBrasMax]);

  // Interpréter les résultats IPSCB
  const interpretations = useMemo(() => {
    const interpreter = (valeur) => {
      if (!valeur) return null;
      
      const num = parseFloat(valeur);
      if (num > 1.40) return {
        niveau: 'Indéterminé',
        description: 'Artères non compressibles',
        color: '#9E9E9E'
      };
      if (num >= 1.0) return {
        niveau: 'Normal',
        description: 'Valeur normale',
        color: '#4CAF50'
      };
      if (num >= 0.9) return {
        niveau: 'Limite',
        description: 'Valeur limite',
        color: '#FF9800'
      };
      if (num >= 0.7) return {
        niveau: 'Anormal, atteinte légère',
        description: 'Atteinte artérielle légère',
        color: '#FFC107'
      };
      if (num >= 0.4) return {
        niveau: 'Anormal, atteinte modérée',
        description: 'Atteinte artérielle modérée',
        color: '#FF5722'
      };
      return {
        niveau: 'Anormal, atteinte sévère',
        description: 'Atteinte artérielle sévère',
        color: '#D32F2F'
      };
    };

    return {
      tibialePosterieureDroite: interpreter(indicesIPSCB.tibialePosterieureDroite),
      pedieuseDroite: interpreter(indicesIPSCB.pedieuseDroite),
      tibialePosterieureGauche: interpreter(indicesIPSCB.tibialePosterieureGauche),
      pedieuseGauche: interpreter(indicesIPSCB.pedieuseGauche)
    };
  }, [indicesIPSCB]);

  // Mettre à jour une pression
  const updatePressure = (field, value) => {
    setPressures(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Réinitialiser toutes les pressions
  const resetPressures = () => {
    setPressures({
      brachialeDroite: '',
      brachialeGauche: '',
      tibialePosterieureDroite: '',
      pedieuseDroite: '',
      tibialePosterieureGauche: '',
      pedieuseGauche: ''
    });
  };

  // Vérifier si toutes les pressions sont remplies
  const isComplete = () => {
    return Object.values(pressures).every(pressure => pressure !== '');
  };

  return {
    pressures,
    pasBrasMax,
    indicesIPSCB,
    interpretations,
    updatePressure,
    resetPressures,
    isComplete
  };
};

export default useIPSCBCalculator;

