import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private ownUserSubscription: Subscription;
  ownUser: any = {};

  constructor(private userService: UserService, private gameComponent: GameComponent) { }

  ngOnInit() {
    this.gameComponent.heading1 = 'Dashboard';
    this.gameComponent.heading2 = '';
    this.ownUserSubscription = this.userService.ownUser.subscribe(res => this.ownUser = res);
  }

  ngOnDestroy() {
    this.ownUserSubscription.unsubscribe();
  }
}