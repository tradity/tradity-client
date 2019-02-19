
import {switchMap, tap} from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';
import * as stocksActions from './stocks.actions';
import { Stock } from './stock.model';
import { getSelectedStock, getSellBuy, getTradeAmount, getTradeValue, getTradeFee, SellBuy } from './stocks.reducer';
import { getUser } from '../auth/auth.reducer';
import { User } from '../auth/user.model';
import * as authActions from '../auth/auth.actions';

@Component({
  moduleId: module.id,
  selector: 'tradity-trade',
  templateUrl: 'trade.component.html',
  styleUrls: ['trade.component.css']
})
export class TradeComponent implements OnDestroy {
  private stockSubscription: Subscription;
  stock: Stock;
  private userSub: Subscription;
  user: User;
  Buy = SellBuy.Buy;
  Sell = SellBuy.Sell;
  sellBuySub: Subscription;
  sellBuy: SellBuy;
  amount: Observable<number>;
  value: Observable<number>;
  fee: Observable<number>;

  constructor(private route: ActivatedRoute, private stocksService: StocksService, private appComponent: AppComponent, private router: Router, private store: Store<any>) {
    this.appComponent.heading2 = 'Trade';
    this.sellBuySub = this.store.select(getSellBuy).subscribe(sellBuy => this.sellBuy = sellBuy);
    this.amount = this.store.select(getTradeAmount);
    this.value = this.store.select(getTradeValue);
    this.fee = this.store.select(getTradeFee);
    this.stockSubscription = this.route.params.pipe(
      tap((params: Params) => this.store.dispatch(new stocksActions.SelectStock(params['isin']))),
      switchMap((params: Params) => this.store.select(getSelectedStock)),)
      .subscribe((stock: Stock) => {
        this.stock = stock;
        this.appComponent.heading1 = stock.name;
      });
    this.store.dispatch(new authActions.LoadUser());
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
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