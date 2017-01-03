import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'tradity-stock-detail',
  templateUrl: 'app/stocks/stock-detail.component.html'
})
export class StockDetailComponent implements OnInit, OnDestroy {
  private stockSubscription: Subscription;
  private stock = {};

  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.stockSubscription = this.stocksService.stock('US88160R1014')
                             .subscribe(res => this.stock = res);
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }
}