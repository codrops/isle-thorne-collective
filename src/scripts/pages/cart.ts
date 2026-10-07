/**
 * The cart (`src/scripts/cart.ts`), on every page: its panel is in the layout,
 * so each page brings a new one in.
 */
import { onPage } from '../../lib/interlude';
import { startCart } from '../cart';

onPage(() => true, { init: () => startCart() });
