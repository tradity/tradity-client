import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { ApiService } from './api.service';
import { StocksService } from './stocks.service';
import { UserService } from './user.service';
import { RankingService } from './ranking.service';
import { FeedService } from './feed.service';
import { GroupService } from './group.service';
import { AdminService } from './admin.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    ApiService,
    StocksService,
    UserService,
    RankingService,
    FeedService,
    GroupService,
    AdminService
  ]
})
export class CoreModule { }
