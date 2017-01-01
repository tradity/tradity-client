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

  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.stockSubscription = this.stocksService.stock('US88160R1014')
                             .subscribe(res => this.stock = res);
    this.stocksService.loadStock('US88160R1014');
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }
}