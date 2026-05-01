// cannot use path alias here because unocss can not resolve it
import { boolean } from "astro:schema";
import { defineConfig } from "./toolkit/themeConfig";

export default defineConfig({
    siteName: "DyingRing's Blog", // 网站名称（必填）
    locale: "zh-CN", // 网站语言（可选）
    brand: {
        title: "DyingRing's Blog",
        subtitle: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。",
        logo: ""
    },
    nav: [
        {
            text: "首页",
            href: "/",
            icon: "i-ri-home-line",
        },
        {
            text: "关于我",
            href: "/about/",
            icon: "i-ri-user-smile-line",
        },
        {
            text: "文章",
            href: "/posts/",
            icon: "i-ri-quill-pen-fill",
            dropbox: {
                enable: true, // 启用下拉菜单
                items: [ // 子菜单内容
                {
                 href: "/categories/",
                 text: "分类",
                 icon: "i-ri-book-shelf-fill",
                },
                {
                 href: "/tags/",
                 text: "标签",
                 icon: "i-ri-price-tag-3-fill",
                 },
                 {
                  href: "/archives/",
                  text: "归档",
                 icon: "i-ri-archive-line",
                 },
                ],
            },
         },
         {
            text: "友链",
            href: "/friends/",
            icon: "i-ri-user-community-line",
        },
    ],
    sidebar: {
        author: "DyingRing",
        description: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。",
        social: {
            github: {
                url: "https://github.com/DyingRing",
                icon: "i-ri-github-fill",
                color: "#000000",
            },
            bilibili: {
                url: "https://space.bilibili.com/94656201",
                icon: "i-ri-bilibili-fill",
                color: "#00c3ff",
            },
        },
    },
    copyright: {
        license: "CC-BY-NC-SA-4.0", // 许可证类型
        show: true, // 是否显示版权声明
    },
    footer: {
        since: 2026, // 博客起始年份
        icon: {
            name: "sakura rotate", // "sakura" 是樱花图标，"rotate" 是旋转动画
            color: "#ffc0cb", // 粉红色
        },
        icp: {
            enable: false, // 海外部署，不需要备案
        },
        count: false, // 显示统计信息
        powered: false, // 显示技术声明
    },
    widgets: {
        randomPosts: true, // 显示 10 篇随机文章
        recentComments: true, // 显示最近评论
    },
    home: {
        pageSize: 8, // 每页显示 8 篇
        selectedCategories: [
                            { name: "编程",cover: "/images/code.png", },
                            { name: "学习",cover: "/images/study.png", }
                            ],
    },
    friends: {
        title: "友链",
        description: "友链",
        avatar: "https://dyingring.github.io/images/avatar.avif",
        color: "#00c3ff",
        links: [
        {
            url: "https://www.lizs.top",
            title: "test19124's Blog",
            desc: "嘻嘻嘻西~",
            author: "test19124",
            avatar: "https://www.lizs.top/assets/avatar.avif",
            color: "var(--color-pink)",
        },
        {
            url: "https://www.kaitaku.xyz/",
            title: "zkz098's blog",
            desc: "一个萌新的学习笔记",
            author: "zkz098",
            avatar: "https://www.kaitaku.xyz/assets/avatar.avif",
            color: "#00BFFF"
        },       
        ],
    },
});
