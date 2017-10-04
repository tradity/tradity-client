import { Routes } from '@angular/router';

import { GroupComponent } from './group.component';
import { GroupRankingComponent } from './group-ranking.component';
import { GroupFavouritesComponent } from './group-favourites.component';

export const groupRoutes: Routes = [
  {
    path: 'group/:id',
    component: GroupComponent,
    children: [
      { path: '', redirectTo: 'ranking', pathMatch: 'full' },
      { path: 'ranking', component: GroupRankingComponent },
      { path: 'favourites', component: GroupFavouritesComponent }
    ]
  }
]