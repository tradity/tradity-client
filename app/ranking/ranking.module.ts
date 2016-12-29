import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './ranking.routing';
import { RankingComponent }   from './ranking.component';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  exports: [],
  declarations: [RankingComponent],
  providers: [],
})
export class RankingModule { }
