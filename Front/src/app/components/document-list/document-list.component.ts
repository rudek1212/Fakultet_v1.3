import { Component, OnInit } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { DocumentApiService } from 'src/app/services/document-api/document-api.service';
import { ListFileQuery, FileDto, FileState, FileType } from 'src/app/models/api.model';
import { Router } from '@angular/router';
import { FileTypeTranslate } from 'src/app/utils/translate-enum/file-type.translate';
import { FileStateTranslate } from 'src/app/utils/translate-enum/file-state.translate';
import { map, debounce, debounceTime } from 'rxjs/operators';
import { SelectOption } from '../document-base/document-base.component';
import { enumKeys } from 'src/app/utils/enum-keys';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  rows: any[] = [];

  columns: TableColumn[];

  page = {
    totalElements: 100,
    pageNumber: 1,
    size: 10
  };


  fileTypeOptions: SelectOption[];
  fileStateOptions: SelectOption[];

  documentStatusCtrl: FormControl;
  documentTypeCtrl: FormControl;
  nameCtrl: FormControl;

  constructor(
    private documentApiService: DocumentApiService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.documentStatusCtrl = this.fb.control(null);
    this.documentStatusCtrl.valueChanges.subscribe(() => { this.setPage(); });

    this.documentTypeCtrl = this.fb.control(null);
    this.documentTypeCtrl.valueChanges.subscribe(() => { this.setPage(); });

    this.nameCtrl = this.fb.control(null);
    this.nameCtrl.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(() => { this.setPage(); });

    this.fileStateOptions = enumKeys(FileState).map(enumKey => {
      const enumVal = FileState[enumKey];
      return {
        value: enumVal,
        label: FileStateTranslate[enumVal]
      };
    });

    this.fileTypeOptions = enumKeys(FileType).map(enumKey => {
      const enumVal = FileType[enumKey];
      return {
        value: enumVal,
        label: FileTypeTranslate[enumVal]
      };
    });

    this.columns = [
      {
        name: 'Sygnatura',
        prop: 'filename'
      },
      {
        name: 'Typ',
        prop: 'fileType'
      },
      {
        name: 'Autor',
        prop: 'author'
      },
      {
        name: 'Data dodania',
        prop: 'createdAt',
      },
      {
        name: 'Data przedawnienia',
        prop: 'expiredAt'
      },
      {
        name: 'Status',
        prop: 'fileState'
      }
    ];

    this.setPage({ offset: 0 });
  }

  setPage(pageInfo?: any) {
    if (pageInfo) {
      this.page.pageNumber = pageInfo.offset;
    }

    const query: ListFileQuery = {
      pageSize: 20,
      pageIndex: this.page.pageNumber,
      searchBy: this.nameCtrl.value,
      fileState: this.documentStatusCtrl.value,
      fileType: this.documentTypeCtrl.value
    };

    this.documentApiService.list(query)
      .pipe(
        map(
          response => {
            const converterItems = response.items.map(item => {
              return {
                ...item,
                fileType: FileTypeTranslate[item.fileType],
                fileState: FileStateTranslate[item.fileState],
                createdAt: new Date(item.createdAt).toLocaleString(),
                expiredAt: new Date(item.expiredAt).toLocaleString(),
              };
            });

            return {
              ...response,
              items: converterItems
            };
          }
        )
      )
      .subscribe(pagedData => {
        this.page = {
          ...this.page,
          ...{
            pageNumber: pagedData.pageIndex,
            size: pagedData.pageSize,
            totalElements: pagedData.count
          }
        };
        this.rows = pagedData.items;
      });
  }

  onActivate($event: {
    type: 'keydown' | 'click' | 'dblclick'
    event
    row
    column
    value
    cellElement
    rowElement
  }) {
    if ($event.type === 'click') {
      this.onRowClick($event.row);
    }
  }

  onRowClick(row: FileDto) {
    this.router.navigate(['admin', 'document', row.id]);
  }

}
