/**
 * The site's own words and settings, in one place. Product, collection and
 * story content lives in `src/content/` instead. No imports here: the
 * browser's scripts (cart, newsletter) read this file too.
 */
export const site = {
  name: 'Isle Thorne Collective',
  tagline: 'Furniture & Interior Collections',
  /** The year the studio was founded. */
  since: 1991,
  /** The home page's headline, over the first photo. */
  headline: 'Sustainable Design, Uncompromised Quality',
  /** Used when a page has no description of its own (search results, sharing). */
  description:
    'Bespoke furniture since 1991, merging timeless artistry with modern sensibility: lounge seats, lamps, coffee tables and armchairs in steel, leather, glass and oak.',
  /** The main navigation, in this order. */
  nav: [
    { label: 'Shop', href: '/shop/' },
    { label: 'About', href: '/about/' },
    { label: 'Journal', href: '/journal/' },
  ],

  /** The footer's social link. Replace the URL with your own account. */
  social: { label: '@itc.furniture', href: 'https://www.instagram.com/' },

  /**
   * "Subscribe to Newsletter" opens a small form. To collect addresses, set
   * `action` to your email provider's form address (most give one, such as
   * Buttondown, Mailchimp or Kit) and `field` to the name it expects for the
   * address. Left empty, the form says it's a demo instead of sending.
   */
  newsletter: { action: '', field: 'email' },

  /** Prices are whole numbers in this currency. */
  currency: {
    /** ISO 4217 code, for search engines (structured data on product pages). */
    code: 'DKK',
    /**
     * How a price is written: the design's "23,000 kr.". For another currency
     * or country, let the browser format it, e.g. euros in Germany ("23.000 €"):
     * `(amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)`
     */
    format: (amount: number) => `${amount.toLocaleString('en-US')} kr.`,
  },

  /** The product pages' "Shipping" panel. */
  shipping:
    'Every piece is made to order and ships within 6 to 8 weeks, fully assembled and carefully insured. Delivery within Denmark is complimentary; elsewhere in Europe it is quoted at checkout. Our white-glove service places each piece in your home and takes all packaging away.',

  /** What the demo says where a real shop would send something. */
  demo: {
    checkout: 'This is a demo shop: checkout isn’t part of it.',
    newsletter: 'This is a demo: the address wasn’t sent anywhere.',
  },
} as const;
