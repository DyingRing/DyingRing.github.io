---
title: Astro博客添加背景音乐
date: 2026-05-01
description: 给Astro博客添加唱片图标，点击可播放或暂停背景音乐(以shokaX主题为例)
categories: [编程]
tags: [Astro,shokaX]
draft: false
---
# 准备音乐和图像
在`public`目录下放置所要显示的图像`image.png`与要播放的音乐`music.mp3`
# 创建唱片播放器组件
在`src/components`目录下创建`VinylPlayer.astro`文件，在`VinylPlayer.astro`中放入以下代码：
```astro
---
// src/components/VinylPlayer.astro
---

<style>
  .vinyl-player {
    position: fixed;
    bottom: 90px;  /* 调整图像的位置 */
    right: 12px;  /* 调整图像的位置 */
    z-index: 9999;
    width: 60px;  /* 调整图像的大小 */
    height: 60px;  /* 调整图像的大小 */
    cursor: pointer;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    transition: transform 0.2s ease;
  }
  .vinyl-player:hover {
    transform: scale(1.08);
  }
  .vinyl-icon {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;  /* 可选：让方形图片变成圆形，更像唱片 */
    object-fit: cover;
  }
  .vinyl-icon.playing {
    animation: spin 4s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .vinyl-tooltip {
    position: absolute;
    bottom: 70px;
    right: -4px;
    background: rgba(0,0,0,0.75);
    color: #fff;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .vinyl-player:hover .vinyl-tooltip {
    opacity: 1;
  }
</style>

<div class="vinyl-player" id="vinyl-player">
<!-- 👇 替换成你的真实图像路径 -->
  <img 
    src="/images/image.png" 
    alt="唱片" 
    class="vinyl-icon" 
    id="vinyl-icon"
  />
  <span class="vinyl-tooltip" id="vinyl-tooltip">点击播放</span>
</div>


<script>
  (function() {
    if (document.getElementById('bg-music-audio')) return;

    // 👇 替换成你的真实音乐路径
    const musicSrc = '/music/music.mp3';

    const player = document.getElementById('vinyl-player');
    const icon = document.getElementById('vinyl-icon');
    const tooltip = document.getElementById('vinyl-tooltip');
    if (!player || !icon) return;

    const audio = new Audio(musicSrc);
    audio.id = 'bg-music-audio';
    audio.loop = true;
    audio.autoplay = false;
    try {
      const saved = localStorage.getItem('vinylVolume');
      audio.volume = saved ? parseFloat(saved) : 0.5;
    } catch {
      audio.volume = 0.5;
    }
    document.body.appendChild(audio);

    const toggle = () => {
      if (audio.paused) {
        audio.play().then(() => {
          icon.classList.add('playing');
          tooltip.textContent = '点击暂停';
        }).catch(err => {
          console.warn('播放被阻止，请先与页面交互。', err);
          icon.classList.remove('playing');
          tooltip.textContent = '点击播放';
        });
      } else {
        audio.pause();
        icon.classList.remove('playing');
        tooltip.textContent = '点击播放';
      }
    };

    player.addEventListener('click', toggle);

    audio.addEventListener('play', () => {
      icon.classList.add('playing');
      tooltip.textContent = '点击暂停';
    });
    audio.addEventListener('pause', () => {
      icon.classList.remove('playing');
      tooltip.textContent = '点击播放';
    });
  })();
</script>
```
调整图像至合适位置。
# 在全局布局`Layout.astro`中引入播放器
打开`src/layouts/Layout.astro`，在文件顶部添加导入`import VinylPlayer from '../components/VinylPlayer.astro';`，然后在<body> 结束标签前放置组件：`<VinylPlayer />`<br>
完整如下：
```astro
---
// src/layouts/Layout.astro
import VinylPlayer from '../components/VinylPlayer.astro';
// ... 原有的其他导入
---
<html lang="zh-CN">
  <head>
    <!-- 其他 head 内容 -->
  </head>
  <body>
    <!-- 页面主要内容，例如 <slot /> 或者你主题的特定内容插槽 -->
    <slot />

    <!-- 唱片背景音乐播放器 -->
    <VinylPlayer />
  </body>
</html>
```
运行`bun run dev`来查看效果，若能正常实现，则配置成功。