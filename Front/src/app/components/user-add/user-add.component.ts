import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '../document-base/document-base.component';
import { enumKeys } from 'src/app/utils/enum-keys';
import { Roles, CreateUserCommand } from 'src/app/models/api.model';
import { RolesTranslate } from 'src/app/utils/translate-enum/roles.translate';
import { UserApiService } from 'src/app/services/user-api/user-api.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Toast } from 'src/app/models/toast.model';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { throwError } from 'rxjs';
import { parseError } from 'src/app/utils/error-parse';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  userForm: FormGroup;
  roleOptions: SelectOption[];

  constructor(
    private fb: FormBuilder,
    private toastService: ToastsService,
    private userApiService: UserApiService,
    private router: Router
  ) { }

  ngOnInit() {

    this.roleOptions = enumKeys(Roles).map(enumKey => {
      const enumVal = Roles[enumKey];
      return {
        value: enumVal,
        label: RolesTranslate[enumVal]
      };
    });

    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      role: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      return;
    }

    const command: CreateUserCommand = this.userForm.value;

    // this.userApiService.create(command)
    //   .pipe(
    //     catchError(e => {
    //       const toast: Toast = {
    //         message: `Dodawanie użytkownika nie powiodła się${parseError(e.error)}`,
    //         type: 'danger'
    //       };
    //       this.toastService.addToast(toast);

    //       return throwError(e);
    //     })
    //   )
    //   .subscribe(() => {
    //     const toast: Toast = {
    //       message: 'Użytkownik został dodany',
    //       type: 'success'
    //     };
    //     this.toastService.addToast(toast);
    //     this.router.navigate(['admin', 'user']);
    //   });
  }



}
