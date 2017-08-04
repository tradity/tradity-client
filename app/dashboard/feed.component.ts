import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedService } from '../core/feed.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-feed',
  templateUrl: 'feed.component.html',
  styles: [':host { display: flex; flex-direction: column; }']
})
export class FeedComponent implements OnInit {
  events: Observable<any>;

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.events = this.feedService.events;
  }
}