// RSS feed of the articles, at /writing/feed.xml
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../../site.config';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing', (p) => !p.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${site.name}: writing`,
    description: 'Essays on building brands, retail and how people in Bangladesh shop.',
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
