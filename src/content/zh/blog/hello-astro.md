---
title: 用 Astro 5 搭建这个博客
description: 从零开始，用 Astro 5 + Tailwind CSS v4 搭建一个极速、SEO 友好的博客。
pubDate: 2026-08-27
tags: [astro, 博客, 教程]
category: study
---

之前断断续续用过 Jekyll、Hugo、Hexo、Notion + Super，每个都有自己的痛点。这次试 Astro 5，终于找到一个既快又自由的工作流。

## 为什么选 Astro

Astro 默认输出**零 JavaScript** 的纯 HTML，构建产物接近原生静态页面，Lighthouse 几乎满分。
对于以内容为主的博客，这正是最合适的形态——快、稳、SEO 友好。

## 技术栈

- 框架：Astro 5
- 样式：Tailwind CSS v4（通过 `@tailwindcss/vite` 接入）
- 内容：Content Collections（文章 + 笔记）
- 部署：Vercel

## 文章与笔记

本站区分两种内容：

1. **文章**：完整的技术或运营文章，有目录、有标签、有描述
2. **笔记**：短小速记，布局更简洁

两者共享同一套渲染管线，但用独立的 Content Collection 管理。

## 分类与标签

每篇 md 都带一个 `category` 字段（work / study / life），用于按主题划分。`tags` 字段保留作为交叉引用。这样读者可以按主题找「做」或「学」两种角度。