import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ThreeStructureRenderer, LitematicLoader, loadDefaultPackResources } from '@mattzh72/lodestone';
import { mat4 } from 'gl-matrix';

(async () => {
  console.log('[MinecraftModel] Script started');
  try {
    const canvas = document.getElementById('mc-canvas');
    if (!canvas) throw new Error('Canvas not found');
    console.log('[MinecraftModel] Canvas found');

    const [{ resources }, response] = await Promise.all([
      loadDefaultPackResources(),
      fetch('/my_build.litematic')
    ]);
    console.log('[MinecraftModel] Resources fetched, status:', response.status);

    const buffer = await response.arrayBuffer();
    console.log('[MinecraftModel] File loaded, size:', buffer.byteLength, 'bytes');
    const structure = LitematicLoader.load(new Uint8Array(buffer));
    console.log('[MinecraftModel] Structure parsed');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(10, 8, 10);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const structureRenderer = new ThreeStructureRenderer(canvas, structure, resources);
    scene.add(structureRenderer.group);
    const view = mat4.create();
    mat4.lookAt(view, [10, 8, 10], [0, 0, 0], [0, 1, 0]);
    structureRenderer.drawStructure(view);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.update();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    console.log('[MinecraftModel] Animation started');
  } catch (err) {
    console.error('[MinecraftModel] Fatal error:', err);
  }
})();







