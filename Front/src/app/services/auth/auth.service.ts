import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, distinctUntilChanged, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthApiService } from '../auth-api/auth-api.service';
import { AuthenticateCommand, Roles } from 'src/app/models/api.model';
import { clearToken, setToken } from 'src/app/utils/token-manager';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject(false);
  constructor(
    private jwtHelper: JwtHelperService,
    private authApiService: AuthApiService
  ) {
    this.authSubject.next(!this.isTokenExpire());
  }

  login(command: AuthenticateCommand) {
    return this.authApiService.authenticate(command).pipe(
      tap(response => {
        this.authorize(response.jwtToken);
      })
    );
  }

  isAuthorized(): Observable<boolean> {
    return this.authSubject.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  getRole(): Observable<Roles> {
    return this.authSubject.asObservable()
      .pipe(
        distinctUntilChanged(),
        map(() => {
          const roleStr: string = this.getDecodedToken().role;

          return Roles[roleStr];
        })
      );
  }

  isAdmin(): Observable<boolean> {
    return this.getRole()
    .pipe(
      map(role => role === Roles.Admin)
    );
  }

  getTokenExpirationDate(): Date {
    return this.jwtHelper.getTokenExpirationDate();
  }

  getDecodedToken(): any {
    return this.jwtHelper.decodeToken();
  }

  logout() {
    clearToken();
    this.authSubject.next(false);
  }

  private authorize(token: string) {
    setToken(token);
    this.authSubject.next(true);
  }

  private isTokenExpire(): boolean {
    const token = this.jwtHelper.tokenGetter();
    return this.jwtHelper.isTokenExpired(token);
  }

}
