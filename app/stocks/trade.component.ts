import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { StocksService } from '../core/stocks.service';
import { GameComponent } from '../game/game.component';
import * as stocksActions from './stocks.actions';
import { Stock } from './stock.model';
import { getSelectedStock, getSellBuy, getTradeAmount, getTradeValue, SellBuy } from './stocks.reducer';

@Component({
  moduleId: module.id,
  selector: 'tradity-trade',
  templateUrl: 'trade.component.html',
  styleUrls: ['trade.component.css']
})
export class TradeComponent implements OnDestroy {
  private stockSubscription: Subscription;
  stock: Stock;
  Buy = SellBuy.Buy;
  Sell = SellBuy.Sell;
  sellBuySub: Subscription;
  sellBuy: SellBuy;
  amount: Observable<number>;
  value: Observable<number>;

  constructor(private route: ActivatedRoute, private stocksService: StocksService, private gameComponent: GameComponent, private router: Router, private store: Store<any>) {
    this.gameComponent.heading2 = 'Trade';
    this.sellBuySub = this.store.select(getSellBuy).subscribe(sellBuy => this.sellBuy = sellBuy);
    this.amount = this.store.select(getTradeAmount);
    this.value = this.store.select(getTradeValue);
    this.stockSubscription = this.route.params
      .do((params: Params) => this.store.dispatch(new stocksActions.SelectStock(params['isin'])))
      .switchMap((params: Params) => this.store.select(getSelectedStock))
      .subscribe((stock: Stock) => {
        this.stock = stock;
        this.gameComponent.heading1 = stock.name;
      });
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
    this.sellBuySub.unsubscribe();
  }

  inputSellBuy(sellBuy: SellBuy) {
    this.store.dispatch(new stocksActions.InputSellBuy(sellBuy));
  }

  inputAmount(amount: number) {
    this.store.dispatch(new stocksActions.InputTradeAmount(amount));
  }

  inputValue(value: number) {
    this.store.dispatch(new stocksActions.InputTradeValue(value));
  }

  trade() {
    this.store.dispatch(new stocksActions.Trade());
  }
}