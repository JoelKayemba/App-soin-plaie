/**
 * Script pour nettoyer les fichiers JSON des tables d'évaluation
 * Supprime les propriétés non utilisées et les répétitions
 */

const fs = require('fs');
const path = require('path');

// Propriétés à supprimer au niveau de la table
const TABLE_PROPERTIES_TO_REMOVE = [
  'metadata',
  'version',
  'accessibility',
  'export_format',
  'data_structure',
  'clinical_notes',
  'derived_data',
  'constats' // Les constats sont dans col2, pas dans col1
];

// Propriétés à supprimer au niveau des éléments
const ELEMENT_PROPERTIES_TO_REMOVE = [
  'calculation',
  'tooltip' // Redondant avec help
];

// Propriétés à supprimer dans les options
const OPTION_PROPERTIES_TO_REMOVE = [
  'description' // Si identique au label
];

/**
 * Nettoie un objet récursivement
 */
function cleanObject(obj, depth = 0) {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item, depth + 1));
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const cleaned = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Supprimer les propriétés non utilisées au niveau table
    if (depth === 0 && TABLE_PROPERTIES_TO_REMOVE.includes(key)) {
      continue;
    }
    
    // Supprimer les propriétés non utilisées au niveau élément
    if (key === 'elements' || key === 'options' || key === 'fields') {
      cleaned[key] = cleanObject(value, depth + 1);
      continue;
    }
    
    // Supprimer les routes vides
    if (key === 'routes' && Array.isArray(value) && value.length === 0) {
      continue;
    }
    
    // Supprimer les propriétés non utilisées dans les éléments
    if (ELEMENT_PROPERTIES_TO_REMOVE.includes(key)) {
      continue;
    }
    
    // Nettoyer les descriptions répétitives
    if (key === 'description') {
      const label = obj.label || obj.title || '';
      // Si description est identique ou très similaire au label, la supprimer
      if (label && value && 
          (value.toLowerCase().trim() === label.toLowerCase().trim() ||
           value.toLowerCase().includes(label.toLowerCase()) ||
           label.toLowerCase().includes(value.toLowerCase()))) {
        continue;
      }
      // Si description commence par "Sélectionnez" et label contient déjà la question, supprimer
      if (value && value.toLowerCase().startsWith('sélectionnez') && label) {
        continue;
      }
    }
    
    // Nettoyer les options
    if (key === 'options' && Array.isArray(value)) {
      cleaned[key] = value.map(option => {
        const cleanedOption = { ...option };
        // Supprimer description si identique au label
        if (cleanedOption.description && cleanedOption.label) {
          if (cleanedOption.description.toLowerCase().trim() === 
              cleanedOption.label.toLowerCase().trim()) {
            delete cleanedOption.description;
          }
        }
        // Supprimer les propriétés non utilisées
        OPTION_PROPERTIES_TO_REMOVE.forEach(prop => {
          if (cleanedOption[prop] && cleanedOption.label) {
            if (cleanedOption[prop].toLowerCase().trim() === 
                cleanedOption.label.toLowerCase().trim()) {
              delete cleanedOption[prop];
            }
          }
        });
        return cleanedOption;
      });
      continue;
    }
    
    // Nettoyer récursivement
    cleaned[key] = cleanObject(value, depth + 1);
  }
  
  return cleaned;
}

/**
 * Nettoie un fichier JSON
 */
function cleanJsonFile(filePath) {
  try {
    console.log(`Nettoyage de ${filePath}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const cleaned = cleanObject(data);
    
    // Écrire le fichier nettoyé avec indentation
    fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf8');
    
    const originalSize = content.length;
    const cleanedSize = JSON.stringify(cleaned, null, 2).length;
    const reduction = ((1 - cleanedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ Réduit de ${originalSize} à ${cleanedSize} octets (${reduction}%)`);
    
    return { originalSize, cleanedSize, reduction: parseFloat(reduction) };
  } catch (error) {
    console.error(`  ✗ Erreur lors du nettoyage de ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Fonction principale
 */
function main() {
  const col1Dir = path.join(__dirname, '../src/data/evaluations/columns/col1');
  const col2Dir = path.join(__dirname, '../src/data/evaluations/columns/col2_constats');
  
  const files = [
    ...fs.readdirSync(col1Dir).filter(f => f.endsWith('.json')).map(f => path.join(col1Dir, f)),
    ...fs.readdirSync(col2Dir).filter(f => f.endsWith('.json')).map(f => path.join(col2Dir, f))
  ];
  
  console.log(`Nettoyage de ${files.length} fichiers JSON...\n`);
  
  let totalOriginal = 0;
  let totalCleaned = 0;
  
  files.forEach(filePath => {
    const result = cleanJsonFile(filePath);
    if (result) {
      totalOriginal += result.originalSize;
      totalCleaned += result.cleanedSize;
    }
  });
  
  const totalReduction = ((1 - totalCleaned / totalOriginal) * 100).toFixed(1);
  
  console.log(`\n✓ Nettoyage terminé !`);
  console.log(`  Total: ${totalOriginal} → ${totalCleaned} octets (réduction de ${totalReduction}%)`);
}

if (require.main === module) {
  main();
}

module.exports = { cleanJsonFile, cleanObject };

