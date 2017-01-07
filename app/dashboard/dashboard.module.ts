import { NgModule } from '@angular/core';

import { routing } from './dashboard.routing';
import { DashboardComponent }   from './dashboard.component';

@NgModule({
  imports: [routing],
  exports: [],
  declarations: [DashboardComponent],
  providers: [],
})
export class DashboardModule { }
