import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import { ApiService } from './api.service';

@Injectable()
export class UserService {
  
  private test;

  constructor(private apiService: ApiService) { }
  
  login(username: string, password: string, stayloggedin: boolean): boolean {
    let ret = false;
    this.apiService.post(
      '/login',
      {
        name: username,
        pw: password,
        stayloggedin: stayloggedin
      }
    )
    .map(res => res.json())
    .subscribe(res => {
      if (res.code === 200) {
        ret = true;
        this.apiService.setAuthToken(res.)
      }
    });
    return ret;
  }
}