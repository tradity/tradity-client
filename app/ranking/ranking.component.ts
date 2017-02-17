import { Component, OnInit } from '@angular/core';

import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-ranking',
  templateUrl: 'ranking.component.html',
  styles: [':host { display: flex; flex-direction: column; padding: 20px; }']
})
export class RankingComponent implements OnInit {
  constructor(private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading2 = 'Leaderboard';
  }

}