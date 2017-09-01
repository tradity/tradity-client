import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { StocksService } from '../core/stocks.service';
import { GameComponent } from '../game/game.component';
import * as stockActions from './stocks.actions';
import { getSelectedStock } from './stocks.reducer';

@Component({
  moduleId: module.id,
  selector: 'tradity-stock-detail',
  templateUrl: 'stock-detail.component.html',
  styleUrls: ['stock-detail.component.css']
})
export class StockDetailComponent implements OnInit, OnDestroy {
  private stockSubscription: Subscription;
  stock: any = {};

  constructor(private route: ActivatedRoute, private store: Store<any>, private stocksService: StocksService, private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading2 = 'Stock details';
    this.stockSubscription = this.route.params
      .do((params: Params) => this.store.dispatch(new stockActions.SelectStock(params['isin'])))
      .do((params: Params) => this.stocksService.loadStock(params['isin']))
      .switchMap((params: Params) => this.store.select(getSelectedStock))
      .subscribe(res => {
        console.log(res);
        this.stock = res;
        this.gameComponent.heading1 = res.name;
      });
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }
}