import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-group-ranking',
  templateUrl: 'groups-ranking.component.html'
})
export class GroupsRankingComponent implements OnInit {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading1 = 'Groups';
    this.ranking = this.rankingService.rankingGroups;
    this.rankingService.loadGroups();
  }
}