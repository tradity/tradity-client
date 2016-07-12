import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _portfolio;
  private _transactions;

  constructor(private apiService: ApiService) { }
  
  get portfolio() {
    return this._portfolio.asObservable();
  }
  
  get transactions() {
    return this._transactions.asObservable();
  }
  
  loadPortfolio(): void {
    this.apiService.get('/depot')
    .map(res => res.json())
    .subscribe(res => console.log(res));
  }
  
  loadTransactions(): void {
    this.apiService.get('/transactions')
    .map(res => res.json())
    .subscribe(res => console.log(res));
  }

}