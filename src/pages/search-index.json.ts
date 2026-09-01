import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';

// 中文版搜索索引：返回 /search-index.json
export const GET: APIRoute = async () => {
  const blog = await getCollection('blog-zh', ({ data }) => !data.draft);
  const notes = await getCollection('notes-zh', ({ data }) => !data.draft);

  const readBody = async (filePath: string) => {
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      return raw.replace(/^---[\s\S]*?---\n/, '').slice(0, 2000);
    } catch {
      return '';
    }
  };

  const items = await Promise.all([
    ...blog.map(async (post) => ({
      kind: 'blog' as const,
      title: post.data.title,
      description: post.data.description ?? '',
      tags: post.data.tags,
      url: `/blog/${post.id}/`,
      body: await readBody(path.join('./src/content/zh/blog', `${post.id}.md`)),
    })),
    ...notes.map(async (note) => ({
      kind: 'notes' as const,
      title: note.data.title,
      description: note.data.description ?? '',
      tags: note.data.tags,
      url: `/notes/${note.id}/`,
      body: await readBody(path.join('./src/content/zh/notes', `${note.id}.md`)),
    })),
  ]);

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
};