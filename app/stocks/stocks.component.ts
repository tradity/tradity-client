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
  popularStocks: Observable<any>;

  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.popularStocks = this.stocksService.popularStocks;
  }
}