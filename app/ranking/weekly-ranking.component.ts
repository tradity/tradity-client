import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-weekly-ranking',
  templateUrl: 'weekly-ranking.component.html'
})
export class WeeklyRankingComponent implements OnInit {
  private ranking: Observable<any>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.ranking = this.rankingService.rankingWeekly;
    this.rankingService.loadWeekly();
  }
}