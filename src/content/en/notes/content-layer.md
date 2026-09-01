---
title: "Astro Content Layer API — Quick Notes"
description: "Quick notes on Astro 5 content layer API"
pubDate: 2026-08-27
tags: [astro]
category: study
---

Astro 5's Content Collections use the **glob loader** to load Markdown/MDX:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ title: z.string() }),
});
```

For rendering, use `render()` instead of `entry.render()`:

```ts
const { Content, headings } = await render(entry);
```

`headings` plugs straight into the floating TOC component.