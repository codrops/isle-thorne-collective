/**
 * A product's photos (`src/components/ProductGallery.astro`): from 1024px, the
 * slideshow's buttons, small pictures and arrow keys. On product pages.
 */
import { onPage } from '../../lib/interlude';

onPage(() => true, {
  init(main) {
    // In the page's <main>: the old page's copy, if a transition keeps one on
    // screen, can have a gallery too.
    const gallery = main.querySelector<HTMLElement>('[data-gallery]');
    const row = main.querySelector<HTMLElement>('[data-gallery-thumbs]');
    if (!gallery || !row) return;

    const slides = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-slide]')];
    const steps = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-step]')];
    const thumbs = [...row.querySelectorAll<HTMLButtonElement>('button')];
    const status = gallery.querySelector<HTMLElement>('[data-gallery-status]')!;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;

    /** Shows photo `index`, wrapping around at both ends. */
    function show(index: number) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.toggleAttribute('data-current', i === current));
      thumbs.forEach((thumb, i) => {
        if (i === current) thumb.setAttribute('aria-current', 'true');
        else thumb.removeAttribute('aria-current');
      });
      status.textContent = `Photo ${current + 1} of ${slides.length}`;
      revealThumb(thumbs[current]);
    }

    /** Scrolls the row just enough for the current small picture to be in full view. */
    function revealThumb(thumb: HTMLElement) {
      const box = thumb.getBoundingClientRect();
      const view = row!.getBoundingClientRect();
      // The row runs to the screen's edge, past its 12px right padding.
      const right = view.right - parseFloat(getComputedStyle(row!).paddingRight);
      const offset = box.left < view.left ? box.left - view.left : Math.max(0, box.right - right);
      if (offset)
        row!.scrollBy({ left: offset, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }

    for (const step of steps) {
      step.hidden = false;
      step.addEventListener('click', () => show(current + Number(step.dataset.galleryStep)));
    }
    thumbs.forEach((thumb, i) => {
      thumb.disabled = false;
      thumb.addEventListener('click', () => show(i));
    });

    // ← and →, while focus is on the big photo's halves or the small pictures.
    // On the small pictures, focus follows the photo showing.
    const onKey = (event: KeyboardEvent) => {
      const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (!step) return;
      event.preventDefault();
      show(current + step);
      if (row.contains(document.activeElement)) thumbs[current].focus({ preventScroll: true });
    };
    gallery.addEventListener('keydown', onKey);
    row.addEventListener('keydown', onKey);
  },
});
