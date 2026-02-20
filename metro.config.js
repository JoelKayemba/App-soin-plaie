const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support des modèles 3D GLB/GLTF pour le viewer corps (remplacement body_front)
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
