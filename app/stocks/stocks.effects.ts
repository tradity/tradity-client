
import {of as observableOf, empty as observableEmpty,  Observable } from 'rxjs';

import {map, withLatestFrom, switchMap, tap, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApiService } from '../core/api.service';
import * as stocksActions from './stocks.actions';
import { getStocksState } from './stocks.reducer';
import { Stock } from './stock.model';
import * as authActions from '../auth/auth.actions';

@Injectable()
export class StocksEffects {
  @Effect()
  inputSearch = this.actions.pipe(
    ofType(stocksActions.INPUT_SEARCH),
    switchMap((action: stocksActions.InputSearch) => {
      // don't send inputs of less than three characters to the server,
      // but cancel any previous running request
      if (action.payload.length < 3) return observableEmpty()
      return this.apiService
        .get('/stocks/search?name=' + action.payload).pipe(
        map(res => res.data),
        map((searchResults: Stock[]) => new stocksActions.ReceiveSearchResults(searchResults)),
        catchError(err => observableOf(new stocksActions.ReceiveSearchResults([]))),)
    })
  );

  @Effect()
  selectStock = this.actions.pipe(
    ofType(stocksActions.SELECT_STOCK),
    map((action: stocksActions.SelectStock) => new stocksActions.LoadStock(action.payload))
  );
  
  @Effect()
  loadStock = this.actions.pipe(
    ofType(stocksActions.LOAD_STOCK),
    switchMap((action: stocksActions.LoadStock) => this.apiService
      .get('/stocks/search?name=' + action.payload).pipe(
      map(res => res.data[0]),
      map((stock: Stock) => new stocksActions.ReceiveStock(stock)),)
    )
  );
  
  @Effect()
  trade = this.actions.pipe(
    ofType(stocksActions.TRADE),
    withLatestFrom(this.store.select(getStocksState)),
    switchMap(([action, stocksState]) => this.apiService
      .post(
        '/trade',
        {
          stocktextid: stocksState.selectedIsin,
          amount: stocksState.tradeAmount * stocksState.sellBuy
        }
      ).pipe(
      map(res => {
        let delayed = false;
        if (res.identifier === 'autodelay-sxnotopen') delayed = true;
        return new stocksActions.TradeSuccess({ delayed: delayed });
      }),
      catchError(err => observableOf(new stocksActions.TradeFailure(err.identifier))),)
    )
  );
  
  @Effect()
  tradeSuccess = this.actions.pipe(
    ofType(stocksActions.TRADE_SUCCESS),
    tap((action: stocksActions.TradeSuccess) => {
      if (action.payload.delayed) {
        alert('Your trade will be executed when the stock exchange opens');
        this.router.navigateByUrl('/portfolio/orders');
      } else {
        alert('Successfully traded!');
        this.router.navigateByUrl('/portfolio/positions');
      }
    }),
    map((action: stocksActions.TradeSuccess) => new authActions.LoadUser())
  );
  
  @Effect({ dispatch: false })
  tradeFailure = this.actions.pipe(
    ofType(stocksActions.TRADE_FAILURE),
    tap((action: stocksActions.TradeFailure) => {
      switch (action.payload) {
        case 'out-of-money':
          alert('You do not have enough leftover money for this trade!');
          break;
        case 'single-paper-share-exceeded':
          alert('Only 50% of your assets may consist of a single stock!');
          break;
        case 'not-enough-stocks':
          alert('Not enough stocks!');
          break;
        case 'over-pieces-limit':
          alert('Unfortunately, your trade exceeds the maximum tradable amount of this stock');
          break;
        case 'stock-not-found':
          alert('This stock could not be found!');
          break;
      }
    })
  );
  
  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService,
    private router: Router
  ) {}
}