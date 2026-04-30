---
title: 从0搭建Astro博客
date: 2026-04-25
description: 从0搭建Astro博客，并部署至Github Pages(以shokaX主题为例)
categories: [编程]
tags: [Astro,shokaX]
draft: false
---
# 前期准备

## **Node.js**
打开[nodejs官网](https://nodejs.cn/download/)，选择自己的平台对应的安装包即可，安装成功后请在命令行输入以下命令检验安装是否成功。
```
node -v
```
```
npm -v
```
## **Git**
打开[git官网](https://git-scm.com/install/)，选择自己的平台对应的安装包即可，安装成功后右键有git bash选项即可（windows11要点击**显示更多选项**）。
## **Bun**
运行以下命令
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```
在终端运行 `bun --version `命令即可查看 Bun 是否安装成功。
如果没有需手动将`C:\Users\<users>\.bun\bin`添加到系统环境变量。
# 安装**ShokaX Astro**

打开powershell并切换到你准备放置这个 Blog 的地方，如：`D:\Blog`
运行以下命令克隆仓库到本地。
```powershell
git clone https://github.com/theme-shoka-x/astro-blog-shokax.git
```
如果连不上GitHub，可使用科学上网或镜像仓库，如：
```powershell
git clone https://hk.gh-proxy.org/https://github.com/theme-shoka-x/astro-blog-shokax.git

git clone https://cdn.gh-proxy.org/https://github.com/theme-shoka-x/astro-blog-shokax.git

git clone https://edgeone.gh-proxy.org/https://github.com/theme-shoka-x/astro-blog-shokax.git
```
进入astro-blog-shokax目录
```powershell
cd ./astro-blog-shokax
```
运行`bun install`安装
安装完毕后运行`bun run dev`开发服务器会自动启动，你可以访问提示的网址（通常为http://localhost:4321）来浏览你的网站。
# 配置网站

详见[网站配置](https://docs.astro.kaitaku.xyz/guides/)
# 部署到**GitHub Pages**

## 创建工作流
进入`astro-blog-shokax\.github\workflows`目录
创建deploy.yml文件，并将下面的 YAML 粘贴进去。
```YAML
name: Deploy to GitHub Pages

on:
  # 每次推送到 `main` 分支时触发这个“工作流程”
  # 如果你使用了别的分支名，请按需将 `main` 替换成你的分支名
  push:
    branches: [ main ]
  # 允许你在 GitHub 上的 Actions 标签中手动触发此“工作流程”
  workflow_dispatch:

# 允许 job 克隆 repo 并创建一个 page deployment
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v5
      - name: Install, build, and upload your site
        uses: withastro/action@v5
        # with:
          # path: . # 存储库中 Astro 项目的根位置。（可选）
          # node-version: 20 # 用于构建站点的特定 Node.js 版本，默认为 20。（可选）
          # package-manager: pnpm@latest # 应使用哪个 Node.js 包管理器来安装依赖项和构建站点。会根据存储库中的 lockfile 自动检测。（可选）
          # build-cmd: pnpm run build # 用于构建你的网站的命令。默认运行软件包的构建脚本或任务。（可选）
        # env:
          # PUBLIC_POKEAPI: 'https://pokeapi.co/api/v2' # 对变量值使用单引号。（可选）

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
可以通过可选的输入来配置 Astro action。要使用这些输入，请取消注释 `with:` 这一行以及你想要使用的输入。
回到`astro-blog-shokax`目录并打开astro.config.mjs文件。
在 defineConfig函数中添加一行`site: 'https://<username>.github.io'，`如下
```javascript
import { defineConfig } from 'astro/config'

export default defineConfig({
    site: 'https://<username>.github.io',
})
```
## 创建并设置**GitHub**仓库
打开GitHub，新建仓库，仓库名称栏填`<username>.github.io`,其他选项可以忽略。点击`创建`创建仓库。打开仓库，进入Settings，进入Pages，将Build and deployment下的Source设置为GitHub Actions。
## 推送到**GitHub**仓库
打开powershell并进入`astro-blog-shokax`目录
运行`git add .`添加所有文件到暂缓区，依此运行以下命令。
```powershell
git commit -m "Initial commit"
```
```powershell
git remote add origin https://github.com/<username>/<username>.github.io.git
```
```powershell
git push -u origin main
```
如果推送失败，请尝试科学上网。
# 查看成果

等GitHub构建完后，进入`https://<username>.github.io`查看成果。


