import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../consts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog-en', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${SITE.title} (English)`,
    description: `${SITE.description} (English edition)`,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/en/blog/${post.id}/`,
    })),
  });
}