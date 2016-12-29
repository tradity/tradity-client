import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StocksComponent } from './stocks.component';
import { StockDetailComponent } from './stock-detail.component';
import { TradeComponent } from './trade.component';

const gameRoutes: Routes = [
  {
    path: '',
    component: StocksComponent
  },
  {
    path: ':isin',
    component: StockDetailComponent
  },
  {
    path: ':isin/trade',
    component: TradeComponent
  }
]

export const routing: ModuleWithProviders = RouterModule.forChild(gameRoutes);