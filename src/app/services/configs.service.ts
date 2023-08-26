import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.APIurl + '/system-configs';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  constructor(
    private http: HttpClient
  ) { }

  // countries
  getAllCountries(): Observable<any> {
    return this.http.get(baseUrl + '/countries/all');
  }

  getAllApprovedCountries(): Observable<any> {
    return this.http.get(baseUrl + '/countries/all/approved');
  }

  getCountryById(id): Observable<any> {
    return this.http.get(baseUrl + '/countries/' + id);
  } 

  // convert Currencies
  convertCurrencies(data): Observable<any> {
    return this.http.post(baseUrl + '/exchange-rates/convert', data);
  }

  convertCurrenciesWithFees(data): Observable<any> {
    return this.http.post(baseUrl + '/exchange-rates/convert-with-fees', data);
  }

  newConvertCurrenciesCalculations(data): Observable<any> {
    return this.http.post(baseUrl + '/exchange-rates/calculate', data);
  }

  // get currencies
  getAllCurrencies(): Observable<any> {
    return this.http.get(baseUrl + '/currencies/all');
  }

  getAllApprovedCurrencies(): Observable<any> {
    return this.http.get(baseUrl + '/currencies/all');
  }

}
