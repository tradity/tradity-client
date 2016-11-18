import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'tradity-positions',
  templateUrl: 'app/positions.component.html'
})
export class PositionsComponent implements OnInit {
  positions: Observable<any>;
  
  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.positions = this.stocksService.positions;
    this.stocksService.loadPositions();
  }
}