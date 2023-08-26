import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.APIurl + '/transactions-service';

@Injectable({
  providedIn: 'root'
})
export class ReceipientsService {

  constructor(private http: HttpClient) { }

  getAllReceipients(id): Observable<any> {
    return this.http.get(baseUrl + '/recipients/client/' + id);
  }

  getReceipientById(id): Observable<any> {
    return this.http.get(`${baseUrl}/recipients/${id}`);
  }

  createReceipient(data): Observable<any> {
    return this.http.post(baseUrl + '/recipients', data);
  }

  updateReceipientPhone(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/recipients/${id}/update-phone-number?phoneNumber=` + data, null);
  }

  updateReceipientRelation(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/recipients/${id}/update-relationship?relationship=` + data, null);
  }

}
