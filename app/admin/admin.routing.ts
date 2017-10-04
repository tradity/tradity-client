import { Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminUserlistComponent } from './admin-userlist.component';
import { AdminGroupsComponent } from './admin-groups.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'userlist', pathMatch: 'full'},
      { path: 'userlist', component: AdminUserlistComponent },
      { path: 'groups', component: AdminGroupsComponent }
    ]
  }
]