import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'register',
    loadChildren: 'app/registration/registration.module#RegistrationModule'
  },
  {
    path: '',
    loadChildren: 'app/game/game.module#GameModule'
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);