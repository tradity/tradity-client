import { NgModule } from '@angular/core';

import { routing } from './game.routing';
import { GameComponent } from './game.component';
import { PortfolioModule } from '../portfolio/portfolio.module';

@NgModule({
  imports: [
    routing,
    PortfolioModule
  ],
  exports: [],
  declarations: [GameComponent],
  providers: [],
})
export class GameModule { }
