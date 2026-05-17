// public/js/minecraft-model.js
(async () => {
  console.log('[MinecraftModel] Script started');
  try {
    console.log('[MinecraftModel] Importing modules...');
    // 使用完整 CDN URL 导入，浏览器完全识别
    const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
    const { OrbitControls } = await import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js');
    const { ThreeStructureRenderer, LitematicLoader, loadDefaultPackResources } = await import('https://unpkg.com/@mattzh72/lodestone@latest/dist/lodestone.es.js');
    const { mat4 } = await import('https://unpkg.com/gl-matrix@3.4.3/esm/index.js');
    console.log('[MinecraftModel] Modules imported successfully');

    const canvas = document.getElementById('mc-canvas');
    if (!canvas) throw new Error('Canvas not found');
    console.log('[MinecraftModel] Canvas found');

    console.log('[MinecraftModel] Loading resources...');
    const [{ resources }, response] = await Promise.all([
      loadDefaultPackResources(),
      fetch('/model/吊塔刷铁机.litematic')  // 请确保你的建筑文件名字完全一致
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
    console.log('[MinecraftModel] Renderer created');

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







