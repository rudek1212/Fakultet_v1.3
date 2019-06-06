import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { isEmpty } from 'lodash';

export const noMachPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const passwordCtrl = control.get('password');
  const rePasswordCtrl = control.get('rePassword');

  if (!(passwordCtrl.touched && rePasswordCtrl.touched)) {
    return null;
  }

  const password = passwordCtrl.value;
  const rePassword = rePasswordCtrl.value;

  return !(isEmpty(password) || isEmpty(rePassword)) && password !== rePassword ? { noMachPassword: true } : null;
};