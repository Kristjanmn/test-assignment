import {Page, PageRequest} from "./page";

export interface CheckoutPage<T> extends Page<T> {}

/**
 * Extended version of PageRequest from page.ts with
 * new variables for filtering checkouts on backend.
 */
export interface CheckoutPageRequest extends PageRequest {
  title?: string;   // borrowed book's title
  name?: string;    // name of the person who has borrowed the book
  status?: string;  // borrowed / late / returned
}
