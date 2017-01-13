import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-trade',
  templateUrl: 'trade.component.html',
  styleUrls: ['trade.component.css']
})
export class TradeComponent implements OnInit, OnDestroy {
  private stockSubscription: Subscription;
  private stock: any;
  private sellbuy: number;
  private amount: number;
  private value: number;

  constructor(private route: ActivatedRoute, private stocksService: StocksService) {
    this.sellbuy = 1;
  }

  ngOnInit() {
    this.stockSubscription = this.route.params
      .switchMap((params: Params) => this.stocksService.stock(params['isin']))
      .subscribe(res => this.stock = res);
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }

  private trade() {
    if (this.amount) {
      this.stocksService.trade(this.stock.stocktextid, this.amount * this.sellbuy).subscribe(res => {
        if (res) alert('Successfully traded!');
      })
    }
  }
}