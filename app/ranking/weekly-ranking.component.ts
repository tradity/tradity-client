import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../core/ranking.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-weekly-ranking',
  templateUrl: 'weekly-ranking.component.html'
})
export class WeeklyRankingComponent implements OnInit {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.appComponent.heading1 = 'Weekly';
    this.ranking = this.rankingService.rankingWeekly;
    this.rankingService.loadWeekly();
  }
}