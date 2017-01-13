import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-stocks',
  templateUrl: 'stocks.component.html',
  styleUrls: ['stocks.component.css']
})
export class StocksComponent implements OnInit {
  searchValue: string;
  searchResult: any[];
  popularStocks: Observable<any>;

  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.popularStocks = this.stocksService.popularStocks;
  }

  search() {
    if (this.searchValue.length > 2) {
      this.stocksService.search(this.searchValue).subscribe(res => this.searchResult = res);
    } else {
      this.searchResult = [];
    }
  }
}