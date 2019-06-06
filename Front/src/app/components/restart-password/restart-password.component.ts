import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from 'src/app/services/auth-api/auth-api.service';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { catchError } from 'rxjs/operators';
import { Toast } from 'src/app/models/toast.model';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-restart-password',
  templateUrl: './restart-password.component.html',
  styleUrls: ['./restart-password.component.scss']
})
export class RestartPasswordComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private toastService: ToastsService
  ) { }

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (!this.resetForm.valid) {
      return;
    }

    this.authApiService.sendResetPasswordEmail(this.resetForm.value.email)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Coś poszło nie tak`,
            type: 'danger'
          };
          this.toastService.addToast(toast);

          return throwError(e);
        })
      ).subscribe(() => {

        const toast: Toast = {
          message: 'Na adres email został wysłany email z dalszymi instrukcjami',
          type: 'success'
        };
        this.toastService.addToast(toast);
      });
  }

}
