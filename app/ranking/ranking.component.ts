import { Component, OnInit } from '@angular/core';

import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-ranking',
  templateUrl: 'ranking.component.html',
  styles: [':host { display: flex; flex-direction: column; padding: 20px; }']
})
export class RankingComponent {
  constructor(private appComponent: AppComponent) {
    this.appComponent.heading2 = 'Leaderboard';    
  }
}