# Plan: yimrocktour publicity site — v1 (Astro + MDX)

> Per project CLAUDE.md, once approved this plan file will be copied to
> `docs/plans/01-yimrocktour-mvp.md` at the start of implementation.

## Context

Greenfield repo (`README.brief.md` + empty `docs/` are the only content). Goal is a
publicity site for a Yunnan rock-climbing tour operation. Priorities in order:

1. **SEO-first**: content pages must render as static HTML with proper meta / OG /
   sitemap / structured data — climbers should be able to find the tours via Google
   ("Yunnan rock climbing", "Liming trad", "Getu climbing tour") and Baidu.
2. **Easy to edit**: content lives as MDX files in the repo. Adding a new tour or
   trip report = drop a file in a folder, commit, push.
3. **Bilingual (zh + en)** with clean URL prefixes (`/en/...`, `/zh/...`, default → zh).
4. **Fast + cheap**: static build, Cloudflare Pages free tier, near-zero JS.

Confirmed choices:
- Audience: bilingual (zh + en)
- Editor: solo, git + markdown
- Stack: **Astro + Tailwind + MDX**
- Host: **Cloudflare Pages**
- Scope: Home / About / Contact + Tour listings + Tour detail + Blog / trip reports
- Content: placeholders for v1

## Why Astro (short version)

Astro is purpose-built for content sites: it ships **zero JS by default**, has
first-class **content collections** (typed frontmatter for tours + posts), native
**MDX**, built-in **sitemap** and **image optimization**, and works cleanly with
Tailwind. That beats Next.js/Nuxt for a marketing site of this shape — we can
still island-hydrate a component later if we ever need interactivity.

## Tech stack

| Concern             | Choice                                                                 |
|---------------------|------------------------------------------------------------------------|
| Framework           | Astro 5 (latest)                                                       |
| Styling             | Tailwind CSS v4 (via `@tailwindcss/vite`)                              |
| Content             | Astro Content Collections + MDX (`@astrojs/mdx`)                       |
| Images              | `astro:assets` (built-in responsive image optimization)                |
| SEO                 | `@astrojs/sitemap`, hand-rolled `<SEO>` component, JSON-LD in layout   |
| i18n                | Astro's built-in i18n routing (zh default, en prefix `/en`)            |
| Icons               | `astro-icon` + Iconify (tree-shaken)                                   |
| Deploy              | Cloudflare Pages (static output, no adapter needed)                    |
| Node / package mgr  | Node 20 LTS, pnpm                                                      |
| Linting             | Prettier + `prettier-plugin-astro`; ESLint optional (skip for v1)      |

## Repository layout

```
yimrocktour/
├─ astro.config.mjs           # site url, i18n, integrations, sitemap
├─ package.json               # pnpm scripts: dev / build / preview
├─ tailwind.config.mjs        # brand tokens (colors, fonts)
├─ tsconfig.json
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ og-default.jpg          # fallback social card
├─ src/
│  ├─ content.config.ts       # collection schemas (tours, posts)
│  ├─ content/
│  │  ├─ tours/
│  │  │  ├─ zh/liming-trad.mdx
│  │  │  ├─ zh/getu-sport.mdx
│  │  │  ├─ en/liming-trad.mdx
│  │  │  └─ en/getu-sport.mdx
│  │  └─ posts/
│  │     ├─ zh/2026-spring-liming-report.mdx
│  │     └─ en/2026-spring-liming-report.mdx
│  ├─ i18n/
│  │  ├─ zh.json              # UI strings
│  │  └─ en.json
│  ├─ layouts/
│  │  ├─ BaseLayout.astro     # <html>, <head>, SEO, header/footer
│  │  ├─ TourLayout.astro
│  │  └─ PostLayout.astro
│  ├─ components/
│  │  ├─ SEO.astro            # title/desc/canonical/OG/twitter/JSON-LD
│  │  ├─ Header.astro         # nav + lang switcher
│  │  ├─ Footer.astro
│  │  ├─ Hero.astro
│  │  ├─ TourCard.astro
│  │  ├─ PostCard.astro
│  │  └─ LangSwitch.astro
│  ├─ pages/
│  │  ├─ index.astro                     # zh home (default locale)
│  │  ├─ about.astro
│  │  ├─ contact.astro
│  │  ├─ tours/index.astro               # zh tour list
│  │  ├─ tours/[slug].astro              # zh tour detail
│  │  ├─ blog/index.astro                # zh blog list
│  │  ├─ blog/[slug].astro               # zh blog detail
│  │  └─ en/
│  │     ├─ index.astro
│  │     ├─ about.astro
│  │     ├─ contact.astro
│  │     ├─ tours/index.astro
│  │     ├─ tours/[slug].astro
│  │     ├─ blog/index.astro
│  │     └─ blog/[slug].astro
│  └─ styles/global.css       # Tailwind entry + a few base rules
├─ docs/
│  ├─ plans/01-yimrocktour-mvp.md   # (copy of this plan on approval)
│  └─ design/                       # future design docs
└─ README.md
```

## Content model (typed frontmatter)

**`src/content.config.ts`** defines two collections; every MDX file is type-checked.

