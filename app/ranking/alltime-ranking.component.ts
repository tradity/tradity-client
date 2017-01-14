import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-alltime-ranking',
  templateUrl: 'alltime-ranking.component.html'
})
export class AlltimeRankingComponent implements OnInit {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.ranking = this.rankingService.rankingAll;
    this.rankingService.loadAll();
  }
}