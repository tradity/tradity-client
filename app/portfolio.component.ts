import { Component, OnInit } from '@angular/core';

import { StocksService } from './stocks.service';

@Component({
  selector: 'tradity-portfolio',
  template: '',
  providers: [StocksService]
})
export class PortfolioComponent implements OnInit {
  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.stocksService.loadPortfolio();
  }

}