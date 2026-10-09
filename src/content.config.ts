import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tours = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tours' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      location: z.string(),
      climbingType: z.enum(['trad', 'sport', 'boulder', 'mixed']),
      difficulty: z.string(),
      durationDays: z.number().int().positive(),
      priceCNY: z.number().positive().optional(),
      season: z.string(),
      heroImage: image(),
      gallery: z.array(image()).optional(),
      summary: z.string(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      onlyLocale: z.enum(['zh', 'en']).optional(),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      heroImage: image().optional(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      /**
       * When set, this post intentionally publishes in only this locale.
       * Suppresses hreflang for the missing locale and the build-time
       * sibling check.
       */
      onlyLocale: z.enum(['zh', 'en']).optional(),
    }),
});

export const collections = { tours, posts };
