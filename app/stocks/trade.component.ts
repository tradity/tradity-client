import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'tradity-trade',
  templateUrl: 'app/stocks/trade.component.html'
})
export class TradeComponent implements OnInit, OnDestroy {
  private stockSubscription: Subscription;
  private stock = {};
  private sellbuy: string;
  private amount: number;
  private value: number;

  constructor(private stocksService: StocksService) {
    this.sellbuy = 'buy';
  }

  ngOnInit() {
    this.stockSubscription = this.stocksService.stock('DE000BASF111')
                             .subscribe(res => this.stock = res);
    this.stocksService.loadStock('DE000BASF111');
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }

  private trade() {
    if (this.amount) {
      this.stocksService.trade('DE000BASF111', this.amount).subscribe(res => {
        if (res) alert('Successfully traded!');
      })
    }
  }
}