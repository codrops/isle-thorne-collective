## Project

Isle Thorne Collective: a furniture shop template in Astro 7, with content collections and Tailwind 4. The design is the Paper file "Isle Thorne Collective" (desktop 1440 and phone 390 artboards); take values from it (spacing, sizes, colours), not from screenshots. The README explains the structure.

- Content is in `src/content/` (collections JSON, products and journal Markdown), typed by `src/content.config.ts`. Pages read it through `src/lib/shop.ts` and `src/lib/journal.ts`, not `getCollection()` directly.
- Links go through Astro's client router (`<ClientRouter />`), with page transitions from Interlude: the engine in `src/lib/interlude/` (kept as Interlude ships it), the transitions in `src/transitions/` (one per file, settings at the top; Interlude's, except `loading-curtain`, the site's own and the default: to update from Interlude, copy its engine, components and transitions over and set `carousel`'s `LINKS`, `particles`' `WORD` and `typewriter`'s `PHRASE` again), the options in `src/interlude.config.ts` (the site's settings: don't overwrite it from Interlude, add new options by hand). Bundled scripts run once per visit, not per page: code that sets up a page goes in `src/scripts/pages/`, registered with `onPage()`, looks for elements in the `main` its `init` gets (outside `<main>`: ids, or `pageElements()`), never the whole document (a still copy of the old page can be in the layer), and returns a cleanup for anything it adds to `window`, `document` or a media query. Code for every navigation listens to the `interlude:*` events. Modal dialogs close on `interlude:leave`, since they'd show above the transition. Elements fixed to the screen go in the layout's `fixed` slot (`<Fragment slot="fixed">`), outside `<main>`: transitions move `<main>`, and a fixed element inside it would move with it.
- Styles are Tailwind classes. Tokens and shared utilities (`grid-site`, `card`, `scroll-row`, `tap`) are in `src/styles/global.css`. Place content on the site grid so labels line up.
- Native HTML first: `<dialog>` for the cart and menu, `<details name>` for the product panels. Embla Carousel only for the home page's endless rows (`src/scripts/carousel.ts`); spacing between its slides is padding inside each slide, not a CSS gap, so the loop's seam keeps it.
- Smooth scrolling is Lenis (`src/scripts/smooth-scroll.ts`). Anything that scrolls on its own needs `data-lenis-prevent`; Lenis stops itself while a modal `<dialog>` is open and during page transitions.

## Conventions

- TypeScript strict, Prettier (`npm run format`, Tailwind classes sorted).
- Comment what each non-obvious step does, and why. Settings go at the top of their file, named, each with a comment.
- Accessible and mobile first: landmarks, focus, 24px touch targets, no sideways scroll at 390px.

## Checking changes

`npm run format:check`, `npm run check` and `npm run build` must pass with 0 errors and 0 warnings. There are no automated tests: check in the browser, at desktop (1440) and phone (390) sizes, with a clean console. After a change to a script or a page, also load a page fresh (it opens with the loading screen, `revealOnLoad`), follow links between pages, go back and forward, and check the page's features still work after a transition (try one that keeps a copy of the old page on screen too, like `peel`: `data-transition` on a link, or `defaultTransition`).

## Releasing

This is a free template by Codrops, designed by Elena Smirnova (README credits, `LICENSE`: MIT). Keep it static and simple: services (CMS, newsletter, checkout) are documented in the README's "Going further", not built in. The brand and everything around it (collaborators, press) are invented; never name real companies as clients or press. The brand's texts (products, collections, stories, about, shipping) follow the voice of Elena's own copy in the design: elegant and evocative, a few full sentences. The template's own texts (README, code comments, demo notes) stay plain. Keep the README current with every change.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`. Running `npm run build` or `astro check` while it runs can leave its dependency cache outdated (scripts fail to load with "504 Outdated Optimize Dep"): restart it afterwards.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