```ts
// tours
{
  title: string
  slug: string                     // used in URL
  location: string                 // "Liming, Yunnan"
  climbingType: 'trad' | 'sport' | 'boulder' | 'mixed'
  difficulty: string               // free text, e.g. "5.9–5.11"
  durationDays: number
  priceCNY?: number
  season: string                   // "Oct–Apr"
  heroImage: image()               // astro:assets, auto-optimized
  gallery?: image()[]
  summary: string                  // 1–2 sentences, used in list + <meta>
  publishDate: date
  draft?: boolean
}

// posts
{
  title: string
  summary: string
  heroImage?: image()
  publishDate: date
  author?: string
  tags?: string[]
  draft?: boolean
}
```

Editor workflow: `cp` an existing MDX file, edit frontmatter + body, `pnpm dev`
gives live preview, commit, push → Cloudflare Pages rebuilds. That's it.

## SEO plan

Every page renders through `BaseLayout.astro`, which mounts `<SEO>`:

- `<title>` and `<meta name="description">` from page/collection frontmatter,
  with sensible fallbacks in `src/i18n/*.json`.
- Canonical URL derived from `Astro.url` + `site` in `astro.config.mjs`.
- OpenGraph + Twitter card tags (image = `heroImage` or `/og-default.jpg`).
- `<link rel="alternate" hreflang="zh" />` + `hreflang="en"` on every page pair
  → tells Google/Baidu the two locales are equivalents.
- JSON-LD:
  - Home: `Organization` + `TravelAgency`.
  - Tour detail: `TouristTrip` (name, description, itinerary, provider, price).
  - Blog post: `BlogPosting`.
- `@astrojs/sitemap` auto-generates `sitemap-index.xml` including both locales
  (via `i18n` option). Baidu-friendly too.
- `public/robots.txt` allows all + points at sitemap.
- Astro image optimization emits width-descriptor `srcset` + AVIF/WebP.
- All content pages are prerendered static HTML — no client JS needed for SEO.

## i18n approach

Astro's built-in i18n in `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'zh',
  locales: ['zh', 'en'],
  routing: { prefixDefaultLocale: false }, // /about (zh) and /en/about
}
```

- UI strings live in `src/i18n/{zh,en}.json`, resolved by a small `t(locale, key)`
  helper (no runtime library needed).
- Content collections filter by `id.startsWith('zh/')` vs `en/`.
- `LangSwitch.astro` links to the matching page in the other locale (falls back
  to the locale home if no translation exists).

## Deploy — Cloudflare Pages

- Static output (default). No adapter required.
- Build command: `pnpm build`, output dir: `dist`.
- Connect repo → CF Pages auto-builds on push to `main`.
- Custom domain added later; until then use the `*.pages.dev` URL.
- Note for later: CF Pages is generally reachable in mainland China but slower
  than a domestic CDN. If CN traffic becomes primary, revisit hosting
  (Aliyun/Tencent OSS + ICP filing) — this stack is portable.

## Implementation steps

1. **Scaffold**
   - `pnpm create astro@latest .` (minimal template, TS strict, no sample data)
   - Add integrations: `@astrojs/mdx`, `@astrojs/sitemap`, Tailwind v4 via
     `@tailwindcss/vite`, `astro-icon`.
   - Configure `astro.config.mjs`: `site`, `i18n`, `integrations`.
2. **Base UI shell**
   - `BaseLayout.astro`, `Header.astro` (with `LangSwitch`), `Footer.astro`,
     Tailwind tokens for brand colors + typography.
3. **Content collections**
   - `src/content.config.ts` with the schemas above.
   - Seed 2 tour MDX files per locale + 1 blog post per locale (placeholder copy
     and stock/placeholder hero images).
4. **Routes**
   - Home, About, Contact for both locales.
   - `tours/index.astro` lists all tours in the current locale; `tours/[slug].astro`
     renders `TourLayout` + MDX content + JSON-LD `TouristTrip`.
   - Same shape for `blog/`.
5. **SEO wiring**
   - `SEO.astro` component; JSON-LD helpers per page type; `hreflang` pairs;
     `@astrojs/sitemap` with i18n config; `robots.txt`.
6. **Deploy**
   - Push to GitHub, connect Cloudflare Pages, verify preview build, note
     the pages.dev URL.

## Verification

- `pnpm dev` → visit `http://localhost:4321/`, `/en/`, `/tours/liming-trad`,
  `/en/tours/liming-trad`. Language switcher hops between the pair.
- `pnpm build && pnpm preview` — inspect built HTML in `dist/`:
  - `view-source:` shows title, description, canonical, OG, JSON-LD baked in.
  - `dist/sitemap-*.xml` contains every route in both locales.
  - Images have `srcset` with multiple widths + modern formats.
- Lighthouse (Chrome DevTools) on `pnpm preview`: SEO ≥ 100, Performance ≥ 95.
- Add a page-not-yet-existing route in the other locale to confirm
  `LangSwitch` fallback behaves.
- After first Cloudflare deploy: open Google Search Console + Baidu 站长工具,
  submit `sitemap-index.xml`.

## Explicitly out of scope for v1 (call out later if wanted)

- CMS UI (Decap/Tina) — trivial to add later on top of the same MDX collections.
- Inquiry / booking form — deferred; when added, Formspree or Cloudflare Pages
  Functions + Resend is a small drop-in.
- Payment / real booking flow.
- Analytics (would suggest Umami or Cloudflare Web Analytics when ready).
- Search (Pagefind is a good later add — static, works with Astro).
- Dark mode.
