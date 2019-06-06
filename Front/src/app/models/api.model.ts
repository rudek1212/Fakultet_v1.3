export class AuthenticateCommand {
  email: string;
  password: string;
}

export class AuthenticateResponse {
  jwtToken: string;
  user: UserBasicDto;
}

export class RegisterCommand {
  email: string;
  password: string;
  name: string;
  lastname: string;
  callbackUrl: string;
}

export class PasswordResetCommand {
  public email: string;
  public callbackUrl: string;
}

export class PasswordResetConfirmCommand {
  email: string;
  token: string;
  password: string;
}

export class RegisterResponse { }

export enum FileType {
  Proposal,
  Complaint,
  Claim,
  Decision
}

export enum FileState {
  Created = 0,
  Confirmed = 1,
  Sent = 2,
  Signed = 3,
  Rejected = 4
}

export class ListFileQuery {
  public pageIndex: number;
  public pageSize: number;
  public searchBy: string;
  public fileType: FileType;
  public fileState: FileState;
}

export class ListDto<T> {
  public pageIndex: number;
  public pageSize: number;
  public count: number;
  public items: T[];
}

export class FileDto {
  id: string;
  filename: string;
  author: string;
  createdAt: string;
  expiredAt: string;
  recivers: string[];
  fileType: FileType;
  fileState: FileState;
  errors: string[];
}

export class ConfirmRegisterCommand {
  public token: string;
  public email: string;
}

export class FileUploadCommand {
  public author: string;
  public createdAt: string;
  public expiredAt: string;
  public fileType: FileType;
  public name: string;
}

export class FileUpdateCommand {
  author: string;
  createdAt: string;
  expiredAt: string;
  fileType: FileState;
  name: string;
  fileState: FileState;
  shareMails: string[];
}

export enum Roles {
  Admin,
  User,
  ExternalUser
}

export class UserBasicDto {
  id: string;
  email: string;
  name: string;
  lastname: string;
}


export class UserDto extends UserBasicDto {
  role: Roles;
}

export class ListUserQuery {
  pageIndex: number;
  pageSize: number;
  searchBy?: string;
}

export class CreateUserCommand {
  email: string;
  password: string;
  name: string;
  lastname: string;
}

export class UpdateUserCommand {
  role: Roles;
  name: string;
  lastname: string;
}
