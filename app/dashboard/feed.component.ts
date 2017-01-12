import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedService } from '../feed.service';

@Component({
  selector: 'tradity-feed',
  templateUrl: 'app/dashboard/feed.component.html'
})
export class FeedComponent implements OnInit {
  private events: Observable<any>;

  constructor(private feedService: FeedService) { }

  ngOnInit() {
    this.events = this.feedService.events;
  }
}