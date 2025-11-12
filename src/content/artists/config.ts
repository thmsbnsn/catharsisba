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
    images: z
      .array(
        z
          .object({
            src: z.string(), // image URL or path
            width: z.number().optional(),
            height: z.number().optional(),
            w: z.number().optional(), // optional legacy width for PhotoSwipe
            h: z.number().optional(), // optional legacy height
            alt: z.string().optional(),
          })
          .transform((image) => ({
            ...image,
            width: image.width ?? image.w,
            height: image.height ?? image.h,
          })),
      )
      .default([])
  })
});

export const collections = { artists };
