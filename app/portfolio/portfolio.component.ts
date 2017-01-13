import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-portfolio',
  templateUrl: 'portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

}