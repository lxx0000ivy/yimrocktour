// Build-time check: every slug in a locale should have a matching sibling in
// the other locale, so hreflang doesn't emit dead links. Opt out per-entry by
// setting `onlyLocale: zh` or `onlyLocale: en` in frontmatter.
//
// Gated behind the CHECK_SIBLINGS env flag initially so a broken sibling
// doesn't block emergency rebuilds. Flip to default-on once the content is
// known-clean.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const COLLECTIONS = ['posts', 'tours'];

async function listMdx(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listMdx(full)));
    else if (entry.isFile() && entry.name.endsWith('.mdx') && !entry.name.startsWith('_')) {
      out.push(full);
    }
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

/**
 * Returns a list of error messages. Empty array means clean.
 */
export async function checkAllSiblings() {
  const errors = [];
  for (const collection of COLLECTIONS) {
    const base = path.join(ROOT, 'src', 'content', collection);
    const files = await listMdx(base);

    const bySlug = new Map(); // slug -> { zh?: {draft, onlyLocale}, en?: ... }
    for (const file of files) {
      const rel = path.relative(base, file);
      const parts = rel.split(path.sep);
      const locale = parts[0];
      if (locale !== 'zh' && locale !== 'en') continue;
      const slug = parts.slice(1).join('/').replace(/\.mdx$/, '');
      const fm = parseFrontmatter(await readFile(file, 'utf8'));
      if (fm.draft === 'true') continue;

      const existing = bySlug.get(slug) ?? {};
      existing[locale] = { onlyLocale: fm.onlyLocale };
      bySlug.set(slug, existing);
    }

    for (const [slug, pair] of bySlug) {
      const missing = ['zh', 'en'].find((l) => !pair[l]);
      if (!missing) continue;
      const present = missing === 'zh' ? 'en' : 'zh';
      const presentData = pair[present];
      if (presentData?.onlyLocale === present) continue;

      errors.push(
        `[check-siblings] ${collection}/${slug}: present in "${present}" but missing in "${missing}". ` +
          `Create src/content/${collection}/${missing}/${slug}.mdx, or add \`onlyLocale: ${present}\` to the ${present} frontmatter.`
      );
    }
  }
  return errors;
}
