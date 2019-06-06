import {
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  catchError,

} from 'rxjs/operators';
import { ToastsService } from '../services/toasts/toasts.service';
@Injectable()
export class NoPrivilegeInterceptor implements HttpInterceptor {

  constructor(private toastService: ToastsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          this.toastService.addToast({
            message: 'Brak uprawnień!',
            type: 'warning'
          });
        }
        return throwError(error);
      })
    );
  }
}
