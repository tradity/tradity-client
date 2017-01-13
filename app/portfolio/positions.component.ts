import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-positions',
  templateUrl: 'positions.component.html'
})
export class PositionsComponent implements OnInit {
  positions: Observable<any>;
  
  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.positions = this.stocksService.positions;
  }
}