// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Your production URL: used for canonical links, Open Graph and the sitemap.
  site: 'https://example.com',
  // Links between pages go through Astro's client router, with a page
  // transition. Prefetching on hover (or focus) fetches the next page early,
  // so it's often ready before the transition has covered the screen.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [sitemap()],
  // Self-hosted from the installed Fontsource package: the Latin files only
  // (add more `src` files for other alphabets). Astro preloads the upright
  // file (`<Font preload>` in the layout) and adds a fallback font with
  // matching metrics, so the text doesn't shift when it arrives.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Instrument Sans',
      cssVariable: '--font-instrument-sans',
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2',
            ],
            weight: '400 700',
            style: 'normal',
          },
          {
            src: [
              '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-italic.woff2',
            ],
            weight: '400 700',
            style: 'italic',
          },
        ],
      },
    },
  ],
  // The styles are small (about 5 KB compressed): inlined in each page, they
  // don't hold back the first paint with a request of their own.
  build: { inlineStylesheets: 'always' },
  // The dev toolbar covers the bottom of the page, where the product page has
  // its buttons.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // three.js (its WebGPU build, ~900 kB minified, ~240 kB compressed) is
    // bigger than Vite's 500 kB warning, but only the WebGL page transitions
    // load it, when a link that uses one is about to be clicked.
    build: { chunkSizeWarningLimit: 1000 },
    // In development, bundles three.js up front, so the first WebGL page
    // transition doesn't make Vite reload the page.
    optimizeDeps: { include: ['three/webgpu', 'three/tsl'] },
  },
});
