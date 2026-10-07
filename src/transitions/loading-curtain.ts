/**
 * Loading curtain: Isle Thorne's own version of Interlude's `curtain`. The
 * black panel that rises over the page is the design's loading screen: the
 * site's name, its tagline (from 1024px) and the year it was founded, in a
 * line across the middle. It stays while the next page loads, then rises off
 * the top to reveal it. The page drifts up with it. On "back" it runs top to
 * bottom.
 *
 * Unlike `curtain`, the panel is cut (`clip-path`) rather than scaled, so the
 * line on it isn't stretched, and it stays from `leave` to `enter`
 * (`solidCover: false`), so the line is on screen while the next page loads.
 */
import { gsap } from 'gsap';
import { defineTransition, panel, sign, type TransitionContext } from '../lib/interlude';
import { pageBlocks } from '../lib/interlude/old-page';
import { site } from '../config/site';

// Settings
const LEAVE = { duration: 0.6, ease: 'power1.inOut' }; // covering
const ENTER = { duration: 0.8, ease: 'power4.out' }; // revealing
const DRIFT = 100; // px the page moves as it goes and comes

// The panel's shape (`clip-path: inset(top right bottom left)`), both ends
// given to each tween, as GSAP interpolates the four numbers.
const FULL = 'inset(0% 0% 0% 0%)'; // the whole screen
const FROM_BELOW = 'inset(100% 0% 0% 0%)'; // nothing yet: grows from the bottom edge
const FROM_ABOVE = 'inset(0% 0% 100% 0%)'; // nothing yet: grows from the top edge

const MARK = 'data-loading-screen';

/**
 * The loading screen: a full-screen panel with the line across its middle, on
 * the site's grid like the header (the tagline on the third column, from
 * 1344px; on the fourth below, where the name needs more room).
 */
function loadingScreen(context: TransitionContext) {
  const el = panel(context);
  el.setAttribute(MARK, '');
  const line = document.createElement('p');
  line.className =
    'grid-site absolute inset-x-0 top-1/2 -translate-y-1/2 px-3 text-title leading-none whitespace-nowrap text-white';
  const parts = [
    [site.name, ''],
    [site.tagline, 'max-lg:hidden lg:col-start-4 min-[84rem]:col-start-3'],
    [`Since ${site.since}`, 'col-start-2 justify-self-end lg:col-span-3 lg:col-start-10'],
  ];
  for (const [text, className] of parts) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    line.append(span);
  }
  el.append(line);
  return el;
}

export default defineTransition({
  name: 'loading-curtain',
  solidCover: false, // the loading screen covers the page, and stays for enter()

  // The first page, with `revealOnLoad`: the same screen, drawn covered before
  // the wait, so the name and tagline are on screen while the page loads.
  cover(context) {
    const el = loadingScreen(context);
    gsap.set(el, { clipPath: FULL });
  },
  entrance: 0.2, // the page's content starts coming in 0.2 s into enter()

  leave(context) {
    const up = sign(context) > 0; // going back, everything runs the other way
    // The screen grows from the bottom edge (the top, going back)…
    const el = loadingScreen(context);
    return (
      gsap
        // `defaults`: every step of this timeline uses LEAVE's duration and ease.
        .timeline({ defaults: LEAVE })
        .fromTo(el, { clipPath: up ? FROM_BELOW : FROM_ABOVE }, { clipPath: FULL })
        // …while the page drifts away: at the same time as the screen. The whole
        // page (header, content, footer), not only `<main>`: moved alone, the
        // content would slide over the red footer, which would show through it.
        .to(pageBlocks(context), { y: up ? -DRIFT : DRIFT }, 0)
    );
  },

  enter(context) {
    const up = sign(context) > 0;
    // The screen leave() put up, still covering (or a new one, if there's none).
    const el = context.root.querySelector<HTMLElement>(`[${MARK}]`) ?? loadingScreen(context);
    return (
      gsap
        .timeline({ defaults: ENTER })
        // The screen shrinks towards the top edge (the bottom, going back)…
        .fromTo(el, { clipPath: FULL }, { clipPath: up ? FROM_ABOVE : FROM_BELOW })
        // …while the new page drifts in after it. `clearProps` removes the
        // inline styles once it's done, so the page's own CSS takes over again.
        .fromTo(
          pageBlocks(context),
          { y: up ? DRIFT : -DRIFT },
          { y: 0, clearProps: 'transform' },
          0
        )
    );
  },
});
