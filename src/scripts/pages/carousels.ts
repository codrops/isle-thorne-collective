/**
 * The home page's rows of photos (`src/scripts/carousel.ts`): started when a
 * page with rows comes in, and stopped before it's swapped for the next one.
 *
 * Files in this folder are page scripts: each is loaded once, on whichever
 * page the visit starts, and `onPage()` runs its hooks for every page shown,
 * the first one and each one a page transition brings in (see
 * `src/components/Interlude.astro`). `init` gets the page's `<main>`: the rows
 * are looked for there, never in the still copy of the old page that some
 * transitions keep on screen meanwhile. Embla, which only the rows need, is
 * imported when a page has rows, not with the rest.
 */
import { onPage } from '../../lib/interlude';
import type { EmblaCarouselType } from 'embla-carousel';

// `() => true`: every page. Pages without rows have nothing to start.
onPage(() => true, {
  init(main) {
    if (!main.querySelector('[data-carousel]')) return;

    let rows: EmblaCarouselType[] = [];
    let gone = false;
    import('../carousel').then(({ startCarousels }) => {
      // The page may have been left while Embla was downloading.
      if (!gone) rows = startCarousels(main);
    });
    return () => {
      gone = true;
      rows.forEach((row) => row.destroy());
    };
  },
});
