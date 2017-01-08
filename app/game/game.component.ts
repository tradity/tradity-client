import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../user.service';
import { SearchComponent } from '../search.component';

@Component({
  selector: 'tradity-game',
  templateUrl: 'app/game/game.component.html',
  styleUrls: ['app/game/game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  private isMenuOpen = false;
  private ownUserSubscription: Subscription;
  private ownUser = {};
  
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