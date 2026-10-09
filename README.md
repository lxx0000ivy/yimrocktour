# yimrocktour

Bilingual (zh + en) publicity site for Yim Rock Tour — climbing tours in Yunnan.

**Stack:** Astro 5 · Tailwind v4 · MDX content collections · sitemap + JSON-LD SEO
**Host:** Cloudflare Pages (static output, no adapter)

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # writes ./dist
npm run preview   # serves ./dist locally
```

Node 20+ recommended.

## Editing content

Content is MDX under `src/content/`:

- `src/content/tours/{zh,en}/<slug>.mdx` — tour pages
- `src/content/posts/{zh,en}/<slug>.mdx` — blog / trip reports

To add a tour, copy an existing MDX file, edit the frontmatter and body, and
commit. The URL slug is the filename (`liming-trad.mdx` → `/tours/liming-trad`).

Schemas live in `src/content.config.ts`.

### Courses (`/courses`)

The Kunming climbing-courses page is **not** MDX — it reads structured
data from `src/lib/courses.ts`. To edit a course, change the entry in
`courses.zh` / `courses.en`. To add one, append a new `Course` object
to both arrays. UI strings live in `src/i18n/{zh,en}.json` under
`courses.*`.

### Online video courses

The second module on `/courses` is backed by `videoSeries` in
`src/lib/courses.ts`. To publish a video:

1. Drop the MP4 (or WebM) into `public/videos/` — served at
   `/videos/<filename>`.
2. Set `src` (and optional `poster`) on the episode in `videoSeries`.

Episodes without `src` render a "即将上线 / Coming soon" placeholder,
so a series can go live one clip at a time. See
`public/videos/README.md` and `docs/plans/02-kunming-courses.md` for
details.

## SEO

Every page is prerendered static HTML with:

- `<title>`, `<meta name="description">`, canonical URL
- OpenGraph + Twitter card tags; locale-aware default OG image
  (`/og-default-zh.svg` / `/og-default-en.svg`)
- `<link rel="alternate" hreflang="...">` pairs for zh/en — only emitted
  for locales that actually have a translation (no 404 alternates)
- `<link rel="alternate" type="application/rss+xml">` pointing at the
  current locale's feed
- Page-appropriate JSON-LD (`Organization` / `TouristTrip` /
  `BlogPosting` with `Person` author + `dateModified` + `mainEntityOfPage`
  / `BreadcrumbList` on post and tour pages)
- Auto-generated `sitemap-index.xml` with `lastmod` sourced from
  frontmatter (`updatedDate` → `publishDate` → build time). Submit to
  Google Search Console and Baidu 站长工具.
- RSS feeds at `/rss.xml` and `/en/rss.xml` (latest 50 posts per locale)

### Configuring the canonical origin

`SITE_URL` in `astro.config.mjs` reads from `process.env.SITE_URL` with
`https://yimrocktour.pages.dev` as fallback. In Cloudflare Pages set
`SITE_URL=https://<your-domain>` on the production env only — branch
previews keep the pages.dev domain and don't leak into canonicals.

### Hreflang sibling check

Set `CHECK_SIBLINGS=1` on the build to fail loudly when a post or tour
exists in one locale but not the other. Opt out per-entry with
`onlyLocale: zh` or `onlyLocale: en` in frontmatter. Flip on by default
once content has been clean for a week.

```bash
CHECK_SIBLINGS=1 npm run build
```

## Publishing a blog post

Scaffold both locale files in one shot:

```bash
npm run post:new -- --slug 2026-autumn-liming \
  --title-zh "黎明秋攀" --title-en "Autumn in Liming" \
  --author "云攀向导团"
```

That writes `src/content/posts/zh/<slug>.mdx` and
`src/content/posts/en/<slug>.mdx` with `draft: true`. Then:

1. Fill in `summary` (becomes `<meta description>` + `og:description`).
2. Drop a hero image next to the MDX file; uncomment `heroImage`.
3. Set `draft: false` and commit. `npm run build` publishes the pair.
4. For a content update later, set `updatedDate: YYYY-MM-DD` — JSON-LD
   `dateModified` and the sitemap `lastmod` both pick it up.

Supported frontmatter: `title`, `summary`, `publishDate`, `updatedDate`,
`author`, `tags`, `heroImage`, `draft`, `onlyLocale` (opts out of the
sibling check).

## Deploy

1. Push to GitHub.
2. In Cloudflare Pages, connect the repo. Build command: `npm run build`,
   output directory: `dist`.
3. Attach a custom domain once ready.

## Docs

- Approved implementation plan: `docs/plans/01-yimrocktour-mvp.md`
- Kunming courses + online videos: `docs/plans/02-kunming-courses.md`
- SEO hardening + new-post flow: `docs/plans/03-seo-and-new-post-flow.md`
