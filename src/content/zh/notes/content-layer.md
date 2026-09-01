---
title: 速记：Astro Content Layer API
description: Astro 5 内容层 API 小记
pubDate: 2026-08-27
tags: [astro]
category: study
---

Astro 5 的 Content Collections 使用 **glob loader** 加载 Markdown/MDX：

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ title: z.string() }),
});
```

渲染时用 `render()` 而非 `entry.render()`：

```ts
const { Content, headings } = await render(entry);
```

`headings` 可直接喂给悬浮目录组件。
