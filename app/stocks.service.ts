import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _positions: BehaviorSubject<any>;
  private _history: BehaviorSubject<any>;
  private _orders: BehaviorSubject<any>;
  private _popularStocks: BehaviorSubject<any>;
  private _stocks: Array<BehaviorSubject<any>>;

  constructor(private apiService: ApiService) { 
    this._positions = new BehaviorSubject([]);
    this._history = new BehaviorSubject([]);
    this._orders = new BehaviorSubject([]);
    this._popularStocks = new BehaviorSubject([]);
    this._stocks = [];
  }
  
  get positions() {
    this.loadPositions();
    return this._positions.asObservable();
  }
  
  get history() {
    this.loadHistory();
    return this._history.asObservable();
  }

  get orders() {
    this.loadOrders();
    return this._orders.asObservable();
  }

  get popularStocks() {
    this.loadPopularStocks();
    return this._popularStocks.asObservable();
  }

  stock(isin: string): Observable<any> {
    this.loadStock(isin);
    if (!this._stocks[isin]) this._stocks[isin] = new BehaviorSubject([]);
    return this._stocks[isin].asObservable();
  }
  
  loadPositions(): void {
    this.apiService.get('/depot')
    .map(res => res.json())
    .subscribe(res => this._positions.next(res.data));
  }
  
  loadHistory(): void {
    this.apiService.get('/user/$self')
    .map(res => res.json())
    .subscribe(res => this._history.next(res.orders));
  }

  loadOrders(): void {
    this.apiService.get('/dqueries')
    .map(res => res.json())
    .subscribe(res => this._orders.next(res.data));
  }

  loadPopularStocks(): void {
    this.apiService.get('/stocks/popular')
    .map(res => res.json())
    .subscribe(res => this._popularStocks.next(res.data));
  }

  loadStock(isin: string): void {
    this.apiService.get('/stocks/search?name=' + isin)
    .map(res => res.json().data[0])
    .subscribe(res => {
      let id = res.stocktextid;
      if (!this._stocks[id]) this._stocks[id] = new BehaviorSubject([]);
      this._stocks[id].next(res);
    });
  }

  trade(isin: string, amount: number): Observable<any> {
    return this.apiService.post(
      '/trade',
      {
        stocktextid: isin,
        amount: amount
      }
    )
    .map(res => res.json());
  }
  
  search(id: string): Observable<any> {
    return this.apiService.get('/stocks/search?name=' + id)
    .map(res => res.json().data);
  }

}