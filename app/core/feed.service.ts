import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { ApiService } from './api.service';
import { UserService } from './user.service';
import * as feedActions from '../feed/feed.actions';
import { FeedEvent } from '../feed/feedEvent.model';
import { getUser } from '../auth/auth.reducer';
import { User } from '../auth/user.model';

@Injectable()
export class FeedService {
  private userSub: Subscription;
  private user: User;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private store: Store<any>
  ) {
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
  }

  loadEvents(): void {
    // TODO: replace this and figure out why the server doesn't return any events without since parameter
    this.apiService.get('/events?since=1459168140')
    .map(res => res.json().data)
    .subscribe(res => {
      let events = <[FeedEvent]>[];
      for (let event of res) {
        let type = '';
        if (event.type === 'trade') {
          if (event.amount < 0) type = 'trade-sell'
          else type = 'trade-buy'
          if (event.srcuser === this.user.uid) {
            type += '-self';
          }
          events.push({
            type: type,
            srcusername: event.srcusername,
            targetid: event.targetid,
            stocktextid: event.stocktextid,
            stockname: event.stockname,
            time: event.eventtime * 1000,
            leader: event.leader,
            amount: Math.abs(event.amount)
          })
        }
      }
      this.store.dispatch(new feedActions.ReceiveEvents(events));
    });
  }
}