
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
  selector: 'tradity-trade',
  template: `
    <tradity-li-header class="big-letters">
      <span left>{{stock.name}}</span>
      <span left>{{stock.stocktextid}}</span>
      <span right>{{stock.pieces}} pc</span>
    </tradity-li-header>
    <form tradity-form (submit)="submit($event)" autocomplete="off">
      <input type="radio" name="sellbuy" id="buy" [checked]="sellBuy === Buy ? 'checked' : null" (click)="inputSellBuy(Buy)" />
      <label for="buy" i18n>Buy</label>
      <input type="radio" name="sellbuy" id="sell" [checked]="sellBuy === Sell ? 'checked' : null" (click)="inputSellBuy(Sell)" />
      <label for="sell" i18n>Sell</label>
      <span id="cash" i18n>Cash available: {{user.freemoney / 10000 | currency:'EUR'}}</span>
      <tradity-input type="number" id="amount" name="amount" [value]="amount | async" min="0" [max]="stock.pieces" placeholder="Number of shares" i18n-placeholder (input)="inputAmount($event.target.value)"></tradity-input>
      <span>x <span [class.inactive]="sellBuy === Sell">{{stock.ask / 10000 | currency:'EUR'}} (Ask)</span> | <span [class.inactive]="sellBuy === Buy">{{stock.bid / 10000 | currency:'EUR'}} (Bid)</span> =</span>
      <tradity-input type="number" step="any" id="value" name="value" [value]="value | async" placeholder="Euros to be invested" i18n-placeholder (input)="inputValue($event.target.value)"></tradity-input>
      <span>+ {{fee | async | currency:'EUR'}} transaction fee</span>
      <button tradity-button type="submit" i18n>Execute trade</button>
    </form>
  `,
  styles: [`
    [tradity-form] {
      margin: 0 50px;
    }
    
    [tradity-form] tradity-input#amount + span {
      display: block;
      text-align: center;
      margin: 0 auto 1rem;
      font-size: 15px;
      line-height: 19px;
      letter-spacing: 1.5px;
      color: #170804;
    }
    
    [tradity-form] tradity-input#amount + span span.inactive {
      color: rgba(23,8,4,0.2);
    }
    
    [tradity-form] tradity-input#value + span {
      margin: -6px auto 20px;
      text-align: center;
      font-size: 10px;
      line-height: 12px;
      letter-spacing: 1px;
      color: #170804;
    }
    
    [tradity-form] span#cash {
      text-align: center;
      margin: 0 auto 20px;
      font-size: 15px;
      line-height: 19px;
      letter-spacing: 1.5px;
      color: #170804;
    }
  `]
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

  submit(e) {
    e.preventDefault();
    this.store.dispatch(new stocksActions.Trade());
  }
}