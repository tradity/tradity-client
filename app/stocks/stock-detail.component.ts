
import {switchMap, tap} from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppComponent } from '../app.component';
import * as stockActions from './stocks.actions';
import { getSelectedStock } from './stocks.reducer';
import { Stock } from './stock.model';

@Component({
  selector: 'tradity-stock-detail',
  template: `
    <tradity-li-header class="big-letters">
      <span left>{{stock.name}}</span>
      <span left>{{stock.stocktextid}}</span>
      <span right>{{stock.ask / 10000 | currency:'EUR'}}</span>
    </tradity-li-header>
    <tradity-li-vl>
      <tradity-li-vi>
        <span i18n>Bid price</span>
        <span>{{stock.bid / 10000 | currency:'EUR'}}</span>
      </tradity-li-vi>
      <tradity-li-vi>
        <span i18n>Tradable amount</span>
        <span>{{stock.pieces}} pc</span>
      </tradity-li-vi>
    </tradity-li-vl>
    <a [routerLink]="['/stocks/' + stock.stocktextid + '/trade']" i18n>Trade</a>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }
    
    a {
      padding: 17px 117px;
      margin: 30px 0 50px;
      background-color: rgba(40,59,144,0.95);
      box-shadow: 0 2px 1px 0 #283B90;
      border: 1px solid rgba(40,59,144,0.97);
      border-radius: 3px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      line-height: 19px;
      color: #FFFFFF;
      text-decoration: none;
    }
  `]
})
export class StockDetailComponent implements OnDestroy {
  private stockSubscription: Subscription;
  stock: Stock;

  constructor(private route: ActivatedRoute, private store: Store<any>, private appComponent: AppComponent) {
    this.appComponent.heading2 = 'Stock details';
    this.stockSubscription = this.route.params.pipe(
    tap((params: Params) => this.store.dispatch(new stockActions.SelectStock(params['isin']))),
    switchMap((params: Params) => this.store.select(getSelectedStock)),)
    .subscribe((stock: Stock) => {
      this.stock = stock;
      this.appComponent.heading1 = stock.name;
    });
  }

  ngOnDestroy() {
    this.stockSubscription.unsubscribe();
  }
}