import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { getUser, getValues } from '../auth/auth.reducer';
import { User, Value } from '../auth/user.model';
import * as authActions from '../auth/auth.actions';
import { AppComponent } from '../app.component';

@Component({
  selector: 'tradity-dashboard',
  template: `
    <!--<tradity-chart [values]="values"></tradity-chart>-->
    <tradity-vl>
      <tradity-vl-li>
        <span>{{user.totalvalue / 10000 | currency:'EUR'}}</span>
        <span i18n>Total value</span>
      </tradity-vl-li>
      <tradity-vl-li>
        <span>{{user.freemoney / 10000 | currency:'EUR'}}</span>
        <span i18n>Cash</span>
      </tradity-vl-li>
      <tradity-vl-li>
        <span>{{(user.totalvalue - user.freemoney) / 10000 | currency:'EUR'}}</span>
        <span i18n>Portfolio</span>
      </tradity-vl-li>
      <tradity-vl-li>
        <span>–</span>
        <span i18n>Time left</span>
      </tradity-vl-li>
    </tradity-vl>
    <tradity-feed [emailVerified]="user.email_verif"></tradity-feed>
  `,
  styles: [`
    tradity-feed {
      margin: 20px;
    }
  `]
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