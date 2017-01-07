import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);