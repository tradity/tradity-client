import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from './stocks.service';

@Component({
  selector: 'tradity-transactions',
  template: '',
  providers: [StocksService]
})
export class TransactionsComponent implements OnInit {
  
  transactions: Observable<any>;
  
  constructor(private stocksService: StocksService) {}

  ngOnInit() {
    this.transactions = this.stocksService.transactions;
    this.transactions.subscribe(val => console.log("received", val));
    this.stocksService.loadTransactions();
  }

}