import { NgModule } from '@angular/core';

import { routing } from './game.routing';
import { GameComponent } from './game.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { RankingModule } from '../ranking/ranking.module';
import { StocksModule } from '../stocks/stocks.module';
import { GroupModule } from '../group/group.module';

@NgModule({
  imports: [
    routing,
    DashboardModule,
    PortfolioModule,
    RankingModule,
    StocksModule,
    GroupModule
  ],
  exports: [],
  declarations: [GameComponent],
  providers: [],
})
export class GameModule { }
