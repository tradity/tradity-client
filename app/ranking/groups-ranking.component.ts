import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RankingService } from '../core/ranking.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-group-ranking',
  templateUrl: 'groups-ranking.component.html'
})
export class GroupsRankingComponent {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private appComponent: AppComponent) {
    this.appComponent.heading1 = 'Groups';
    this.ranking = this.rankingService.rankingGroups;
    this.rankingService.loadGroups();
  }
}