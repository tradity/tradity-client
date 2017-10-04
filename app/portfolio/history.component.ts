import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
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