import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';

@Component({
  selector: 'tradity-weekly-ranking',
  templateUrl: 'app/ranking/weekly-ranking.component.html'
})
export class WeeklyRankingComponent implements OnInit {
  private ranking: Observable<any>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.ranking = this.rankingService.rankingWeekly;
    this.rankingService.loadWeekly();
  }
}