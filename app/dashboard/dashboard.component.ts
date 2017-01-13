import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
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