import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';

import { DashboardComponent } from '../dashboard/dashboard.component';

import { PortfolioComponent }   from '../portfolio/portfolio.component';
import { HistoryComponent } from '../portfolio/history.component';
import { PositionsComponent } from '../portfolio/positions.component';
import { OrdersComponent } from '../portfolio/orders.component';

import { RankingComponent } from '../ranking/ranking.component';
import { AlltimeRankingComponent } from '../ranking/alltime-ranking.component';
import { WeeklyRankingComponent } from '../ranking/weekly-ranking.component';
import { GroupsRankingComponent } from '../ranking/groups-ranking.component';

import { StocksComponent } from '../stocks/stocks.component';
import { StockDetailComponent } from '../stocks/stock-detail.component';
import { TradeComponent } from '../stocks/trade.component';

import { GroupComponent } from '../group/group.component';
import { GroupRankingComponent } from '../group/group-ranking.component';
import { GroupFavouritesComponent } from '../group/group-favourites.component';

const gameRoutes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
        children: [
          { path: '', redirectTo: 'positions', pathMatch: 'full'},
          { path: 'positions', component: PositionsComponent },
          { path: 'history', component: HistoryComponent },
          { path: 'orders', component: OrdersComponent }
        ]
      },
      {
        path: 'ranking',
        component: RankingComponent,
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full'},
          { path: 'all', component: AlltimeRankingComponent},
          { path: 'weekly', component: WeeklyRankingComponent},
          { path: 'groups', component: GroupsRankingComponent}
        ]
      },
      {
        path: 'stocks',
        component: StocksComponent
      },
      {
        path: 'stocks/:isin',
        component: StockDetailComponent
      },
      {
        path: 'stocks/:isin/trade',
        component: TradeComponent
      },
      {
        path: 'group/:id',
        component: GroupComponent,
        children: [
          { path: '', redirectTo: 'ranking', pathMatch: 'full' },
          { path: 'ranking', component: GroupRankingComponent },
          { path: 'favourites', component: GroupFavouritesComponent }
        ]
      }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);