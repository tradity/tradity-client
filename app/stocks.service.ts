import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _positions: Subject<any>;
  private _history: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._positions = new Subject();
    this._history = new Subject();
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
    this.apiService.get('/user/$self')
    .map(res => res.json())
    .subscribe(res => this._history.next(res.data));
  }
  
  search(id: string) {
    return this.apiService.get('/stocks/search')
    .map(res => res.json());
  }

}