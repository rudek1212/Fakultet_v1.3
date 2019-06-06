import { Component, OnInit } from '@angular/core';
import { FileUploadCommand } from 'src/app/models/api.model';
import { DocumentApiService } from 'src/app/services/document-api/document-api.service';
import { HttpEventType } from '@angular/common/http';
import { Toast } from 'src/app/models/toast.model';
import { ToastsService } from 'src/app/services/toasts/toasts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-add',
  templateUrl: './document-add.component.html',
  styleUrls: ['./document-add.component.scss']
})
export class DocumentAddComponent implements OnInit {

  constructor(
    private documentApiService: DocumentApiService,
    private toastService: ToastsService,
    private router: Router
  ) { }

  ngOnInit() { }

  onSubmit(entity) {

    const command: FileUploadCommand = {
      author: entity.author,
      createdAt: new Date(entity.createdAt).toISOString(),
      expiredAt: new Date(entity.expiredAt).toISOString(),
      fileType: entity.fileType,
      name: entity.name
    };

    this.documentApiService.create(command, entity.file)
      .subscribe(response => {
        if (response.type === HttpEventType.Response) {
          this.router.navigate(['..']);
        }
      });
  }

}
