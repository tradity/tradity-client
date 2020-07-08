import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RankingService } from '../core/ranking.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-weekly-ranking',
  templateUrl: 'weekly-ranking.component.html'
})
export class WeeklyRankingComponent {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private appComponent: AppComponent) {
    this.appComponent.heading1 = 'Weekly';
    this.ranking = this.rankingService.rankingWeekly;
    this.rankingService.loadWeekly();
  }
}