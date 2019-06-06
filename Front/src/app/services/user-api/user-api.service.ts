import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { getEndpointUrl } from 'src/app/utils/endpoint-url';
import { ListUserQuery, ListDto, UserDto, CreateUserCommand, UpdateUserCommand } from 'src/app/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private httpClient: HttpClient) { }

  list(query: ListUserQuery) {

    const httpParams = new HttpParams({
      fromObject: {
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    });

    return this.httpClient.get<ListDto<UserDto>>(
      getEndpointUrl('/user/list'),
      {
        params: httpParams
      }
    );
  }

  get(userId: string) {
    return this.httpClient.get<UserDto>(
      getEndpointUrl(`/user/${userId}`)
    );
  }

  update(userId: string, command: UpdateUserCommand) {
    return this.httpClient.put<UserDto>(
      getEndpointUrl(`/user/${userId}`),
      command
    );
  }

  delete(userId: string) {
    return this.httpClient.delete(
      getEndpointUrl(`/user/${userId}`)
    );
  }
}
