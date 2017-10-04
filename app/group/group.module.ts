import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { groupRoutes } from './group.routes';
import { GroupComponent } from './group.component';
import { GroupRankingComponent } from './group-ranking.component';
import { GroupFavouritesComponent } from './group-favourites.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(groupRoutes),
    SharedModule
  ],
  exports: [],
  declarations: [
    GroupComponent,
    GroupRankingComponent,
    GroupFavouritesComponent
  ],
  providers: [],
})
export class GroupModule { }
