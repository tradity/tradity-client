import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-history',
  templateUrl: 'history.component.html'
})
export class HistoryComponent implements OnInit {
  
  history: Observable<any>;
  
  constructor(private stocksService: StocksService, private gameComponent: GameComponent) {}

  ngOnInit() {
    this.gameComponent.heading1 = 'Order history';
    this.history = this.stocksService.history;
  }

}