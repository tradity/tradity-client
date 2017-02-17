import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StocksService } from '../stocks.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-stock-detail',
  templateUrl: 'stock-detail.component.html',
  styleUrls: ['stock-detail.component.css']
})
export class StockDetailComponent implements OnInit, OnDestroy {
  private stockSubscription: Subscription;
  stock: any = {};

  constructor(private route: ActivatedRoute, private stocksService: StocksService, private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading2 = 'Stock details';
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
}