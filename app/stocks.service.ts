import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ApiService } from './api.service';

@Injectable()
export class StocksService {
  
  private _positions: Subject<any>;
  private _history: Subject<any>;
  private _orders: Subject<any>;
  private _popularStocks: Subject<any>;

  constructor(private apiService: ApiService) { 
    this._positions = new Subject();
    this._history = new Subject();
    this._orders = new Subject();
    this._popularStocks = new Subject();
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
  
  search(id: string) {
    return this.apiService.get('/stocks/search')
    .map(res => res.json());
  }

}