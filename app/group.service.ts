import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

@Injectable()
export class GroupService {
  private _groups: Array<BehaviorSubject<any>>;

  constructor(private apiService: ApiService) {
    this._groups = [];
  }

  getGroup(id: string): Observable<any> {
    this.loadGroup(id);
    if (!this._groups[id]) this._groups[id] = new BehaviorSubject([]);
    return this._groups[id].asObservable();
  }

  loadGroup(id: string): void {
    this.apiService.get('/school/' + id)
    .map(res => res.json().data)
    .subscribe(res => {
      if (!this._groups[id]) this._groups[id] = new BehaviorSubject([]);
      this._groups[id].next(res);
    });
  }
}