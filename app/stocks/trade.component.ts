import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StocksService } from '../stocks.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-trade',
  templateUrl: 'trade.component.html',
  styleUrls: ['trade.component.css']
})
export class TradeComponent implements OnInit, OnDestroy {
  private stockSubscription: Subscription;
  stock: any;
  sellbuy: number;
  amount: number;
  value: number;

  constructor(private route: ActivatedRoute, private stocksService: StocksService, private gameComponent: GameComponent) {
    this.sellbuy = 1;
  }

  ngOnInit() {
    this.gameComponent.heading2 = 'Trade';
    this.stockSubscription = this.route.params
      .switchMap((params: Params) => this.stocksService.stock(params['isin']))
      .subscribe(res => {
        this.stock = res;
        this.gameComponent.heading1 = res.name;
      });
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }

  trade() {
    if (this.amount) {
      this.stocksService.trade(this.stock.stocktextid, this.amount * this.sellbuy).subscribe(res => {
        if (res) alert('Successfully traded!');
      })
    }
  }
}