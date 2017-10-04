import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../core/ranking.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-alltime-ranking',
  templateUrl: 'alltime-ranking.component.html'
})
export class AlltimeRankingComponent {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private appComponent: AppComponent) {
    this.appComponent.heading1 = 'All-time';
    this.ranking = this.rankingService.rankingAll;
    this.rankingService.loadAll();
  }
}