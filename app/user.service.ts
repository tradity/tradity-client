import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';

@Injectable()
export class UserService {
  private _ownUser: BehaviorSubject<any>;

  constructor(private apiService: ApiService) {
    this._ownUser = new BehaviorSubject([]);
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
        this.apiService.setAuthToken(res.key);
        return true;
      }
      return false;
    });
  }
  
  logout() {
    this.apiService.delAuthToken();
  }

  get ownUser() {
    this.loadOwnUser();
    return this._ownUser.asObservable();
  }
  
  loadOwnUser() {
    this.apiService.get('/user/$self?nohistory=true')
    .map(res => res.json())
    .subscribe(res => this._ownUser.next(res.data));
  }

  register(data: Object) {
    return this.apiService.post(
      '/register',
      data
    )
    .map(res => res.json())
    .map(res => {
      if (res.code === 200) {
        this.apiService.setAuthToken(res.key);
        return true;
      }
      return false;
    });
  }

  verifyEmail(emailVerifCode: string, uid: number) {
    return this.apiService.post('/verify-email', {
      uid: uid,
      key: emailVerifCode
    })
    .map(res => res.json());
  }
}