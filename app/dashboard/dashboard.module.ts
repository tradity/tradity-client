import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FeedModule } from '../feed/feed.module';

import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes),
    SharedModule,
    FeedModule
  ],
  exports: [],
  declarations: [
    DashboardComponent
  ],
  providers: [],
})
export class DashboardModule { }
