/**
 * The cart in the browser: opening and closing its panel, drawing its lines,
 * "Add to cart" buttons, and "Cart (n)" counts. The data itself is in
 * `src/lib/cart.ts`; the markup in `src/components/Cart.astro`.
 *
 * Started on every page (`src/scripts/pages/cart.ts`): each page brings its
 * own cart panel and buttons.
 */
import { site } from '../config/site';
import { addToCart, countCart, readCart, removeFromCart, type CartProduct } from '../lib/cart';
import { formatPrice, formatQuantity } from '../lib/format';
import { closeOnClickOutside } from './dialog';
import { pageElements } from './page-elements';

/**
 * Starts the page's cart. Returns what stops it, for when the page goes.
 */
export function startCart() {
  const dialog = document.querySelector<HTMLDialogElement>('#cart');
  if (!dialog) return;

  const list = dialog.querySelector<HTMLUListElement>('[data-cart-lines]')!;
  const template = dialog.querySelector<HTMLTemplateElement>('[data-cart-line]')!;
  const empty = dialog.querySelector<HTMLElement>('[data-cart-empty]')!;
  const checkout = dialog.querySelector<HTMLButtonElement>('[data-cart-checkout]')!;
  const shop = dialog.querySelector<HTMLElement>('[data-cart-shop]')!;
  const status = dialog.querySelector<HTMLElement>('[data-cart-status]')!;
  const catalog: Record<string, CartProduct> = JSON.parse(
    dialog.querySelector('[data-cart-catalog]')?.textContent ?? '{}'
  );

  /** Redraws the lines and every "Cart (n)" from what's stored. */
  function render() {
    // Products that no longer exist (removed from the content) are left out.
    const lines = readCart().filter((line) => line.id in catalog);

    list.replaceChildren(
      ...lines.map((line) => {
        const product = catalog[line.id];
        const name = `${product.title} No. ${product.number}`;
        const item = template.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
        const image = item.querySelector<HTMLImageElement>('[data-line-image]')!;
        const title = item.querySelector<HTMLAnchorElement>('[data-line-title]')!;
        image.src = product.image;
        title.href = product.href;
        title.textContent = product.title;
        item.querySelector('[data-line-number]')!.textContent = `No. ${product.number}`;
        item.querySelector('[data-line-quantity]')!.textContent = formatQuantity(line.quantity);
        item.querySelector('[data-line-price]')!.textContent = formatPrice(
          product.price * line.quantity
        );
        const remove = item.querySelector<HTMLButtonElement>('[data-line-remove]')!;
        remove.setAttribute('aria-label', `Remove ${name}`);
        remove.addEventListener('click', () => {
          removeFromCart(line.id);
          status.textContent = `${name} removed.`;
          render();
          // The removed line's button is gone: keep focus in the cart.
          (list.querySelector<HTMLElement>('[data-line-remove]') ?? shop).focus();
        });
        return item;
      })
    );

    const hasLines = lines.length > 0;
    empty.hidden = hasLines;
    checkout.hidden = !hasLines;
    shop.hidden = hasLines;
    for (const count of pageElements('[data-cart-count]')) {
      count.textContent = String(countCart(lines));
    }
  }

  const openers = pageElements('[data-cart-open]');

  function open() {
    // The menu (phones) gives way to the cart.
    document.querySelector<HTMLDialogElement>('#menu')?.close();
    render();
    if (!dialog!.open) dialog!.showModal();
    for (const button of openers) button.setAttribute('aria-expanded', 'true');
  }

  for (const button of openers) button.addEventListener('click', open);
  dialog.querySelector('[data-cart-close]')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('close', () => {
    status.textContent = '';
    for (const button of openers) button.setAttribute('aria-expanded', 'false');
  });

  closeOnClickOutside(dialog);

  checkout.addEventListener('click', () => {
    status.textContent = site.demo.checkout;
  });

  // "Add to cart" (product pages): add one, then show the cart.
  for (const button of pageElements<HTMLElement>('[data-add-to-cart]')) {
    button.addEventListener('click', () => {
      const id = button.dataset.addToCart;
      if (!id || !(id in catalog)) return;
      addToCart(id);
      open();
      status.textContent = `${catalog[id].title} No. ${catalog[id].number} added.`;
    });
  }

  // Another tab changed the cart: show the same.
  addEventListener('storage', render);

  render();
  return () => removeEventListener('storage', render);
}
