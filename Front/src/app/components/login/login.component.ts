import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { Toast } from 'src/app/models/toast.model';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthApiService } from 'src/app/services/auth-api/auth-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastsService,
    private authService: AuthService,
    private authApiService: AuthApiService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required]
    });


    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      const token = this.route.snapshot.queryParams.token.split(' ').join('+');

      this.authApiService.confirm({
        email,
        token
      })
        .pipe(
          catchError(e => {
            const toast: Toast = {
              message: 'Aktywacja konta nie powiodłą się!',
              type: 'danger'
            };
            this.toastService.addToast(toast);

            return throwError(e);
          })
        )
        .subscribe(() => {
          const toast: Toast = {
            message: 'Konto zostało aktywowane',
            type: 'success'
          };
          this.toastService.addToast(toast);
          this.loginForm.get('email').setValue(email);
        });
    }

  }

  onSubmit() {

    if (!this.loginForm.valid) {
      return;
    }


    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    })
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: 'Błędne dane logowania',
            type: 'danger'
          };
          this.toastService.addToast(toast);

          return e;
        })
      )
      .subscribe(response => {
        const toast: Toast = {
          message: 'Zalogowano',
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.router.navigate(['admin']);
      });

  }

}
