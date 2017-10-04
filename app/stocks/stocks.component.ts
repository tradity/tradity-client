import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-stocks',
  templateUrl: 'stocks.component.html',
  styleUrls: ['stocks.component.css']
})
export class StocksComponent {
  popularStocks: Observable<any>;

  constructor(private stocksService: StocksService, private appComponent: AppComponent) {
    this.appComponent.heading2 = 'Stocks';
    this.appComponent.heading1 = 'Stock search';
    this.popularStocks = this.stocksService.popularStocks;
  }
}