import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './dashboard.routing';
import { DashboardComponent }   from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  exports: [],
  declarations: [DashboardComponent],
  providers: [],
})
export class DashboardModule { }
