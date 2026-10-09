#!/usr/bin/env node
// Scaffold a new blog post pair (zh + en) under src/content/posts/.
// Usage:
//   npm run post:new -- --slug 2026-autumn-liming \
//       --title-zh "黎明秋攀" --title-en "Autumn in Liming"
//
// Optional flags:
//   --summary-zh "一句话中文摘要"     (defaults to a TODO stub)
//   --summary-en "One-line summary"   (defaults to a TODO stub)
//   --author     "云攀向导团"         (goes into both files)
//   --date       2026-10-15           (defaults to today, UTC)
//   --force                           (overwrite existing files)

import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src', 'content', 'posts');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const slug = args.slug;
const titleZh = args['title-zh'];
const titleEn = args['title-en'];

if (!slug || !titleZh || !titleEn) {
  console.error('Usage: npm run post:new -- --slug <slug> --title-zh "..." --title-en "..."');
  console.error('Optional: --summary-zh, --summary-en, --author, --date, --force');
  process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`Invalid slug "${slug}" — use lowercase letters, digits, hyphens.`);
  process.exit(1);
}

const today = args.date || new Date().toISOString().slice(0, 10);
const summaryZh = args['summary-zh'] || 'TODO: 一句话中文摘要 (becomes <meta description> and og:description)';
const summaryEn = args['summary-en'] || 'TODO: one-line English summary (becomes <meta description> and og:description)';
const author = args.author || '';

function render(locale) {
  const title = locale === 'zh' ? titleZh : titleEn;
  const summary = locale === 'zh' ? summaryZh : summaryEn;
  const bodyPlaceholder = locale === 'zh'
    ? '# ' + title + '\n\n正文从这里开始。记得在发布前把 `draft: false`。\n'
    : '# ' + title + '\n\nStart writing here. Flip `draft: false` before publishing.\n';
  const lines = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `summary: ${JSON.stringify(summary)}`,
    `publishDate: ${today}`,
    author ? `author: ${JSON.stringify(author)}` : null,
    'tags: []',
    'draft: true',
    '# heroImage: ./' + slug + '.jpg   # drop a cover image next to this file',
    '# updatedDate: 2026-11-01          # set when content changes materially',
    '---',
    '',
    bodyPlaceholder,
  ].filter((line) => line !== null);
  return lines.join('\n');
}

async function exists(p) {
  try {
    await access(p, FS.F_OK);
    return true;
  } catch {
    return false;
  }
}

const results = [];
for (const locale of ['zh', 'en']) {
  const dir = path.join(POSTS_DIR, locale);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${slug}.mdx`);
  if (await exists(file) && !args.force) {
    console.error(`Refusing to overwrite ${path.relative(ROOT, file)} — pass --force to override.`);
    process.exit(1);
  }
  await writeFile(file, render(locale), 'utf8');
  results.push(path.relative(ROOT, file));
}

console.log('Scaffolded:');
for (const r of results) console.log('  ' + r);
console.log('\nNext:');
console.log('  1. Edit both files; keep zh/en in sync.');
console.log('  2. Drop a hero image next to the MDX and uncomment heroImage.');
console.log('  3. Set draft: false when ready, run `npm run build`.');
