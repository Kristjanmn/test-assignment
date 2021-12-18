import {BookPageRequest} from "../models/bookPage";
import {HttpParams} from "@angular/common/http";

/**
 * Just new class of rest-utils.ts with new
 * variables for more advanced page request.
 */
export class BookRestUtil {
  public static buildParamsFromPageRequest(filter: Partial<BookPageRequest>): HttpParams {
    const {pageIndex, pageSize, sort, direction, title, author, fromYear, toYear, status} = filter;
    let params = new HttpParams();
    if(pageIndex != null) params = params.set('page', String(pageIndex));
    if(pageSize != null) params = params.set('size', String(pageSize));
    if(sort != null) params = params.set('sort', sort + ',' + direction ?? '');
    if(title != null && title.trim() != '') params = params.set('title', title);
    if(author != null && author.trim() != '') params = params.set('author', author);
    if(fromYear != null) params = params.set('fromYear', String(fromYear));
    if(toYear != null) params = params.set('toYear', String(toYear));
    if(status != null && status != 'All') params = params.set('status', status);
    return params;
  }
}
