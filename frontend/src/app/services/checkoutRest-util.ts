import {CheckoutPageRequest} from "../models/checkoutPage";
import {HttpParams} from "@angular/common/http";

/**
 * Rest util for more advanced page request.
 */
export class CheckoutRestUtil {
  public static buildParamsFromPageRequest(filter: Partial<CheckoutPageRequest>): HttpParams {
    const {pageIndex, pageSize, sort, direction, title, name, status} = filter;
    let params = new HttpParams();
    if(pageIndex != null) params = params.set('page', String(pageIndex));
    if(pageSize != null) params = params.set('size', String(pageSize));
    if(sort != null) params = params.set('sort', sort + ',' + direction ?? '');
    if(title != null && title.trim() != '') params = params.set('title', title);
    if(name != null && name.trim() != '') params = params.set('name', name);
    if(status != null && status != 'All') params = params.set('status', status);
    return params;
  }
}
