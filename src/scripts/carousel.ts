/**
 * The home page's rows of photos: endless, and dragged by mouse, finger or
 * trackpad, with momentum. Built on Embla Carousel (https://www.embla-carousel.com),
 * plus its wheel plugin for two-finger swipes on trackpads.
 *
 * Without JavaScript the rows scroll sideways natively (`scroll-row`). Once a
 * row starts here it gets `data-ready`, which hands the scrolling over to Embla.
 */
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

// Settings
const OPTIONS: EmblaOptionsType = {
  loop: true, // endless: after the last photo comes the first again
  // A throw glides on and slows down, then stays where it lands. Set to
  // `false` to snap a photo to the left edge instead.
  dragFree: true,
  align: 'start', // where the first photo sits: on the left edge, like the design
  duration: 30, // how long a glide takes to settle: higher is slower (Embla's default: 25)
};
const REDUCED_DURATION = 15; // with reduced motion: a shorter glide

/** Starts every row in `root`. Returns them, so they can be stopped (`destroy()`). */
export function startCarousels(root: ParentNode): EmblaCarouselType[] {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const options = { ...OPTIONS, ...(reducedMotion && { duration: REDUCED_DURATION }) };

  return [...root.querySelectorAll<HTMLElement>('[data-carousel]')].map((viewport) => {
    // The row may have been scrolled natively before this ran: start from the left.
    viewport.scrollLeft = 0;
    viewport.setAttribute('data-ready', '');
    return EmblaCarousel(viewport, options, [WheelGesturesPlugin()]);
  });
}
