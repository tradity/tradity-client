import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { routing } from './portfolio.routing';
import { PortfolioComponent }   from './portfolio.component';
import { HistoryComponent } from './history.component';
import { PositionsComponent } from './positions.component';
import { OrdersComponent } from './orders.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [
    PortfolioComponent,
    HistoryComponent,
    PositionsComponent,
    OrdersComponent
  ],
  providers: [],
})
export class PortfolioModule { }
