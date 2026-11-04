// Defines the two kinds of Markdown content on the site:
//   src/content/work/*.md     -> project case studies at /work/<file-name>/
//   src/content/writing/*.md  -> articles at /writing/<file-name>/
// If a required field is missing, the build stops and tells you which file and field.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    client: z.string(),
    role: z.string(),
    year: z.string(),
    category: z.string(),
    focus: z.array(z.string()).default([]),
    // Big number and caption shown on the card until you add a cover photo
    art: z.object({ value: z.string(), label: z.string() }),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    placeholder: z.boolean().default(false),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    gallery: z.array(z.object({ caption: z.string().default('') })).default([]),
    quote: z
      .object({ text: z.string(), name: z.string(), role: z.string() })
      .optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    dek: z.string().optional(),
    excerpt: z.string(),
    date: z.coerce.date(),
    topic: z.string(),
    placeholder: z.boolean().default(false),
    // Set draft: true to keep an article off the site while you work on it
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, writing };
