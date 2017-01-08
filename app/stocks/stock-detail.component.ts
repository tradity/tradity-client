import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private stocksService: StocksService) { }

  ngOnInit() {
    this.stockSubscription = this.route.params
      .switchMap((params: Params) => this.stocksService.stock(params['isin']))
      .subscribe(res => this.stock = res);
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }
}