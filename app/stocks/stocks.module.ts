import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { stocksRoutes } from './stocks.routes';
import { stocksReducer } from './stocks.reducer';
import { StocksEffects } from './stocks.effects';
import { StocksComponent }   from './stocks.component';
import { StockSearchComponent } from './stock-search.component';
import { StockDetailComponent } from './stock-detail.component';
import { TradeComponent } from './trade.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(stocksRoutes),
    SharedModule,
    StoreModule.forFeature('stocks', stocksReducer),
    EffectsModule.forFeature([StocksEffects])
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
