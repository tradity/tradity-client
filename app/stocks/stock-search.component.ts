import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as stocksActions from './stocks.actions';
import { Stock } from './stock.model';
import { getSearchValue, getSearchResults } from './stocks.reducer';

@Component({
  selector: 'tradity-stock-search',
  templateUrl: 'stock-search.component.html',
  styleUrls: ['stock-search.component.css']
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