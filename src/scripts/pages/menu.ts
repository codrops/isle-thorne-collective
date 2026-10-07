/**
 * The menu on phones (`src/components/Menu.astro`): opened by the header's
 * "Menu" button, on every page.
 */
import { onPage } from '../../lib/interlude';
import { pageElements } from '../page-elements';

onPage(() => true, {
  init() {
    const menu = document.querySelector<HTMLDialogElement>('#menu');
    const openers = pageElements<HTMLButtonElement>('[data-menu-open]');
    if (!menu) return;

    for (const button of openers) {
      button.addEventListener('click', () => {
        menu.showModal();
        button.setAttribute('aria-expanded', 'true');
      });
    }
    menu.querySelector('[data-menu-close]')?.addEventListener('click', () => menu.close());
    // However it closes (the button, Escape, opening the cart), the header's button says so.
    menu.addEventListener('close', () => {
      for (const button of openers) button.setAttribute('aria-expanded', 'false');
    });

    // The menu only exists on phones: close it if the window grows past them.
    const wide = matchMedia('(width >= 64rem)');
    const closeWhenWide = (event: MediaQueryListEvent) => event.matches && menu.close();
    wide.addEventListener('change', closeWhenWide);
    return () => wide.removeEventListener('change', closeWhenWide);
  },
});
