import { Component, OnInit } from '@angular/core';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-stock-search',
  templateUrl: 'stock-search.component.html',
  styleUrls: ['stock-search.component.css']
})
export class StockSearchComponent {
  searchValue: string;
  searchResult: any[];

  constructor(private stocksService: StocksService) { }

  search() {
    if (this.searchValue.length > 2) {
      this.stocksService.search(this.searchValue).subscribe(res => this.searchResult = res);
    } else {
      this.searchResult = [];
    }
  }
}