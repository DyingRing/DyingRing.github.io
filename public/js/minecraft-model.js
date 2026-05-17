// public/js/minecraft-model.js
(async () => {
  console.log('[MinecraftModel] Script started');

  // 1. 动态注入 import map（必须在所有 import() 之前）
  const importMap = {
    imports: {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/examples/jsm/controls/OrbitControls.js": "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js",
      "gl-matrix": "https://unpkg.com/gl-matrix@3.4.3/esm/index.js",
      "@mattzh72/lodestone": "https://unpkg.com/@mattzh72/lodestone@latest/dist/lodestone.es.js"
    }
  };
  const importMapScript = document.createElement('script');
  importMapScript.type = 'importmap';
  importMapScript.textContent = JSON.stringify(importMap);
  document.head.appendChild(importMapScript);

  // 给浏览器一瞬时间消化 import map（通常不需要，但为了稳妥可加一个微任务）
  await new Promise(resolve => setTimeout(resolve, 0));

  try {
    console.log('[MinecraftModel] Importing modules...');
    const THREE = await import('three');
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
    const { ThreeStructureRenderer, LitematicLoader, loadDefaultPackResources } = await import('@mattzh72/lodestone');
    const { mat4 } = await import('gl-matrix');
    console.log('[MinecraftModel] Modules imported');

    const canvas = document.getElementById('mc-canvas');
    if (!canvas) throw new Error('Canvas not found');
    console.log('[MinecraftModel] Canvas found');

    console.log('[MinecraftModel] Loading resources...');
    const [{ resources }, response] = await Promise.all([
      loadDefaultPackResources(),
      fetch('/my_build.litematic')   // 确认你的建筑文件名是否正确
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
    console.log('[MinecraftModel] Structure drawn');

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