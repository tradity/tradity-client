
import {map, withLatestFrom, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { ApiService } from '../core/api.service';
import * as feedActions from './feed.actions';
import { FeedEvent } from './feedEvent.model';
import { getUser } from '../auth/auth.reducer';

@Injectable()
export class FeedEffects {
  @Effect()
  loadEvents = this.actions
    .ofType(feedActions.LOAD_EVENTS).pipe(
    withLatestFrom(this.store.select(getUser)),
    switchMap(([action, ownUser]) => this.apiService
      // TODO: replace this and figure out why the server doesn't return any events without since parameter
      .get('/events?since=1459168140').pipe(
      map(res => res.data),
      map((res: any[]) => res.reduce((events: FeedEvent[], event) => {
          let type = '';
          if (event.type === 'trade') {
            if (event.amount < 0) type = 'trade-sell'
            else type = 'trade-buy'
            if (event.srcuser === ownUser.uid) {
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
          return events;
      }, [])),
      map((events: FeedEvent[]) => new feedActions.ReceiveEvents(events)),)
    ),)

  constructor(
    private actions: Actions,
    private store: Store<any>,
    private apiService: ApiService,
    private router: Router
  ) {}
}