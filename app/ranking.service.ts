import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ApiService } from './api.service';

@Injectable()
export class RankingService {
  
  private _ranking: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._ranking = Subject.create();
  }
  
  get ranking() {
    return this._ranking.asObservable();
  }
  
  load() {
    this.apiService.get('/ranking')
    .map(res => res.json())
    .subscribe(res => this._ranking.next(res.data));
  }

}