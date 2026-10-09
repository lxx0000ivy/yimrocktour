import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByLocale, entrySlug } from '../lib/content';
import { localizePath, t } from '../i18n';

export async function GET(context: APIContext) {
  const posts = await getPostsByLocale('zh');
  const site = context.site ?? new URL('https://yimrocktour.pages.dev');

  return rss({
    title: t('zh', 'site.nameFull'),
    description: t('zh', 'site.description'),
    site: site.toString(),
    items: posts.slice(0, 50).map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishDate,
      link: localizePath('zh', `/blog/${entrySlug(post)}`),
    })),
    customData: '<language>zh-CN</language>',
  });
}
