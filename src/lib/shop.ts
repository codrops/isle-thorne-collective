/**
 * Reading the shop's content: collections with their products in order,
 * product titles and links. Pages use these instead of `getCollection()`
 * directly, so the sorting and naming rules live in one place.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Collection = CollectionEntry<'collections'>;
export type Product = CollectionEntry<'products'>;

/** A collection with its products, both in display order. */
export interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
}

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

/**
 * Every collection that has products, each with its products. A collection
 * with none (while you're filling in your own) isn't shown: an empty card
 * labelled "0 pieces" would look broken.
 */
export async function getCollectionsWithProducts(): Promise<CollectionWithProducts[]> {
  const [collections, products] = await Promise.all([
    getCollection('collections'),
    getCollection('products'),
  ]);
  return collections
    .sort(byOrder)
    .map((collection) => ({
      collection,
      products: products
        .filter((product) => product.data.collection.id === collection.id)
        .sort(byOrder),
    }))
    .filter(({ products }) => products.length > 0);
}

/** The collection a product belongs to. */
export async function getProductCollection(product: Product): Promise<Collection> {
  const collection = await getEntry(product.data.collection);
  if (!collection)
    throw new Error(`${product.id}: unknown collection "${product.data.collection.id}"`);
  return collection;
}

/** "Elysian Lounge Seat No. 7" */
export const productTitle = (product: Product, collection: Collection) =>
  `${collection.data.singular} No. ${product.data.number}`;

/** The product's page. */
export const productUrl = (product: Product) => `/shop/${product.id}/`;

/** "114 x 98 x 79", as on the product page (width x depth x height, in cm). */
export const productSize = (product: Product) => {
  const { width, depth, height } = product.data.dimensions;
  return `${width} x ${depth} x ${height}`;
};

/** "7 pieces" */
export const pieces = (count: number) => `${count} ${count === 1 ? 'piece' : 'pieces'}`;
