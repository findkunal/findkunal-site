import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    status: z.enum(['live', 'beta', 'dev']).default('dev'),
    order: z.number().default(0),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    icon: z.string().optional(),
    cover: z.string().optional(),
    stack: z.array(z.string()).default([]),
    started: z.string().optional(),
  }),
});

export const collections = { apps };
