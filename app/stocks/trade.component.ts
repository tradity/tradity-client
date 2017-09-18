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
    if (this.amount) {
      this.stocksService.trade(this.stock.stocktextid, this.amount * this.sellbuy)
      .subscribe(
        res => {
          if (res.identifier === 'autodelay-sxnotopen') alert('Your trade will be executed when the stock exchange opens');
          else alert('Successfully traded!');
          this.router.navigateByUrl('/portfolio/orders');
        },
        err => {
          switch (err.identifier) {
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
        }
      )
    }
  }
}