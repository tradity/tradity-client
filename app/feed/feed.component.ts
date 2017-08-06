import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { FeedService } from '../core/feed.service';
import { getFeedEvents } from './feed.reducer';

@Component({
  moduleId: module.id,
  selector: 'tradity-feed',
  templateUrl: 'feed.component.html',
  styles: [':host { display: flex; flex-direction: column; }']
})
export class FeedComponent implements OnInit {
  events: Observable<any>;

  constructor(private store: Store<any>, private feedService: FeedService) { }

  ngOnInit() {
    this.events = this.store.select(getFeedEvents);
    this.feedService.loadEvents();
  }
}