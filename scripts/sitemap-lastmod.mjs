// Build a URL -> lastmod map by scanning MDX frontmatter under
// src/content/{posts,tours}/{zh,en}/. Used by astro.config.mjs to feed
// `lastmod` into @astrojs/sitemap's serialize hook. No deps.
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const COLLECTIONS = [
  { dir: 'src/content/posts', urlPrefix: '/blog' },
  { dir: 'src/content/tours', urlPrefix: '/tours' },
];

async function listMdx(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listMdx(full)));
    else if (entry.isFile() && entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function parseFrontmatter(src) {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, value] = kv;
    value = value.trim().replace(/^['"]|['"]$/g, '');
    out[key] = value;
  }
  return out;
}

function urlFor(prefix, locale, slug) {
  const base = locale === 'zh' ? '' : `/${locale}`;
  return `${base}${prefix}/${slug}`;
}

/**
 * Returns a Map<string, Date> keyed by the URL *path* (e.g. "/blog/foo" or
 * "/en/blog/foo"). Entries are only added for non-draft content.
 */
export async function buildLastmodIndex() {
  const index = new Map();

  for (const { dir, urlPrefix } of COLLECTIONS) {
    const full = path.join(ROOT, dir);
    const files = await listMdx(full);
    for (const file of files) {
      const rel = path.relative(full, file);
      const parts = rel.split(path.sep);
      const locale = parts[0];
      if (locale !== 'zh' && locale !== 'en') continue;
      const slug = parts.slice(1).join('/').replace(/\.mdx$/, '');

      const text = await readFile(file, 'utf8');
      const fm = parseFrontmatter(text);
      if (fm.draft === 'true') continue;

      const dateStr = fm.updatedDate || fm.publishDate;
      let date;
      if (dateStr) {
        const parsed = new Date(dateStr);
        if (!Number.isNaN(parsed.valueOf())) date = parsed;
      }
      if (!date) {
        const st = await stat(file);
        date = st.mtime;
      }
      index.set(urlFor(urlPrefix, locale, slug), date);
    }
  }

  return index;
}

/**
 * Match a full sitemap URL (origin + path, trailing slash maybe) against the
 * index and return the matching Date, or undefined.
 */
export function lastmodFor(index, fullUrl) {
  try {
    const u = new URL(fullUrl);
    const pathname = u.pathname.replace(/\/$/, '') || '/';
    return index.get(pathname);
  } catch {
    return undefined;
  }
}
