// src/components/LitematicViewer.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function LitematicViewer({ litematicUrl, autoRotate = true }) {
  const mountRef = useRef(null);
  const [status, setStatus] = useState('加载模型中...');

  useEffect(() => {
    if (!mountRef.current) return;
    let scene, camera, renderer, structure, viewerRenderer, animationId;

    const init = async () => {
      try {
        // 动态导入库，优化首屏加载
        const { LitematicLoader, ThreeStructureRenderer, loadDefaultPackResources } = await import('@mattzh72/lodestone');
        const { mat4 } = await import('gl-matrix'); // 部分版本可能需要显式导入

        // 1. 设置Three.js基础环境
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setClearColor(0x111122); // 设置一个柔和的深色背景
        mountRef.current.appendChild(renderer.domElement);
        camera.position.set(10, 15, 20);
        camera.lookAt(0, 0, 0);

        // 2. 加载资源包（纹理等）和 .litematic 文件
        setStatus('加载资源...');
        const { resources } = await loadDefaultPackResources();
        
        setStatus('解析模型文件...');
        const response = await fetch(litematicUrl);
        const buffer = await response.arrayBuffer();
        const structure = LitematicLoader.load(new Uint8Array(buffer));
        
        // 可选：获取文件元数据
        const metadata = LitematicLoader.getMetadata(new Uint8Array(buffer));
        console.log(`模型信息: ${metadata.name} by ${metadata.author}, 共 ${metadata.totalBlocks} 个方块`);

        // 3. 渲染结构
        setStatus('生成世界中...');
        viewerRenderer = new ThreeStructureRenderer(renderer.domElement, structure, resources);
        
        // 4. 设置渲染循环
        let time = 0;
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          time += 0.01;
          
          // 简单的自动旋转效果
          if (autoRotate) {
            const radius = 20;
            const angle = time * 0.5;
            camera.position.x = Math.sin(angle) * radius;
            camera.position.z = Math.cos(angle) * radius;
            camera.lookAt(0, 0, 0);
          }
          
          // 更新渲染器视图
          if (viewerRenderer) {
            const view = mat4.create();
            mat4.translate(view, view, [0, 0, -15]);
            viewerRenderer.drawStructure(view);
          }
          renderer.render(scene, camera);
        };
        animate();
        setStatus(''); // 清空状态信息

      } catch (error) {
        console.error('模型加载失败:', error);
        setStatus(`加载失败: ${error.message}`);
      }
    };

    init();

    // 清理函数：组件卸载时释放资源
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (viewerRenderer) viewerRenderer.dispose?.(); // 假设有dispose方法
      if (renderer) {
        renderer.dispose();
        mountRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [litematicUrl, autoRotate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#111122', borderRadius: '8px' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {status && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 16px',
          borderRadius: '4px',
          zIndex: 10
        }}>
          {status}
        </div>
      )}
    </div>
  );
}