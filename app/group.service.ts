import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

@Injectable()
export class GroupService {
  private _groups: Array<BehaviorSubject<any>>;
  private _groupList: BehaviorSubject<any>;

  constructor(private apiService: ApiService) {
    this._groups = [];
    this._groupList = new BehaviorSubject([]);
  }

  get groupList(): Observable<any> {
    this.loadGroups();
    return this._groupList.asObservable();
  }

  getGroup(id: string): Observable<any> {
    this.loadGroup(id);
    if (!this._groups[id]) this._groups[id] = new BehaviorSubject([]);
    return this._groups[id].asObservable();
  }

  loadGroup(id: string): void {
    this.apiService.get('/school/' + id)
    .map(res => res.json().data)
    .zip(
      this.apiService.get('/ranking?schoolid=' + id)
      .map(res => res.json())
      .map(res => res.data.sort((a, b) => b.totalvalue - a.totalvalue)),
      (res1, res2) => {
        res1["ranking"] = res2;

        let totalValueSum = 0;
        for (let user of res1.ranking) totalValueSum += user.totalvalue;
        res1["avgtotalvalue"] = totalValueSum / res1.ranking.length;

        return res1;
      }
    )
    .subscribe(res => {
      if (!this._groups[id]) this._groups[id] = new BehaviorSubject([]);
      this._groups[id].next(res);
    });
  }

  loadGroups() {
    this.apiService.get('/schools')
    .map(res => res.json().data)
    .subscribe(res => this._groupList.next(res));
  }

  getSubGroups(path: string): Observable<any> {
    return this.apiService.get('/schools?parentPath=' + path)
           .map(res => res.json().data)
  }
}