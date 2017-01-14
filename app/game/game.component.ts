import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-game',
  templateUrl: 'game.component.html',
  styleUrls: ['game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  private ownUserSubscription: Subscription;
  ownUser: any = {};
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.ownUserSubscription = this.userService.ownUser.subscribe(res => this.ownUser = res);
    this.router.events.subscribe(val => {
    if (NavigationStart) this.isMenuOpen = false;
    else this.isMenuOpen = true;
    })
  }

  ngOnDestroy() {
    this.ownUserSubscription.unsubscribe();
  }
  
  logout() {
    this.userService.logout();
    this.router.navigateByUrl('login');
  }

  toggleMenu() {
    if (this.isMenuOpen) this.isMenuOpen = false;
    else this.isMenuOpen = true; 
  }

}