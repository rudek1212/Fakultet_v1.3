import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getEndpointUrl } from 'src/app/utils/endpoint-url';
import {
  AuthenticateResponse,
  AuthenticateCommand,
  RegisterCommand,
  RegisterResponse,
  ConfirmRegisterCommand,
  PasswordResetCommand,
  PasswordResetConfirmCommand
} from 'src/app/models/api.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private httpClient: HttpClient) { }

  authenticate(data: AuthenticateCommand) {
    return this.httpClient.post<AuthenticateResponse>(
      getEndpointUrl('/Auth/authenticate'),
      data
    );
  }

  register(data: RegisterCommand) {
    return this.httpClient.post<RegisterResponse>(
      getEndpointUrl('/Auth/register'),
      data
    );
  }

  confirm(data: ConfirmRegisterCommand) {
    return this.httpClient.post<RegisterResponse>(
      getEndpointUrl('/Auth/confirm'),
      data
    );
  }

  sendResetPasswordEmail(email: string) {
    const command: PasswordResetCommand = {
      email,
      callbackUrl: `${environment.frontendHost}/change-password`
    };

    return this.httpClient.post(getEndpointUrl('/Auth/passwordReset'),
      command
    );
  }

  passwordResetConfirm(command: PasswordResetConfirmCommand) {
    return this.httpClient.post(getEndpointUrl('/Auth/passwordResetConfirm'),
      command
    );
  }
}
