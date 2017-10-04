import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../core/stocks.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-positions',
  templateUrl: 'positions.component.html'
})
export class PositionsComponent implements OnInit {
  positions: Observable<any>;
  
  constructor(private stocksService: StocksService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.appComponent.heading1 = 'Positions';
    this.positions = this.stocksService.positions;
  }
}