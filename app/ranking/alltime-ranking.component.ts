import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';

@Component({
  selector: 'tradity-alltime-ranking',
  templateUrl: 'app/ranking/alltime-ranking.component.html'
})
export class AlltimeRankingComponent implements OnInit {
  private ranking: Observable<any>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.ranking = this.rankingService.rankingAll;
    this.rankingService.loadAll();
  }
}