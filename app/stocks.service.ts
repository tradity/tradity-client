import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _positions: BehaviorSubject<any>;
  private _transactions: BehaviorSubject<any>;

  constructor(private apiService: ApiService) { 
    this._positions = new BehaviorSubject("");
  }
  
  get portfolio() {
    return this._positions.asObservable();
  }
  
  get transactions() {
    return this._transactions.asObservable();
  }
  
  loadPositions(): void {
    this.apiService.get('/depot')
    .map(res => res.json())
    .subscribe(res => this._positions.next(res.data));
  }
  
  loadTransactions(): void {
    this.apiService.get('/transactions')
    .map(res => res.json())
    .subscribe(res => this._transactions.next(res.data));
  }
  
  search(id: string) {
    return this.apiService.get('/stocks/search')
    .map(res => res.json());
  }

}