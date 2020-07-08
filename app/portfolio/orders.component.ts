import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-orders',
  templateUrl: 'orders.component.html'
})
export class OrdersComponent {
  
  orders: Observable<any>;
  
  constructor(private stocksService: StocksService, private appComponent: AppComponent) {
    this.appComponent.heading1 = 'Pending orders';
    this.orders = this.stocksService.orders;
  }
}