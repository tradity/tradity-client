import { NgModule } from '@angular/core';

import { routing } from './game.routing';
import { GameComponent } from './game.component';
import { StocksComponent } from './stocks.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    routing,
    SharedModule,
    CommonModule
  ],
  exports: [],
  declarations: [GameComponent, StocksComponent],
  providers: [],
})
export class GameModule { }
