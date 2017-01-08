import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';

@Component({
  selector: 'tradity-dashboard',
  templateUrl: 'app/dashboard/dashboard.component.html',
  styleUrls: ['app/dashboard/dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ownUserSubscription: Subscription;
  private ownUser = {};

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.ownUserSubscription = this.userService.ownUser.subscribe(res => this.ownUser = res);
  }

  ngOnDestroy() {
    this.ownUserSubscription.unsubscribe();
  }
}