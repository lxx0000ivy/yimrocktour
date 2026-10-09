# Online video drop folder

Place MP4 (or WebM) files here. Files in `public/` are served as-is at
`/videos/<filename>`.

To wire a video to an episode, open `src/lib/courses.ts` and set the
`src` (and optional `poster`) on the episode. For example:

```ts
{ title: '八字结 Figure 8', duration: '03:40',
  src: '/videos/knots-figure-8.mp4',
  poster: '/videos/knots-figure-8.jpg' },
```

The first episode of each series is used as the card preview. Episodes
without `src` render as "Coming soon" placeholders.

Recommended encoding: H.264 MP4, max 1920×1080, under ~40 MB per clip.
