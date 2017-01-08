import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ApiService } from './api.service';

@Injectable()
export class RankingService {
  
  private _rankingAll: Subject<any>;
  private _rankingWeekly: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._rankingAll = new Subject();
    this._rankingWeekly = new Subject();
  }
  
  get rankingAll() {
    return this._rankingAll.asObservable();
  }

  get rankingWeekly() {
    return this._rankingWeekly.asObservable();
  }
  
  loadAll() {
    this.apiService.get('/ranking')
    .map(res => res.json())
    .map(res => res.data.sort((a, b) => b.totalvalue - a.totalvalue))
    .subscribe(res => this._rankingAll.next(res));
  }

  loadWeekly() {
    this.apiService.get('/ranking?since=' + (Math.floor(Date.now() / 1000) - 604800))
    .map(res => res.json())
    .map(res => res.data.sort((a, b) => b.totalvalue - a.totalvalue))
    .subscribe(res => this._rankingWeekly.next(res))
  }

}