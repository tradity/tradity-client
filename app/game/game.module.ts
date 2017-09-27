import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { gameRoutes } from './game.routing';
import { GameComponent } from './game.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { RankingModule } from '../ranking/ranking.module';
import { StocksModule } from '../stocks/stocks.module';
import { GroupModule } from '../group/group.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(gameRoutes),
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
