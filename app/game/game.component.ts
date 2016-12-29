import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { UserService } from '../user.service';
import { SearchComponent } from '../search.component';

@Component({
  selector: 'tradity-game',
  templateUrl: 'app/game/game.component.html',
  styleUrls: ['app/game/game.component.css']
})
export class GameComponent implements OnInit {
  private isMenuOpen = false;
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(val => {
    if (NavigationStart) this.isMenuOpen = false;
    else this.isMenuOpen = true;
    })
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