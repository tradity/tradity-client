import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import * as authActions from './auth/auth.actions';
import { getUser, getLoggedIn } from './auth/auth.reducer';
import { User } from './auth/user.model';

@Component({
  moduleId: module.id,
  selector: 'tradity',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoggedIn: Observable<boolean>;
  private userSub: Subscription;
  user: User;
  heading1: string = '';
  heading2: string = '';
  
  constructor(private router: Router, private store: Store<any>) { }

  ngOnInit() {
    this.isLoggedIn = this.store.select(getLoggedIn);
    this.userSub = this.store.select(getUser).subscribe(user => this.user = user);
    this.router.events.subscribe(val => {
    if (NavigationStart) this.isMenuOpen = false;
    else this.isMenuOpen = true;
    })
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