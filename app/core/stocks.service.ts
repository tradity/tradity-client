
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ApiService } from './api.service';
import * as stocksActions from '../stocks/stocks.actions';

@Injectable()
export class StocksService {
  
  private _positions: BehaviorSubject<any>;
  private _history: BehaviorSubject<any>;
  private _orders: BehaviorSubject<any>;
  private _popularStocks: BehaviorSubject<any>;

  constructor(private apiService: ApiService, private store: Store<any>) { 
    this._positions = new BehaviorSubject([]);
    this._history = new BehaviorSubject([]);
    this._orders = new BehaviorSubject([]);
    this._popularStocks = new BehaviorSubject([]);
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
  
  loadPositions(): void {
    this.apiService.get('/depot').pipe(
    map(res => res.json()))
    .subscribe(res => this._positions.next(res.data));
  }
  
  loadHistory(): void {
    this.apiService.get('/user/$self').pipe(
    map(res => res.json()))
  .subscribe(res => this._history.next(res.orders));
  }

  loadOrders(): void {
    this.apiService.get('/dqueries').pipe(
    map(res => res.json()))
    .subscribe(res => this._orders.next(res.data));
  }

  loadPopularStocks(): void {
    this.apiService.get('/stocks/popular').pipe(
    map(res => res.json()))
    .subscribe(res => this._popularStocks.next(res.data));
  }

  trade(isin: string, amount: number): Observable<any> {
    return this.apiService.post(
      '/trade',
      {
        stocktextid: isin,
        amount: amount
      }
    ).pipe(
    map(res => res.json()));
  }
}