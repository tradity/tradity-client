import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedService } from '../feed.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-feed',
  templateUrl: 'feed.component.html'
})
export class FeedComponent implements OnInit {
  events: Observable<any>;

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.events = this.feedService.events;
  }
}