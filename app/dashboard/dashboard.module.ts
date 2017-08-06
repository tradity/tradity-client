import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { FeedModule } from '../feed/feed.module';

import { DashboardComponent }   from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
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
