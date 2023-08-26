import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.APIurl + '/transactions-service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(
    private http: HttpClient
  ) { }

  sendPreAuth(data): Observable<any> {
    return this.http.post(baseUrl + '/transactions/client-send-money/preauth', data);
  }

  sendMoney(data): Observable<any> {
    return this.http.post(baseUrl + '/transactions/client-send-money/transaction', data);
  }

  getAllClientTransactions(id): Observable<any> {
    return this.http.get(baseUrl + '/transactions/client/0/100?clientId=' + id);
  }

  getManipulatedClientTransactions(params, id): Observable<any> {
    if(params){
      return this.http.get(baseUrl + '/transactions/all/0/100' + params);
    }
    return this.http.get(baseUrl + '/transactions/client/0/100?clientId=' + id);
  }

  cancelTransaction(data, tid, cid){
    return this.http.post(baseUrl + `/transactions/cancel-transaction/${tid}/client/${cid}`, data);
  }

}
