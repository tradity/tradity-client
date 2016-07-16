import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _portfolio: Subject<any>;
  private _transactions: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._portfolio = Subject.create();
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
    .subscribe(res => this._portfolio.next(res));
  }
  
  loadTransactions(): void {
    this.apiService.get('/transactions')
    .map(res => res.json())
    .subscribe(res => console.log(res));
  }

}