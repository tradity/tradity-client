import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { adminRoutes } from './admin.routing';
import { AdminComponent } from './admin.component';
import { AdminUserlistComponent } from './admin-userlist.component';
import { AdminGroupsComponent } from './admin-groups.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(adminRoutes)
  ],
  exports: [],
  declarations: [
    AdminComponent,
    AdminUserlistComponent,
    AdminGroupsComponent
  ],
  providers: [],
})
export class AdminModule { }
