import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingComponent } from './ranking.component';

const portfolioRoutes: Routes = [
  {
    path: '',
    component: RankingComponent
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(portfolioRoutes);