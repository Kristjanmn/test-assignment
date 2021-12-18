import {Page, PageRequest} from "./page";

export interface BookPage<T> extends Page<T> {}

/**
 * Extended version of PageRequest from page.ts
 * with new variables for filtering books on backend.
 */
export interface BookPageRequest extends PageRequest {
  title?: string;
  author?: string;
  fromYear: number;
  toYear: number;
  status?: string;    // available / borrowed / returned / damaged / processing
}
