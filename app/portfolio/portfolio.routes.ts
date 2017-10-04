import { Routes } from '@angular/router';

import { PortfolioComponent }   from './portfolio.component';
import { HistoryComponent } from './history.component';
import { PositionsComponent } from './positions.component';
import { OrdersComponent } from './orders.component';

export const portfolioRoutes: Routes = [
  {
    path: 'portfolio',
    component: PortfolioComponent,
    children: [
      { path: '', redirectTo: 'positions', pathMatch: 'full'},
      { path: 'positions', component: PositionsComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'orders', component: OrdersComponent }
    ]
  }
]