import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByLocale, entrySlug } from '../../lib/content';
import { localizePath, t } from '../../i18n';

export async function GET(context: APIContext) {
  const posts = await getPostsByLocale('en');
  const site = context.site ?? new URL('https://yimrocktour.pages.dev');

  return rss({
    title: t('en', 'site.nameFull'),
    description: t('en', 'site.description'),
    site: site.toString(),
    items: posts.slice(0, 50).map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishDate,
      link: localizePath('en', `/blog/${entrySlug(post)}`),
    })),
    customData: '<language>en</language>',
  });
}
