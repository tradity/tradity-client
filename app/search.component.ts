import { Component, OnInit } from '@angular/core';

import { StocksService } from './stocks.service';

@Component({
  selector: 'tradity-search',
  template: '<input type="text">'
})
export class SearchComponent implements OnInit {
  constructor(private stocksService: StocksService) { }

  ngOnInit() { 
    this.stocksService.search('Google').subscribe(res => console.log(res));
  }

}