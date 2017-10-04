import { Routes } from '@angular/router';

import { StocksComponent } from './stocks.component';
import { StockDetailComponent } from './stock-detail.component';
import { TradeComponent } from './trade.component';

export const stocksRoutes: Routes = [
  {
    path: 'stocks',
    component: StocksComponent
  },
  {
    path: 'stocks/:isin',
    component: StockDetailComponent
  },
  {
    path: 'stocks/:isin/trade',
    component: TradeComponent
  }
]