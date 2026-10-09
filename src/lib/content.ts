import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

/**
 * Content lives under `src/content/<collection>/<locale>/<slug>.mdx`.
 * Both `id` (glob loader path) and `filePath` include the locale segment,
 * so we parse whichever is present. `filePath` is guaranteed on Astro 5.
 */
function entryPathParts(entry: { id: string; filePath?: string }): {
  locale: Locale;
  slug: string;
} {
  const source = entry.filePath ?? entry.id;
  // Normalize: strip leading dirs up to the locale segment.
  const match = source.match(/(?:^|\/)(zh|en)\/([^/]+?)(?:\.[^/.]+)?$/);
  if (match) {
    return { locale: match[1] as Locale, slug: match[2]! };
  }
  // Fallback: assume id is `<locale>/<slug>` (with or without extension).
  const parts = source.replace(/\.[^./]+$/, '').split('/');
  const locale = (parts[0] === 'en' ? 'en' : 'zh') as Locale;
  const slug = parts.slice(1).join('/') || parts[0]!;
  return { locale, slug };
}

export function entryLocale(entry: { id: string; filePath?: string }): Locale {
  return entryPathParts(entry).locale;
}

export function entrySlug(entry: { id: string; filePath?: string }): string {
  return entryPathParts(entry).slug;
}

export async function getToursByLocale(locale: Locale) {
  const all = await getCollection('tours', ({ data }) => !data.draft);
  return all
    .filter((entry) => entryLocale(entry) === locale)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getPostsByLocale(locale: Locale) {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all
    .filter((entry) => entryLocale(entry) === locale)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

async function siblingLocales(
  collection: 'posts' | 'tours',
  slug: string
): Promise<Locale[]> {
  const all = await getCollection(collection, ({ data }) => !data.draft);
  const found = new Set<Locale>();
  for (const entry of all) {
    const parts = entryPathParts(entry);
    if (parts.slug === slug) found.add(parts.locale);
  }
  return [...found];
}

export function postSiblingLocales(slug: string): Promise<Locale[]> {
  return siblingLocales('posts', slug);
}

export function tourSiblingLocales(slug: string): Promise<Locale[]> {
  return siblingLocales('tours', slug);
}

export type TourEntry = CollectionEntry<'tours'>;
export type PostEntry = CollectionEntry<'posts'>;
