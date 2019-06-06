import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { Roles } from '../models/api.model';
import { Toast } from '../models/toast.model';
import { ToastsService } from '../services/toasts/toasts.service';

@Injectable()
export class CanActivePrivilege implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastsService: ToastsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.getRole()
      .pipe(
        map((role: Roles) => {
          if (role !== Roles.ExternalUser) {
            return true;
          }
          const toast: Toast = {
            message: 'Dostęp tylko dla uprawnionych',
            type: 'warning'
          }
          this.toastsService.addToast(toast);
          this.router.navigate(['admin', 'external-document']);
          return false;
        })
      );
  }
}
