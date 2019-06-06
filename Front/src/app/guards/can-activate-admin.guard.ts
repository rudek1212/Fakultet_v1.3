import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { Roles } from '../models/api.model';
import { ToastsService } from '../services/toasts/toasts.service';
import { Toast } from '../models/toast.model';

@Injectable()
export class CanActiveAdmin implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastsService: ToastsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.isAdmin()
      .pipe(
        map(isAdm => {
          if (isAdm) {
            return true;
          }
          const toast: Toast = {
            message: 'Dostęp tylko dla administratora',
            type: 'warning'
          }
          this.toastsService.addToast(toast);
          this.router.navigate(['admin', 'document']);
          return false;
        })
      );
  }
}
