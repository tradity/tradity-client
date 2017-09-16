import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../core/api.service';
import * as stocksActions from './stocks.actions';

@Injectable()
export class StocksEffects {
  @Effect()
  inputSearch = this.actions
    .ofType(stocksActions.INPUT_SEARCH)
    .switchMap((action: stocksActions.InputSearch) => {
      // don't send inputs of less than three characters to the server,
      // but cancel any previous running request
      if (action.payload.length < 3) return Observable.empty()
      return this.apiService
        .get('/stocks/search?name=' + action.payload)
        .map(res => res.json().data)
        .map(searchResults => new stocksActions.ReceiveSearchResults(searchResults))
    });

  @Effect()
  selectStock = this.actions
    .ofType(stocksActions.SELECT_STOCK)
    .map((action: stocksActions.SelectStock) => new stocksActions.LoadStock(action.payload));
  
  @Effect()
  loadStock = this.actions
    .ofType(stocksActions.LOAD_STOCK)
    .switchMap((action: stocksActions.LoadStock) => this.apiService
      .get('/stocks/search?name=' + action.payload)
      .map(res => res.json().data[0])
      .map(stock => new stocksActions.ReceiveStock(stock))
    );
  
  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService
  ) {}
}