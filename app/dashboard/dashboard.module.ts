import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { routing } from './dashboard.routing';
import { DashboardComponent }   from './dashboard.component';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [
    DashboardComponent,
    FeedComponent
  ],
  providers: [],
})
export class DashboardModule { }
