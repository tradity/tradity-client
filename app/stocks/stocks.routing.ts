import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StocksComponent } from './stocks.component';

const gameRoutes: Routes = [
  {
    path: '',
    component: StocksComponent,
    children: [

    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);