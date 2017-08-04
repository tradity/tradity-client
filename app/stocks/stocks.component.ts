import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../core/stocks.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-stocks',
  templateUrl: 'stocks.component.html',
  styleUrls: ['stocks.component.css']
})
export class StocksComponent implements OnInit {
  popularStocks: Observable<any>;

  constructor(private stocksService: StocksService, private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading2 = 'Stocks';
    this.gameComponent.heading1 = 'Stock search';
    this.popularStocks = this.stocksService.popularStocks;
  }
}