import { defineCollection, z } from 'astro:content';

const artists = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    styles: z.array(z.string()),
    email: z.string().email(),
    instagram: z.string().url().optional(),
    hero: z.string().optional(), // path to hero image in /public or /src/assets
    bio: z.string().optional(),
    images: z.array(z.object({
      src: z.string(),        // image URL or path
      w: z.number().optional(), // optional width for PhotoSwipe
      h: z.number().optional(), // optional height
      alt: z.string().optional()
    })).default([])
  })
});

export const collections = { artists };
