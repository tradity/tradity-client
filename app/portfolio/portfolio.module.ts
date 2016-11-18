import { NgModule } from '@angular/core';

import { PortfolioComponent }   from './portfolio.component';
import { HistoryComponent } from './history.component';
import { PositionsComponent } from './positions.component';
import { OrdersComponent } from './orders.component';

@NgModule({
  imports: [],
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
