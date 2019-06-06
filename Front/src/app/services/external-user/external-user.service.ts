import { Injectable } from '@angular/core';
import { ListFileQuery, ListDto, FileDto } from 'src/app/models/api.model';
import { HttpParams, HttpClient } from '@angular/common/http';
import { getEndpointUrl } from 'src/app/utils/endpoint-url';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExternalUserService {

  constructor(private httpClient: HttpClient) { }

  list(query: ListFileQuery) {

    const httpParams = new HttpParams({
      fromObject: {
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    });

    return this.httpClient.get<ListDto<FileDto>>(
      getEndpointUrl('/externalUser/list'),
      {
        params: httpParams
      }
    );
  }

  getFile(fileId: string, accessToken: string = ' ') {
    return this.httpClient.get<FileDto>(
      getEndpointUrl(`/${accessToken}/${fileId}`)
    );
  }

  downloadFile(fileId: string, accessToken: string = ' '): Observable<Blob> {
    return this.httpClient.get(getEndpointUrl(`/${accessToken}/download/${fileId}`), { responseType: 'blob' });
  }

  downloadAsBase64(fileId: string, accessToken: string = ' '): Observable<string> {
    return this.downloadFile(fileId, accessToken)
      .pipe(
        concatMap(result => new Observable<string>(subscriber => {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            subscriber.next(reader.result as string);
          }, false);
          reader.readAsDataURL(result);
        }))
      );
  }

  sign(fileId: string, accessToken: string = ' ') {
    return this.httpClient.put(
      getEndpointUrl(`/${accessToken}/sign/${fileId}`),
      {}
    );
  }

  error(fileId: string, errors: string, accessToken: string = ' ') {
    return this.httpClient.put(
      getEndpointUrl(`/${accessToken}/errors/${fileId}`),
      { errors }
    );
  }
}
