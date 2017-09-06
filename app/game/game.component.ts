import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import * as authActions from '../auth/auth.actions';
import { getUser } from '../auth/auth.reducer';
import { User } from '../auth/user.model';

@Component({
  moduleId: module.id,
  selector: 'tradity-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  private userSub: Subscription;
  user: User;
  heading1: string = '';
  heading2: string = '';
  
  constructor(private router: Router, private store: Store<any>) { }

  ngOnInit() {
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