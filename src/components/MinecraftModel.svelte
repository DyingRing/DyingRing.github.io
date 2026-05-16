<script>
  console.log('MinecraftModel script loaded');
  import { onMount } from 'svelte';
  import { ThreeStructureRenderer, LitematicLoader, loadDefaultPackResources } from '@mattzh72/lodestone';
  import { mat4 } from 'gl-matrix';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  export let filePath = '/my_build.litematic'; // 接收 .litematic 文件路径
  let canvas;

  onMount(async () => {
    console.log('MinecraftModel mounted'); 
    try {
      // 加载默认资源包 + 建筑文件
      const [{ resources }, response] = await Promise.all([
        loadDefaultPackResources(),
        fetch(filePath)
      ]);
      const buffer = await response.arrayBuffer();
      const structure = LitematicLoader.load(new Uint8Array(buffer));

      // 初始化 Three.js
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);
      const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.set(10, 8, 10);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      // 使用 Lodestone 渲染结构
      const structureRenderer = new ThreeStructureRenderer(canvas, structure, resources);
      scene.add(structureRenderer.group);
      const view = mat4.create();
      mat4.lookAt(view, [10, 8, 10], [0, 0, 0], [0, 1, 0]);
      structureRenderer.drawStructure(view);

      // 轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.update();

      // 动画循环
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      });
    } catch (error) {
      console.error('Minecraft model init error:', error);
    }
  });
</script>

<div class="model-wrapper">
  <canvas bind:this={canvas}></canvas>
  <p class="caption">拖拽旋转视角，滚动滚轮缩放</p>
</div>

<style>
  .model-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  canvas {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
  }
  .caption {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }
</style>