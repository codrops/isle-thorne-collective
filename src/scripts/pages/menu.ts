/**
 * The menu on phones (`src/components/Menu.astro`): opened by the header's
 * "Menu" button, on every page.
 *
 * It's opened with `show()`, not `showModal()`: a modal dialog is drawn above
 * everything, page transitions included, and following one of its links should
 * play the transition over it, as from any page. So what a modal dialog does by
 * itself is done here: the page behind can't be reached (`inert`), Escape
 * closes it, and the page can't scroll behind it (`html:has(#menu[open])` in
 * `src/styles/global.css`).
 */
import { onPage } from '../../lib/interlude';
import { pageElements } from '../page-elements';

onPage(() => true, {
  init() {
    const menu = document.querySelector<HTMLDialogElement>('#menu');
    const openers = pageElements<HTMLButtonElement>('[data-menu-open]');
    if (!menu) return;

    /** What `open()` made inert: everything in <body> but the menu and the transition layer. */
    let behind: Element[] = [];
    /** The button that opened it, to give focus back to. */
    let opener: HTMLButtonElement | null = null;

    function open(button: HTMLButtonElement) {
      opener = button;
      behind = [...document.body.children].filter(
        (el) => el !== menu && !el.hasAttribute('data-interlude') && !el.hasAttribute('inert')
      );
      for (const el of behind) el.setAttribute('inert', '');
      menu!.show(); // focuses the first link in it, as `showModal()` does
      button.setAttribute('aria-expanded', 'true');
    }

    for (const button of openers) button.addEventListener('click', () => open(button));
    menu.querySelector('[data-menu-close]')?.addEventListener('click', () => menu.close());
    // However it closes (the button, Escape, opening the cart), the page comes
    // back, and the header's button says so.
    menu.addEventListener('close', () => {
      for (const el of behind) el.removeAttribute('inert');
      behind = [];
      for (const button of openers) button.setAttribute('aria-expanded', 'false');
      // Focus back on the "Menu" button, now that it can take it: the browser
      // tried while it was still inert. Only if focus is still in the closed
      // menu (or lost): not if something else has it (the cart, opened from it).
      const focused = document.activeElement;
      if (!focused || focused === document.body || menu.contains(focused)) opener?.focus();
    });

    // Escape closes it (a modal dialog would do that by itself).
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.open) menu.close();
    };
    document.addEventListener('keydown', onKey);

    // The menu only exists on phones: close it if the window grows past them.
    const wide = matchMedia('(width >= 64rem)');
    const closeWhenWide = (event: MediaQueryListEvent) => event.matches && menu.close();
    wide.addEventListener('change', closeWhenWide);
    return () => {
      document.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', closeWhenWide);
    };
  },
});
