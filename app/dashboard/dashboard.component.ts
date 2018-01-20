import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { getUser } from '../auth/auth.reducer';
import { User } from '../auth/user.model';
import * as authActions from '../auth/auth.actions';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {
  private userSub: Subscription;
  user: User;
  values: [number, number][] = [[2, 2], [4, 4]];

  constructor(private store: Store<any>, private appComponent: AppComponent) {
    this.appComponent.heading1 = '';
    this.appComponent.heading2 = '';
    this.store.dispatch(new authActions.LoadUser());
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}