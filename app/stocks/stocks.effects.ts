import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../core/api.service';
import * as stocksActions from './stocks.actions';
import { getStocksState } from './stocks.reducer';
import { Stock } from './stock.model';
import * as authActions from '../auth/auth.actions';

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
        .map((searchResults: Stock[]) => new stocksActions.ReceiveSearchResults(searchResults))
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
      .map((stock: Stock) => new stocksActions.ReceiveStock(stock))
    );
  
  @Effect()
  trade = this.actions
    .ofType(stocksActions.TRADE)
    .withLatestFrom(this.store.select(getStocksState))
    .switchMap(([action, stocksState]) => this.apiService
      .post(
        '/trade',
        {
          stocktextid: stocksState.selectedIsin,
          amount: stocksState.tradeAmount * stocksState.sellBuy
        }
      )
      .map(res => res.json())
      .map(res => {
        let delayed = false;
        if (res.identifier === 'autodelay-sxnotopen') delayed = true;
        return new stocksActions.TradeSuccess({ delayed: delayed });
      })
      .catch(err => Observable.of(new stocksActions.TradeFailure(err)))
    )
  
  @Effect()
  tradeSuccess = this.actions
    .ofType(stocksActions.TRADE_SUCCESS)
    .do((action: stocksActions.TradeSuccess) => {
      if (action.payload.delayed) {
        alert('Your trade will be executed when the stock exchange opens');
        this.router.navigateByUrl('/portfolio/orders');
      } else {
        alert('Successfully traded!');
        this.router.navigateByUrl('/portfolio/positions');
      }
    })
    .map((action: stocksActions.TradeSuccess) => new authActions.LoadUser())
  
  @Effect({ dispatch: false })
  tradeFailure = this.actions
    .ofType(stocksActions.TRADE_FAILURE)
    .do((action: stocksActions.TradeFailure) => {
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
  
  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService,
    private router: Router
  ) {}
}