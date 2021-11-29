import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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
  getCheckouts(): Observable<any> {
    return this.http.get(this.baseUrl + '/getCheckouts');
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
