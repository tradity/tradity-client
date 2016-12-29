import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { routing } from './ranking.routing';
import { RankingComponent }   from './ranking.component';
import { AlltimeRankingComponent } from './alltime-ranking.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
  exports: [],
  declarations: [
    RankingComponent,
    AlltimeRankingComponent
  ],
  providers: [],
})
export class RankingModule { }
