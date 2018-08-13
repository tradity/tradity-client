import { Component, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as authActions from './auth/auth.actions';
import { getUser, getLoggedIn } from './auth/auth.reducer';
import { User } from './auth/user.model';
import { Notification, getNotifications } from './app.reducer';

@Component({
  moduleId: module.id,
  selector: 'tradity',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnDestroy {
  isMenuOpen = false;
  isLoggedIn: Observable<boolean>;
  private userSub: Subscription;
  user: User;
  heading1: string = '';
  heading2: string = '';
  notifications: Observable<Notification[]>;
  
  constructor(private router: Router, private store: Store<any>) {
    this.isLoggedIn = this.store.select(getLoggedIn);
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) this.isMenuOpen = false;
    });
    this.notifications = this.store.select(getNotifications);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  
  logout() {
    this.store.dispatch(new authActions.Logout());
  }

  toggleMenu() {
    if (this.isMenuOpen) this.isMenuOpen = false;
    else this.isMenuOpen = true; 
  }
}