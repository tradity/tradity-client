import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-history',
  templateUrl: 'history.component.html'
})
export class HistoryComponent {
  
  history: Observable<any>;
  
  constructor(private stocksService: StocksService, private appComponent: AppComponent) {
    this.appComponent.heading1 = 'Order history';
    this.history = this.stocksService.history;
  }
}