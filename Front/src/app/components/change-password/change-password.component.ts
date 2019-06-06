import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { AuthApiService } from 'src/app/services/auth-api/auth-api.service';
import { catchError } from 'rxjs/operators';
import { Toast } from 'src/app/models/toast.model';
import { throwError } from 'rxjs';
import { PasswordResetConfirmCommand } from 'src/app/models/api.model';
import { ActivatedRoute, Router } from '@angular/router';
import { noMachPasswordValidator } from 'src/app/utils/validators/no-match-password.validator';
import { parseError } from 'src/app/utils/error-parse';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  private email: string;
  private token: string;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastsService,
    private authApiService: AuthApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
    this.token = this.route.snapshot.queryParams.token;

    this.changePasswordForm = this.fb.group({
      password: [null, [Validators.required]],
      rePassword: [null, [Validators.required]]
    }, {
        validators: [noMachPasswordValidator]
      });
  }

  onSubmit() {
    if (!this.changePasswordForm.valid) {
      return;
    }

    const changePasswordCommand: PasswordResetConfirmCommand = {
      email: this.email,
      password: this.changePasswordForm.value.password,
      token: this.token
    };

    this.authApiService.passwordResetConfirm(changePasswordCommand)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Zmiana hasła nie powiodła się${parseError(e.error)}}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);

          return throwError(e);
        })
      )
      .subscribe(response => {
        const toast: Toast = {
          message: 'Hasło zostało zmienione',
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.router.navigate(['login']);
      });

  }
}
