import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-alltime-ranking',
  templateUrl: 'alltime-ranking.component.html'
})
export class AlltimeRankingComponent implements OnInit {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService, private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading1 = 'All-time';
    this.ranking = this.rankingService.rankingAll;
    this.rankingService.loadAll();
  }
}