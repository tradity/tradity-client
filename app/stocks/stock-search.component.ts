import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as stocksActions from './stocks.actions';
import { Stock } from './stock.model';
import { getSearchValue, getSearchResults } from './stocks.reducer';

@Component({
  selector: 'tradity-stock-search',
  template: `
    <input type="search" placeholder="Search for stock" [value]="searchValue | async" (input)="inputSearch($event.target.value)" />
    <tradity-li *ngFor="let paper of searchResults | async">
      <tradity-li-img [placeholder]="paper.name"></tradity-li-img>
      <tradity-li-header>
        <span left>{{paper.name}}</span>
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
  `,
  styles: [`
    input[type=search] {
      width: 100%;
      font-size: 12px;
      font-weight: bold;
      font-family: inherit;
      line-height: 15px;
      color: #170804;
      padding: 12px;
      border-radius: 40px;
      border: 1px solid #170804;
      outline: none;
    }
    
    input[type=search]:hover,
    input[type=search]:focus {
      border-color: #F1592A;
    }
    
    tradity-li:first-of-type {
      margin-top: 10px;
    }
  `]
})
export class StockSearchComponent {
  searchValue: Observable<string>;
  searchResults: Observable<Stock[]>;

  constructor(private store: Store<any>) {
    this.searchValue = this.store.select(getSearchValue);
    this.searchResults = this.store.select(getSearchResults);
  }

  inputSearch(value: string) {
    this.store.dispatch(new stocksActions.InputSearch(value));
  }
}