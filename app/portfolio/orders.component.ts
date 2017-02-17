import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-orders',
  templateUrl: 'orders.component.html'
})
export class OrdersComponent implements OnInit {
  
  orders: Observable<any>;
  
  constructor(private stocksService: StocksService, private gameComponent: GameComponent) {}

  ngOnInit() {
    this.gameComponent.heading1 = 'Pending orders';
    this.orders = this.stocksService.orders;
  }

}