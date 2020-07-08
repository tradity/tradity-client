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
  styles: [`
    nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 13px 20px;
      color: #170804;
    }
    
    nav a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: #170804;
    }
    
    nav span:first-of-type {
      font-size: 24px;
      font-weight: 900;
      line-height: 29px;
    }
    
    nav div {
      width: 100%;
      transition: all 1s ease;
      height: 0;
      visibility: hidden;
      opacity: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    nav div.menu-open {
      height: 100vh;
      margin-top: 5px;
      padding-top: 10px;
      box-sizing: border-box;
      visibility: visible;
      opacity: 1;
    }
    
    #profile-pic {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 1px solid #979797;
      margin-bottom: 25px;
      background-color: rgba(23,8,4,0.02);
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: visible;
      opacity: 1;
    }
    
    #profile-pic img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    
    #profile-pic span {
      font-weight: bold;
      font-size: 40px;
      line-height: 40px;
    }
    
    #username {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
      opacity: 0.87;
    }
    
    #email {
      font-size: 14px;
      line-height: 17px;
      color: rgba(23,8,4,0.8);
    }
    
    ul {
      width: 215px;
      margin: 15px 0 0 0;
      padding: 30px 0 0 0;
      list-style: none;
      border-top: 1px solid #9B9B9B;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    li {
      display: block; 
      color: #170804;
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 25px;
    }
    
    li a {
      text-decoration: none;
      color: #170804;
    }
    
    li a.active {
      color: #F1592A;
    }
    
    #subheader {
      background-color: #f1592a;
      color: white;
      overflow: hidden;
      padding: 20px;
    }
    
    #subheader h2 {
      margin: 8px 0 2px;
      font-size: 16px;
      line-height: 19px;
    }
    
    #subheader h1 {
      margin: 2px 0 8px;
      font-size: 30px;
      font-weight: 900;
      line-height: 36px;
    }
    
    div#notifications {
      position: fixed;
      top: 55px;
      width: calc(100vw - 20px);
      padding: 0 10px;
    }`]
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