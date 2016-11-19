import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';
import { ProfileComponent } from './profile.component';
import { RankingComponent } from './ranking.component';

const appRoutes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'ranking', component: RankingComponent }
    ]
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);