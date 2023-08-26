import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { userInfo } from './../shared/credentials';
import { environment } from './../../environments/environment';
import { StorageService } from './../shared/storage.service';

const baseUrl = environment.APIurl + '/registration';
const authUrl = environment.APIurl + '/oauth-server';
const usersUrl = environment.APIurl + '/user-manager';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService, 
    private storageService: StorageService
  ) { }

  selfRegister(data): Observable<any> {
    return this.http.post(baseUrl + '/clients/self-registration', data);
  }

  searchClient(pnum): Observable<any> {
    return this.http.get(baseUrl + '/clients/phone-number-login/' + pnum);
  }

  createAccount(data): Observable<any> {
    return this.http.post(usersUrl + '/user/create-client-account', data);
  }


  // Sign-in
  signIn(data: userInfo) {
    return this.http.post<any>(`${authUrl}/login`, data);
  }

  newSignIn(data) {
    return this.http.post<any>(`${authUrl}/client-login`, data);
  }

  getToken() {
    return this.storageService.decrypt(sessionStorage.getItem('access_token'));
  }

  getClientId() {
    return this.storageService.decrypt(sessionStorage.getItem('client_id'));
  }

  getUserDisplayName() {
    return this.storageService.decrypt(sessionStorage.getItem('display_name'));
  }

  get isLoggedIn(): boolean {
    // return true;
    
    let authToken = sessionStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {

    let removeToken = sessionStorage.removeItem('access_token');
    let removeName = sessionStorage.removeItem('display_name');
    let removeId = sessionStorage.removeItem('client_id');

    if (removeToken == null && removeName == null) {
      window.location.href = '/';
    }
  }

  resetUser(email){
    var query = '?email=' + email;
    return this.http.post<any>(`${usersUrl}/user/resetPassword` + query, null);
  }

  resetUserPassword(data) : Observable<any>{
    return this.http.post( usersUrl + '/user/savePassword', data);
  }

  changeUserPassword(data) : Observable<any>{
    return this.http.post( usersUrl + '/user/change-password', data);
  }

  changeExpiredPassword(data) : Observable<any>{
    return this.http.post( usersUrl + '/user/set-change-password', data);
  }
}
