import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { StocksService } from '../stocks.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-portfolio',
  templateUrl: 'portfolio.component.html',
  styles: [':host { display: flex; flex-direction: column; padding: 20px; }']
})
export class PortfolioComponent implements OnInit {
  constructor(private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading2 = 'Portfolio';
  }

}