import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The shop's collections (furniture lines): one JSON file, in display order.
 * Named `collections` like the shop calls them, not to be confused with
 * Astro's content collections, which this is one of.
 */
const shopCollections = defineCollection({
  loader: file('./src/content/collections.json'),
  schema: z.object({
    /** "Elysian Lounge Seats": the collection, on the home and shop pages. */
    name: z.string(),
    /** "Elysian Lounge Seat": one piece of it, in product titles and the cart. */
    singular: z.string(),
    /** Position on the home and shop pages, and the number in its circle. */
    order: z.number().int().positive(),
    /** What the collection is made of, as one line: "Steel, Glass, Ceramics". */
    materials: z.string(),
    /** The product pages' "Process" panel. */
    process: z.string(),
  }),
});

/**
 * One Markdown file per product. The front matter holds the facts, the body
 * is its description. The file name is its URL: `/shop/<file name>/`.
 */
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      collection: reference('collections'),
      /** The model number: "No. 7". */
      number: z.number().int().positive(),
      /** Position within its collection. */
      order: z.number().int().positive(),
      /** The collection year: "2024 Collection". */
      year: z.number().int(),
      materials: z.string(),
      /** In centimetres. */
      dimensions: z.object({
        width: z.number().positive(),
        depth: z.number().positive(),
        height: z.number().positive(),
      }),
      /** A whole number in `site.currency`. */
      price: z.number().int().positive(),
      /** The first is the main photo; any others show beside it. */
      images: z
        .array(
          z.object({
            /** Relative to the Markdown file. */
            src: image(),
            alt: z.string(),
          })
        )
        .min(1),
    }),
});

/** The journal: one Markdown file per story, the file name is its URL. */
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      /** Who wrote it, and who took the photos. */
      words: z.string(),
      photo: z.string(),
      cover: image(),
      coverAlt: z.string(),
      /** For search results and sharing. */
      description: z.string(),
    }),
});

export const collections = { collections: shopCollections, products, journal };
