import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';

// Chemin relatif pour Metro (l'alias @ peut poser problème pour les assets)
const MODEL_SOURCE = require('../../assets/models/woundModel.glb');

/**
 * Génère la page HTML qui affiche le modèle 3D avec Three.js (chargé depuis le CDN).
 * @param {string} modelUri - URI du fichier GLB (file:// ou http(s)://)
 */
function buildHtml(modelUri) {
  const escaped = (modelUri || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #888; touch-action: none; -webkit-user-select: none; user-select: none; }
    #c { display: block; width: 100%; height: 100%; touch-action: none; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>window.MODEL_URL = "${escaped}";</script>
  <script type="module">
    import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
    import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

    const canvas = document.getElementById('c');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x888888, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.minDistance = 1;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(2, 2, 3);
    scene.add(dir);

    const modelUrl = window.MODEL_URL || '';
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          scene.add(model);
          const box = new THREE.Box3().setFromObject(model);
          const c = box.getCenter(new THREE.Vector3());
          const s = box.getSize(new THREE.Vector3());
          model.position.sub(c);
          const max = Math.max(s.x, s.y, s.z, 0.001);
          model.scale.setScalar(2.2 / max);
        },
        undefined,
        (err) => console.error('GLB load error', err)
      );
    }

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>
</html>
`;
}

/**
 * Viewer 3D du corps (GLB) via WebView.
 * - Si publicModelUrl est fourni (ex. Supabase/Firebase/GitHub raw), on l'utilise → fiable partout.
 * - Sinon on tente le GLB local (file://) avec baseUrl + options Android ; iOS peut bloquer.
 */
export default function BodyModelViewer({
  width = 300,
  height = 400,
  style,
  /** URL publique du .glb (recommandé pour éviter les blocages file:// sur iOS/Android) */
  publicModelUrl = null,
}) {
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (publicModelUrl && typeof publicModelUrl === 'string') {
      setHtml(buildHtml(publicModelUrl.trim()));
      return;
    }

    (async () => {
      try {
        const [asset] = await Asset.loadAsync(MODEL_SOURCE);
        const uri = asset?.localUri ?? asset?.uri;
        if (cancelled) return;
        if (uri) {
          setHtml(buildHtml(uri));
        } else {
          setError('URI du modèle non disponible');
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Erreur chargement du modèle');
      }
    })();
    return () => { cancelled = true; };
  }, [publicModelUrl]);

  if (error) {
    return (
      <View style={[styles.placeholder, { width, height }, style]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!html) {
    return (
      <View style={[styles.placeholder, { width, height }, style]}>
        <Text style={styles.loadingText}>Chargement du modèle 3D…</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ html, baseUrl: 'https://localhost/' }}
      style={[styles.webview, { width, height }, style]}
      scrollEnabled={false}
      originWhitelist={['*', 'file://', 'https://localhost']}
      javaScriptEnabled
      domStorageEnabled
      allowFileAccess={Platform.OS === 'android'}
      allowFileAccessFromFileURLs={Platform.OS === 'android'}
      allowUniversalAccessFromFileURLs={Platform.OS === 'android'}
      mixedContentMode="compatibility"
      setSupportMultipleWindows={false}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    backgroundColor: '#888888',
  },
  placeholder: {
    backgroundColor: '#888888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#333',
    fontSize: 14,
  },
  errorText: {
    padding: 12,
    color: '#c00',
    textAlign: 'center',
  },
});
