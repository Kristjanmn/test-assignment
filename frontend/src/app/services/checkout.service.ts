import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page, PageRequest} from "../models/page";
import {RestUtil} from "./rest-util";
import {Checkout} from "../models/checkout";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly baseUrl = environment.backendUrl + '/api/checkout';

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Get all checkouts.
   */
  getCheckouts(filter: Partial<PageRequest>): Observable<Page<Checkout>> {
    const url = this.baseUrl + '/getCheckouts';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Checkout>>(url, {params});
  }

  /**
   * Get a single checkout by ID.
   *
   * @param checkoutId
   */
  getCheckout(checkoutId: string): Observable<Checkout> {
    const url = this.baseUrl + '/getCheckout';
    const params = new HttpParams().set('checkOutId', checkoutId);
    return this.http.get<Checkout>(url, {params});
  }

  getCheckoutByBookId(bookId: string): Observable<Checkout> {
    const url = this.baseUrl + '/getCheckoutByBookId';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.get<Checkout>(url, {params});
  }

  createCheckout(bookId: string, firstName: string, lastName: string, dueDate: string): Observable<Checkout> {
    const url = this.baseUrl + '/createCheckout';
    const params = new HttpParams()
      .set('bookId', bookId)
      .set('firstName', firstName)
      .set('lastName', lastName)
      .set('dueDate', dueDate);
    return this.http.get<Checkout>(url, {params});
  }

  saveCheckout(checkout: Checkout): Observable<void | Error> {
    const url = this.baseUrl + '/checkout';
    return this.http.post<void>(url, checkout);
  }

  isBookLate(checkout: Checkout): boolean {
    return new Date() > new Date(checkout.dueDate);
  }

  isBookReturned(checkout: Checkout): boolean {
    if(checkout.returnedDate == null || checkout.returnedDate.trim() == "") return false;
    return true;
  }

  isLateReturn(checkout: Checkout): boolean {
    return new Date() > new Date(checkout.returnedDate);
  }
}
