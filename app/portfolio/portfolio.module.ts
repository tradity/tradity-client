import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { PortfolioComponent }   from './portfolio.component';
import { HistoryComponent } from './history.component';
import { PositionsComponent } from './positions.component';
import { OrdersComponent } from './orders.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
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
