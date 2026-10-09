# Plan: SEO hardening + new-post publishing flow

## Context

The baseline SEO (`SEO.astro`, `sitemap`, JSON-LD helpers in
`src/lib/jsonld.ts`, hreflang via `switchLocalePath`) works for the
pages that exist today. Gaps surface when we start publishing posts at
a regular cadence:

- A post published in zh with no en sibling emits an hreflang link that
  404s — Google treats this as a soft error.
- `heroImage` is optional on posts, so new posts without one share as
  the generic `/og-default.svg` on WeChat / Twitter / LinkedIn.
- `BlogPosting` JSON-LD lists the human `author` as an Organization and
  has no `dateModified`, so content updates don't propagate.
- There is no RSS/Atom feed, so new posts aren't discoverable by
  readers / aggregators / Baidu push.
- Sitemap has no `lastmod`, so search engines re-crawl on their own
  schedule rather than when we actually ship.
- `SITE_URL` still points at `pages.dev`; canonical / og:url / sitemap
  all leak the staging domain until we flip it.
- No "related posts" or tag pages → each post is a terminal node with no
  internal linking back into the content graph.

## Goals

1. **Zero-404 hreflang** — when a locale sibling is missing, don't emit
   a dead link; emit the available locale only.
2. **Every new post ships with a share image** — either its own
   `heroImage` or a locale-aware default that doesn't look generic.
3. **Richer BlogPosting signals** — `Person` author, `dateModified`,
   breadcrumbs.
4. **Feeds** — one RSS feed per locale (`/rss.xml`, `/en/rss.xml`),
   linked from `<head>` and `robots.txt`.
5. **Fresh sitemap** — include `lastmod` from `publishDate` / file
   mtime so re-crawls track reality.
6. **Author workflow** — a one-page checklist + a `scripts/new-post.mjs`
   scaffold that creates both locale files from a template.
7. **Verification** — a build-time check that fails loudly when a zh
   post has no en sibling (or vice-versa), so hreflang stays honest.

## Non-goals

- No CMS. Content stays in MDX under `src/content/posts/{zh,en}/`.
- No AMP, no server-side rendering, no analytics-driven SEO tools.
- No automatic translation — human-written zh+en pairs only.

## Proposed changes

### 1. Hreflang that respects missing siblings

Today `src/components/SEO.astro` maps over every locale and emits a
link. Change it to accept an optional `availableLocales: Locale[]` prop
from the caller. `PostLayout` / `TourLayout` pass only the locales for
which the slug exists.

```astro
<SEO ... availableLocales={availableLocales} />
```

`src/lib/content.ts` grows a helper:

```ts
export async function postSiblingLocales(slug: string): Promise<Locale[]>
```

It `getCollection('posts')`s both locales once (cached per build) and
returns the subset that has this slug. Same shape for tours.

**Fallback:** when `availableLocales` is omitted, keep current behavior
(emit all locales) so non-post pages don't regress.

### 2. Per-locale OG default + per-post override contract

- Add `public/og-default-zh.svg` and `public/og-default-en.svg`
  (reuse existing SVG, swap the tagline). Pick by locale in `SEO.astro`.
- Keep `heroImage` optional in the posts schema, but make `PostLayout`
  pick, in order: explicit `heroImage` → first `gallery` image → locale
  default. All three resolve through `astro:assets` so sizes work.
- Update `README.md` + `docs/plans/01-yimrocktour-mvp.md` to call out
  the fallback order so future authors stop guessing.

### 3. Richer BlogPosting JSON-LD

Edit `src/lib/jsonld.ts`:

- When `author` is set, emit `{ '@type': 'Person', name: author }`.
  Fall back to Organization only when `author` is absent.
- Add `dateModified` — plumb through `PostLayout` from frontmatter
  (`updatedDate?: Date` added to schema; falls back to `publishDate`).
- Add `mainEntityOfPage` pointing at `pageUrl` (Google recommends it).

Add a new helper `breadcrumbJsonLd({ siteUrl, trail: [{name, url}] })`
and emit it alongside `BlogPosting` on post pages
(`Home → Journal → <post title>`).

### 4. RSS feeds

Install `@astrojs/rss`. Add:

