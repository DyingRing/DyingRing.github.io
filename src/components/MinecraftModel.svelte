<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas;

  onMount(() => {
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xff0000); // 红色背景
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer.render(scene, camera);
  });
</script>

<div>
  <canvas bind:this={canvas} style="width: 600px; height: 400px;"></canvas>
</div>