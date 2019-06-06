import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { Toast } from 'src/app/models/toast.model';
import { AuthApiService } from 'src/app/services/auth-api/auth-api.service';
import { RegisterCommand } from 'src/app/models/api.model';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { noMachPasswordValidator } from 'src/app/utils/validators/no-match-password.validator';
import { Router } from '@angular/router';
import { parseError } from 'src/app/utils/error-parse';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastsService,
    private authApiService: AuthApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required],
      rePassword: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    }, {
        validators: [noMachPasswordValidator]
      });
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    const registerCommand: RegisterCommand = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      name: this.registerForm.value.firstName,
      lastname: this.registerForm.value.lastName,
      callbackUrl: `${environment.frontendHost}/login`
    };

    this.authApiService.register(registerCommand)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Rejestracja nie powiodła się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);

          return throwError(e);
        })
      )
      .subscribe(response => {
        const toast: Toast = {
          message: 'Na adres email został wysłany email aktywacyjny',
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.router.navigate(['/login']);
      });

  }

}
