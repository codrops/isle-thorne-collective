/**
 * The page's elements outside `<main>` (the header's and the footer's buttons,
 * the cart counts) that match `selector`.
 *
 * Not the whole document: while a page transition runs, its layer
 * (`[data-interlude]`) can hold a still copy of the old page, with the same
 * classes and data attributes, and the page's scripts must not set those up.
 * Inside `<main>`, look in the `main` that `onPage()`'s `init` gets instead.
 */
export function pageElements<T extends Element = HTMLElement>(selector: string) {
  return document.querySelectorAll<T>(`${selector}:not([data-interlude] *)`);
}
