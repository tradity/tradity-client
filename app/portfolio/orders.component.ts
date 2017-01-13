import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-orders',
  templateUrl: 'orders.component.html'
})
export class OrdersComponent implements OnInit {
  
  orders: Observable<any>;
  
  constructor(private stocksService: StocksService) {}

  ngOnInit() {
    this.orders = this.stocksService.orders;
  }

}