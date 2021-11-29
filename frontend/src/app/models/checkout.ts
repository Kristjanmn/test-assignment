import {Book} from "./book";

export interface Checkout {
  id: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowedBook: Book;
  checkoutDate: string;
  dueDate: string;
  returnedDate: string;
}
