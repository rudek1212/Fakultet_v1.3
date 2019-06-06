import { Component, OnInit } from '@angular/core';
import { DocumentApiService } from 'src/app/services/document-api/document-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DocumentEntity } from '../document-base/document-base.component';
import { FileUpdateCommand } from 'src/app/models/api.model';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit {

  fileEntity: DocumentEntity;

  private fileId: string;

  constructor(
    private documentApiService: DocumentApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fileId = this.route.snapshot.paramMap.get('id');
    const fileDto$ = this.documentApiService.get(this.fileId);
    const fileBase64$ = this.documentApiService.downloadAsBase64(this.fileId);

    combineLatest([fileDto$, fileBase64$])
      .subscribe(([fileDto, fileBase64]) => {
        this.fileEntity = {
          author: fileDto.author,
          name: fileDto.filename,
          documentType: fileDto.fileType,
          documentState: fileDto.fileState,
          receivers: fileDto.recivers,
          createDate: fileDto.createdAt,
          expireDate: fileDto.expiredAt,
          errors: fileDto.errors,
          fileBase64,
        };
      });

  }

  onSubmit(entity) {

    const command: FileUpdateCommand = {
      author: entity.author,
      createdAt: new Date(entity.createdAt).toISOString(),
      expiredAt: new Date(entity.expiredAt).toISOString(),
      fileType: entity.fileType,
      name: entity.name,
      fileState: entity.fileState,
      shareMails: entity.receivers
    };

    this.documentApiService.update(this.fileId, command)
      .subscribe(res => {
        this.fileEntity = {
          ...this.fileEntity,
          author: res.author,
          name: res.filename,
          documentType: res.fileType,
          documentState: res.fileState,
          receivers: res.recivers,
          createDate: res.createdAt,
          expireDate: res.expiredAt,
        };
      });

  }

  onShareClick(){
    this.documentApiService.share(this.fileId)
    .pipe(
      concatMap(val => {
        return this.documentApiService.get(this.fileId)
      })
    )
    .subscribe(res => {
      this.fileEntity = {
        ...this.fileEntity,
        author: res.author,
        name: res.filename,
        documentType: res.fileType,
        documentState: res.fileState,
        receivers: res.recivers,
        createDate: res.createdAt,
        expireDate: res.expiredAt,
      };
    })
  }

}
