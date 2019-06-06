import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './components/register/register.component';
import { SignBaseComponent } from './components/sign-base/sign-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastsComponent } from './components/toasts/toasts.component';
import { environment } from 'src/environments/environment';
import { tokenGetter } from './utils/token-manager';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FixJwtInterceptor } from './interceptors/fix-jwt.interceptor';
import { DocumentAddComponent } from './components/document-add/document-add.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentBaseComponent } from './components/document-base/document-base.component';
import { DocumentEditComponent } from './components/document-edit/document-edit.component';
import { RestartPasswordComponent } from './components/restart-password/restart-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CanActiveLogged } from './guards/can-active-logged.guard';
import { CanActiveLogout } from './guards/can-active-logout.guard';
import { AdminComponent } from './components/admin/admin.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ExternalDocumentComponent } from './components/external-document/external-document.component';
import { CanActivePrivilege } from './guards/can-activate-privilage.guard';
import { CanActiveAdmin } from './guards/can-activate-admin.guard';
import { RateDocumentComponent } from './components/rate-document/rate-document.component';

let restServerPath = environment.apiHost;
restServerPath = restServerPath.slice(restServerPath.indexOf('//') + 2);

export function jwtOptionsFactory() {

  return {
    tokenGetter: () => {
      return tokenGetter();
    },
    whitelistedDomains: [
      restServerPath
    ],
    blacklistedRoutes: [
      new RegExp(`https?:\/\/${restServerPath}\/auth.*`),
      /\.\/.*/
    ]
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SignBaseComponent,
    ToastsComponent,
    DocumentListComponent,
    DocumentAddComponent,
    DocumentBaseComponent,
    DocumentEditComponent,
    RestartPasswordComponent,
    ChangePasswordComponent,
    AdminComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    ExternalDocumentComponent,
    RateDocumentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxDatatableModule,
    PdfViewerModule
  ],
  providers: [
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useFactory: jwtOptionsFactory
    },
    {

      provide: HTTP_INTERCEPTORS,
      useClass: FixJwtInterceptor,
      multi: true
    },
    CanActiveLogged,
    CanActiveLogout,
    CanActivePrivilege,
    CanActiveAdmin
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
