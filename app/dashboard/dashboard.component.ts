import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { getUser } from '../auth/auth.reducer';
import { User } from '../auth/user.model';
import * as authActions from '../auth/auth.actions';
import { GameComponent } from '../game/game.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  user: User;

  constructor(private store: Store<any>, private gameComponent: GameComponent) {
    this.store.dispatch(new authActions.LoadUser());
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.gameComponent.heading1 = 'Dashboard';
    this.gameComponent.heading2 = '';
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}