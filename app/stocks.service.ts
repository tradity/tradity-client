import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _positions: BehaviorSubject<any>;
  private _history: BehaviorSubject<any>;

  constructor(private apiService: ApiService) { 
    this._positions = new BehaviorSubject("");
  }
  
  get positions() {
    return this._positions.asObservable();
  }
  
  get history() {
    return this._history.asObservable();
  }
  
  loadPositions(): void {
    this.apiService.get('/depot')
    .map(res => res.json())
    .subscribe(res => this._positions.next(res.data));
  }
  
  loadHistory(): void {
    this.apiService.get('/transactions')
    .map(res => res.json())
    .subscribe(res => this._history.next(res.data));
  }
  
  search(id: string) {
    return this.apiService.get('/stocks/search')
    .map(res => res.json());
  }

}