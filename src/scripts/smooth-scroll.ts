/**
 * Smooth scrolling with Lenis (https://lenis.darkroom.engineering): mouse
 * wheels and trackpads glide instead of stepping. Touch scrolling stays the
 * browser's own (Lenis's default). To scroll natively everywhere, remove its
 * `<script>` from `src/layouts/BaseLayout.astro`.
 *
 * - Off for visitors who prefer reduced motion (an OS setting, which can
 *   change during a visit).
 * - Still while the cart or the menu is open (a modal <dialog>), so the page
 *   doesn't scroll behind them, and during page transitions.
 * - Anything that scrolls on its own (the cart, the product page's panels)
 *   carries `data-lenis-prevent`: the wheel scrolls it natively.
 *
 * One instance lasts the whole visit: Lenis drives the window's own scroll,
 * which survives the page swaps of Astro's client router. Interlude's events
 * keep it in step with the transitions (at the end of the file).
 */
import Lenis, { type LenisOptions } from 'lenis';
import 'lenis/dist/lenis.css';

// Settings
const OPTIONS: LenisOptions = {
  autoRaf: true, // Lenis runs its own animation loop
  anchors: true, // links to a spot on the same page glide there too
};

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const layer = document.querySelector<HTMLElement>('[data-interlude]');
let lenis: Lenis | null = null;

/** A page transition is running. True from the start if the first page is rendered covered. */
let transitioning = Boolean(layer && layer.dataset.state !== 'idle');

/** Whether the cart or the menu is open. */
const modalOpen = () => document.querySelector('dialog:modal, #menu[open]') !== null;

/** Scrolls, unless a dialog is open or a transition is running. */
function refresh() {
  if (modalOpen() || transitioning) lenis?.stop();
  else lenis?.start();
}

/** On, unless the visitor prefers reduced motion. */
function update() {
  if (motion.matches) {
    lenis?.destroy();
    lenis = null;
  } else if (!lenis) {
    lenis = new Lenis(OPTIONS);
    refresh();
  }
}

/** Matches Lenis to the page's current height and scroll position. */
function sync() {
  lenis?.resize();
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}

update();
motion.addEventListener('change', update);

// Dialogs gain and lose their `open` attribute as they open and close.
// Watching from <html>, which Astro keeps, covers every page's dialogs.
new MutationObserver(refresh).observe(document.documentElement, {
  subtree: true,
  attributes: true,
  attributeFilter: ['open'],
});

// A page transition starts: no scrolling under the cover.
document.addEventListener('interlude:leave', () => {
  transitioning = true;
  refresh();
});
// The new page is in, scrolled where the router put it (the top, or where you
// were when going back): catch up.
document.addEventListener('astro:after-swap', sync);
// The page is shown: scroll again.
document.addEventListener('interlude:idle', () => {
  transitioning = false;
  sync();
  refresh();
});
