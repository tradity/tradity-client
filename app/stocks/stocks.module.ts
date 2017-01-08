import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { routing } from './stocks.routing';
import { StocksComponent }   from './stocks.component';
import { StockDetailComponent } from './stock-detail.component';
import { TradeComponent } from './trade.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    SharedModule
  ],
  exports: [],
  declarations: [
    StocksComponent,
    StockDetailComponent,
    TradeComponent
  ],
  providers: [],
})
export class StocksModule { }
