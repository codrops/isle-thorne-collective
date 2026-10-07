/**
 * The cart and the newsletter form are modal <dialog>s, which the browser shows
 * above everything else, the page transition's layer too. So they stay open
 * while a transition covers the page behind them (a link inside one, or back
 * and forward), and close once the page is covered: the cover is on screen
 * then, and the next page is revealed from it. The phone menu isn't modal: the
 * transition covers it, and it closes then too, unseen.
 */

/** Closes the open dialogs. */
function closeDialogs() {
  for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[open]')) {
    dialog.close();
  }
}

// Also fired by a navigation without a transition (`none`, reduced motion),
// just before the swap.
document.addEventListener('interlude:covered', closeDialogs);

// A link to the page you're on starts no transition (the current page in the
// menu): close the dialog on the click itself. Clicks that open a new tab
// (with a modifier key) leave it open.
document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('dialog a[href]');
  const newTab = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (!link || event.button !== 0 || newTab) return;
  const to = new URL(link.href, location.href);
  if (to.origin === location.origin && to.pathname === location.pathname) closeDialogs();
});
