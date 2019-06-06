import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '../document-base/document-base.component';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { UserApiService } from 'src/app/services/user-api/user-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { enumKeys } from 'src/app/utils/enum-keys';
import { Roles, UpdateUserCommand } from 'src/app/models/api.model';
import { RolesTranslate } from 'src/app/utils/translate-enum/roles.translate';
import { catchError } from 'rxjs/operators';
import { Toast } from 'src/app/models/toast.model';
import { parseError } from 'src/app/utils/error-parse';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {


  userForm: FormGroup;
  roleOptions: SelectOption[];
  userId: string;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastsService,
    private userApiService: UserApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.userId = this.route.snapshot.paramMap.get('id');

    this.roleOptions = enumKeys(Roles).map(enumKey => {
      const enumVal = Roles[enumKey];
      return {
        value: enumVal,
        label: RolesTranslate[enumVal]
      };
    });

    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      role: [null, [Validators.required]],
    });


    this.userApiService.get(this.userId)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Pobieranie użytkownika nie powiodła się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);

          this.router.navigate(['..']);

          return throwError(e);
        })
      )
      .subscribe(userDto => {
        this.userForm.setValue({
          name: userDto.name,
          lastname: userDto.lastname,
          role: userDto.role,
        });
      });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      return;
    }

    const command: UpdateUserCommand = this.userForm.value;

    this.userApiService.update(this.userId, command)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Aktualizacja użytkownika nie powiodła się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);

          return throwError(e);
        })
      )
      .subscribe(() => {
        const toast: Toast = {
          message: 'Użytkownik został zaktualizowany',
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.router.navigate(['admin', 'user']);
      });
  }

  onRemoveClick() {
    this.userApiService.delete(this.userId)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Usunięcie użytkownika nie powiodła się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);

          return throwError(e);
        })
      )
      .subscribe(() => {
        const toast: Toast = {
          message: 'Użytkownik został usunięty',
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.router.navigate(['admin', 'user']);
      });
  }

}
