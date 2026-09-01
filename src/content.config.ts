import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 顶层分类：工作 / 学习 / 生活
const categoryEnum = z.enum(['work', 'study', 'life']).default('work');

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  category: categoryEnum,
  draft: z.boolean().default(false),
});

const notesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  category: categoryEnum,
  draft: z.boolean().default(false),
});

export const collections = {
  // 中文
  'blog-zh': defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/zh/blog' }),
    schema: blogSchema,
  }),
  'notes-zh': defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/zh/notes' }),
    schema: notesSchema,
  }),
  // English
  'blog-en': defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/en/blog' }),
    schema: blogSchema,
  }),
  'notes-en': defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/en/notes' }),
    schema: notesSchema,
  }),
};