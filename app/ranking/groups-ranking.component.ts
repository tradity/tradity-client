import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../core/ranking.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-group-ranking',
  templateUrl: 'groups-ranking.component.html'
})
export class GroupsRankingComponent implements OnInit {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.appComponent.heading1 = 'Groups';
    this.ranking = this.rankingService.rankingGroups;
    this.rankingService.loadGroups();
  }
}