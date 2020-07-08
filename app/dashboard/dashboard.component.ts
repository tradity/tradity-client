import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { getUser, getValues } from '../auth/auth.reducer';
import { User, Value } from '../auth/user.model';
import * as authActions from '../auth/auth.actions';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {
  private userSub: Subscription;
  private valuesSub: Subscription;
  user: User;
  values: Value[];

  constructor(private store: Store<any>, private appComponent: AppComponent) {
    this.appComponent.heading1 = '';
    this.appComponent.heading2 = '';
    this.store.dispatch(new authActions.LoadUser());
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
    this.valuesSub = this.store.select(getValues).subscribe(values => this.values = values);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.valuesSub.unsubscribe();
  }
}