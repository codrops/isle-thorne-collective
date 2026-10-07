/**
 * Helpers for the site's panels that are modal <dialog>s (the cart, the
 * newsletter form).
 */

/**
 * Closes the dialog when someone clicks outside it. Outside is the dialog's
 * ::backdrop, which reports clicks as clicks on the dialog itself: so check
 * where the click was.
 */
export function closeOnClickOutside(dialog: HTMLDialogElement) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (!inside) dialog.close();
  });
}
