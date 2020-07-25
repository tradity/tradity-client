import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-stocks',
  template: `
    <tradity-stock-search></tradity-stock-search>
    <tradity-container name="Most traded" i18n-name>
      <tradity-li *ngFor="let paper of popularStocks | async">
        <tradity-li-img [placeholder]="paper.stockname"></tradity-li-img>
        <tradity-li-header>
          <span left>{{paper.stockname}}</span>
          <span left>{{paper.stocktextid}}</span>
          <span right>{{paper.lastvalue / 10000 | currency:'EUR'}}</span>
        </tradity-li-header>
        <tradity-li-action-list>
          <tradity-action-favourite></tradity-action-favourite>
          <tradity-action-stock-info [isin]="paper.stocktextid"></tradity-action-stock-info>
          <tradity-action-buy [isin]="paper.stocktextid"></tradity-action-buy>
          <tradity-action-sell [isin]="paper.stocktextid"></tradity-action-sell>
          <tradity-action-expand></tradity-action-expand>
        </tradity-li-action-list>
        <tradity-li-vl>
          <tradity-li-vi>
            <span i18n>Ask price</span>
            <span>{{paper.ask / 10000 | currency:'EUR'}}</span>
          </tradity-li-vi>
          <tradity-li-vi>
            <span i18n>Bid price</span>
            <span>{{paper.bid / 10000 | currency:'EUR'}}</span>
          </tradity-li-vi>
          <tradity-li-vi>
            <span i18n>Tradable amount</span>
            <span>{{paper.pieces}} pc</span>
          </tradity-li-vi>
        </tradity-li-vl>
      </tradity-li>
    </tradity-container>
    <tradity-container name="Your favourites" i18n-name></tradity-container>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      padding: 20px;
    }
    
    tradity-container,
    tradity-stock-search {
      margin-bottom: 20px;
    }
  `]
})
export class StocksComponent {
  popularStocks: Observable<any>;

  constructor(private stocksService: StocksService, private appComponent: AppComponent) {
    this.appComponent.heading2 = 'Stocks';
    this.appComponent.heading1 = 'Stock search';
    this.popularStocks = this.stocksService.popularStocks;
  }
}