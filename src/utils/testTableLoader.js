/**
 * Script de test pour vérifier le chargement des tables
 */
import { tableDataLoader } from '@/services';

export const testTableLoader = async () => {
  //console.log(' Test du TableDataLoader...');
  
  try {
    // Test de chargement de la première table
    //console.log(' Chargement de C1T01...');
    const tableData = await tableDataLoader.loadTableData('C1T01');
    
    //console.log('Table chargée avec succès:');
    //console.log('- ID:', tableData.id);
    //console.log('- Titre:', tableData.title);
    //console.log('- Description:', tableData.description);
    //console.log('- Nombre d\'éléments:', tableData.elements?.length || 0);
    
    // Test des statistiques du cache
    const stats = tableDataLoader.getCacheStats();
    //console.log('Statistiques du cache:', stats);
    
    return { success: true, data: tableData };
  } catch (error) {
    //console.error(' Erreur lors du test:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour tester depuis la console
window.testTableLoader = testTableLoader;


