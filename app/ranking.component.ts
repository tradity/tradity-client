import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from './ranking.service';

@Component({
  selector: 'tradity-ranking',
  template: '',
  providers: [RankingService]
})
export class RankingComponent implements OnInit {
  
  ranking: Observable<any>;
  
  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.ranking = this.rankingService.ranking;
    this.ranking.subscribe(val => console.log(val));
    this.rankingService.load();
  }

}