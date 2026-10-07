/**
 * Formatting shared by the pages and the cart's script.
 */
import { site } from '../config/site';

const month = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });

/** 23000 → "23,000 kr." (set in `site.currency.format`). */
export const formatPrice = (amount: number) => site.currency.format(amount);

/** A story's date as the design writes it: "2024, November". */
export const formatMonth = (date: Date) => `${date.getUTCFullYear()}, ${month.format(date)}`;

/** A cart quantity: "1 pc", "6 pc". */
export const formatQuantity = (quantity: number) => `${quantity} pc`;
