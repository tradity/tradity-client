import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable()
export class FeedService {
  private _events: BehaviorSubject<any>;
  private ownUserSubscription: Subscription;
  private ownUser: any;

  constructor(private apiService: ApiService, private userService: UserService) {
    this._events = new BehaviorSubject([]);
    this.ownUserSubscription = this.userService.ownUser.subscribe(res => this.ownUser = res);
  }

  get events() {
    this.loadEvents();
    return this._events.asObservable();
  }

  loadEvents(): void {
    // TODO: replace this and figure out why the server doesn't return any events without since parameter
    this.apiService.get('/events?since=1459168140')
    .map(res => res.json().data)
    .subscribe(res => {
      let events = [];
      for (let event of res) {
        let type = '';
        if (event.type === 'trade') {
          if (event.amount < 0) type = 'trade-sell'
          else type = 'trade-buy'
          if (event.srcuser === this.ownUser.uid) {
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
      this._events.next(events);
    });
  }
}