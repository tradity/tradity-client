import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ApiService } from './api.service';

@Injectable()
export class RankingService {
  
  private _ranking: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._ranking = new Subject();
  }
  
  get ranking() {
    return this._ranking.asObservable();
  }
  
  load() {
    this.apiService.get('/ranking')
    .map(res => res.json())
    .map(res => res.data.sort((a, b) => b.totalvalue - a.totalvalue))
    .subscribe(res => this._ranking.next(res));
  }

}