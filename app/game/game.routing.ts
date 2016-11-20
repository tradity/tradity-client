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
      }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);