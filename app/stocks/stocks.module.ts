import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './stocks.routing';
import { StocksComponent }   from './stocks.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SharedModule
  ],
  exports: [],
  declarations: [StocksComponent],
  providers: [],
})
export class StocksModule { }
