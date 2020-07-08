import { Component, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as authActions from './auth/auth.actions';
import { getUser, getLoggedIn } from './auth/auth.reducer';
import { User } from './auth/user.model';
import { Notification, getNotifications } from './app.reducer';

@Component({
  selector: 'tradity',
  template: `
    <div id="notifications">
      <tradity-notification
        *ngFor="let notification of notifications | async"
        [id]="notification.id"
        [type]="notification.type"
        [message]="notification.message"
      ></tradity-notification>
    </div>
    <header *ngIf="isLoggedIn | async">
      <nav>
        <a role="button" (click)="toggleMenu()"><tradity-icon>menu</tradity-icon></a>
        <span>Tradity</span>
        <a [routerLink]="['/stocks']"><tradity-icon>search</tradity-icon></a>
        <div [class.menu-open]="isMenuOpen">
          <div id="profile-pic">
            <img *ngIf="user.profilepic" [src]="user.profilepic" />
            <span *ngIf="!user.profilepic && user.name">{{ user.name.toUpperCase()[0] }}</span>
          </div>
          <span id="username">{{user.name}}</span>
          <span id="email">{{user.email}}</span>
          <ul>
            <li><a [routerLink]="['/']" routerLinkActive = "active" [routerLinkActiveOptions]="{ exact: true }" i18n>Dashboard</a></li>
            <li><a [routerLink]="['/portfolio']" routerLinkActive = "active" i18n>Portfolio</a></li>
            <li><a [routerLink]="['/stocks']" routerLinkActive = "active" i18n>Stocks</a></li>
            <li><a [routerLink]="['/ranking']" routerLinkActive = "active" i18n>Leaderboard</a></li>
            <li *ngIf="user.dschoolid"><a [routerLink]="['/group/' + user.dschoolid]" routerLinkActive = "active" i18n>My group</a></li>
            <!--<li><a [routerLink]="['/education']" routerLinkActive = "active" i18n>Education</a></li>-->
            <li><a (click)="logout()" routerLinkActive = "active" i18n>Logout</a></li> 
          </ul>
        </div>
      </nav>
      <div id="subheader" *ngIf="heading1 || heading2">
        <h2>{{heading2}}</h2>
        <h1>{{heading1}}</h1>
      </div>
    </header>
    <main role="main">
      <router-outlet></router-outlet>
    </main>`,
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