
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class AdminService {
  private _userlist: BehaviorSubject<any>;

  constructor(private apiService: ApiService) {
    this._userlist = new BehaviorSubject([]);
  }

  get userlist() {
    this.loadUserlist();
    return this._userlist.asObservable();
  }

  loadUserlist() {
    this.apiService.get('/users').pipe(
    map(res => res.data))
    .subscribe(res => this._userlist.next(res));
  }

  deleteGroup(gid: number) {
    return this.apiService.post('/school/null/merge/' + gid, {});
  }

  createSchool(name: string, path: string) {
    return this.apiService.post('/school', {
      schoolname: name,
      schoolpath: path
    });
  }
}