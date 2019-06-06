import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isNil } from 'lodash';
import { ExternalUserService } from 'src/app/services/external-user/external-user.service';
import { DocumentApiService } from 'src/app/services/document-api/document-api.service';
import { Observable, combineLatest, throwError } from 'rxjs';
import { DocumentEntity } from '../document-base/document-base.component';
import { FileDto } from 'src/app/models/api.model';
import { map, catchError, take } from 'rxjs/operators';
import { Toast } from 'src/app/models/toast.model';
import { parseError } from 'src/app/utils/error-parse';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { FileTypeTranslate } from 'src/app/utils/translate-enum/file-type.translate';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-rate-document',
  templateUrl: './rate-document.component.html',
  styleUrls: ['./rate-document.component.scss']
})
export class RateDocumentComponent implements OnInit {


  fileEntity: DocumentEntity;

  errorCtr: FormControl;

  fileTypeTranslate = FileTypeTranslate;

  private email: string;
  private accessToken: string;
  private fileId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private externalUserService: ExternalUserService,
    private toastService: ToastsService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.errorCtr = this.fb.control(null);

    this.fileId = this.route.snapshot.paramMap.get('fileId');
    this.email = this.route.snapshot.paramMap.get('email');

    this.accessToken = this.route.snapshot.queryParams.fileAccessToken;

    this.getFileEntity()
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Pobieranie dokumentu nie powiodło się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);
          this.navigateAfterAction();

          return throwError(e);
        })
      )
      .subscribe(fileEntity => this.fileEntity = fileEntity);

  }

  onSignClick() {
    this.externalUserService.sign(this.fileId, this.accessToken)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Podpisywanie dokumentu nie powiodło się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);
          this.navigateAfterAction();

          return throwError(e);
        })
      ).subscribe(result => {
        const toast: Toast = {
          message: `Dokument został podpisany`,
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.navigateAfterAction();
      });
  }

  onErrorClick() {
    this.externalUserService.error(this.fileId, this.errorCtr.value, this.accessToken)
      .pipe(
        catchError(e => {
          const toast: Toast = {
            message: `Zgłoszenie błędu dokumentu nie powiodło się${parseError(e.error)}`,
            type: 'danger'
          };
          this.toastService.addToast(toast);
          this.navigateAfterAction();

          return throwError(e);
        })
      ).subscribe(result => {
        const toast: Toast = {
          message: `Zastrzeżenie zostało zgłoszone`,
          type: 'success'
        };
        this.toastService.addToast(toast);
        this.navigateAfterAction();
      });
  }

  private isExternalUser(): Observable<boolean> {
    return this.authService.isAuthorized().pipe(map(val => !val), take(1));
  }

  private navigateAfterAction() {
    this.isExternalUser()
      .subscribe(isExternalUser => {
        if (isExternalUser) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['admin', 'external-document']);
        }
      })

  }

  private getFileEntity(): Observable<DocumentEntity> {
    let fileDto$: Observable<FileDto>;
    let fileBase64$: Observable<string>;
    fileDto$ = this.externalUserService.getFile(this.fileId, this.accessToken);
    fileBase64$ = this.externalUserService.downloadAsBase64(this.fileId, this.accessToken);


    return combineLatest([fileDto$, fileBase64$])
      .pipe(
        map(([fileDto, fileBase64]) => {
          return {
            author: fileDto.author,
            name: fileDto.filename,
            documentType: fileDto.fileType,
            createDate: new Date(fileDto.createdAt).toLocaleString(),
            expireDate: new Date(fileDto.expiredAt).toLocaleString(),
            errors: fileDto.errors,
            fileBase64,
          };
        })
      )
  }

}
