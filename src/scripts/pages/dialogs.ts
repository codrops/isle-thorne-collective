/**
 * The menu, the cart and the newsletter form are modal <dialog>s, which the
 * browser shows above everything else, the page transition's layer too. So
 * they close when a page transition starts (a link inside one, or back and
 * forward), and the transition covers the page as usual.
 */

/** Closes the open dialogs. */
function closeDialogs() {
  for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[open]')) {
    dialog.close();
  }
}

document.addEventListener('interlude:leave', closeDialogs);

// A link to the page you're on (the current page in the menu) starts no
// transition, so close the dialog on the click itself. Clicks that open a new
// tab (with a modifier key) leave it open.
document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest?.('dialog a[href]');
  const newTab = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (link && event.button === 0 && !newTab) closeDialogs();
});
