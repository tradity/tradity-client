import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-orders',
  templateUrl: 'orders.component.html'
})
export class OrdersComponent implements OnInit {
  
  orders: Observable<any>;
  
  constructor(private stocksService: StocksService, private appComponent: AppComponent) {}

  ngOnInit() {
    this.appComponent.heading1 = 'Pending orders';
    this.orders = this.stocksService.orders;
  }

}