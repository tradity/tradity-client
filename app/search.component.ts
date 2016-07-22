import { Component, OnInit } from '@angular/core';

import { StocksService } from './stocks.service';

@Component({
  selector: 'tradity-search',
  template: '<input type="text" [(ngModel)]="id" onchange="search()">' 
})
export class SearchComponent implements OnInit {
  
  private id: string;
  
  constructor(private stocksService: StocksService) { }

  ngOnInit() {
    this.stocksService.search('Google').subscribe(res => console.log(res));
  }
  
  search() {
    this.stocksService.search(this.id).subscribe(res => console.log(res));
  }

}