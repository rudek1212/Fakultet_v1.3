import { Component, OnInit } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { UserApiService } from 'src/app/services/user-api/user-api.service';
import { Router } from '@angular/router';
import { ListUserQuery, UserDto } from 'src/app/models/api.model';
import { map } from 'rxjs/operators';
import { RolesTranslate } from 'src/app/utils/translate-enum/roles.translate';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {


  rows: any[] = [];

  columns: TableColumn[];

  page = {
    totalElements: 100,
    pageNumber: 1,
    size: 10
  };

  constructor(
    private userApiService: UserApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.columns = [
      {
        name: 'Imie',
        prop: 'name'
      },
      {
        name: 'Nazwisko',
        prop: 'lastname'
      },
      {
        name: 'email',
        prop: 'email'
      },
      {
        name: 'Rola',
        prop: 'role',
      }
    ];

    this.setPage({ offset: 0 });
  }

  setPage(pageInfo?: any) {
    if (pageInfo) {
      this.page.pageNumber = pageInfo.offset;
    }

    const query: ListUserQuery = {
      pageSize: 20,
      pageIndex: this.page.pageNumber
    };

    this.userApiService.list(query)
      .pipe(
        map(
          response => {
            const converterItems = response.items.map(item => {
              return {
                ...item,
                role: RolesTranslate[item.role]
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

  onRowClick(row: UserDto) {
    this.router.navigate(['admin', 'user', row.id]);
  }

}
