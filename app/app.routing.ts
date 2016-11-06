import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GameComponent } from './game.component';
import { ProfileComponent } from './profile.component';
import { PortfolioComponent } from './portfolio.component';
import { HistoryComponent } from './history.component';
import { RankingComponent } from './ranking.component';
import { PositionsComponent } from './positions.component';
import { OrdersComponent } from './orders.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: GameComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      {
        path: 'portfolio',
        component: PortfolioComponent,
        children: [
          { path: 'positions', component: PositionsComponent },
          { path: 'history', component: HistoryComponent },
          { path: 'orders', component: OrdersComponent }
        ]
      },
      { path: 'ranking', component: RankingComponent }
    ]
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);