// Formule: IPSCB(jambe) = PAS_cheville_max(jambe) / PAS_bras_max
// Les bornes suivent ton tableau :
//  >1.40 indéterminé ; 1.00–1.40 normal ; 0.90–0.99 limite ;
//  0.70–0.89 atteinte légère ; 0.40–0.69 atteinte modérée ; <0.40 sévère

const interpret = (value) => {
  if (!isFinite(value)) return 'Valeur non interprétable';
  if (value > 1.40) return 'Indéterminé (artères non compressibles)';
  if (value >= 1.00 && value <= 1.40) return 'Normal';
  if (value >= 0.90 && value <= 0.99) return 'Limite';
  if (value >= 0.70 && value <= 0.89) return 'Anormal, atteinte légère';
  if (value >= 0.40 && value <= 0.69) return 'Anormal, atteinte modérée';
  if (value < 0.40) return 'Anormal, atteinte sévère';
  return 'Valeur non interprétable';
};

export const calcIpscb = ({
  braRight, // PAS bras droit (mmHg)
  braLeft,  // PAS bras gauche (mmHg)
  tpRight,  // Tibiale post. droite
  dpRight,  // Pédieuse droite
  tpLeft,   // Tibiale post. gauche
  dpLeft    // Pédieuse gauche
}) => {
  const braMax = Math.max(+braRight || 0, +braLeft || 0);

  if (!isFinite(braMax) || braMax <= 0) {
    return {
      right: { value: NaN, label: 'Erreur: PAS bras invalide' },
      left:  { value: NaN, label: 'Erreur: PAS bras invalide' },
      notes: ['Fournir une PAS bras droite et/ou gauche > 0']
    };
  }

  const ankleRight = Math.max(+tpRight || 0, +dpRight || 0);
  const ankleLeft  = Math.max(+tpLeft  || 0, +dpLeft  || 0);

  const rightVal = Math.round((ankleRight / braMax) * 100) / 100; // arrondi 2 déc.
  const leftVal  = Math.round((ankleLeft  / braMax) * 100) / 100;

  return {
    right: { value: rightVal, label: interpret(rightVal) },
    left:  { value: leftVal,  label: interpret(leftVal) }
  };
};

// Optionnel: expose aussi l'interprétation seule
export const interpretIpscb = interpret;
