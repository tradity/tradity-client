import { Component, OnInit } from '@angular/core';

import { StocksService } from './stocks.service';

@Component({
  selector: 'tradity-transactions',
  template: '',
  providers: [StocksService]
})
export class TransactionsComponent implements OnInit {
  constructor(private stocksService: StocksService) {}

  ngOnInit() { 
    this.stocksService.loadTransactions();
  }

}