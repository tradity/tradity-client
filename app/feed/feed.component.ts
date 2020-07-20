import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as feedActions from './feed.actions';
import { getFeedEvents } from './feed.reducer';
import { FeedEvent } from './feedEvent.model';

@Component({
  selector: 'tradity-feed',
  template: `
    <tradity-li *ngIf="!emailVerified">
      <tradity-li-img src="/img/tradity_symbol.png"></tradity-li-img>
      <tradity-li-header class="no-right">
        <span left>You have not yet verified your email address. Please click the link in the email we've sent you.</span>
      </tradity-li-header>
    </tradity-li>
    <tradity-li *ngFor="let event of events | async" [ngSwitch]="event.type">
      <tradity-li-img [placeholder]="event.srcusername"></tradity-li-img>
      <tradity-li-header class="no-right">
        <span left *ngSwitchCase="'trade-buy'">{{event.srcusername}} has bought {{event.amount}} shares of {{event.stockname}}</span>
        <span left *ngSwitchCase="'trade-sell'">{{event.srcusername}} has sold {{event.amount}} shares of {{event.stockname}}</span>
        <span left *ngSwitchCase="'trade-buy-self'">You have bought {{event.amount}} shares of {{event.stockname}}</span>
        <span left *ngSwitchCase="'trade-sell-self'">You have sold {{event.amount}} shares of {{event.stockname}}</span>
        <span left>{{event.time | date:'short'}}</span>
      </tradity-li-header>
    </tradity-li>
  `,
  styles: [':host { display: flex; flex-direction: column; }']
})
export class FeedComponent {
  @Input() emailVerified: Boolean;
  events: Observable<FeedEvent[]>;

  constructor(private store: Store<any>) {
    this.store.dispatch(new feedActions.LoadEvents());
    this.events = this.store.select(getFeedEvents);
  }
}