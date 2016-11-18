import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';

@Component({
  selector: 'tradity-portfolio',
  templateUrl: 'app/portfolio/portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  
  portfolio: Observable<any>;
  
  constructor() { }

  ngOnInit() { }

}