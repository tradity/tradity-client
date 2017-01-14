import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { DashboardComponent }   from './dashboard.component';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    DashboardComponent,
    FeedComponent
  ],
  providers: [],
})
export class DashboardModule { }
