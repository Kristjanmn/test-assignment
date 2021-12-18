import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BookPage, BookPageRequest } from '../models/bookPage';
import { Book } from '../models/book';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookRestUtil } from './bookRest-util';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly baseUrl = environment.backendUrl + '/api/book';

  constructor(
    private http: HttpClient
  ) {}

  getBooks(filter: Partial<BookPageRequest>): Observable<BookPage<Book>> {
    const url = this.baseUrl + '/getBooks';
    const params = BookRestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<BookPage<Book>>(url, {params});
  }

  getBook(bookId: string): Observable<Book> {
    const url = this.baseUrl + '/getBook';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.get<Book>(url, {params});
  }

  createBook(book: Book): Observable<Book> {
    const url = this.baseUrl + '/createBook';
    return this.http.post<Book>(url, book);
  }

  returnBook(book: Book): Observable<void | Error> {
    const url = this.baseUrl + '/returnBook';
    return this.http.post<void>(url, book);
  }

  saveBook(book: Book): Observable<void | Error> {
    const url = this.baseUrl + '/saveBook';
    return this.http.post<void>(url, book);
  }

  deleteBook(bookId: string): Observable<void | Error> {
    const url = this.baseUrl + '/deleteBook';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.delete<void>(url, {params});
  }

}
