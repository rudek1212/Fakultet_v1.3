import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { Toast } from '../models/toast.model';
import { ToastsService } from '../services/toasts/toasts.service';

@Injectable()
export class CanActiveLogged implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastsService: ToastsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.isAuthorized()
      .pipe(
        map(isLogged => {
          if (!isLogged) {
            this.router.navigate(['login']);
            const toast: Toast = {
              message: 'Dostęp tylko dla zalogowanych',
              type: 'warning'
            }
            this.toastsService.addToast(toast);
            
            return false;
          }
          return true;
        })
      );
  }

}
