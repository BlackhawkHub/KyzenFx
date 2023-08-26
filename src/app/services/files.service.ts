import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.APIurl + '/file-storage/files';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private http: HttpClient
  ) { }

  uploadFile(fdata): Observable<any>{
    return this.http.post(baseUrl + '/upload', fdata);
  }

  updateFile(fdata): Observable<any>{
    return this.http.post(baseUrl + '/update', fdata);
  }

  downloadFile(fname): Observable<any>{
    return this.http.get(baseUrl + '/download/' + fname);
  }

  uploadDocument(file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    const uploadUrl = `${baseUrl}/upload`;

    formData.append('file', file);

    const uploadRequest = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
      // responseType: 'json' 
    });

    return this.http.request(uploadRequest);
  }
}
