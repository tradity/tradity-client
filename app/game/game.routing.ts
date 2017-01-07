import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';

const gameRoutes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      {
        path: 'portfolio',
        loadChildren: 'app/portfolio/portfolio.module#PortfolioModule'
      },
      {
        path: 'stocks',
        loadChildren: 'app/stocks/stocks.module#StocksModule'
      },
      {
        path: 'ranking',
        loadChildren: 'app/ranking/ranking.module#RankingModule'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
      }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);