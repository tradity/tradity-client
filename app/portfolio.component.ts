import { Component, OnInit } from '@angular/core';

import { PortfolioService } from './portfolio.service';

@Component({
  selector: 'tradity-portfolio',
  template: '',
  providers: [PortfolioService]
})
export class PortfolioComponent implements OnInit {
  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() { 
    this.portfolioService.load();
  }

}