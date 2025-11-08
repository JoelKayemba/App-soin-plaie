// Couleurs principales de l'application
const colors = {
  light: {
    // Couleurs de base
    background: '#FFFFFF',     // fond principal clair
    surface: '#F8FAFC',        // cartes, zones secondaires
    surfaceLight: '#F0F3FA',   // surface légère
    card: '#FFFFFF',           // cartes de produits
    
    // Couleurs principales et accents
    primary: '#628ECB',        // bleu principal (boutons, liens)
    primaryDark: '#395886',    // survols, états actifs
    primaryText: '#FFFFFF',    // texte sur primary
    secondary: '#8AAEE0',      // accents, tags
    tertiary: '#B1C9EF',       // surlignage léger
    
    // Couleurs de texte
    text: '#1E293B',           // texte principal (plus contrasté)
    textSecondary: '#64748B',  // texte secondaire (plus contrasté)
    textTertiary: '#94A3B8',   // texte tertiaire
    textLight: '#FFFFFF',      // texte clair (sur primary)
    
    // Couleurs d'interface
    border: '#E2E8F0',         // bordures (plus claires)
    
    // Couleurs d'état
    success: '#10B981',        // vert pour succès
    warning: '#F59E0B',        // orange pour avertissement
    error: '#EF4444',          // rouge pour erreur
    
    // Couleurs utilitaires
    shadow: '#000000',         // couleur d'ombre
    black: '#000000',
    white: '#FFFFFF'
  },

  dark: {
    // Couleurs de base
    background: '#1C1F26',     // fond principal sombre
    surface: '#2A2F3A',        // cartes, zones secondaires
    surfaceLight: '#374151',   // surface légère (améliorée)
    card: '#2A2F3A',           // cartes de produits
    
    // Couleurs principales et accents
    primary: '#628ECB',        // bleu principal identique
    primaryDark: '#8AAEE0',    // bleu plus clair pour contraster
    primaryText: '#FFFFFF',    // texte sur primary
    secondary: '#B1C9EF',      // accents doux
    tertiary: '#D5DEEF',       // surlignage
    
    // Couleurs de texte
    text: '#F8FAFC',           // texte principal
    textSecondary: '#CBD5E1',  // texte secondaire (plus contrasté)
    textTertiary: '#94A3B8',   // texte tertiaire
    textLight: '#000000',      // texte foncé (sur boutons clairs)
    
    // Couleurs d'interface
    border: '#475569',         // séparateurs discrets
    
    // Couleurs d'état
    success: '#34D399',        // vert pour succès (plus clair)
    warning: '#FBBF24',        // orange pour avertissement (plus clair)
    error: '#F87171',          // rouge pour erreur (plus clair)
    
    // Couleurs utilitaires
    shadow: '#000000',         // couleur d'ombre
    black: '#FFFFFF',
    white: '#000000'
  },
};

export default colors;
