import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminUserlistComponent } from './admin-userlist.component';
import { AdminGroupsComponent } from './admin-groups.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'userlist', component: AdminUserlistComponent },
      { path: 'groups', component: AdminGroupsComponent }
    ]
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(adminRoutes);