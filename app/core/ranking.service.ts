
import {map, zip} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class RankingService {
  
  private _rankingAll: Subject<any>;
  private _rankingWeekly: Subject<any>;
  private _rankingGroups: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._rankingAll = new Subject();
    this._rankingWeekly = new Subject();
    this._rankingGroups = new Subject();
  }
  
  get rankingAll() {
    return this._rankingAll.asObservable();
  }

  get rankingWeekly() {
    return this._rankingWeekly.asObservable();
  }

  get rankingGroups() {
    return this._rankingGroups.asObservable();
  }
  
  loadAll() {
    this.apiService.get('/ranking').pipe(
    map(res => res.json()),
    map(res => res.data.sort((a, b) => b.totalvalue - a.totalvalue).slice(0, 100)),)
    .subscribe(res => this._rankingAll.next(res));
  }

  loadWeekly() {
    this.apiService.get('/ranking?since=' + (Math.floor(Date.now() / 1000) - 604800)).pipe(
    map(res => res.json()),
    map(res => res.data.sort((a, b) => b.totalvalue - a.totalvalue).slice(0, 100)),)
    .subscribe(res => this._rankingWeekly.next(res));
  }

  loadGroups() {
    this.apiService.get('/schools').pipe(
    map(res => res.json().data),
    zip(
      this.apiService.get('/ranking').pipe(
      map(res => res.json().data)),
      (groups, users) => {
        let ret = {};
        for (let group of groups) {
          group.avgTotalValue = 0;
          group.rankingUsercount = 0;
          ret[group.path] = group;
        }
        for (let user of users) {
          if (user.schoolpath) {
            let splitPath = user.schoolpath.split('/');
            ret[user.schoolpath].avgTotalValue += user.totalvalue;
            ret[user.schoolpath].rankingUsercount++;
            // also add to parent group, if one exists
            if (splitPath.length - 1 === 2) {
              ret['/' + splitPath[1]].avgTotalValue += user.totalvalue;
              ret['/' + splitPath[1]].rankingUsercount++;
            }
          }
        }
        let retArr = Object.keys(ret).map(res => ret[res]);
        for (let group of retArr) {
          group.avgTotalValue = group.rankingUsercount ? group.avgTotalValue / group.rankingUsercount : 1000000000;
        }
        retArr.sort((a, b) => b.avgTotalValue - a.avgTotalValue)
        return retArr;
      }
    ),)
    .subscribe(res => this._rankingGroups.next(res));
  }
}