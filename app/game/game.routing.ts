import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';

const gameRoutes: Routes = [
  {
    path: '',
    component: GameComponent
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);