import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { ListDto, FileDto, ListFileQuery, FileUploadCommand, FileUpdateCommand } from 'src/app/models/api.model';
import { getEndpointUrl } from 'src/app/utils/endpoint-url';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService {

  constructor(private httpClient: HttpClient) { }

  list(query: ListFileQuery) {

    let httpParams = new HttpParams({
      fromObject: {
        pageIndex: query.pageIndex.toString(),
        pageSize: query.pageSize.toString()
      }
    });

    if (query.searchBy) {
      httpParams = httpParams.append('searchBy', query.searchBy);
    }

    if (query.fileType) {
      httpParams = httpParams.append('fileType', query.fileType.toString());
    }

    if (query.fileState) {
      httpParams = httpParams.append('fileState', query.fileState.toString());
    }

    return this.httpClient.get<ListDto<FileDto>>(
      getEndpointUrl('/file/list'),
      {
        params: httpParams
      }
    );
  }

  create(command: FileUploadCommand, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('author', command.author);
    formData.append('createdAt', command.createdAt);
    formData.append('expiredAt', command.expiredAt);
    formData.append('fileType', command.fileType.toString());
    formData.append('name', command.name);

    const req = new HttpRequest(
      'POST',
      getEndpointUrl('/file'),
      formData
    );

    return this.httpClient.request(req);
  }

  download(fileId: string): Observable<Blob> {
    return this.httpClient.get(getEndpointUrl(`/file/download/${fileId}`), { responseType: 'blob' });
  }

  downloadAsBase64(fileId: string): Observable<string> {
    return this.download(fileId)
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

  get(fileId: string) {
    return this.httpClient.get<FileDto>(
      getEndpointUrl(`/file/${fileId}`)
    );
  }

  update(fileId: string, command: FileUpdateCommand) {
    return this.httpClient.put<FileDto>(
      getEndpointUrl(`/file/${fileId}`),
      command
    );
  }

  share(fileId: string){
    return this.httpClient.put<FileDto>(
      getEndpointUrl(`/file/share/${fileId}`),
      {
        callbackUrl: `${environment.frontendHost}/rate`
      }
    );
  }
}
