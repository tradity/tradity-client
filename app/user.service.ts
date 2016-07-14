import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

@Injectable()
export class UserService {

  constructor(private apiService: ApiService) { 
    if (localStorage.getItem('authorizationToken')) {
      this.apiService.setAuthToken(localStorage.getItem('authorizationToken'));
    }
  }
  
  login(username: string, password: string, stayloggedin: boolean): Observable<Boolean> {
    return this.apiService.post(
      '/login',
      {
        name: username,
        pw: password,
        stayloggedin: stayloggedin
      }
    )
    .map(res => res.json())
    .map(res => {
      if (res.code === 200) {
        localStorage.setItem('authorizationToken', res.key);
        this.apiService.setAuthToken(res.key);
        this.getUser();
        return true;
      }
      return false;
    });
  }
  
  getUser() {
    this.apiService.get('/user/$self')
    .map(res => res.json())
    .subscribe(res => console.log(res));
  }
}