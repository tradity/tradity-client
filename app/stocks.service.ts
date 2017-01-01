import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _positions: Subject<any>;
  private _history: Subject<any>;
  private _orders: Subject<any>;
  private _popularStocks: Subject<any>;
  private _stocks: Array<Subject<any>>;

  constructor(private apiService: ApiService) { 
    this._positions = new Subject();
    this._history = new Subject();
    this._orders = new Subject();
    this._popularStocks = new Subject();
    this._stocks = [];
  }
  
  get positions() {
    return this._positions.asObservable();
  }
  
  get history() {
    return this._history.asObservable();
  }

  get orders() {
    return this._orders.asObservable();
  }

  get popularStocks() {
    return this._popularStocks.asObservable();
  }

  stock(isin: string): Observable<any> {
    if (!this._stocks[isin]) this._stocks[isin] = new Subject();
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
      if (!this._stocks[id]) this._stocks[id] = new Subject();
      this._stocks[id].next(res);
    });
  }
  
  search(id: string) {
    return this.apiService.get('/stocks/search')
    .map(res => res.json());
  }

}