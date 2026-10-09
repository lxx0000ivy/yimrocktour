# Plan: Kunming climbing courses section

## Context

The 15-image `野攀课程.zip` brochure describes a full ladder of outdoor
climbing courses run from Kunming by instructor 陈逸民. The content is
originally image-only (posters). It fits awkwardly inside the `tours`
collection (tours are destination trips; courses are skill ladders), and
embedding the raw posters loses translation and accessibility.

Decision: extract the text, drop the images, and build a dedicated
`/courses` page in both locales. Keep the data structured so pricing,
curriculum, and prerequisites can be edited without touching layout.

## What was built

### New routes

- `/courses` (zh) → `src/pages/courses.astro`
- `/en/courses` (en) → `src/pages/en/courses.astro`

Both render `src/components/pages/CoursesPage.astro`, which pulls course
data from `src/lib/courses.ts`.

### Course data model (`src/lib/courses.ts`)

```ts
Course {
  id, name, nameEn, tagline, prereq,
  curriculum: { label, items[] }[],
  prices: { amountCNY, unit, note? }[],
  ratio?, perks?,
}
```

Five courses, zh + en in parallel:

| id            | zh name       | days | from (CNY) |
|---------------|---------------|------|------------|
| real-rock     | 野攀体验      | 0.5–1 | 450       |
| top-rope      | 顶绳攀岩课程  | 2    | 1800       |
| lead          | 先锋攀岩课程  | 3    | 2800       |
| multi-pitch   | 结组攀岩课程  | 3    | 3000       |
| trad          | 传统攀岩课程  | 3    | 4500       |

Instructor + "field record" (places the coach has climbed) also live in
`courses.ts` as per-locale arrays.

### Online video courses (new)

Second module on the same page, under id `#video`:

- `videoSeries: Record<Locale, VideoSeries[]>` in `src/lib/courses.ts`
- Three starter series: `knots`, `belay`, `anchor`
- Each `VideoEpisode` is `{ title, duration?, src?, poster? }`
- Episodes without `src` render a "即将上线 / Coming soon" placeholder
- When `src` is set on the first episode, the card shows an inline
  `<video controls preload="metadata">` player
- MP4 drop folder: `public/videos/` (see `public/videos/README.md`)

### Page layout

```
Hero + 5-up course index (anchor links)
Instructor band (stone bg)
Course articles ×5
  header: catalogue no · title · tagline · price
  grid: curriculum (left, day-by-day) + sidebar (prereq / price / ratio / perks)
Field record (stone bg)
Online video courses band (ink bg)
  3-up grid of video series cards (first episode = preview)
CTA
```

### Homepage integration

- Hero gets a third CTA `昆明野攀课程 / Kunming climbing courses →`
- New dark `Courses` band between Tours and Journal, titled
  `想自己能爬？ / Want to climb this yourself?` with a 5-up tile list
  that anchor-links to each course on `/courses`
- Header nav gets a `课程 / Courses` entry

### i18n keys added

In `src/i18n/{zh,en}.json`:

- `nav.courses`
- `home.hero.ctaCourses`
- `home.courses.*` (section eyebrow/title/body/cta/list.*)
- `courses.eyebrow`, `courses.title`, `courses.tagline`, `courses.subtitle`
- `courses.instructor.*`, `courses.curriculum`, `courses.prereq`,
  `courses.price`, `courses.ratio`, `courses.day`, `courses.day.suffix`
- `courses.cv.eyebrow`, `courses.cv.title`
- `courses.cta.eyebrow`, `courses.cta.title`, `courses.cta.body`
- `courses.video.eyebrow`, `courses.video.title`, `courses.video.subtitle`,
  `courses.video.cta`, `courses.video.pending`, `courses.video.duration`,
  `courses.video.episodes`, `courses.video.chapter`

## How to update

### Edit a course

Open `src/lib/courses.ts`. Each course has a `zh` and `en` entry — keep
both in sync. Changes rebuild on the next deploy.

### Add a new course

Append a new `Course` object to both `courses.zh` and `courses.en`. The
`id` becomes the anchor on `/courses#<id>`; also add a tile to the
homepage band in `src/components/pages/HomePage.astro` if you want it
featured.

### Upload a video

1. Drop the MP4 (or WebM) into `public/videos/`. Files are served at
   `/videos/<filename>`.
2. Open `src/lib/courses.ts`, find the series + episode, set `src` and
   optionally `poster`:

   ```ts
   { title: '八字结 Figure 8', duration: '03:40',
     src: '/videos/knots-figure-8.mp4',
     poster: '/videos/knots-figure-8.jpg' }
   ```

3. The first episode of each series is used as the inline preview.
   Episodes without `src` keep showing the "即将上线" placeholder, so you
   can roll out one at a time.

Recommended encoding: H.264 MP4, max 1920×1080, under ~40 MB per clip.

## Explicitly out of scope

- No individual pages per course (anchors on `/courses` are enough for
  now).
- No per-video pages — the inline player on the card is the whole
  experience. If libraries get large, promote `videoSeries` into a
  proper content collection with per-series routes.
- No booking/payment flow; the `courses.cta` section links to a mailto.
- No multi-episode playlist controls — the card shows one video and
  lists the rest. Upgrade when more than a handful of clips are live.
