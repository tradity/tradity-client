import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from '../app.component';
import * as stockActions from './stocks.actions';
import { getSelectedStock } from './stocks.reducer';
import { Stock } from './stock.model';

@Component({
  moduleId: module.id,
  selector: 'tradity-stock-detail',
  templateUrl: 'stock-detail.component.html',
  styleUrls: ['stock-detail.component.css']
})
export class StockDetailComponent implements OnDestroy {
  private stockSubscription: Subscription;
  stock: Stock;

  constructor(private route: ActivatedRoute, private store: Store<any>, private appComponent: AppComponent) {
    this.appComponent.heading2 = 'Stock details';
    this.stockSubscription = this.route.params
    .do((params: Params) => this.store.dispatch(new stockActions.SelectStock(params['isin'])))
    .switchMap((params: Params) => this.store.select(getSelectedStock))
    .subscribe((stock: Stock) => {
      this.stock = stock;
      this.appComponent.heading1 = stock.name;
    });
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }
}