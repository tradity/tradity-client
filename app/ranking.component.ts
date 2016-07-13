import { Component, OnInit } from '@angular/core';

import { RankingService } from './ranking.service';

@Component({
  selector: 'tradity-ranking',
  template: '',
  providers: [RankingService]
})
export class RankingComponent implements OnInit {
  constructor(private rankingService: RankingService) { }

  ngOnInit() { 
    this.rankingService.load();
  }

}