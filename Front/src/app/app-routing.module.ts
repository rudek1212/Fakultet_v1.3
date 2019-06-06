import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentAddComponent } from './components/document-add/document-add.component';
import { DocumentEditComponent } from './components/document-edit/document-edit.component';
import { RestartPasswordComponent } from './components/restart-password/restart-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CanActiveLogged } from './guards/can-active-logged.guard';
import { CanActiveLogout } from './guards/can-active-logout.guard';
import { AdminComponent } from './components/admin/admin.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ExternalDocumentComponent } from './components/external-document/external-document.component';
import { CanActivePrivilege } from './guards/can-activate-privilage.guard';
import { CanActiveAdmin } from './guards/can-activate-admin.guard';
import { RateDocumentComponent } from './components/rate-document/rate-document.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [CanActiveLogout]
  },
  {
    path: 'login/:email',
    component: LoginComponent,
    canActivate: [CanActiveLogout]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [CanActiveLogout]
  },
  {
    path: 'restart-password',
    component: RestartPasswordComponent,
    canActivate: [CanActiveLogout]
  },
  {
    path: 'change-password/:email',
    component: ChangePasswordComponent,
    canActivate: [CanActiveLogout]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [CanActiveLogged],
    children: [
      {
        path: 'document',
        canActivate: [CanActivePrivilege],
        children: [
          {
            path: '',
            component: DocumentListComponent,
            pathMatch: 'full',
          },
          {
            path: 'add',
            component: DocumentAddComponent,
          },
          {
            path: ':id',
            component: DocumentEditComponent,
          },
        ]
      },
      {
        path: 'user',
        canActivate: [CanActiveAdmin],
        children: [
          {
            path: '',
            component: UserListComponent,
            pathMatch: 'full',
          },
          {
            path: ':id',
            component: UserEditComponent,
          },
        ]
      },
      {
        path: 'external-document',
        component: ExternalDocumentComponent,
      },
      {
        path: 'rate/:fileId',
        component: RateDocumentComponent
      },
      {
        path: '',
        redirectTo: 'document',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'rate/:email/shared/:fileId',
    component: RateDocumentComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
