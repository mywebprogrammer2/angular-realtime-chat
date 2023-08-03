import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class GlobalRequestHandlerInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add your Bearer token retrieval logic here
    const bearerToken = localStorage.getItem('access_token')?.replaceAll('"','');

    if (bearerToken) {

       request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${bearerToken}`
        }
      });
    }

    // Clone the request and add the Bearer token to the headers

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // You can perform global response handling here
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // You can perform global error handling here
        return throwError(error);
      })
    );
  }
}
