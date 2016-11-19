import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortfolioComponent } from './portfolio.component';
import { HistoryComponent } from './history.component';
import { PositionsComponent } from './positions.component';
import { OrdersComponent } from './orders.component';

const portfolioRoutes: Routes = [
  {
    path: 'portfolio',
    component: PortfolioComponent,
    children: [
      { path: 'positions', component: PositionsComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'orders', component: OrdersComponent }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(portfolioRoutes);