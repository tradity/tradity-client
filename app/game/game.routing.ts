import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';
import { StocksComponent } from './stocks.component';

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
        component: StocksComponent
      }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);