import { Injectable } from '@angular/core';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class FixJwtInterceptor extends JwtInterceptor {
  handleInterception(
    token: string | null,
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    let tokenIsExpired = false;

    if (!token && this.throwNoTokenError) {
      throw new Error('Nie udało się uzyskać sesji.');
    }

    if (this.skipWhenExpired) {
      tokenIsExpired = token ? this.jwtHelper.isTokenExpired(token) : true;
    }

    if (token && tokenIsExpired && this.skipWhenExpired) {
      request = request.clone();
    } else if (token) {
      request = request.clone({
        setHeaders: {
          [this.headerName]: `${this.authScheme}${token}`
        }
      });
    }
    return next.handle(request);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenGetter();
    if (
      !this.isWhitelistedDomain(request)
      || this.isBlacklistedRoute(request)) {
        return next.handle(request);
    }
    if (token instanceof Promise) {
      return from(token).pipe(mergeMap(
        (asyncToken: string | null) => {
          return this.handleInterception(asyncToken, request, next);
        }
      ));
    } else {
      return this.handleInterception(token, request, next);
    }
  }
}
