import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _portfolio: BehaviorSubject<any>;
  private _transactions: BehaviorSubject<any>;

  constructor(private apiService: ApiService) { 
    this._portfolio = BehaviorSubject.create();
  }
  
  get portfolio() {
    return this._portfolio.asObservable();
  }
  
  get transactions() {
    return this._transactions.asObservable();
  }
  
  loadPortfolio(): void {
    this.apiService.get('/depot')
    .map(res => res.json())
    .subscribe(res => this._portfolio.next(res.data));
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