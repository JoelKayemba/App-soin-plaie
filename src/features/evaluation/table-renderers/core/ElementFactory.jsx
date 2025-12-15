/**
 * ElementFactory - Factory pour créer des éléments React
 * 
 * Fournit des fonctions utilitaires pour créer des composants React
 * de manière cohérente dans les renderers de tables.
 */

/**
 * Crée un élément React avec gestion flexible des paramètres
 * @param {React.Component} Component - Le composant à créer
 * @param {object} additionalProps - Props additionnelles
 * @param {string|React.Node} keyOrChildren - Key (string) ou children (React.Node)
 * @param {React.Node} children - Children optionnels
 * @returns {React.Element} - L'élément React créé
 */
export const createElement = (Component, additionalProps = {}, keyOrChildren = null, children = null) => {
  // Si le troisième paramètre est une string, c'est une key
  // Sinon, c'est probablement des children
  if (typeof keyOrChildren === 'string') {
    if (children) {
      return <Component key={keyOrChildren} {...additionalProps}>{children}</Component>;
    }
    return <Component key={keyOrChildren} {...additionalProps} />;
  } else {
    // Le troisième paramètre est des children
    if (keyOrChildren) {
      return <Component {...additionalProps}>{keyOrChildren}</Component>;
    }
    return <Component {...additionalProps} />;
  }
};

/**
 * Crée un élément avec les props communes pré-appliquées
 * @param {React.Component} Component - Le composant à créer
 * @param {object} commonProps - Props communes (error, disabled, help, style)
 * @param {object} additionalProps - Props spécifiques à l'élément
 * @param {string} elementId - ID de l'élément (utilisé comme key)
 * @returns {React.Element} - L'élément React créé
 */
export const createElementWithCommonProps = (Component, commonProps, additionalProps = {}, elementId = null) => {
  const props = { ...commonProps, ...additionalProps };
  return createElement(Component, props, elementId);
};

export default {
  createElement,
  createElementWithCommonProps,
};


