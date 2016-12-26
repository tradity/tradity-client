import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'tradity-stocks',
  templateUrl: 'app/game/stocks.component.html'
})
export class StocksComponent implements OnInit {
  popularStocks: Observable<any>;

  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.popularStocks = this.stocksService.popularStocks;
    this.stocksService.loadPopularStocks();
  }
}