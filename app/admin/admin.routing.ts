import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminUserlistComponent } from './admin-userlist.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'userlist', component: AdminUserlistComponent }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(adminRoutes);