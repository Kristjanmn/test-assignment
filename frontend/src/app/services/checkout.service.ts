import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
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
  getCheckout(checkoutId: string): Observable<any> {
    return this.http.get(this.baseUrl + '/get')
  }
}
