// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { buildLastmodIndex, lastmodFor } from './scripts/sitemap-lastmod.mjs';
import { checkAllSiblings } from './scripts/check-siblings.mjs';

// Prefer SITE_URL from env (e.g. Cloudflare Pages production env) so staging
// previews don't leak into canonical URLs. Falls back to the pages.dev domain
// until a custom domain is attached.
export const SITE_URL = process.env.SITE_URL || 'https://yimrocktour.pages.dev';

// Scan MDX frontmatter once per build so sitemap can emit real lastmod dates.
const lastmodIndex = await buildLastmodIndex();
const buildStart = new Date();

// Opt-in build-time check that every post/tour has siblings in both locales
// (or an explicit `onlyLocale` opt-out). Set CHECK_SIBLINGS=1 to enforce;
// once content has been clean for a while, flip this to default-on.
if (process.env.CHECK_SIBLINGS === '1') {
  const errors = await checkAllSiblings();
  if (errors.length) {
    for (const err of errors) console.error(err);
    throw new Error(`Found ${errors.length} missing locale sibling(s). Fix them or add onlyLocale.`);
  }
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false, // zh at /, en at /en
    },
  },
  integrations: [
    mdx(),
    icon(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
        },
      },
      serialize(item) {
        const dated = lastmodFor(lastmodIndex, item.url);
        item.lastmod = (dated ?? buildStart).toISOString();
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
