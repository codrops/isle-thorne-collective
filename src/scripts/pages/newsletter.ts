/**
 * The newsletter form (`src/components/Newsletter.astro`): opened from the
 * footer, on every page.
 */
import { onPage } from '../../lib/interlude';
import { site } from '../../config/site';
import { closeOnClickOutside } from '../dialog';
import { pageElements } from '../page-elements';

onPage(() => true, {
  init() {
    const dialog = document.querySelector<HTMLDialogElement>('#newsletter');
    const form = dialog?.querySelector<HTMLFormElement>('[data-newsletter-form]');
    const status = dialog?.querySelector<HTMLElement>('[data-newsletter-status]');
    const openers = pageElements('[data-newsletter-open]');
    if (!dialog || !form || !status) return;

    for (const button of openers) {
      button.addEventListener('click', () => {
        dialog.showModal();
        button.setAttribute('aria-expanded', 'true');
      });
    }
    dialog.addEventListener('close', () => {
      status.textContent = '';
      for (const button of openers) button.setAttribute('aria-expanded', 'false');
    });
    closeOnClickOutside(dialog);

    form.addEventListener('submit', (event) => {
      // No provider set: nothing to send to.
      if (!site.newsletter.action) {
        event.preventDefault();
        status.textContent = site.demo.newsletter;
        return;
      }
      // Sent (in a new tab): thank them here too.
      status.textContent = 'Thank you. The sign-up continues in the new tab.';
      form.reset();
    });
  },
});
