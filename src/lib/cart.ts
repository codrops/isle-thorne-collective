/**
 * The cart, kept in the browser's localStorage: a list of product ids and
 * quantities. No server is involved, so it survives page loads and is shared
 * between tabs, but stays on this device.
 *
 * Only ids are stored: names, prices and photos come from the catalogue each
 * page carries (see `src/components/Cart.astro`), so they're always current.
 */

/** The localStorage key. */
export const CART_KEY = 'itc-cart';

export interface CartLine {
  /** The product's id: its file name in `src/content/products/`. */
  id: string;
  quantity: number;
}

/** What the cart needs to show a product, per id. */
export interface CartProduct {
  title: string;
  number: number;
  price: number;
  href: string;
  image: string;
}

const isLine = (value: unknown): value is CartLine =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as CartLine).id === 'string' &&
  Number.isInteger((value as CartLine).quantity) &&
  (value as CartLine).quantity > 0;

/** The cart's lines. Anything unreadable (private mode, old data) counts as empty. */
export function readCart(): CartLine[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    return Array.isArray(stored) ? stored.filter(isLine) : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked: the cart just won't persist.
  }
}

/** Adds one of a product (or one more, if it's already in the cart). */
export function addToCart(id: string) {
  const lines = readCart();
  const line = lines.find((item) => item.id === id);
  if (line) line.quantity += 1;
  else lines.push({ id, quantity: 1 });
  writeCart(lines);
}

/** Takes a product out of the cart, whatever its quantity. */
export function removeFromCart(id: string) {
  writeCart(readCart().filter((line) => line.id !== id));
}

/** How many pieces are in the cart: the number in "Cart (n)". */
export const countCart = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.quantity, 0);
