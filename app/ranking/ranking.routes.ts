import { Routes } from '@angular/router';

import { RankingComponent } from './ranking.component';
import { AlltimeRankingComponent } from './alltime-ranking.component';
import { WeeklyRankingComponent } from './weekly-ranking.component';
import { GroupsRankingComponent } from './groups-ranking.component';

export const rankingRoutes: Routes = [
  {
    path: 'ranking',
    component: RankingComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full'},
      { path: 'all', component: AlltimeRankingComponent},
      { path: 'weekly', component: WeeklyRankingComponent},
      { path: 'groups', component: GroupsRankingComponent}
    ]
  }
]