- `src/pages/rss.xml.ts` — zh posts
- `src/pages/en/rss.xml.ts` — en posts

Each filters drafts, sorts by `publishDate` desc, caps at 50 items.
`BaseLayout` emits `<link rel="alternate" type="application/rss+xml">`
pointing at the current locale's feed. `robots.txt` learns about them.

### 5. Sitemap `lastmod` + exclude drafts

`@astrojs/sitemap` accepts a `serialize` function. Use it to:

- Drop URLs that correspond to `draft: true` content (currently they're
  not rendered, so they shouldn't appear — verify and gate as needed).
- Attach `lastmod` from `updatedDate ?? publishDate` for posts/tours,
  and `new Date()` (build time) for static pages.

### 6. `SITE_URL` handoff

Keep the constant in `astro.config.mjs` but read from
`process.env.SITE_URL` with the current value as fallback. Document it
in `README.md` so staging deploys (branch previews) don't leak into the
production canonical.

### 7. New-post authoring UX

Add `scripts/new-post.mjs` (plain Node, no deps). Usage:

```bash
npm run post:new -- --slug 2026-autumn-liming --title-zh "黎明秋攀" --title-en "Autumn in Liming"
```

It:

1. Reads `src/content/posts/_template.mdx` (new) once per locale.
2. Writes `src/content/posts/zh/<slug>.mdx` and
   `src/content/posts/en/<slug>.mdx` with frontmatter prefilled
   (`publishDate: today`, `draft: true`).
3. Prints the two paths and a reminder: add hero image, set `draft:
   false`, run `npm run build`.

Also add a short section to `README.md` → "Publishing a blog post"
listing the SEO-relevant frontmatter and the checklist.

### 8. Build-time hreflang sanity check

New file `src/lib/content.checks.ts`. Called from a top-level
`src/pages/_check.astro` (or an Astro integration hook if simpler)
during `getStaticPaths` collection. Logic:

- For every slug in `posts/zh`, assert a matching `posts/en/<slug>` or
  explicit `onlyLocale: 'zh'` frontmatter flag.
- Same for tours.
- Mismatches throw at build time with a clear message pointing at the
  missing file.

Opt-out via `onlyLocale` is deliberate — some posts are intentionally
single-locale, and we want that to be an explicit decision, not a
missing file.

## Phased rollout

Ship in order; each phase is independently useful.

| Phase | What                                       | Risk  |
|-------|--------------------------------------------|-------|
| P1    | Hreflang fix + per-locale OG default       | low   |
| P2    | JSON-LD upgrades + sitemap lastmod         | low   |
| P3    | RSS feeds + feed links in `<head>`         | low   |
| P4    | `SITE_URL` env + README updates            | low   |
| P5    | `scripts/new-post.mjs` + authoring doc     | low   |
| P6    | Build-time sibling check (`onlyLocale`)    | med   |

P6 is medium-risk because it can block builds. Ship behind
`CHECK_SIBLINGS=1` env flag first, make it default-on after a week of
clean builds.

## What a new post looks like after this plan

```bash
npm run post:new -- --slug 2026-autumn-liming \
  --title-zh "黎明秋攀" --title-en "Autumn in Liming"
# edits two MDX files, drops hero image into src/content/posts/{zh,en}/
# sets draft: false
npm run build   # fails loudly if en sibling is missing
```

On build the post gets:

- Canonical + hreflang pair pointing at real URLs only
- `BlogPosting` JSON-LD with `Person` author, `dateModified`,
  breadcrumbs
- A locale-specific OG image (or its own hero)
- An entry in `sitemap-index.xml` with correct `lastmod`
- An item in `/rss.xml` or `/en/rss.xml`

## Open questions

- Do we want tag archive pages (`/tags/<slug>`) now, or defer until the
  tag list is longer than ~10 unique tags? Current cost: low; current
  value: low. **Default: defer**.
- Pre-rendered OG images per post (via `satori` / `og-image.vercel.app`
  style)? Nice but new infra. **Default: defer** — the locale-aware
  SVGs plus explicit `heroImage` are enough until we have >20 posts.
- Should we add Baidu-specific tags (`<meta name="baidu-site-verification">`,
  `baidu-ssp`)? Only after we attach the real domain and verify in
  站长工具. **Default: defer to deploy-time task**.
