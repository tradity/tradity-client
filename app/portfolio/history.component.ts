import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'tradity-history',
  templateUrl: 'app/portfolio/history.component.html',
  providers: [StocksService]
})
export class HistoryComponent implements OnInit {
  
  history: Observable<any>;
  
  constructor(private stocksService: StocksService) {}

  ngOnInit() {
    this.history = this.stocksService.history;
    this.history.subscribe(val => console.log("received", val));
    this.stocksService.loadHistory();
  }

}