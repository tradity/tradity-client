import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as feedActions from './feed.actions';
import { getFeedEvents } from './feed.reducer';
import { FeedEvent } from './feedEvent.model';

@Component({
  moduleId: module.id,
  selector: 'tradity-feed',
  templateUrl: 'feed.component.html',
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