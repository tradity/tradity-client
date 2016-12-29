import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingComponent } from './ranking.component';
import { AlltimeRankingComponent } from './alltime-ranking.component';

const portfolioRoutes: Routes = [
  {
    path: '',
    component: RankingComponent,
    children: [
      { path: '', redirectTo: 'all' },
      { path: 'all', component: AlltimeRankingComponent}
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(portfolioRoutes);