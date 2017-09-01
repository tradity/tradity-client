import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';

import { stocksReducer } from './stocks.reducer';
import { StocksComponent }   from './stocks.component';
import { StockSearchComponent } from './stock-search.component';
import { StockDetailComponent } from './stock-detail.component';
import { TradeComponent } from './trade.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    StoreModule.forFeature('stocks', stocksReducer)
  ],
  exports: [],
  declarations: [
    StocksComponent,
    StockSearchComponent,
    StockDetailComponent,
    TradeComponent
  ],
  providers: [],
})
export class StocksModule { }
