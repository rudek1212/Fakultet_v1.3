import { Component, OnInit } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { ExternalUserService } from 'src/app/services/external-user/external-user.service';
import { Router } from '@angular/router';
import { ListFileQuery, FileDto } from 'src/app/models/api.model';
import { map } from 'rxjs/operators';
import { FileTypeTranslate } from 'src/app/utils/translate-enum/file-type.translate';
import { FileStateTranslate } from 'src/app/utils/translate-enum/file-state.translate';

@Component({
  selector: 'app-external-document',
  templateUrl: './external-document.component.html',
  styleUrls: ['./external-document.component.scss']
})
export class ExternalDocumentComponent implements OnInit {

  rows: any[] = [];

  columns: TableColumn[];

  page = {
    totalElements: 100,
    pageNumber: 1,
    size: 10
  };

  constructor(
    private externalUserService: ExternalUserService,
    private router: Router
  ) { }

  ngOnInit() {
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
      searchBy: null,
      fileState: null,
      fileType: null
    };

    this.externalUserService.list(query)
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
    this.router.navigate(['admin', 'rate', row.id]);
  }

}
