import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-portfolio',
  templateUrl: 'portfolio.component.html',
  styles: [':host { display: flex; flex-direction: column; padding: 20px; }']
})
export class PortfolioComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

}